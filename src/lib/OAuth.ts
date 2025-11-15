import type { AuthError, PostgrestError, User } from "@supabase/supabase-js";
import { Supabase } from "./Supabase";
import DBReturn from "./Database/DBReturn";

export interface UserRecord {
    id: string;
    email: string;
    is_admin: boolean;
    picture: string;
}

interface AssociatedData {
    id: string;
    is_admin: boolean;
}

export interface OAuthReturn<T> {
    data: T | null,
    error: AuthError | PostgrestError | null,
    cached?: true
}

class OAuth {
    private signedInUser: UserRecord | null = null; 
    private isSignedIn: boolean | null = null;

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
        const error = await Supabase.auth.signOut();
        this.signedInUser = null;
        this.isSignedIn = false;
        
        return (error !== null);
    }

    /**
     * Stitches together Supabase profile data nad associated profile data from public.Profiles
     * @param user User data from Supabase
     * @param data User data from public.Profiles
     * @returns UserRecord containing useful data from both.
     */
    private composeRecord(user: User, data: AssociatedData): UserRecord {
        const picture = user.user_metadata?.picture;
        if (!picture)
            throw new Error("User did not have a picture / ie did not go through google as a provider.");

        this.isSignedIn = true;
        const completeUser: UserRecord = {
            id: user.id,
            email: user.email!,
            is_admin: data.is_admin,
            picture
        };

        return completeUser;
    }

    /**
     * Always calls Supabase and does not cached information. Only should be used from getUser() to get relevant data and everything is cached together as a whole.
     * @param id 
     * @returns 
     */
    private async getAssociatedData(id: string): Promise<DBReturn<AssociatedData>> {
        const { data, error } = await Supabase
            .from("Profiles")
            .select("*")
            .eq('id', id)
            .single();


        return DBReturn.fromSupabase<AssociatedData>(data, error);
    }

    /**
     * Grabs data from Supabase or from cache of currently logged in user. 
     * @returns Null if no user is logged in
     */
    async getUser(): Promise<UserRecord | null> {
        if (this.isSignedIn === false)
            return null;

        if (this.signedInUser) {
            return this.signedInUser;
        }

        const { data: { user }, error } = await Supabase.auth.getUser();
        if (error || !user) {
            this.isSignedIn = false;
            return null;
        }

        const userResult = await this.getAssociatedData(user.id);
        if (userResult.isError()) return null;

        const data = userResult.unwrapData();
        this.isSignedIn = true;
        const completeUser = this.composeRecord(user, data);
        this.signedInUser = completeUser;
        return completeUser;
    }

    /**
     * Whether the currently logged in user is an admin.
     * @returns Null if no user is logged in
     */
    async isPrivileged(): Promise<boolean | null> {
        const user = await this.getUser();
        return user ? user.is_admin : null;
    }
}

export default new OAuth();