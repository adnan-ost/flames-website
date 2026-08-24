"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * The Studio config holds plugin objects, icon components and functions, none
 * of which survive the Server -> Client props boundary. Importing the config
 * *inside* a Client Component keeps it on one side of that boundary, so nothing
 * has to be serialized. Do not lift this back into page.tsx.
 */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
