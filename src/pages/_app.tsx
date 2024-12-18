import { SessionProvider } from "next-auth/react";
import { AppProps } from 'next/app';
import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const mockSession = {
    user: {
      name: "ENEKO LARREA PEREZ",
      email: "eneko.larrea@ikasle.aeg.eus",
      image: "",
    },
    expires: "2025-12-31T23:59:59.999",
    accessToken: "",
    refreshToken: "",
    email: "eneko.larrea@ikasle.aeg.eus",
  };

  useEffect(() => {
    // Redirigir al usuario a /player si está en la raíz
    if (router.pathname === '/') {
      router.push('/player');
    }
  }, [router]);

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
