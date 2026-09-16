import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, LOCALE_COOKIE, type Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : defaultLocale;
}
