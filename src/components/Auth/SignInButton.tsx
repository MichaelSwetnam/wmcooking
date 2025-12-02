import { useContext } from "react";
import OAuth from "../../lib/OAuth";
import { UserContext } from "./UserContext";

export default function Component() {
    const { setUser } = useContext(UserContext);

    const signIn = async () => {
        OAuth.logIn(window.location.href);
        setUser(await OAuth.getUser());
    };

    return <button
        onClick={signIn}
        className="cursor-pointer flex gap-2 items-center justify-center bg-blue-100 text-blue-900 font-medium px-3 py-1 rounded-full hover:shadow-md transition-shadow"
    >
        <span>Sign in</span>
    </button>
}