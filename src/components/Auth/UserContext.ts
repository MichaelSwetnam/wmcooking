import { createContext } from "react";
import type { UserProfile } from "../../lib/OAuth";

export const UserContext = createContext<{
    user: UserProfile | null,
    setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
}>({ user: null, setUser: () => null});
