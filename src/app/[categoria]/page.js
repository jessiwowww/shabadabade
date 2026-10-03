import { notFound } from "next/navigation";
import HomeClient from "../HomeClient.jsx";
import { getProjects, getAbout } from "@/lib/content.js";
import { macroList, macroSlug, macroDaSlug } from "@/data/macroCategories";

export const revalidate = 60;

export async function generateStaticParams() {
  return macroList().map((v) => ({ categoria: macroSlug(v.etichetta) }));
}

export async function generateMetadata({ params }) {
  const { categoria } = await params;
  const voce = macroDaSlug(categoria);
  if (!voce) return { title: "Not found" };

  return {
    title: voce.etichetta,
    description: `${voce.etichetta} work by shabadabade (Sharon Bertoncello), designer and illustrator in London.`,
    alternates: { canonical: `/${categoria}` },
    openGraph: {
      title: `${voce.etichetta} — shabadabade`,
      description: `${voce.etichetta} work by Sharon Bertoncello.`,
      url: `/${categoria}`,
    },
  };
}

export default async function CategoriaPage({ params }) {
  const { categoria } = await params;
  const voce = macroDaSlug(categoria);
  if (!voce) notFound();

  const [projects, about] = await Promise.all([getProjects(), getAbout()]);

  return (
    <HomeClient
      projects={projects}
      about={about}
      macroIniziale={voce.etichetta}
    />
  );
}
