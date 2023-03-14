import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const quotesRouter = createTRPCRouter({
    createQuote: protectedProcedure
        .input(z.object({
            quote: z.string().min(1),
            author: z.string().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.quote.create({
                data: {
                    quote: input.quote,
                    author: {
                        connectOrCreate: {
                            where: { name: input.author },
                            create: { name: input.author },
                        }
                    },
                },
            })
        }),
    importQuotes: protectedProcedure
        .input(z.array(z.object({
            quote: z.string().min(1),
            author: z.string().min(1),
            createdAt: z.date(),
        })))
        .mutation(async ({ ctx, input: quotes }) => {
            // extract authors from quotes
            // [author]: [quote, quote, quote]
            const inverted = quotes.reduce((acc, quote) => {
                if (!acc[quote.author]) {
                    acc[quote.author] = [];
                }
                acc[quote.author]?.push(quote);
                return acc;
            }, {} as Record<string, typeof quotes>);


            return ctx.prisma.$transaction(async (tx) => {
                const createdAuthors = await tx.quoteAuthor.createMany({
                    data: Object.keys(inverted).map((author) => ({
                        name: author,
                    })),
                    skipDuplicates: true,
                });
                const authors = await tx.quoteAuthor.findMany();
                const authorMap = authors.reduce((acc, author) => {
                    acc[author.name] = author.id;
                    return acc;
                }, {} as Record<string, number>);

                return await tx.quote.createMany({
                    data: quotes.map((quote, idx) => {
                        const authorId = authorMap[quote.author] ?? -1;
                        if (authorId === -1) {
                            throw new Error(`Author ${quote.author} not found`);
                        }

                        return {
                            id: idx + 1,
                            quote: quote.quote,
                            createdAt: quote.createdAt,
                            authorId,
                        }
                    }),
                });
            });

            // const authors = await ctx.prisma.quote.createMany({
            //     data: quotes.map((quote) => ({
            //         quote: quote.quote,
            //         createdAt: quote.createdAt,
            //     })),
            // });
        }),
    getAllQuotes: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.quote.findMany({ include: { author: true } })
    }),
});
