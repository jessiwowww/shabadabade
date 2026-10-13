import { notFound } from "next/navigation";
import Progetti from "@/components/Progetti.jsx";
import { getCaseStudies } from "@/lib/content.js";

export const revalidate = 60;

export const metadata = {
  title: "Projects",
  description:
    "Full projects by shabadabade (Sharon Bertoncello), told properly: process, final pieces and everything in between.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — shabadabade",
    description: "Full projects, told properly: process and final pieces.",
    url: "/projects",
  },
};

export default async function ProjectsPage() {
  const caseStudies = await getCaseStudies();
  // senza progetti la pagina non esiste, come la voce nel menu
  if (caseStudies.length === 0) notFound();

  return <Progetti caseStudies={caseStudies} />;
}
