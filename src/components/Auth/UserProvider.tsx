import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import OAuth, { UserProfile } from "../../lib/OAuth";

export function UserProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<UserProfile | null>(null);

    // Initial profile load - child components should avoid calling OAuth.getUser()
    useEffect(() => {
        OAuth.getUser().then(user => setUser(user));
    }, []);

    return <UserContext.Provider value={{ user, setUser }}>
        { children }
    </UserContext.Provider>
}