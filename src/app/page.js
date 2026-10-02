import HomeClient from "./HomeClient.jsx";
import { getProjects, getAbout } from "@/lib/content.js";

// rigenerata al massimo ogni minuto: quello che Sharon pubblica
// compare da solo, senza ripubblicare il sito
export const revalidate = 60;

export default async function HomePage() {
  const [projects, about] = await Promise.all([getProjects(), getAbout()]);

  return <HomeClient projects={projects} about={about} />;
}
