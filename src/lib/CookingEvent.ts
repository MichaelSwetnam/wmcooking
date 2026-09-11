import DBCache from "./database/DBCache";
import type { Tables } from "./database/gen-types";
import { Supabase } from "./database/Supabase";

type EventData = Tables<"Events">;

async function fetchEvent(id: number): Promise<EventData> {
    const { data, error } = await Supabase
        .from("Events")
        .select("*")
        .eq('id', id)
        .single();

    if (error || !data) throw new Error("Not implemented");

    return data;
}

export default class CookingEvent {
    private static Cache = new DBCache<number, EventData>(fetchEvent);

    public static async Get(key: number): Promise<CookingEvent> {
        return new CookingEvent(await CookingEvent.Cache.get(key));
    }

    public static async GetNextEvents(num: number): Promise<CookingEvent[]> {
        if (num > 10) throw new Error("Using num > 10 is not supported.");

        const rightNow = new Date();
        const today = new Date(rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDate());
        const todayISO = today.toISOString(); // YYYY-MM-DD

        const { data, error } = await Supabase
            .from("Events")
            .select("*")
            .gte("start_timestamp", todayISO)
            .order("start_timestamp", { ascending: true })
            .limit(num);

        if (error || !data) throw new Error("Not implemented");

        for (const event of data) {
            CookingEvent.Cache.set(event.id, event);
        }

        return data.map(q => new CookingEvent(q));
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
        const { data, error } = await Supabase
            .from("EventAllergies") 
            .select(`allergy_id, "AllergyLabel" (text)`)
            .eq('event_id', this.id);
        
        if (error || !data) throw new Error("Not implemented");

        const allergens = data.map(t => t.AllergyLabel.text);
        return allergens;
    }
}