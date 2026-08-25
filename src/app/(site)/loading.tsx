import { FlameLoader } from "@/components/flame-loader";

/**
 * Shown while a route segment is still resolving on the server. The menu pages
 * are prerendered, so this is brief in normal use — it matters on a cold ISR
 * revalidation, when Sanity is slow, and on a poor connection.
 */
export default function Loading() {
  return <FlameLoader label="Loading Flames by the Indus" className="min-h-[60vh]" />;
}
