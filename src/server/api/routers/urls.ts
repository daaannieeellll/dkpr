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
    click: publicProcedure
        .input(z.object({ slug: z.string(), ip: z.string(), userAgent: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.shortUrlClick.create({
                data: {
                    shortUrlSlug: input.slug,
                }
            });
        }),
    getAllURLs: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.shortUrl.findMany({
            where: {
                userId: ctx.session.user.id,
            },
            include: {
                clicks: true,
            },
        })
    }),
});
