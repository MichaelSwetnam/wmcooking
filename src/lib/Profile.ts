import type { Tables } from "./database/gen-types.ts";
import QueryClient from "./database/QueryClient.ts";
import { Supabase } from "./database/Supabase.ts";

const QueryKeys = {
     single: (id: string) => ["profile", id] as const,
};

export async function getProfile(id: string): Promise<ProfileData> {
     return await QueryClient.query({
	  queryKey: QueryKeys.single(id),
	  queryFn: async () => {
	       const { data, error } = await Supabase
		    .from("Profiles")
		    .select("*")
		    .eq('id', id)
		    .single()

	       if (error) throw error;
	       return data;
	  }
     });
}

type ProfileData = Tables<"Profiles">;
export class Profile {
     private data: ProfileData;

     constructor(data: ProfileData) {
	  this.data = data;
     }

     get email() { return this.data.email };
     get name() { return this.data.name };
     get isAdmin() { return this.data.is_admin };
     get id() { return this.data.id };
}

