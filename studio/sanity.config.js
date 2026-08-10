import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

/*
  Studio Sanity del portfolio di Sharon.
  Tre voci: Lavori (griglia della home), Progetti completi (case study
  a blocchi), Chi sono (documento unico con foto e bio).
*/
export default defineConfig({
  name: "default",
  title: "Sharon Bertoncello",
  projectId: "gdqr6s88",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("progetto").title("Work (grid)"),
            S.documentTypeListItem("progettoCompleto").title("Projects"),
            S.divider(),
            // "About" è un documento unico: si apre sempre lo stesso
            S.listItem()
              .title("About")
              .child(
                S.document().schemaType("chiSono").documentId("chiSono")
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // impedisce di creare più documenti "Chi sono" dal menu +
    templates: (prev) => prev.filter((t) => t.schemaType !== "chiSono"),
  },
});
