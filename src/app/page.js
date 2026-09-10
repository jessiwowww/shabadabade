import HomeClient from "./HomeClient.jsx";
import { getProjects, getAbout } from "@/lib/content.js";

/*
  Home: i dati arrivano dal server, quindi lavori e bio sono già
  nell'HTML. Le pagine si rigenerano al massimo ogni minuto, così
  quello che Sharon pubblica su Sanity compare da solo — senza
  ricompilare né ripubblicare il sito.
*/
export const revalidate = 60;

export default async function HomePage() {
  const [projects, about] = await Promise.all([getProjects(), getAbout()]);

  return <HomeClient projects={projects} about={about} />;
}
