import HomeClient from "./HomeClient.jsx";
import { getProjects, getAbout, getCaseStudies } from "@/lib/content.js";

// rigenerata al massimo ogni minuto: quello che Sharon pubblica
// compare da solo, senza ripubblicare il sito
export const revalidate = 60;

export default async function HomePage() {
  const [projects, about, caseStudies] = await Promise.all([
    getProjects(),
    getAbout(),
    getCaseStudies(),
  ]);

  return <HomeClient projects={projects} about={about} caseStudies={caseStudies} />;
}
