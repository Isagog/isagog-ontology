import Script from "next/script";

// Cloudflare Web Analytics: cookieless page-view stats for
// ontology.isagog.com, under its own site token (isagog.com has its own).
// The token is public by design.
// crossOrigin matches the <link rel="preload"> Next emits for the module
// script; without it the browser downloads the beacon twice.
const CF_BEACON_TOKEN = "05a856ec4ab94c319f185b3bec5e9208";

export const CloudflareAnalytics = () => (
    <Script
      type="module"
      crossOrigin="anonymous"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
      strategy="afterInteractive"
    />
  );
