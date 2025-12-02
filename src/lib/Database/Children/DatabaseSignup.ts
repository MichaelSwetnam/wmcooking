import { Supabase } from "../../Supabase";
import type { DBWrapper } from "../Database";
import DBError from "../DBError";
import DBReturn from "../DBReturn";
import type { SignupRecord } from "../Records/SignupRecord";
import Store from "../Store";
import DatabaseChild from "./DatabaseChild";

async function getSignup(id: string): Promise<DBReturn<SignupRecord>> {
    const { data, error } = await Supabase
        .from("EventSignup")
        .select(`
            *,
            Profiles (
                name
            )
        `)
        .eq('id', id)
        .single();
    
    throw new Error("Got individual signup! Not implemented.");
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
        .select(`
            *,
            "Profiles" (
                name
            )
        `)
        .eq('event_id', eventId);
        
        type SupabaseReturn = { Profiles: { name: string }, id: number, user_id: string, event_id: string, date_created: string }[];

        const r = DBReturn.fromSupabase<SupabaseReturn>(data, error);
        if (r.isError()) return r.mapError();
        
        const d = r.unwrapData();
        const signups: SignupRecord[] = [];

        d.forEach(s =>  {
                const SURecord: Partial<SignupRecord> = {};
                SURecord.id = s.id;
                SURecord.event_id = s.event_id;
                SURecord.user_id = s.user_id;
                SURecord.user_name = s.Profiles.name;
                
                signups.push(SURecord as SignupRecord);
                this.signups.set(s.id.toString(), SURecord as SignupRecord);
            }
        )

        return new DBReturn(signups);
    }
    
    /**
     * 
     * @param id 
     * @returns The data that was deleted.
     */
    async delete(id: string): Promise<DBReturn<SignupRecord>> {
        // Assumption: If i'm trying to delete a signup - it should have been cached. 
        // Therefore this await is trivial and I should make sure the record exists here instead of DB layer.
        const cacheRet = await this.signups.get(id);
        if (cacheRet.isError()) return DBReturn.fromError(DBError.custom("Cannot delete something which doesn't exist."));

        // I won't check authorization here, that is the role of RLS on Supabase.
        const { data, error } = await Supabase.from("EventSignup")
            .delete()
            .eq('id',  id)
            .select()
            .single();

        const dbRet = DBReturn.fromSupabase<SignupRecord>(data, error);
        if (dbRet.isError()) return dbRet;

        // If successful, make sure to delete the record from cache.
        dbRet.ifData(() => this.signups.delete(id));

        return dbRet;
    }

    async insert(event_id: string, user_id: string): Promise<DBReturn<SignupRecord>> {
        // Make sure this doesn't already exist.
        if (this.signups.findExists(x => x.event_id == event_id && x.user_id == user_id)) {
            return DBReturn.fromError(DBError.custom("This entry already exists."));
        }

        const { data, error } = await Supabase
            .from("EventSignup")
            .insert({ user_id, event_id, date_created: new Date().toISOString() })
            .select("*")
            .single();

        const ret = DBReturn.fromSupabase<SignupRecord>(data as unknown as SignupRecord, error);
        if (ret.isError()) {
            return ret;
        }

        const signupRecord = ret.unwrapData();
        this.signups.set(signupRecord.id.toString(), signupRecord);
        return ret;
    }

    toCacheObject(): unknown {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateFromCache(_s: unknown): void {
        throw new Error("Method not implemented.");
    }
}
