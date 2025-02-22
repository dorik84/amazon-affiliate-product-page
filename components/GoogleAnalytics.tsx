/*"use client";

import Script from "next/script";

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

if (!GOOGLE_ANALYTICS_ID) {
  throw new Error("Please define the NEXT_PUBLIC_GOOGLE_ANALYTICS_ID environment variable inside .env.local");
}

export function GoogleAnalytics({ gaId = GOOGLE_ANALYTICS_ID }: { gaId?: string }) {
  console.log("GoogleAnalytics");
  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}
*/

"use client";

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

if (!GOOGLE_ANALYTICS_ID) {
  throw new Error("Please define the NEXT_PUBLIC_GOOGLE_ANALYTICS_ID environment variable inside .env.local");
}

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

export function GoogleAnalytics({ gaId = GOOGLE_ANALYTICS_ID }: { gaId?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname;
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    window.gtag?.("event", "page_view", {
      page_path: url,
      page_query_params: params,
    });
  }, [pathname, searchParams]);

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}
/*
generate_lead
login
select_item ? 
share
view_item
view_item_list
view_image
*/
