import OAuth from "../../OAuth";
import { Supabase } from "../../Supabase";
import type { DBWrapper } from "../Database";
import DBError from "../DBError";
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

    async updateName(id: string, newName: string): Promise<DBReturn<ProfileRecord>> {
        const userProfileReturn = await OAuth.getUser();
        if (userProfileReturn.isError()) return userProfileReturn;

        const userProfile = userProfileReturn.unwrapData();
        if (id !== userProfile.id)
            return DBReturn.fromError(DBError.custom("Can only update your own display name, not others."));

        const { data, error } = await Supabase
            .from("Profiles")
            .update({ name: newName })
            .eq('id', userProfile.id)
            .select("*")
            .single();

        const ret = DBReturn.fromSupabase<ProfileRecord>(data, error);

        ret.ifData(d => 
            this.profiles.set(userProfile.id, d)
        );

        return ret;
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