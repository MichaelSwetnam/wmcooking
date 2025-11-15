import { Supabase } from "../Supabase";
import type { EventRecord } from "./EventRecord";
import DBError from "./DBError";
import Store from "./Store";
import DBReturn from "./DBReturn";
import getMillis from "./getMillis";
import OAuth from "../OAuth";

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
    },
    months: {
        [_: string]: {
            d: number[],
            livesUntil: number
        }
    }
};

const ONE_HOUR = 60 * 60 * 1000;

class Database {
    private static readonly EVENT_STORAGE_KEY = "EVENTS";
    private static readonly DATABASE_STORAGE_KEY = "DATABASE";
    private events: Store<EventRecord>;

    private nextEvents: {
        d: number[],
        livesUntil: number
    } | undefined;
    private months: {
        [_: string]: {
            d: number[],
            livesUntil: number
        }
    } = {};

    constructor() {
        this.events = Store.fromStorage<EventRecord>(Database.EVENT_STORAGE_KEY, getEvent);

        const dbStorage = localStorage.getItem(Database.DATABASE_STORAGE_KEY);
        if (dbStorage) {
            const obj = JSON.parse(dbStorage) as DatabaseStorage;
            if (obj.nextEvents && obj.nextEvents.livesUntil > getMillis()) {
                this.nextEvents = obj.nextEvents;
            }
            
            for (const key of Object.keys(obj.months)) {
                const data = obj.months[key as keyof DatabaseStorage["months"]];
                if (data.livesUntil > getMillis()) this.months[key] = data;
            }
        }
    }

    private save() {
        const obj: Partial<DatabaseStorage> = {};
        obj.nextEvents = this.nextEvents;
        obj.months = this.months;

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

        const ret = DBReturn.fromSupabase<EventRecord[]>(data, error);
        if (ret.isError()) return ret;

        this.nextEvents = {
            d: data!.map(d => d.id),
            livesUntil: getMillis() + ONE_HOUR // One hour
        }

        for (const event of ret.unwrapData()) {
            this.events.set(event.id.toString(), event);
        }

        this.save();
        return ret;
    }

    async getEventsInMonth(month: number, year: number): Promise<DBReturn<EventRecord[]>> {
        const mapString = `${year}-${month}`;

        if (this.months && this.months[mapString] && this.months[mapString].livesUntil > getMillis()) {
            const ids = this.months[mapString].d;

            return DBReturn.all(
                await Promise.all(
                    ids.map(id => this.getEvent(id))
                )
            );
        }
        
        // Get the dates (start and end of month)
        const startOfMonth = new Date(year, month, 1).toISOString();
        const endOfMonth = new Date(year, month + 1, 1).toISOString();

        const { data, error } = await Supabase
            .from("Events")
            .select("*")
            .gte("start", startOfMonth)
            .lt("start", endOfMonth);
        
        const ret = DBReturn.fromSupabase<EventRecord[]>(data, error);
        if (ret.isError()) return ret;

        this.months[mapString] = {
            d: ret.unwrapData().map(e => e.id),
            livesUntil: getMillis() + ONE_HOUR
        }
        for (const event of ret.unwrapData()) {
            this.events.set(event.id.toString(), event);
        }

        this.save();
        return ret;
    }

    /**
     * @param id 
     * @param event 
     * @returns Event date after update.
     */
    async updateEvent(id: number, event: EventRecord): Promise<DBReturn<EventRecord>> {
        if (!await OAuth.isPrivileged()) {
            return new DBReturn<EventRecord>(DBError.custom("User does not have permission to update events."));
        }
        if (id !== event.id) {
            return new DBReturn<EventRecord>(DBError.custom("Event ids must match in update requests."));
        }

        const { data, error } = await Supabase
            .from("Events")
            .update(event)
            .eq('id', id)
            .select('*')
            .single();
        
        const ret = DBReturn.fromSupabase<EventRecord>(data, error);
        if (ret.isError())
            return ret;

        const retData = ret.unwrapData();
        this.events.set(retData.id.toString(), retData);
        return ret;
    }
}

export default new Database();