import OAuth from "../../OAuth";
import { Supabase } from "../../Supabase";
import type { DatabaseStorage, DBWrapper } from "../Database";
import DatabaseChild from "./DatabaseChild";
import DBError from "../DBError";
import DBReturn from "../DBReturn";
import type { EventRecord } from "../Records/EventRecord";
import getMillis from "../getMillis";
import Store from "../Store";

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

const ONE_HOUR = 60 * 60 * 1000;
type Key = "events";
export default class DatabaseEvents extends DatabaseChild {
    private static readonly EVENT_STORAGE_KEY = "EVENTS";

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

    constructor(db: DBWrapper) {
        super(db);
        this.events = Store.fromStorage<EventRecord>(DatabaseEvents.EVENT_STORAGE_KEY, getEvent);

    }

    async get(id: number): Promise<DBReturn<EventRecord>> {
        return this.events.get(id.toString());
    }

    async getNextEvents(limit: number): Promise<DBReturn<EventRecord[]>> {
        if (this.nextEvents && this.nextEvents.livesUntil > getMillis()) {
            const eventIds = this.nextEvents.d.slice(0, limit);
            const events = await Promise.all(eventIds.map(id => this.get(id)));

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
        return ret.map(d => d.slice(0, limit));
    }

    async getEventsInMonth(month: number, year: number): Promise<DBReturn<EventRecord[]>> {
        const mapString = `${year}-${month}`;

        if (this.months && this.months[mapString] && this.months[mapString].livesUntil > getMillis()) {
            const ids = this.months[mapString].d;

            return DBReturn.all(
                await Promise.all(
                    ids.map(id => this.get(id))
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
    async update(id: number, event: EventRecord): Promise<DBReturn<EventRecord>> {
        if (!await OAuth.isPrivileged()) {
            return new DBReturn<EventRecord>(DBError.custom("User does not have permission to update events."));
        }
        if (id !== event.id) {
            return new DBReturn<EventRecord>(DBError.custom("Event ids must match in update requests."));
        }

        const payload: Partial<EventRecord> = event;
        payload.id = undefined; // Should never be updated;
        const { data, error } = await Supabase
            .from("Events")
            .update(payload)
            .eq('id', id)
            .select('*')
            .single();

        console.log(data, error);

        const ret = DBReturn.fromSupabase<EventRecord>(data, error);
        if (ret.isError())
            return ret;

        const retData = ret.unwrapData();
        this.events.set(retData.id.toString(), retData);
        return ret;
    }

    private save() {
        this.db.save();
    }

    toCacheObject(): DatabaseStorage[Key] {
        const obj: Partial<DatabaseStorage[Key]> = {};
        obj.nextEvents = this.nextEvents;
        obj.months = this.months;
        return obj as DatabaseStorage[Key];
    }

    updateFromCache(o: DatabaseStorage[Key]): void {
        if (o.nextEvents && o.nextEvents.livesUntil > getMillis()) {
            this.nextEvents = o.nextEvents;
        }
        
        for (const key of Object.keys(o.months)) {
            const data = o.months[key as keyof DatabaseStorage[Key]["months"]];
            if (data.livesUntil > getMillis()) this.months[key] = data;
        }
    }
}