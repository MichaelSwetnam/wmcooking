import { useQuery } from "@tanstack/react-query";
import { Supabase } from "./database/Supabase";
import { QueryKeys } from "./QueryKeys";

const PREFIX = "https://ysqrkscfqagmvjdglxcb.supabase.co/storage/v1/object/public/Images/";

export function useDatabaseImages() {
     return useQuery({
	  queryKey: QueryKeys.images.self(),
	  queryFn: async () => {
	     let { data, error } = await Supabase
		 .storage
		 .from('Images')
		 .list(undefined, {
		     limit: 20,
		     offset: 0,
		 }
	     );
	     
	     if (error) throw error;
	     return data.map(t => PREFIX + t.name);
	  }
     });
}
