import { SettingsProvider } from "@/providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { locale } = useRouter();
  const getLang = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") || undefined;
    } else return locale;
  };

  const setLang = (e: string) => {
    if (typeof window !== "undefined") localStorage.setItem("lang", e);
  };
  return (
    <SettingsProvider>
      <select
        value={getLang()}
        onChange={(evt) => {
          const locale = evt.currentTarget.value;
          router.replace(router.asPath, router.asPath, { locale });
          setLang(locale);
        }}
        className="xs:px-1 xs:text-lg  absolute top-0 left-0 z-50  block w-fit cursor-pointer appearance-none border-white bg-transparent py-4 text-center text-black   outline-none md:px-3   md:text-2xl lg:text-lg"
      >
        <option
          className=" xs:text-lg bg-yellow-200 md:text-2xl lg:text-lg  "
          value="en"
        >
          🇬🇧
        </option>
        <option
          className="xs:text-lg bg-yellow-200 md:text-2xl lg:text-lg  "
          value="el"
        >
          🇬🇷
        </option>
      </select>
      <Component {...pageProps} />
    </SettingsProvider>
  );
}
