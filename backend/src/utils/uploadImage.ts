import { supabase } from "../config/supabase.js";
const uploadImage = async (image: Express.Multer.File): Promise<string> => {
  const fileName = `${Date.now()}-${image.originalname}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, image.buffer, { contentType: image.mimetype });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");

  return publicUrlData.publicUrl as string;
};

export default uploadImage;
