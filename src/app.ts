import Fastify from 'fastify';
import { registerContextRoutes } from './routes/contextRoutes';

export async function createServer() {
  const server = Fastify({
    logger: {
      serializers: {
        req(request) {
          return { method: request.method, url: request.url?.split('?')[0] };
        },
      },
      redact: ['req.headers.authorization', 'req.body.accessToken'],
    },
    bodyLimit: 16 * 1024,
    ajv: { customOptions: { removeAdditional: false, coerceTypes: false } },
  });
  server.setErrorHandler((error, request, reply) => {
    const code = (error as { statusCode?: number }).statusCode;
    const status = code && [400, 413, 415, 429].includes(code) ? code : 500;
    request.log.warn({ status }, 'Request rejected');
    const message =
      status === 400
        ? 'Invalid request'
        : status === 413
          ? 'Request body is too large'
          : status === 415
            ? 'Unsupported media type'
            : status === 429
              ? 'Too many requests'
              : 'Request failed';
    reply.code(status).send({ error: message });
  });
  await registerContextRoutes(server);
  return server;
}
