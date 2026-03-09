import type { InsertCabin } from "@/types/cabins.types";
import supabase from "@/utils/supabase";

export async function getCabins() {
  try {
    const { data, error } = await supabase.from("cabins").select("*");
    if (error) throw new Error(error.message);
    if (!data) return [];
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("something went wrong");
    }
  }
}

export async function addCabin(newCabin: InsertCabin) {
  try {
    // 1. create an image path to store in supabase with this name
    const imagePath = `${Date.now()}-${newCabin.image.name.replaceAll("/", "-")}`;

    // 2. upload the image to the database buckt
    const { data: imageData, error: imageError } = await supabase.storage
      .from("cabinimages")
      .upload(imagePath, newCabin.image);
    if (imageError) throw new Error(imageError.message);

    // 3. now we get the public url form the supabase bucket
    const { data: publicUrl } = supabase.storage
      .from("cabinimages")
      .getPublicUrl(imageData.path);

    // 4. ow finally we add the cabin to the databas table
    const { data, error } = await supabase
      .from("cabins")
      .insert([{ ...newCabin, image: publicUrl.publicUrl }])
      .select();
    if (error) throw new Error(error.message);
    return { data, message: "cabin added sucessfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("something went wrong");
    }
  }
}
