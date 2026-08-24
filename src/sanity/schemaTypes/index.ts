import type { SchemaTypeDefinition } from "sanity";
import { dish } from "./dish";
import { menuSection } from "./menuSection";

export const schemaTypes: SchemaTypeDefinition[] = [menuSection, dish];
