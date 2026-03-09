import type { Tables, TablesInsert } from "./supabase.types.ts";

export type Cabins = Tables<"cabins">;

export type InsertCabin = Omit<TablesInsert<"cabins">, "image"> & {
  image: File;
};
