import { createContext } from "react";
import type ProfileRecord from "../../lib/Database/Records/ProfileRecord";

export const UserContext = createContext<{
    user: ProfileRecord | null,
    setUser: React.Dispatch<React.SetStateAction<ProfileRecord | null>>
}>({ user: null, setUser: () => null});
