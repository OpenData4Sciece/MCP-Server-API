import Fastify from 'fastify';
import dotenv from 'dotenv';
import { registerContextRoutes } from './routes/contextRoutes';
import fastifyStatic from '@fastify/static';
import path from 'path';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const server = Fastify({ logger: true });
const appVersion = process.env.APP_VERSION || '0.1.0';

// Register context routes
registerContextRoutes(server);

server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/', // optional: serve from root
});

// Start server
server.listen({ port: PORT }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 MCP Server (v${appVersion}) ready at ${address}`);
});
