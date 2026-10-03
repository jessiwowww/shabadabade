import { getCaseStudies } from "@/lib/content.js";
import { macroList, macroSlug } from "@/data/macroCategories";
import { SITE_URL as base } from "@/lib/site.js";

export default async function sitemap() {
  const caseStudies = await getCaseStudies();

  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/projects`, lastModified: new Date(), priority: 0.8 },
    ...macroList().map((v) => ({
      url: `${base}/${macroSlug(v.etichetta)}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
    ...caseStudies.map((cs) => ({
      url: `${base}/projects/${cs.slug}`,
      lastModified: cs.data ? new Date(cs.data) : new Date(),
      priority: 0.6,
    })),
  ];
}
