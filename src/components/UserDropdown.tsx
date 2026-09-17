import { useNavigate } from "react-router-dom";
import OAuth from "../lib/OAuth.ts";
import { useEffect, useRef, useState } from "react";
import type { Profile } from "../lib/Profile.ts";

// Dropdown component inside the same file
interface UserDropdownProps {
    user: Profile,
    onLogout?: () => void;
}

export default function UserDropdown({ user, onLogout }: UserDropdownProps) {
    const nav = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); 

    const priveleged = user.isAdmin;

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
                    <span>{ user.name }</span>
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
