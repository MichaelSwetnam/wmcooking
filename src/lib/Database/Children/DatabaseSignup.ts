import OAuth from "../../OAuth";
import { Supabase } from "../../Supabase";
import type { DBWrapper } from "../Database";
import DBError from "../DBError";
import DBReturn from "../DBReturn";
import type { SignupRecord } from "../Records/SignupRecord";
import Store from "../Store";
import DatabaseChild from "./DatabaseChild";

/**
 * Signups don't cache in localStorage, but they will keep data between page navigation.
 */
export default class DatabaseSignup extends DatabaseChild {
    private static readonly SIGNUP_STORAGE_KEY = "SIGNUPS";
    private readonly signups = Store.fromStorage<SignupRecord>(DatabaseSignup.SIGNUP_STORAGE_KEY);

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
     * Invokes edge function to delete the signup.
     * **ENSURE THAT THE USER IS LOGGED IN**
     * @param id 
     * @returns The data that was deleted.
     */
    async invokeDelete(id: string): Promise<DBReturn<SignupRecord>> {
        const user = await OAuth.getUser();
        if (!user) return new DBReturn(DBError.custom("Could not delete a signup, as there is no logged in user.")).mapError();

        const signupReq = await this.signups.get(id);
        if (signupReq.isError()) return new DBReturn(DBError.custom("Could not delete a signup, as it does not appear to exist.")).mapError();

        const signup = signupReq.unwrapData();

        const { data, error } = await Supabase.functions.invoke("event-signup", {
            method: "DELETE",
            body: {
                eventId: signup.event_id
            }
        });

        const response = (await DBReturn.fromSupabaseFunction<{ payload: SignupRecord }>(data, error)).map(p => p.payload);
        if (response.isError()) return response;

        const payload = response.unwrapData();
        payload.user_name = user.getName(); // This is not set by the supabase function.
        this.signups.delete(payload.id.toString());

        return response;
    }

    /**
     * Invokes edge function to insert a new signup
     * **ENSURE THAT THE USER IS LOGGED IN**
     * @param event_id 
     * @param user_id 
     * @returns 
     */
    async invokeInsert(event_id: string, user_id: string): Promise<DBReturn<SignupRecord>> {
        const user = await OAuth.getUser();
        if (!user) return new DBReturn(DBError.custom("Could not insert a signup, as there is no logged in user.")).mapError();

        if (this.signups.findExists(x => x.event_id == event_id && x.user_id == user_id)) {
            return DBReturn.fromError(DBError.custom("This entry already exists."));
        }

        const { data, error } = await Supabase.functions.invoke("event-signup", {
            method: "PUT",
            body: {
                eventId: event_id
            }
        });

        const response = (await DBReturn.fromSupabaseFunction<{ payload: SignupRecord }>(data, error)).map(p => p.payload);
        if (response.isError()) return response;

        const payload = response.unwrapData();
        payload.user_name = user.getName(); // This is not set by the supabase function.
        this.signups.set(payload.id.toString(), payload);
        
        return response;
    }

    toCacheObject(): unknown {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateFromCache(_s: unknown): void {
        throw new Error("Method not implemented.");
    }
}
