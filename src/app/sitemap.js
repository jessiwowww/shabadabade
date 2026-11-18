import { getCaseStudies, getProjects } from "@/lib/content.js";
import { macroLabel, macroList, macroSlug } from "@/data/macroCategories";
import { SITE_URL as base } from "@/lib/site.js";

export default async function sitemap() {
  const [caseStudies, projects] = await Promise.all([
    getCaseStudies(),
    getProjects(),
  ]);

  // solo le categorie che hanno davvero dei lavori: le altre non si
  // vedono sul sito, e in sitemap sarebbero pagine vuote da indicizzare
  const piene = new Set(
    projects.map((p) => macroLabel(p.macro)).filter(Boolean)
  );

  return [
    { url: base, lastModified: new Date(), priority: 1 },
    ...(caseStudies.length > 0
      ? [{ url: `${base}/projects`, lastModified: new Date(), priority: 0.8 }]
      : []),
    ...macroList()
      .filter((v) => piene.has(v.etichetta))
      .map((v) => ({
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
