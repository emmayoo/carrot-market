import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";

export default function App({ Component, pageProps }: AppProps) {
  const { user, isLodaing } = useUser();

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
      }}
    >
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} user={user} />
      </div>
    </SWRConfig>
  );
}
