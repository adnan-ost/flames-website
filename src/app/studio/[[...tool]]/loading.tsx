import { FlameLoader } from "@/components/flame-loader";

/** The Studio is a large client bundle, so this one is actually seen. */
export default function Loading() {
  return <FlameLoader label="Loading the Studio" className="min-h-screen" />;
}
