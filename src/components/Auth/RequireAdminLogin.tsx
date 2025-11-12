import type React from "react";
import RequireLogin from "./RequireLogin";
import { useEffect, useState } from "react";
import OAuth from "../../lib/OAuth";
import LoadingComponent from "../Utility/LoadingComponent";
import ErrorComponent from "../Event/ErrorComponent";

type ComponentState = "LOADING" | "IS_ADMIN" | "NOT_ADMIN";
export default function Component({ children }: {children: React.ReactNode }) {
    const [state, setState] = useState<ComponentState>("LOADING");

    useEffect(() => {
        OAuth.isPrivileged().then(isPrivileged => {
            if (isPrivileged === true)
                setState("IS_ADMIN");
            else
                setState("NOT_ADMIN");
        })
    }, []);

    switch (state) {
    case "LOADING":
        return <LoadingComponent />

    case "NOT_ADMIN":
        return <RequireLogin>
            <ErrorComponent message="You do not have permission to view this page." />
        </RequireLogin>

    case "IS_ADMIN":
        return <RequireLogin>
            {children}
        </RequireLogin>
    }
}