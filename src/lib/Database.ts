import { createClient, PostgrestError } from "@supabase/supabase-js";

interface EventRecord {
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
    error: PostgrestError | null
}

class Database {
    private readonly PROJECT_URL = "https://okoywtixurlcfnkraeob.supabase.co";
    private readonly PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rb3l3dGl4dXJsY2Zua3JhZW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDExNjcsImV4cCI6MjA3Nzc3NzE2N30.Vtyh85w1_WYOjLeGbXNo35JwEMOG7E0Bo1tdFFr4vYw";

    client = createClient(this.PROJECT_URL, this.PUBLIC_API_KEY);

    async getEvent(id: number): Promise<DatabaseReturn<EventRecord>> {
        return this.client.from("Events").select("*").eq('id', id).single();
    }
}


export default new Database();