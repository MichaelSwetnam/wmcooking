import { useEffect, useState } from "react";
import type ProfileRecord from "../../lib/Database/Records/ProfileRecord";
import { UserContext } from "./UserContext";
import OAuth from "../../lib/OAuth";

export function UserProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<ProfileRecord | null>(null);

    // Initial profile load - child components should avoid calling OAuth.getUser()
    useEffect(() => {
        OAuth.getUser().then(user => user.ifData(d => setUser(d)))
    }, []);

    return <UserContext.Provider value={{ user, setUser }}>
        { children }
    </UserContext.Provider>
}