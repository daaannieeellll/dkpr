import type { Message, User } from "@microsoft/microsoft-graph-types";
import { Client } from "@microsoft/microsoft-graph-client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const msgraphRouter = createTRPCRouter({
    getMe: protectedProcedure.query(async ({ ctx }) => {
        const accessToken = ctx.token.accessToken;
        if (accessToken) {
            const client = Client.init({
                authProvider: (done) => done(null, accessToken),
            });
            return client.api("/me").get() as Promise<User>;
        }
    }),
    // get messages, select only the provided fields (function parameters)
    getMessages: protectedProcedure
        .input(z.object({
            skip: z.number().optional().default(0),
            top: z.number().optional().default(10).refine((n) => 1 <= n && n <= 1000, {
                message: "top must be within the range of 1 to 1000",
            }),
            select: z.union([
                z.string(),
                z.array(z.string()).optional().default([])
            ])
        }))
        .query(async ({ ctx, input }) => {
            const accessToken = ctx.token.accessToken;
            if (accessToken) {
                const client = Client.init({
                    authProvider: (done) => done(null, accessToken),
                });
                return client.api("/me/messages")
                    .top(input.top)
                    .skip(input.skip)
                    .select(input.select).get() as Promise<{ "@odata.context": string; "@odata.nextLink": string; value: Message[] }>;

            }
        }),
    getAllMessages: protectedProcedure
        .query(async ({ ctx }) => {
            const accessToken = ctx.token.accessToken;
            if (accessToken) {
                const client = Client.init({
                    authProvider: (done) => done(null, accessToken),
                });
                interface Response { "@odata.context": string; "@odata.nextLink": string; value: Message[] };
                const { value, ...odata } = await client.api("/me/messages")
                    .select([
                        "from",
                        "toRecipients",
                    ])
                    .top(1000)
                    .skip(0)
                    .get() as Response;

                let { "@odata.nextLink": nextLink } = odata;
                while (nextLink) {
                    console.log(nextLink);
                    const next: Response = await client.api(nextLink).get();
                    value.push(...next.value);
                    nextLink = next["@odata.nextLink"];
                }

                return value;
            }
        }),
});
