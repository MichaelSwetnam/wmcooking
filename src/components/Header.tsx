import { useEffect, useState, useRef } from "react";
import logo from "../assets/cooking-logo.png";
import ResponsiveLink from "./ResponsiveLink";
import { Supabase } from "../lib/Supabase";
import { AuthError, type User } from "@supabase/supabase-js";
import LoadingComponent from "./LoadingComponent";
import OAuth from "../lib/OAuth";

interface SectionLinkProps {
    to: string;
    children: React.ReactNode;
}

function SectionLink({ to, children }: SectionLinkProps) {
    return <ResponsiveLink to={to}>{children}</ResponsiveLink>;
}

// Dropdown component inside the same file
interface UserDropdownProps {
    user: User;
    onLogout?: () => void;
}

function UserDropdown({ user, onLogout }: UserDropdownProps) {
    const [open, setOpen] = useState(false);
    const [priveleged, setPriveleged] = useState<null | boolean>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        OAuth.isPrivileged(user.id).then(({data, error}) => {
            if (error) {
                setPriveleged(false);
                return;
            }

            setPriveleged(data);
        });
    }, [user.id])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await Supabase.auth.signOut();
        setOpen(false);
        if (onLogout) onLogout();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="bg-blue-100 text-blue-900 font-medium px-3 py-1 rounded-full hover:shadow-md transition-shadow"
            >
                <div className="flex gap-2 items-center justify-center">
                    {user.user_metadata?.picture ? (
                        <img
                            src={user.user_metadata!.picture}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <span className="w-6 h-6 bg-blue-300 text-white rounded-full flex items-center justify-center text-xs">
                            {user.email?.[0].toUpperCase()}
                        </span>
                    )}
                    <span>{user.email}</span>
                    <span className="transform rotate-3">{ priveleged ? "✅" : ""}</span>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<AuthError | null>(null);

    useEffect(() => {
        Supabase.auth.getUser().then(({ data, error }) => {
            setUser(data.user);
            setError(error);
        });
    }, []);

    let profileComponent = <LoadingComponent />;
    if (user) {
        profileComponent = <UserDropdown user={user} onLogout={() => setUser(null)} />;
    }
    if (error || !user) {
        const signIn = () => {
            Supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href }});
        };

        profileComponent = (
            <button
                onClick={signIn}
                className="cursor-pointer flex gap-2 items-center justify-center bg-blue-100 text-blue-900 font-medium px-3 py-1 rounded-full hover:shadow-md transition-shadow"
            >
                <img
                    className="w-8 h-8 rounded-full object-cover"
                    src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
                ></img>
                <span>Sign in</span>
            </button>
        );
    }

    return (
        <header className="bg-linear-to-r from-blue-300 to-blue-200 py-3 shadow-md w-full">
            <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Club Cooking Logo"
                        className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                    />
                    <ResponsiveLink to="/">
                        <span className="text-xl font-semibold text-blue-900 hover:text-blue-700 transition">
                            Club Cooking W&M
                        </span>
                    </ResponsiveLink>
                </div>

                <div className="flex flex-row gap-6 text-blue-800 font-medium items-center">
                    <nav>
                        <SectionLink to="/events">Events</SectionLink>
                    </nav>
                    {profileComponent}
                </div>
            </div>
        </header>
    );
}
