import OAuth from "../../lib/OAuth";

export default function Component() {
    const signIn = () => {
        OAuth.logIn(window.location.href);
    };

    return <button
        onClick={signIn}
        className="cursor-pointer flex gap-2 items-center justify-center bg-blue-100 text-blue-900 font-medium px-3 py-1 rounded-full hover:shadow-md transition-shadow"
    >
        <span>Sign in</span>
    </button>
}