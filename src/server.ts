import 'dotenv/config';
import { createServer } from './app';

async function start() {
  const port = Number(process.env.APP_PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('APP_PORT must be an integer between 1 and 65535');
  }
  const server = await createServer();
  await server.listen({ port, host: process.env.APP_HOST || '127.0.0.1' });
}

start().catch(() => {
  console.error('Unable to start metadata API; check configuration and port availability.');
  process.exitCode = 1;
});
