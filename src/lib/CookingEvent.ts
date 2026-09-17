import { useQuery } from "@tanstack/react-query";
import type { Tables } from "./database/gen-types";
import QueryClient from "./database/QueryClient";
import { Supabase } from "./database/Supabase";
import OAuth from "./OAuth";

const QueryKeys = {
    single: (id: number) => ["event", id] as const,
    next: () => ["events", "next"] as const,
    allergens: (id: number) =>
        ["event", id, "allergens"] as const,
};

export function useCookingEvent(id: number) {
    return useQuery({
        queryKey: QueryKeys.single(id),
        queryFn: async () => {
            const { data, error } = await Supabase
            .from("Events")
            .select("*")
            .eq('id', id)
            .single();

            if (error) throw error;
            return new CookingEvent(data);
        }
    })
}

export function useNextCookingEvents() {
    const rightNow = new Date();
    const today = new Date(rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDate());
    const todayISO = today.toISOString(); // YYYY-MM-DD

    return useQuery({
        queryKey: QueryKeys.next(),
        queryFn: async () => {
            const { data, error } = await Supabase
            .from("Events")
            .select("*")
            .gte("start_timestamp", todayISO)
            .order("start_timestamp", { ascending: true })
            .limit(5);

            if (error) throw error;
            const events = data.map(t => new CookingEvent(t));
            events.forEach(e => QueryClient.setQueryData(QueryKeys.single(e.id), e))

            return events;
        }
    });
}

export function useCookingEventAllergens(id: number) {
    return useQuery({
        queryKey: QueryKeys.allergens(id),
        queryFn: async () => {
            const { data, error } = await Supabase
            .from("EventAllergies") 
            .select(`allergy_id, "AllergyLabel" (text)`)
            .eq('event_id', id);

            if (error) throw error;
            return data.map(t => t.AllergyLabel.text);
        }
    })
}

export async function deleteCookingEvent(id: number) {
     if (!OAuth.isPrivileged()) throw new Error("Logged in user does not have permission to delete events");

     // Request deletion
     const { error } = await Supabase
	  .from("Events")
	  .delete()
	  .eq('id', id)
	  .single(); 

     if (error) throw error;

     // Invalidate affected caches:
     QueryClient.removeQueries({ queryKey: QueryKeys.single(id) });
     QueryClient.removeQueries({ queryKey: QueryKeys.allergens(id) });
     QueryClient.removeQueries({ queryKey: QueryKeys.next() });
}

type EventData = Tables<"Events">;
export class CookingEvent {
    private data: EventData;
    constructor(data: EventData) {
        this.data = data;
    }

    get description() { return this.data.description }
    get accessability() { return this.data.accessability }
    get backgroundImageUrl() { return this.data.background_image }
    get capacity() { return this.data.capacity }
    get id() { return this.data.id }
    get location() { return this.data.location }
    get name() { return this.data.name }
    get notableLink() { return this.data.notable_link }
    get requiresSignup() { return this.data.requires_signup }

    getStartDate(): Date {
        return new Date(this.data.start_timestamp + 'Z')
    }

    getEndDate(): Date {
        return new Date(this.data.end_timestamp + 'Z')
    }

    getBadges(): string[] {
        const badges = [];
        const startDate = this.getStartDate();
        const endDate = this.getEndDate();

        badges.push(startDate.toLocaleDateString('en-us', {
            weekday: "short",
            day: 'numeric',
            month: 'long'
        }));
        badges.push(startDate.toLocaleTimeString('en-us', {
            hour: "numeric",
            minute: "2-digit"
        }) + " - " + endDate.toLocaleTimeString('en-us', {
            hour: "numeric",
            minute: "2-digit"
        }));
        badges.push(this.location);

        switch (this.accessability) {
            case "AllStudents":
            badges.push("All Students");
            break;
        case "ClubMembers":
            badges.push("Club Members");
            break;
        }

        return badges;
    }
}
