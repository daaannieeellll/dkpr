import type { ShortUrl } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const urlsRouter = createTRPCRouter({
    createShortUrl: protectedProcedure
        .input(z.object({
            slug: z.string().min(1),
            url: z.string().min(1),
        }))
        .mutation(({ ctx, input }) => {
            return ctx.redis.set(input.slug, input.url);
            // return ctx.prisma.shortUrl.create({
            //     data: {
            //         slug: input.slug,
            //         url: input.url,
            //         userId: ctx.session.user.id,
            //     },
            // })
        }),
    getAllURLs: protectedProcedure.query(async ({ ctx }) => {
        const res = await ctx.redis.scan(0, { match: "*" });
        const keys = res[1];
        const values = await ctx.redis.mget(...keys);

        return keys.map((key, i) => {
            return {
                slug: key,
                url: values[i],
                userId: ctx.session.user.id,
                createdAt: new Date(0),
            } as ShortUrl;
        });
        // return ctx.prisma.shortUrl.findMany({
        //     where: {
        //         userId: ctx.session.user.id,
        //     },
        // })
    }),
});
