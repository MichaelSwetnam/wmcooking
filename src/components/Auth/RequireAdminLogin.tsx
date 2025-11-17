import type React from "react";
import RequireLogin from "./RequireLogin";
import { useEffect, useState } from "react";
import OAuth from "../../lib/OAuth";
import LoadingComponent from "../Utility/LoadingComponent";
import ErrorComponent from "../Event/ErrorComponent";

type ComponentState = "LOADING" | "IS_ADMIN" | "NOT_ADMIN" | "ERROR";
export default function Component({ children }: {children: React.ReactNode }) {
    const [state, setState] = useState<ComponentState>("LOADING");

    useEffect(() => {
        OAuth.isPrivileged().then(r => {
            if (r.isError()) {
                setState("ERROR")
                return;
            }

            const isPrivileged = r.unwrapData();
            if (isPrivileged === true)
                setState("IS_ADMIN");
            else
                setState("NOT_ADMIN");
        })
    }, []);

    switch (state) {
    case "LOADING":
        return <LoadingComponent />

    case "ERROR":
        return <ErrorComponent message="Could not determine whether you have privilege." />

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