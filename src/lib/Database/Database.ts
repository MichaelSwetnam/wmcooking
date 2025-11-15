import { Supabase } from "../Supabase";
import type { EventRecord } from "./EventRecord";
import DBError from "./DBError";
import Store from "./Store";
import DBReturn from "./DBReturn";
import getMillis from "./getMillis";

async function getEvent(id: string): Promise<DBReturn<EventRecord>> {
    const parsed = parseInt(id);
    if (isNaN(parsed)) return new DBReturn<EventRecord>(DBError.custom("Event did not have an integer"));
    
    const { data, error } = await Supabase
        .from("Events")
        .select("*")
        .eq('id', id)
        .single();
     
    return DBReturn.fromSupabase(data, error);
}

type DatabaseStorage = {
    nextEvents: {
        d: number[];
        livesUntil: number;
    }
};

class Database {
    private static readonly EVENT_STORAGE_KEY = "EVENTS";
    private static readonly DATABASE_STORAGE_KEY = "DATABASE";
    private events: Store<EventRecord>;
    private nextEvents: {
        d: number[],
        livesUntil: number
    } | undefined;

    constructor() {
        this.events = Store.fromStorage<EventRecord>(Database.EVENT_STORAGE_KEY, getEvent);

        const dbStorage = localStorage.getItem(Database.DATABASE_STORAGE_KEY);
        if (dbStorage) {
            const obj = JSON.parse(dbStorage) as DatabaseStorage;
            if (obj.nextEvents && obj.nextEvents.livesUntil > getMillis()) {
                this.nextEvents = obj.nextEvents;
            }
        }
    }

    private save() {
        const obj: Partial<DatabaseStorage> = {};
        obj.nextEvents = this.nextEvents;
        localStorage.setItem(Database.DATABASE_STORAGE_KEY, JSON.stringify(obj));
    }

    async getEvent(id: number): Promise<DBReturn<EventRecord>> {
        return this.events.get(id.toString());
    }

    async getNextEvents(limit: number): Promise<DBReturn<EventRecord[]>> {
        if (this.nextEvents && this.nextEvents.livesUntil > getMillis()) {
            const eventIds = this.nextEvents.d.slice(0, limit);
            const events = await Promise.all(eventIds.map(id => this.getEvent(id)));

            return DBReturn.all(events);
        }

        const rightNow = new Date();
        const today = new Date(rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDate());

        const { data, error } = await Supabase
            .from("Events")
            .select("*")
            .gte("start", today.toISOString())
            .order("start", { ascending: true })
            .limit(10);

        const ret = DBReturn.fromSupabase(data, error);
        if (ret.isError()) return ret;

        this.nextEvents = {
            d: data!.map(d => d.id),
            livesUntil: getMillis() + 60 * 60 * 1000 // One hour
        }

        for (const event of data as EventRecord[]) {
            this.events.set(event.id.toString(), event);
        }

        this.save();
        return new DBReturn(data as EventRecord[]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getEventsInMonth(month: number, year: number): Promise<DBReturn<EventRecord[]>> {
        throw new Error("Not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateEvent(id: number, event: EventRecord): Promise<DBError | undefined> {
        throw new Error("Not implemented.");
    }
}

export default new Database();

//     async getEventsInMonth(month: number, year: number): Promise<DatabaseReturn<EventRecord[]>> {
//         const mapString = `${year}-${month}`;
//         if (this.monthLoaded.has(mapString)) {
//             const ids = this.monthLoaded.get(mapString)!;            
//             const eventData = await Promise.all(ids.map(id => this.getEvent(id)));
//             return { data: eventData.map(r => r.data!), error: null, cached: true };
//         }

//         // Get the dates (start and end of month)
//         const startOfMonth = new Date(year, month, 1).toISOString();
//         const endOfMonth = new Date(year, month + 1, 1).toISOString();
        
//         const result = await Supabase
//             .from("Events")
//             .select("*")
//             .gte("start", startOfMonth)
//             .lt("start", endOfMonth)

//         if (result.data && !result.error) {
//             this.monthLoaded.set(mapString, result.data.map(event => event.id));

//             for (const event of result.data as EventRecord[]) {
//                 this.events.set(event.id, event);
//             }
//         }

//         return result;
//     }

//     /**
//      * 
//      * @param id 
//      * @param event 
//      * @returns Error message or undefined if there was no error
//      */
//     async updateEvent(id: number, event: EventRecord): Promise<string | undefined> {
//         if (!await OAuth.isPrivileged()) {
//             return "User does not have permission to update events.";
//         }
        
//         if (id !== event.id) {
//             return "Event ids must match in update requests.";
//         }
        
//         const { data, error } = await Supabase
//             .from("Events")
//             .update(event)
//             .eq('id', id)
//             .select('id');

//         if (error)
//             return error.message;

//         if (!data)
//             return "Did not update any data.";

//         if (this.events.get(id)) {
//             this.events.set(id, event);
//         }

//         return undefined;
//     }