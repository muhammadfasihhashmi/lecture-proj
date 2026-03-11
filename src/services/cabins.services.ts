import type { InsertCabin, UpdateCabin } from "@/types/cabins.types";
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

export async function editCabin({
  id,
  updatedCabin,
}: {
  id: number;
  updatedCabin: UpdateCabin;
}) {
  try {
    let imageUrl: string | undefined;

    // Only upload a new image if the user selected one
    if (updatedCabin.image instanceof File) {
      const imagePath = `${Date.now()}-${updatedCabin.image.name.replaceAll("/", "-")}`;
      const { data: imageData, error: imageError } = await supabase.storage
        .from("cabinimages")
        .upload(imagePath, updatedCabin.image);
      if (imageError) throw new Error(imageError.message);

      const { data: publicUrl } = supabase.storage
        .from("cabinimages")
        .getPublicUrl(imageData.path);
      imageUrl = publicUrl.publicUrl;
    }

    // Destructure out the File so Supabase only ever sees a string for image
    const { image: _image, ...rest } = updatedCabin;
    void _image; // intentionally unused — only string URL sent to Supabase
    const payload: typeof rest & { image?: string } = {
      ...rest,
      ...(imageUrl ? { image: imageUrl } : {}),
    };

    const { data, error } = await supabase
      .from("cabins")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message);
    return { data, message: "Cabin updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("something went wrong");
    }
  }
}
