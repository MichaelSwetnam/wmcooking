import { useQuery } from "@tanstack/react-query";
import { Supabase } from "./database/Supabase";


export function useAllergyLabels() {
     return useQuery({
	  queryKey: ["allergyLabels"],
	  queryFn: async () => {
	       const { data, error } = await Supabase
	       .from("AllergyLabel")
	       .select("*");

	       if (error) throw error;
	       return data.map(t => t.text);
	  }
     });
}
