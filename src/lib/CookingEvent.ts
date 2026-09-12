import type { Tables } from "./database/gen-types";
import QueryClient from "./database/QueryClient";
import { Supabase } from "./database/Supabase";

type EventData = Tables<"Events">;
export default class CookingEvent {
    public static readonly QueryKeys = {
        single: (id: number) => ["event", id] as const,
        next: () => ["events", "next"] as const,
        allergens: (id: number) =>
            ["event", id, "allergens"] as const,
    };
    
    public static async GetNextEvents(): Promise<CookingEvent[]> {
        const rightNow = new Date();
        const today = new Date(rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDate());
        const todayISO = today.toISOString(); // YYYY-MM-DD

        const data = await QueryClient.query({
            queryKey: this.QueryKeys.next(),
            queryFn: async () => {
                const { data, error } = await Supabase
                .from("Events")
                .select("*")
                .gte("start_timestamp", todayISO)
                .order("start_timestamp", { ascending: true })
                .limit(5);

                if (error) throw error;
                return data;
            }
        })

        const events = data.map(t => new CookingEvent(t));
        for (const event of events) {
            QueryClient.setQueryData(this.QueryKeys.single(event.id), event)
        }

        return events;
    }

    public static async Get(id: number): Promise<CookingEvent> {
        const event = await QueryClient.query({
            queryKey: this.QueryKeys.single(id),
            queryFn: async () => {
                const { data, error } = await Supabase
                .from("Events")
                .select("*")
                .eq('id', id)
                .single();

                if (error) throw error;
                return data;
            }
        });

        return new CookingEvent(event);
    }

    private data: EventData;
    private constructor(data: EventData) {
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

    async getAllergens(): Promise<string[]> {
        const allergens = await QueryClient.query({
            queryKey: CookingEvent.QueryKeys.allergens(this.id),
            queryFn: async () => {
                const { data, error } = await Supabase
                .from("EventAllergies") 
                .select(`allergy_id, "AllergyLabel" (text)`)
                .eq('event_id', this.id);

                if (error) throw error;
                return data.map(t => t.AllergyLabel.text);
            }
        });

        return allergens;
    }
}