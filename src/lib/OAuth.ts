import { Supabase } from "./database/Supabase";
import { getProfile, Profile } from "./Profile";
import { AuthSessionMissingError } from "@supabase/supabase-js";

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
        const error = await Supabase.auth.signOut();
        this.signedInUser = null;
        
        return (error !== null);
    }

    /**
     * Get the id of the signed in user
     * @returns String id of signed in user
     */
    private async getId(): Promise<string> {
        if (this.signedInUser !== null) {
	     return this.signedInUser;
        }

        const { data, error } = await Supabase.auth.getUser();
	if (error) throw error;
	if (data.user === null) throw new Error("userData.user is undefined!");

	this.signedInUser = data.user!.id;
	return this.signedInUser;
    }

    hasUser(): boolean {
	 return this.signedInUser ? true : false;
    }

    /**
     * Get the profile for the signed in user
     */
    async getUser(): Promise<Profile | null> {
	 let id: string;
	 try {
	      // AuthSessionMissingError thrown if no logged in user
	      id = await this.getId();
	 } catch (error) {
	      if (!(error instanceof AuthSessionMissingError))
		   throw error;

	      return null;
	 }

	const userProfile = await getProfile(id);
        return new Profile(userProfile);
    }

    async isPrivileged(): Promise<boolean> {
        const user = await this.getUser();
        if (!user) 
            return false;
        else 
            return user.isAdmin;
    }
}

export default new OAuth();
