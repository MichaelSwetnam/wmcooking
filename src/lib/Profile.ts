import type { Tables } from "./database/gen-types.ts";
import QueryClient from "./database/QueryClient.ts";
import { Supabase } from "./database/Supabase.ts";
import { QueryKeys } from "./QueryKeys.ts";

function profileQuery(id: string) {
     return {
	  queryKey: QueryKeys.profile.single(id),
	  queryFn: async () => {
	       const { data, error } = await Supabase
		    .from("Profiles")
		    .select("*")
		    .eq('id', id)
		    .single()

	       if (error) throw error;
	       return new Profile(data);
	  }
     }
}
export async function getProfile(id: string) {
     return QueryClient.query(profileQuery(id));
}

export async function updateProfile(id: string, name: string) {
     const profile = await getProfile(id);
     if (profile instanceof Error) throw profile;

     const profileData = profile.getRawData();
     profileData.name = name;

     // Update in supabase
     const { error } = await Supabase
	  .from("Profiles")
	  .update(profileData)
	  .eq('id', id)
	  .single();
     
     if (error) throw error;
     
     // Update query
     QueryClient.setQueryData(QueryKeys.profile.single(id), new Profile(profileData));
}

export type ProfileData = Tables<"Profiles">;
export class Profile {
     private readonly data: ProfileData;

     constructor(data: ProfileData) {
	  this.data = data;
     }

     get email() { return this.data.email };
     get name() { return this.data.name };
     get isAdmin() { return this.data.is_admin };
     get id() { return this.data.id };

     getRawData() {
	  return this.data;
     }
}

