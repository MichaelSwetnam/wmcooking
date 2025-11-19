import { useContext, useState } from "react";
import ErrorComponent from "../Event/ErrorComponent";
import LoadingComponent from "../Utility/LoadingComponent";
import { UserContext } from "./UserContext";

type ComponentState = "LOADING" | "LOGGED_OUT" | "LOGGED_IN";
export default function Component({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<ComponentState>("LOADING");
    const { user } = useContext(UserContext);

    if (user === null)
        setState("LOGGED_OUT");
    else
        setState("LOGGED_IN")

    switch (state) {
    case "LOADING":
        return <LoadingComponent />;

    case "LOGGED_OUT":
        return <ErrorComponent message="You need to be logged in to access this content." />;

    case "LOGGED_IN":
        return <>{children}</>;
    }
}