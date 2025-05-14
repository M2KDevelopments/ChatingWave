import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (<>
    <Head>      
      <title>Chating Wave – Build Your Own AI Assistant</title>
      <meta name="title" content="Chating Wave – Build Your Own AI Assistant"/>
      <meta name="description" content="Create custom AI chatbots, surveys, interviews, voice assistants, and more with Chating Wave – no code required."/>

      <meta property="og:type" content="website"/>
      <meta property="og:url" content="https://www.chatingwave.com/"/>
      <meta property="og:title" content="Chating Wave – Build Your Own AI Assistant"/>
      <meta property="og:description" content="Create powerful AI surveys, chatbots, interviews, and voice assistants with ease."/>
      <meta property="og:image" content="https://www.chatingwave.com/og-image.png"/>

      
      <meta property="twitter:card" content="summary_large_image"/>
      <meta property="twitter:url" content="https://www.chatingwave.com/"/>
      <meta property="twitter:title" content="Chating Wave – Build Your Own AI Assistant"/>
      <meta property="twitter:description" content="Create powerful AI surveys, chatbots, interviews, and voice assistants with ease."/>
      <meta property="twitter:image" content="https://www.chatingwave.com/og-image.png"/>

      <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
      <link rel="canonical" href="https://www.chatingwave.com/" />

    </Head>
    <Component {...pageProps} />;
  </> )
}
