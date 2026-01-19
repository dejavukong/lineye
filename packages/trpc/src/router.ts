import { users } from '@repo/database';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { router, publicProcedure } from './trpc';

export const appRouter = router({
  health: publicProcedure.query(() => ({
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
  })),

  user: router({
    list: publicProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(users);
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, input.id));

        return result[0] ?? null;
      }),

    create: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().min(1),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.insert(users).values(input).returning();

        return result[0];
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db
          .delete(users)
          .where(eq(users.id, input.id))
          .returning();

        return result[0] ?? null;
      }),
  }),
});

export type AppRouter = typeof appRouter;
