import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

/**
 * Studio config. `basePath` matches the route the Studio is mounted at, which
 * AGENTS.md fixes at /studio.
 *
 * projectId comes from the environment and is empty until the project is
 * provisioned; the /studio route checks for that and shows setup instructions
 * rather than booting a Studio that cannot connect.
 */
export default defineConfig({
  name: "flames-by-the-indus",
  title: "Flames by the Indus",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
