import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import { api } from "../utils/api";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <FluentProvider theme={webLightTheme}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </FluentProvider>
  );
};

export default api.withTRPC(MyApp);
