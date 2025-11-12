import OAuth from "../../lib/OAuth";

export default function Component() {
    const signIn = () => {
        OAuth.logIn(window.location.href);
    };

    return <button
        onClick={signIn}
        className="cursor-pointer flex gap-2 items-center justify-center bg-blue-100 text-blue-900 font-medium px-3 py-1 rounded-full hover:shadow-md transition-shadow"
    >
        <img
            className="w-8 h-8 rounded-full object-cover"
            src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
        ></img>
        <span>Sign in</span>
    </button>
}