import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import AzureADProvider from "next-auth/providers/azure-ad";
import { env } from "../env.mjs";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      token: {
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
      };
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}


interface AccessToken {
  token_type: 'Bearer',
  scope: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
  refresh_token: string;
  id_token: string;
}
const getAccessTokenFromRefreshToken = async (refreshToken: string) => {
  const response = await fetch(
    `https://login.microsoftonline.com/${env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.AZURE_AD_CLIENT_ID,
        scope: "openid profile email offline_access",
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        client_secret: env.AZURE_AD_CLIENT_SECRET,
      }),
    }
  );
  return response.json() as Promise<AccessToken>;
};


/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  // Include user.id and access tokens on session
  callbacks: {
    session({ session, token }) {
      // TODO: check if tokens are synced with jwt
      if (session.user) {
        const { accessToken, refreshToken, accessTokenExpires } = token;
        session.user.id = token.id;
        session.user.token = { accessToken, refreshToken, accessTokenExpires };
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // at sign in
      if (account && user) {
        // check if user exists in db, if not create it
        await prisma.user
          .create({
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            },
          })
          .catch(() => { /* user already exists */ });

        return {
          ...token,
          id: user.id,
          accessToken: account.access_token || "",
          refreshToken: account.refresh_token || "",
          accessTokenExpires: (account.expires_at || 0) * 1000,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, so we need to refresh it
      const newToken = await getAccessTokenFromRefreshToken(
        token.refreshToken
      );
      return {
        ...token,
        accessToken: newToken.access_token,
        accessTokenExpires: Date.now() + newToken.expires_in,
      };
    },
  },

  secret: env.NEXTAUTH_SECRET,
  providers: [
    AzureADProvider({
      clientId: env.AZURE_AD_CLIENT_ID,
      clientSecret: env.AZURE_AD_CLIENT_SECRET,
      tenantId: env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        },
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
