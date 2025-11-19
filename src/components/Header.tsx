import { useEffect, useState, useRef, useContext } from "react";
import logo from "../assets/cooking-logo.png";
import ResponsiveLink from "./Utility/ResponsiveLink";
import LoadingComponent from "./Utility/LoadingComponent";
import OAuth from "../lib/OAuth";
import SignInButton from "./Auth/SignInButton";
import type ProfileRecord from "../lib/Database/Records/ProfileRecord";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Auth/UserContext";

interface SectionLinkProps {
    to: string;
    children: React.ReactNode;
}

function SectionLink({ to, children }: SectionLinkProps) {
    return <ResponsiveLink to={to}>{children}</ResponsiveLink>;
}

// Dropdown component inside the same file
interface UserDropdownProps {
    user: ProfileRecord;
    onLogout?: () => void;
}

function UserDropdown({ user, onLogout }: UserDropdownProps) {
    const nav = useNavigate();
    const [open, setOpen] = useState(false);
    const [priveleged, setPriveleged] = useState<null | boolean>(null);
    const dropdownRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        OAuth.isPrivileged().then((result) => {
            if (result.isError()) {
                setPriveleged(null);
            }

            setPriveleged(result.unwrapData());
        });
    }, [user.id]);

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
        OAuth.logOut();
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
                    <span>{user.name}</span>
                    <span className="transform rotate-3">{ priveleged ? "✅" : ""}</span>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                    { user.is_admin &&
                        <button
                        onClick={() => nav("/profile")}
                        className="block w-full text-left px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md transition"
                    >
                        Update Profile
                    </button>
                    }
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
    const { user, setUser } = useContext(UserContext);

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
                    {
                        !user && <LoadingComponent />
                    }
                    {
                        user
                        ? <UserDropdown user={user} onLogout={() => setUser(null)} />
                        : <SignInButton />
                    }
                </div>
            </div>
        </header>
    );
}
