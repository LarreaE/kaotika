import { SessionProvider } from "next-auth/react";
import { AppProps } from 'next/app';
import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const mockSession = {
    user: {
      name: "ENEKO LARREA PEREZ",
      email: "eneko.larrea@ikasle.aeg.eus",
      image: "https://lh3.googleusercontent.com/a-/ALV-UjW79byZC_JXJCJrG0AsR_UyQdUoLxTi5YQ5W-4oD4UbHC1NI3Mo",
    },
    expires: "2025-12-31T23:59:59.999",
    accessToken: "",
    refreshToken: "",
    email: "eneko.larrea@ikasle.aeg.eus",
  };

  return (
    <SessionProvider session={mockSession}>
      <NextUIProvider>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </NextUIProvider>
    </SessionProvider>
  );
}

export default MyApp;
