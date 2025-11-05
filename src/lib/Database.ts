import { createClient, PostgrestError } from "@supabase/supabase-js";

export interface EventRecord {
    accessability: "AllStudents" | "ClubMembers";
    description: string;
    end: string;
    id: number;
    location: string;
    name: string;
    start: string;
}

interface DatabaseReturn<T> {
    data: T | null,
    error: PostgrestError | null,
    cached?: true
}

class Database {
    private readonly PROJECT_URL = "https://okoywtixurlcfnkraeob.supabase.co";
    private readonly PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rb3l3dGl4dXJsY2Zua3JhZW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDExNjcsImV4cCI6MjA3Nzc3NzE2N30.Vtyh85w1_WYOjLeGbXNo35JwEMOG7E0Bo1tdFFr4vYw";

    private client = createClient(this.PROJECT_URL, this.PUBLIC_API_KEY);
    
    private events = new Map<number, EventRecord>();
    private nextEvents: EventRecord[] | undefined = undefined;
    private eventsInMonth: EventRecord[] | undefined = undefined;

    async getEvent(id: number): Promise<DatabaseReturn<EventRecord>> {
        const cache = this.events.get(id);
        if (cache !== undefined)
            return { data: cache, error: null, cached: true };

        const result = await this.client
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

        const result = await this.client
            .from("Events")
            .select("*")
            .gte("start", new Date().toISOString())
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

    async getEventsInCurrentMonth(): Promise<DatabaseReturn<EventRecord[]>> {
        if (this.eventsInMonth)
            return { data: this.eventsInMonth, error: null, cached: true }

        // Get the current date
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
        
        const result = await this.client
            .from("Events")
            .select("*")
            .gte("start", startOfMonth)
            .lt("start", endOfMonth)

        if (result.data && !result.error) {
            this.eventsInMonth = result.data;

            for (const event of result.data as EventRecord[]) {
                this.events.set(event.id, event);
            }
        }

        return result;
    }
}

export default new Database();