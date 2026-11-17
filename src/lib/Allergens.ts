import { useQuery } from "@tanstack/react-query";
import { Supabase } from "./database/Supabase";
import QueryClient from "./database/QueryClient";
import { PostgrestError } from "@supabase/supabase-js";
import { QueryKeys } from "./QueryKeys";

function getAllergyMap() {
     return QueryClient.query({
	  queryKey: QueryKeys.allergens.map(),
	  queryFn: async () => {
	       const { data, error } = await Supabase
		    .from("AllergyLabel")
		    .select("*")

	       if (error) return error;

	       const idToText: {[_: number]: string} = {};
	       const textToId: {[_: string]: number} = {};
	       for (const dp of data) {
		    idToText[dp.id] = dp.text;
		    textToId[dp.text] = dp.id;
	       }

	       return { id: textToId, text: idToText };
	  }
     });
}

export function useAllergyLabels() {
     return useQuery({
	  queryKey: QueryKeys.allergens.labels(),
	  queryFn: async () => {
	       const map = await getAllergyMap();
	       if (map instanceof PostgrestError) throw map;

	       return Object.keys(map.id);
	  }
     });
}

export function useCookingEventAllergens(id: number) {
    return useQuery({
        queryKey: QueryKeys.allergens.event(id),
        queryFn: async () => {
            const { data, error } = await Supabase
            .from("EventAllergies") 
            .select(`allergy_id, "AllergyLabel" (text)`)
            .eq('event_id', id);

            if (error) throw error;
            return data.map(t => t.AllergyLabel.text);
        }
    });
}

export async function updateCookingEventAllergens(eventId: number, allergens: string[]) {
     const { error: delError } = await Supabase
	  .from("EventAllergies")
	  .delete()
	  .eq("event_id", eventId);

     if (delError) throw delError;

     const map = await getAllergyMap();
     if (map instanceof Error) throw map;

     const ids: number[] = [];
     for (const allergyLabel of allergens) {
	  const id = map.id[allergyLabel];

	  if (!id || id === undefined)
	       throw new Error("updateCookingEventAllergebs got a label that does not map to an id");

	  ids.push(id);
     }

     const rows = ids.map(i => {return { event_id: eventId, allergy_id: i }});
     const { error: insError } = await Supabase
	  .from("EventAllergies")
	  .insert(rows)
	  .select();

     if (insError) throw insError;

     // Update cache
     QueryClient.setQueryData(QueryKeys.allergens.event(eventId), allergens);
}
