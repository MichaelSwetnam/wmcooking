import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import OAuth from "../../lib/OAuth";
import type { Profile } from "../../lib/Profile";

export function UserProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<Profile | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    // Initial profile load - child components should avoid calling OAuth.getUser()
    useEffect(() => {
        OAuth.getUser().then(user => {
	     setUser(user);
	     setLoaded(true);
	});
    }, []);

    return <UserContext.Provider value={{ user, setUser, loaded }}>
        { children }
    </UserContext.Provider>
}
