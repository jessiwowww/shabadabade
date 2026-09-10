const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sharonbertoncello.com";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
