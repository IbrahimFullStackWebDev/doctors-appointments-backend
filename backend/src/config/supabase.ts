import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SB_URL as string;
const supabaseKey = process.env.SB_SECRET_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Secret Key in .env file");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
