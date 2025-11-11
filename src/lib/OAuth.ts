import type { DatabaseReturn } from "./Database";
import { Supabase } from "./Supabase";

class OAuth {
    async isPrivileged(id: string): Promise<DatabaseReturn<boolean>> {
        const { data, error } = await Supabase
            .from("Profiles")
            .select("is_admin")
            .eq('id', id)
            .single();

        return { data: data?.is_admin, error };
    }
}

export default new OAuth();