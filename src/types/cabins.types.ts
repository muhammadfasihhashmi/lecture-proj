import type { Tables, TablesInsert, TablesUpdate } from "./supabase.types.ts";

export type Cabins = Tables<"cabins">;

export type InsertCabin = Omit<TablesInsert<"cabins">, "image"> & {
  image: File;
};

export type UpdateCabin = Omit<TablesUpdate<"cabins">, "image"> & {
  image?: File;
};
