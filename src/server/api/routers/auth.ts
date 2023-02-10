import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getToken: publicProcedure.query(({ ctx }) => {
    return ctx.token;
  }),
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma?.user.findUnique({
      where: { id: ctx.token.id },
    });
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
