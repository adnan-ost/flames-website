import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

/**
 * CLI config, used by `sanity schemas deploy`, `sanity typegen` and friends.
 * Values come from .env.local so there is a single place to set them.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    enabled: true,
    path: "./src/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});
