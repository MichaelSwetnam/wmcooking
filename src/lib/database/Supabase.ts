import { createClient } from "@supabase/supabase-js";
import type { Database } from "./gen-types.js";

export const Supabase = createClient<Database>("https://ysqrkscfqagmvjdglxcb.supabase.co", "sb_publishable_x8JjrbhxirhyRnpAt-zzcA_DyDXQogd");