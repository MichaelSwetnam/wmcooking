import type { PostgrestError } from "@supabase/supabase-js";
import { Supabase } from "./Supabase";
import DBReturn from "./Database/DBReturn";
import type ProfileRecord from "./Database/Records/ProfileRecord";
import Database from "./Database/Database";

export class UserProfile {
    private record: ProfileRecord;

    constructor(rec: ProfileRecord) {
        this.record = rec;
    }

    isPrivileged(): boolean {
        return this.record.is_admin;
    }

    getId(): string {
        return this.record.id;
    }

    getEmail(): string {
        return this.record.email;
    }

    getName(): string {
        return this.record.name;
    }
}

class OAuth {
    private signedInUser: string | null = null; // Key to database cache
 
    /**
     * Forces a redirect which means the entire app will reload.
     * @param href The page which the OAUTH should redirect to.
     */
    async logIn(href: string) {
        Supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: href }});
    }

    /**
     * Ends the current auth session, logging out the user.
     * @returns Whether the logout was succesfull
     */
    async logOut(): Promise<boolean> {
        Database.profiles.logoutWipe();
        
        const error = await Supabase.auth.signOut();
        this.signedInUser = null;
        
        return (error !== null);
    }

    /**
     * Get the id of the signed in user
     * @returns String id of signed in user
     */
    private async getId(): Promise<DBReturn<string>> {
        if (this.signedInUser !== null) {
            return new DBReturn(this.signedInUser);
        }

        const { data, error } = await Supabase.auth.getUser();
                                        // This is a dangerous type assertion but the errors act the same.
        const res = DBReturn.fromSupabase(data, error as unknown as PostgrestError);
        if (res.isError()) 
            return res.mapError<string>();

        const userData = res.unwrapData();
        if (userData.user === undefined)
            return res.mapError<string>();

        if (res.isData())
            this.signedInUser = res.unwrapData().user!.id;

        return res.map(u => u.user!.id);
    }

    /**
     * Get the profile for the signed in user
     */
    async getUser(): Promise<UserProfile | null> {
        console.log("Someone called getUser()!!!!!");
        const idRet = await this.getId();
        if (idRet.isError()) 
            return null;

        const id = idRet.unwrapData();
        const userProfile = await Database.profiles.get(id);
        if (userProfile.isError())
            return null;

        return new UserProfile(userProfile.unwrapData());
    }
}

export default new OAuth();