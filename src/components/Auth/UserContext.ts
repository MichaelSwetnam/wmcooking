import { createContext } from "react";
import type { Profile } from "../../lib/Profile";

export const UserContext = createContext<{
    user: Profile | null,
    setUser: React.Dispatch<React.SetStateAction<Profile | null>>,
    loaded: boolean
}>({ user: null, setUser: () => null, loaded: false });
