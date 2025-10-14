import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TappyLine - Queue Management Made Simple</title>
        <meta
          name="description"
          content="Create and manage queues in 30 seconds. No apps, no accounts, just tap and go!"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            border: "2px solid #f97316",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Component {...pageProps} />
    </>
  );
}
