import { Supabase } from "../../Supabase";
import type { DBWrapper } from "../Database";
import DBReturn from "../DBReturn";
import type { SignupRecord } from "../Records/SignupRecord";
import Store from "../Store";
import DatabaseChild from "./DatabaseChild";

async function getSignup(id: string): Promise<DBReturn<SignupRecord>> {
    const { data, error } = await Supabase
        .from("EventSignup")
        .select("*")
        .eq('id', id)
        .single();
    
    return DBReturn.fromSupabase(data, error);
}

export default class DatabaseSignup extends DatabaseChild {
    private static readonly SIGNUP_STORAGE_KEY = "SIGNUPS";
    private readonly signups = Store.fromStorage<SignupRecord>(DatabaseSignup.SIGNUP_STORAGE_KEY, getSignup);

    constructor(db: DBWrapper) {
        super(db);
    }

    async get(id: number) {
        return this.signups.get(id.toString());
    }

    /**
     * !! This function is never cached
     */
    async getFromEvent(eventId: number): Promise<DBReturn<SignupRecord[]>> {
        const { data, error } = await Supabase
        .from("EventSignup")
        .select("*")
        .eq('event_id', eventId);
        
        const r = DBReturn.fromSupabase<SignupRecord[]>(data, error);
        r.ifData(d => d.forEach(s => this.signups.set(s.id.toString(), s)))

        return r;
    }
    
    toCacheObject(): unknown {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateFromCache(_s: unknown): void {
        throw new Error("Method not implemented.");
    }
}
