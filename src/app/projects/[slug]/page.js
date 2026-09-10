import { notFound } from "next/navigation";
import ProgettoDettaglio from "@/components/ProgettoDettaglio.jsx";
import TagSidebar from "@/components/TagSidebar.jsx";
import { getCaseStudies, getCaseStudy } from "@/lib/content.js";
import { ogImageUrl } from "@/lib/images.js";

export const revalidate = 60;

/*
  Le pagine dei progetti esistenti vengono generate in anticipo; quelle
  pubblicate dopo su Sanity vengono create alla prima visita.
*/
export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

/*
  È qui che si gioca la condivisione: ogni progetto ha titolo,
  descrizione e immagine propri, invece dell'anteprima generica del
  sito uguale per tutti.
*/
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);
  if (!caseStudy) return { title: "Project not found" };

  const immagine = ogImageUrl(caseStudy.copertina?.url);

  return {
    title: caseStudy.titolo,
    description: caseStudy.descrizione,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      title: `${caseStudy.titolo} — shabadabade`,
      description: caseStudy.descrizione,
      url: `/projects/${slug}`,
      images: immagine ? [{ url: immagine, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);
  if (!caseStudy) notFound();

  return (
    <>
      <TagSidebar />
      <ProgettoDettaglio caseStudy={caseStudy} />
    </>
  );
}
