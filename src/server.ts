import Fastify from 'fastify';
import { registerContextRoutes } from './routes/contextRoutes';

const server = Fastify({ logger: true });

// Register custom context routes for discovery
registerContextRoutes(server);

// Start the server
server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 MCP Server ready at ${address}`);
});
