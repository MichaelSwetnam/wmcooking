import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import { Supabase } from "./Supabase";
import type { DatabaseReturn } from "./Database";

export interface UserRecord {
    id: string;
    email: string;
    is_admin: boolean;
    picture: string;
}

export interface OAuthReturn<T> {
    data: T | null,
    error: AuthError | PostgrestError | null,
    cached?: true
}

class OAuth {
    private signedInUser: UserRecord | null = null; 
    private isSignedIn: boolean | null = null;

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
        if (userResult.data && !userResult.error) {
            const picture = user.user_metadata?.picture;
            if (!picture)
                throw new Error("User did not have a picture / ie did not go through google as a provider.");

            this.isSignedIn = true;
            const completeUser: UserRecord = {
                id: user.id,
                email: user.email!,
                is_admin: userResult.data.is_admin,
                picture
            };

            this.signedInUser = completeUser;
            return completeUser;
        }

        return null;
    }

    async getAssociatedData(id: string): Promise<DatabaseReturn<UserRecord>> {
        const { data, error } = await Supabase
            .from("Profiles")
            .select("*")
            .eq('id', id)
            .single();

        return { data, error };
    }

    async isPrivileged(): Promise<boolean | null> {
        const user = await this.getUser();
        return user ? user.is_admin : null;
    }
}

export default new OAuth();