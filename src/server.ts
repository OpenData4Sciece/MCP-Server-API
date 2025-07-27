import Fastify from 'fastify';
import dotenv from 'dotenv';
import { registerContextRoutes } from './routes/contextRoutes';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const server = Fastify({ logger: true });

// Register context routes
registerContextRoutes(server);

// Start server
server.listen({ port: PORT }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 MCP Server ready at ${address}`);
});
