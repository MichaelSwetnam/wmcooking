import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import { Supabase } from "./Supabase";
import type { DatabaseReturn } from "./Database";

interface UserRecord {
    id: string;
    email: string;
    is_admin: boolean;
}

export interface OAuthReturn<T> {
    data: T | null,
    error: AuthError | PostgrestError | null,
    cached?: true
}

class OAuth {
    private signedInUser: UserRecord | null

    constructor() {
        this.signedInUser = null;
    }

    async getUser(): Promise<OAuthReturn<UserRecord>> {
        if (this.signedInUser) {
            return {
                data: this.signedInUser,
                error: null,
                cached: true
            };
        }

        const result = await Supabase.auth.getUser();
        const { data, error } = result as unknown as { data: { id: string, email: string }, error: AuthError };
        if (result.error)
            return { error, data: null, cached: undefined };

        const userResult = await this.getAssociatedData(data.id);
        if (result.data && !userResult.error) {
            console.log(result.data);
            throw new Error("RAAAH");
            // this.signedInUser = result.data;
            // return { 
            //     error: null,
            //     data: {
            //         email: data.email
            //     },
            //     cached: undefined 
            // }
        }

        return { error: userResult.error, data: null, cached: undefined };;
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
        return user.data?.is_admin || null;
    }
}

export default new OAuth();