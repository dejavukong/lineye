import type { AppRouter } from '@repo/trpc';

import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function getTRPCClient() {
  return trpc.createClient({
    links: [httpBatchLink({ url: `${API_URL}/trpc` })],
  });
}
