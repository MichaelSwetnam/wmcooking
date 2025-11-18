import { Supabase } from "../../Supabase";
import type { DBWrapper } from "../Database";
import DBReturn from "../DBReturn";
import type ProfileRecord from "../Records/ProfileRecord";
import Store from "../Store";
import DatabaseChild from "./DatabaseChild";

async function getProfile(id: string): Promise<DBReturn<ProfileRecord>>{
    const { data, error } = await Supabase
        .from("Profiles")
        .select("*")
        .eq('id', id)
        .single();
    
    return DBReturn.fromSupabase(data, error);
}

export default class DatabaseProfiles extends DatabaseChild {
    private static readonly PROFILE_STORAGE_KEY = "PROFILES";
    private profiles = Store.fromStorage<ProfileRecord>(DatabaseProfiles.PROFILE_STORAGE_KEY, getProfile);
    
    constructor(db: DBWrapper) {
        super(db);
    }

    async get(id: string): Promise<DBReturn<ProfileRecord>> {
        return this.profiles.get(id);
    }

    logoutWipe() {
        // When a user logs out we must remove all profile information in case an exec member logs out and allows a non-exec into the browser.
        localStorage.removeItem(DatabaseProfiles.PROFILE_STORAGE_KEY);
        this.profiles = Store.fromStorage<ProfileRecord>(DatabaseProfiles.PROFILE_STORAGE_KEY, getProfile);
    }

    toCacheObject(): unknown {
        throw new Error("DatabaseProfiles does not store in DATABASE.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateFromCache(_s: unknown): void {
        throw new Error("DatabaseProfiles does not store in DATABASE.");
    }

}