import { useQuery } from "@tanstack/react-query";
import type { Tables } from "./database/gen-types";
import { Supabase } from "./database/Supabase";
import OAuth from "./OAuth";
import QueryClient from "./database/QueryClient";
import { CookingEvent } from "./CookingEvent";

const QueryKeys = {
     event: (eventId: number) => ["signups", "event", eventId],
     single: (signupId: number) => ["signup", signupId]

};

export async function invokeDeleteSignup(signup: EventSignup): Promise<Tables<"EventSignup">> {
     const user = await OAuth.getUser();
     if (!user) 
	  throw new Error("Could not delete the signup, as there is no logged user.");

     const cachedSignup = QueryClient.getQueryData(QueryKeys.single(signup.signupId));
     if (!cachedSignup)
	  throw new Error("Could not delete signup, as it does not appear to exist.");

     if (!(cachedSignup instanceof EventSignup))
	  throw new Error("Signup cache was invalid. Try refreshing the page.");

     const { data: _data, error } = await Supabase.functions.invoke("event-signup", {
	  method: "DELETE",
	  body: { eventId: signup.eventId }
     });

     if (error) throw error;
     const data = _data as { payload: Tables<"EventSignup"> };

     // Using the fresh data returned from the function, as we know that is not corrupted.
     QueryClient.invalidateQueries({ queryKey: QueryKeys.single(data.payload.id) });
     QueryClient.invalidateQueries({ queryKey: QueryKeys.event(data.payload.event_id) });

     return data.payload;
}

export async function invokeInsertSignup(event: CookingEvent): Promise<EventSignup> {
     const user = await OAuth.getUser();
     if (!user)
	  throw new Error("Could not insert signup, as there is no logged in user.");

     const eventSignups = QueryClient.getQueryData(QueryKeys.event(event.id)) as EventSignup[] | undefined;
     if (!eventSignups)
	  throw new Error("Invalid cache data for event. Try refreshing your page");

     const find = eventSignups.findIndex(x => x.profileId === user.id);
     if (find !== -1)
	  throw new Error("Signup data is already cached. Try refreshing your page, or it is possible you are already signuped up.");

     const { data: _data, error } = await Supabase.functions.invoke("event-signup", {
	  method: "PUT",
	  body: { eventId: event.id }
     });

     if (error) throw error;

     const data = _data.payload as Tables<"EventSignup">;
     const signupInstance = new EventSignup({
	  name: user.name,
	  ...data
     });

     // Using the fresh data returned from the function, as we know that is not corrupted.
     QueryClient.invalidateQueries({ queryKey: QueryKeys.event(data.event_id) });
     return signupInstance;
}

export function useSignupsFromEvent(eventId: number) {
     return useQuery({
	  queryKey: QueryKeys.event(eventId),
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
	       
	       const signupInstances = data.map(d => {
		    return {
			 name: d.Profiles.name,
			 ...d
		    }
	       }).map(d => new EventSignup(d));

	       signupInstances.forEach(s => QueryClient.setQueryData(QueryKeys.single(s.signupId), s));
	       return signupInstances;
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
