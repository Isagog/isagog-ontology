import Script from "next/script";

// Cloudflare Web Analytics: cookieless page-view stats for
// ontology.isagog.com, under its own site token (isagog.com has its own).
// The token is public by design. Empty means the beacon is off; Task 7 of
// the implementation plan fills it in once the site exists in Cloudflare.
// crossOrigin matches the <link rel="preload"> Next emits for the module
// script; without it the browser downloads the beacon twice.
const CF_BEACON_TOKEN = "";

export const CloudflareAnalytics = () =>
  CF_BEACON_TOKEN === "" ? null : (
    <Script
      type="module"
      crossOrigin="anonymous"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
      strategy="afterInteractive"
    />
  );
