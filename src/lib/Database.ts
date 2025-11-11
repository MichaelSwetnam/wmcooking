import { PostgrestError } from "@supabase/supabase-js";
import { Supabase } from "./Supabase";

export interface EventRecord {
    accessability: "AllStudents" | "ClubMembers";
    description: string;
    end: string;
    id: number;
    location: string;
    name: string;
    start: string;
    background_image: string;
    signup_link: string | null;
    requires_signup: boolean;
}

export interface DatabaseReturn<T> {
    data: T | null,
    error: PostgrestError | null,
    cached?: true
}

class Database {    
    private events = new Map<number, EventRecord>();
    private nextEvents: EventRecord[] | undefined = undefined;
    private monthLoaded = new Map<string, number[]>(); // Year-Month -> id[]

    async getEvent(id: number): Promise<DatabaseReturn<EventRecord>> {
        const cache = this.events.get(id);
        if (cache !== undefined)
            return { data: cache, error: null, cached: true };

        const result = await Supabase
            .from("Events")
            .select("*")
            .eq('id', id)
            .single();

        if (result.data && !result.error) {
            const data = result.data as EventRecord;
            this.events.set(data.id, data);
        }

        return result;
    }

    async getNextEvents(limit: number): Promise<DatabaseReturn<EventRecord[]>> {
        if (this.nextEvents) {
            return { data: this.nextEvents.slice(0, limit), error: null, cached: true };
        }

        const rightNow = new Date();
        const today = new Date(rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDay());

        const result = await Supabase
            .from("Events")
            .select("*")
            .gte("start", today.toISOString())
            .order("start", { ascending: true })
            .limit(10);
        
        if (result.data && !result.error) {
            this.nextEvents = result.data;

            for (const event of result.data as EventRecord[]) {
                this.events.set(event.id, event);
            }
        }

        return { 
            data: result.data ? result.data.slice(0, limit) : null,
            error: result.error
        };
    }

    async getEventsInMonth(month: number, year: number): Promise<DatabaseReturn<EventRecord[]>> {
        const mapString = `${year}-${month}`;
        if (this.monthLoaded.has(mapString)) {
            const ids = this.monthLoaded.get(mapString)!;            
            const eventData = await Promise.all(ids.map(id => this.getEvent(id)));
            return { data: eventData.map(r => r.data!), error: null, cached: true };
        }

        // Get the dates (start and end of month)
        const startOfMonth = new Date(year, month, 1).toISOString();
        const endOfMonth = new Date(year, month + 1, 1).toISOString();
        
        const result = await Supabase
            .from("Events")
            .select("*")
            .gte("start", startOfMonth)
            .lt("start", endOfMonth)

        if (result.data && !result.error) {
            this.monthLoaded.set(mapString, result.data.map(event => event.id));

            for (const event of result.data as EventRecord[]) {
                this.events.set(event.id, event);
            }
        }

        return result;
    }
}

export default new Database();