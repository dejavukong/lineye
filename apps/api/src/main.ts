import cors from '@fastify/cors';
import { createDatabase } from '@repo/database';
import { appRouter, createContext, type AppRouter } from '@repo/trpc';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';

const PORT = Number(process.env.PORT) || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const DATABASE_URL =
  process.env.DATABASE_URL || '../../packages/database/data/sqlite.db';

async function main() {
  const server = Fastify({
    logger: true,
  });

  // Initialize database
  const db = createDatabase(DATABASE_URL);

  // Register CORS
  await server.register(cors, {
    origin: CORS_ORIGIN,
    credentials: true,
  });

  // Register tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: () => createContext({ db }),
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });

  // Health check endpoint (non-tRPC)
  server.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  try {
    const address = await server.listen({ port: PORT, host: '0.0.0.0' });

    console.log(`Server listening at ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
