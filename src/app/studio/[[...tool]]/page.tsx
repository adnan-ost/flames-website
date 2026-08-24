import { isSanityConfigured } from "@/sanity/env";
import StudioClient from "./studio-client";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div style={{ padding: "3rem", fontFamily: "Inter, system-ui, sans-serif", lineHeight: 1.6 }}>
        <h1 style={{ fontWeight: 300, fontSize: "1.5rem" }}>Studio not configured</h1>
        <p style={{ marginTop: "1rem", maxWidth: "42rem" }}>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in <code>.env.local</code> and restart the
          dev server. See <code>README.md</code> for the full connection steps.
        </p>
      </div>
    );
  }

  return <StudioClient />;
}
