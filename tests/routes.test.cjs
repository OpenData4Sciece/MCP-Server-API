const assert = require('node:assert/strict');
const test = require('node:test');
const Fastify = require('fastify');
const axios = require('axios');
const { registerContextRoutes } = require('../dist/routes/contextRoutes.js');

async function app(t) {
  const server = Fastify({
    logger: false,
    ajv: { customOptions: { removeAdditional: false, coerceTypes: false } },
  });
  t.after(() => server.close());
  await registerContextRoutes(server);
  return server;
}

test('metadata reads configured values at registration time', async (t) => {
  const before = {
    name: process.env.MCP_NAME,
    tags: process.env.MCP_TAGS,
    version: process.env.APP_VERSION,
  };
  t.after(() => {
    for (const [key, value] of Object.entries({
      MCP_NAME: before.name,
      MCP_TAGS: before.tags,
      APP_VERSION: before.version,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  Object.assign(process.env, {
    MCP_NAME: 'Fixture service',
    MCP_TAGS: ' ML, statistics, , ML ',
    APP_VERSION: '9.8.7',
  });
  const server = await app(t);
  const response = await server.inject('/.well-known/model-context');
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().name, 'Fixture service');
  assert.equal(response.json().version, '9.8.7');
  assert.deepEqual(response.json().tags, ['ML', 'statistics']);
});

test('documented discovery resolves the same metadata and context', async (t) => {
  const server = await app(t);
  const metadata = await server.inject('/.well-known/model-context');
  const discovery = await server.inject('/v1/discovery');
  assert.equal(discovery.statusCode, 200);
  assert.deepEqual(discovery.json(), metadata.json());
  const context = (await server.inject(metadata.json()['@context'])).json()['@context'];
  for (const field of ['name', 'description', 'version', 'tags', 'contact', 'content_endpoint'])
    assert.ok(context[field], field);
});

test('models identify examples and return 404 for unknown IDs', async (t) => {
  const server = await app(t);
  const content = await server.inject('/v1/content');
  assert.equal(content.json().length, 4);
  for (const id of ['churn', 'eda']) {
    const response = await server.inject(`/v1/model/${id}`);
    assert.equal(response.statusCode, 200);
    assert.equal(response.json().example, true);
    assert.equal(response.json().usage, undefined);
  }
  assert.equal((await server.inject('/v1/model/missing')).statusCode, 404);
});

test('arbitrary destinations and malformed bodies never make outbound requests', async (t) => {
  const server = await app(t);
  let calls = 0;
  t.mock.method(axios, 'get', async () => {
    calls++;
    return { data: [] };
  });
  for (const body of [
    {},
    { accessToken: '' },
    { accessToken: 42 },
    { accessToken: 'bad\r\ntoken' },
    { accessToken: 'fixture', endpoint: 'http://127.0.0.1/internal' },
    { accessToken: 'fixture', page: 0 },
    { accessToken: 'fixture', page: 1.5 },
    { accessToken: 'fixture', page: '2' },
    { accessToken: 'fixture', per_page: 201 },
    { accessToken: 'fixture', per_page: -1 },
  ]) {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/strava/activities',
      payload: body,
    });
    assert.equal(response.statusCode, 400, JSON.stringify(body));
  }
  assert.equal(calls, 0);
});

test('valid Strava requests use only its fixed endpoint with bounded options', async (t) => {
  const server = await app(t);
  const received = [];
  t.mock.method(axios, 'get', async (url, options) => {
    received.push({ url, options });
    return { data: [{ id: 7, name: 'Synthetic activity' }] };
  });
  for (const pagination of [{}, { page: 2, per_page: 200 }]) {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/strava/activities',
      payload: { accessToken: 'fixture-token', ...pagination },
    });
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['cache-control'], 'no-store');
    assert.equal(response.json()[0].id, 7);
  }
  for (const { url, options } of received) {
    assert.equal(url, 'https://www.strava.com/api/v3/athlete/activities');
    assert.equal(options.headers.Authorization, 'Bearer fixture-token');
    assert.equal(options.maxRedirects, 0);
    assert.equal(options.timeout, 10000);
    assert.ok(options.maxContentLength > 0);
  }
  assert.deepEqual(received[0].options.params, { page: 1, per_page: 30 });
  assert.deepEqual(received[1].options.params, { page: 2, per_page: 200 });
});

test('upstream failures return generic errors without private details', async (t) => {
  const server = await app(t);
  t.mock.method(axios, 'get', async () => {
    throw new Error('private-token-marker and private-activity-marker');
  });
  const response = await server.inject({
    method: 'POST',
    url: '/v1/strava/activities',
    payload: { accessToken: 'fixture' },
  });
  assert.equal(response.statusCode, 502);
  assert.deepEqual(response.json(), { error: 'Unable to retrieve Strava activities' });
  assert.equal(response.headers['cache-control'], 'no-store');
});

test('the configured server rejects malformed JSON and oversized bodies', async (t) => {
  const { createServer } = require('../dist/app.js');
  const server = await createServer();
  t.after(() => server.close());
  for (const [payload, statusCode] of [
    ['{"accessToken":"private-token-marker",', 400],
    [JSON.stringify({ accessToken: 'a'.repeat(17000) }), 413],
  ]) {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/strava/activities',
      headers: { 'content-type': 'application/json' },
      payload,
    });
    assert.equal(response.statusCode, statusCode);
    assert.ok(!response.body.includes('private-token-marker'));
    assert.ok(!response.body.includes('stack'));
  }
  const response = await server.inject({
    method: 'POST',
    url: '/v1/strava/activities',
    payload: { accessToken: 'fixture', endpoint: 'https://example.invalid/' },
  });
  assert.equal(response.statusCode, 400);
});
