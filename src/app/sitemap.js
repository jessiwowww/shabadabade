import { getCaseStudies } from "@/lib/content.js";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sharonbertoncello.com";

/* Sitemap generata dai contenuti: i progetti nuovi entrano da soli. */
export default async function sitemap() {
  const caseStudies = await getCaseStudies();

  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/projects`, lastModified: new Date(), priority: 0.8 },
    ...caseStudies.map((cs) => ({
      url: `${base}/projects/${cs.slug}`,
      lastModified: cs.data ? new Date(cs.data) : new Date(),
      priority: 0.6,
    })),
  ];
}
