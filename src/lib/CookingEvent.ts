import DBCache from "./database/DBCache";
import { DBReturn } from "./database/DBReturn";
import type { Tables } from "./database/gen-types";
import { Supabase } from "./database/Supabase";

type EventData = Tables<"Events">;

async function fetchEvent(id: number): Promise<DBReturn<EventData>> {
    const { data, error } = await Supabase
        .from("Events")
        .select("*")
        .eq('id', id)
        .single();

    return DBReturn.FromDB(data, error);
}

throw new Error("GetNextEvents should cache result!");
throw new Error("Allergens should cache result!");
export default class CookingEvent {
    private static Cache = new DBCache<number, EventData>(fetchEvent);

    public static async Get(key: number): Promise<DBReturn<CookingEvent>> {
        return (await CookingEvent.Cache.get(key)).map(d => new CookingEvent(d));
    }

    public static async GetNextEvents(num: number): Promise<DBReturn<CookingEvent[]>> {
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

        const dbret = DBReturn.FromDB(data, error);

        if (dbret.isData()) {
            for (const event of dbret.getData()) {
                CookingEvent.Cache.set(event.id, event);
            }
        }

        return dbret.map(arr => arr.map(q => new CookingEvent(q)));
    }

    private data: EventData;
    private allergens?: string[];
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

    async getAllergens(): Promise<DBReturn<string[]>> {
        if (!this.allergens) {
            const { data, error } = await Supabase
            .from("EventAllergies") 
            .select(`allergy_id, "AllergyLabel" (text)`)
            .eq('event_id', this.id);
        

            const dbRet = DBReturn.FromDB(data, error).map(d => d.map(t => t.AllergyLabel.text));
            if (dbRet.isData()) {
                this.allergens = dbRet.getData();
            }

            return dbRet;
        }

        return DBReturn.fromData(this.allergens);
    }
}