import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const urlsRouter = createTRPCRouter({
    createShortUrl: protectedProcedure
        .input(z.object({
            slug: z.string().min(1),
            url: z.string().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.redis.set(input.slug, input.url);
            return ctx.prisma.shortUrl.create({
                data: {
                    slug: input.slug,
                    url: input.url,
                    userId: ctx.session.user.id,
                },
            })
        }),
    getAllURLs: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.shortUrl.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        })
    }),
});
