import type React from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import ErrorComponent from "../Utility/ErrorComponent";

export default function Component({ children }: {children: React.ReactNode }) {
    const { user } = useContext(UserContext);

    if (user === null) {
        return <ErrorComponent message="You need to be logged in to view this page." />
    }

    if (!user.isAdmin) {
        <ErrorComponent message="You do not have permission to view this page." />
    }

    return <>{children}</>;
}
