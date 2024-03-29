import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const quotesRouter = createTRPCRouter({
    createQuote: protectedProcedure
        .input(z.object({
            quote: z.string().min(1),
            author: z.string().min(1),
            latitude: z.number().min(-90).max(90),
            longitude: z.number().min(-180).max(180),
        }))
        .mutation(async ({ ctx, input }) => {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${input.latitude}&lon=${input.longitude}&addressdetails=1`);
            const { address } = await response.json() as {address: {
                building?: string;
                amenity?: string;
                railway?: string;
                house_number?: string;
                road: string;
                city?: string;
                county?: string;
                village?: string;
                town?: string;
                country: string;
            }};
            const locationString = [
                address.building ?? address.amenity ?? (address.railway !== address.road ? address.railway : "") ?? "",
                address.house_number ? address.road + " " + address.house_number : address.road,
                address.village ?? address.town ?? address.city ?? "",
                address.country,
            ].filter((part) => part.length > 0).join(", ");

            return ctx.prisma.quote.create({
                data: {
                    quote: input.quote,
                    author: {
                        connectOrCreate: {
                            where: { name: input.author },
                            create: { name: input.author },
                        }
                    },
                    location: {
                        connectOrCreate: {
                            where: {
                                lat_lng: {
                                    lat: input.latitude,
                                    lng: input.longitude
                                },
                            },
                            create: {
                                lat: input.latitude,
                                lng: input.longitude,
                                string: locationString,
                            }
                        }
                    }

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
        return ctx.prisma.quote.findMany({ include: { author: true, location: true } })
    }),
});
