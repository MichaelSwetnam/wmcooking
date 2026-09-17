import { useQuery } from "@tanstack/react-query";
import type { Tables } from "./database/gen-types";
import { Supabase } from "./database/Supabase";

export function useSignupsFromEvent(eventId: number) {
     return useQuery({
	  queryKey: ["signups", "event", eventId],
	  queryFn: async () => {
	       const { data, error } = await Supabase
		    .from("EventSignup")
		    .select(`
			 *,
			 "Profiles" (
			      name
			 )
		    `)
		    .eq("event_id", eventId);

	       if (error) throw error;
	       return data.map(d => {
		    return {
			 name: d.Profiles.name,
			 ...d
		    }
	       }).map(d => new EventSignup(d));
	  }
     });
}

type SignupData = Tables<"EventSignup"> & { name: string };
export class EventSignup {
     private data: SignupData;
     constructor(data: SignupData) {
	  this.data = data;
     }

     getDateCreated(): Date {
	  return new Date(this.data.date_created + 'Z');
     }

     get signupId() { return this.data.id; }
     get eventId() { return this.data.event_id; }
     get profileId() { return this.data.user_id; } 
     get profileName() { return this.data.name; }
}
