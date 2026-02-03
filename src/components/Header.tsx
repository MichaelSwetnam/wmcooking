import { useEffect, useState, useRef, useContext } from "react";
import logo from "../assets/cooking-logo.png";
import ResponsiveLink from "./Utility/ResponsiveLink";
import OAuth, { UserProfile } from "../lib/OAuth";
import SignInButton from "./Auth/SignInButton";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Auth/UserContext";
import RequireAdminLogin from "./Auth/RequireAdminLogin";
import Database from "../lib/Database/Database";
import DBError from "../lib/Database/DBError";
import ErrorComponent from "./Event/ErrorComponent";


// Dropdown component inside the same file
interface UserDropdownProps {
    user: UserProfile;
    onLogout?: () => void;
}

function UserDropdown({ user, onLogout }: UserDropdownProps) {
    const nav = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); 

    const priveleged = user.isPrivileged();

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
                    <span>{ user.getName() }</span>
                    <span className="transform rotate-3">{ priveleged ? "✅" : ""}</span>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                    { priveleged &&
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

function AddEvent() {
    const nav = useNavigate();
    const { user } = useContext(UserContext);
    const [error, setError] = useState<DBError | null>(null);
    const [clicked, setClicked] = useState(false);

    if (error) {
        return <ErrorComponent message="Failed to add new event." technical={error.message} />
    }

    async function _addEvent() {
        // Only allow this function to run once - it should redirect if successful.
        if (clicked) return;
        setClicked(true);
        
        // Force user to be logged in
        if (!user) throw new Error("A logged out user cannot add a new event.");
        if (!user.isPrivileged()) throw new Error("A non-admin user cannot add a new event");

        // Create new event
        const event = await Database.events.newEvent();
        if (event.isError()) {
            setError(event.unwrapError());
            return;
        }

        // Redirect to event edit page.
        const eData = event.unwrapData();
        nav(`/events/${eData.id}/edit`);
        return;
    }

    return <RequireAdminLogin>
        <button 
            className="cursor-pointer flex items-center justify-center bg-blue-100 text-blue-900 font-medium px-3 py-1 rounded-full hover:shadow-md transition-shadow"
            onClick={_addEvent}
        >
            Add Event
        </button>
    </RequireAdminLogin>;
}

export default function Header() {
    const { user, setUser } = useContext(UserContext);
    const [ loadedRecord, setLoadedRecord ] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!user) {
            setLoadedRecord(null);
            return;
        }

        setLoadedRecord(user);
    }, [user])

    return (
        <header className="bg-linear-to-r from-blue-300 to-blue-200 py-3 shadow-md w-full">
            <div className="flex flex-col md:flex-row items-center justify-between px-6">
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
                        <ResponsiveLink to="/events">Events</ResponsiveLink>
                    </nav> 
                    <nav>
                        <ResponsiveLink to="/health">Health & Safety</ResponsiveLink>
                    </nav>
                    { user?.isPrivileged() && <AddEvent /> }
                    {
                        loadedRecord !== null
                        ? <UserDropdown user={loadedRecord} onLogout={() => setUser(null)} />
                        : <SignInButton />
                    }
                </div>
            </div>
        </header>
    );
}
