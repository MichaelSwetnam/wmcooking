import type React from "react";
import { useContext } from "react";
import ErrorComponent from "../Event/ErrorComponent";
import { UserContext } from "./UserContext";

export default function Component({ children }: {children: React.ReactNode }) {
    const { user } = useContext(UserContext);

    if (user === null) {
        return <ErrorComponent message="You need to be logged in to view this page." />
    }

    if (!user.isPrivileged()) {
        <ErrorComponent message="You do not have permission to view this page." />
    }

    return <>{children}</>;
}