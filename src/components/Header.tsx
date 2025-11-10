import { useEffect, useState } from "react";
import logo from "../assets/cooking-logo.png";
import ResponsiveLink from "./ResponsiveLink";
import { Supabase } from "../lib/Supabase";
import type { UserResponse } from "@supabase/supabase-js";
import LoadingComponent from "./LoadingComponent";

interface SectionLinkProps {
     to: string, 
     children: React.ReactNode
};

function SectionLink({to, children}: SectionLinkProps) {
    return <ResponsiveLink to={to}> {children}</ResponsiveLink>
}

export default function Header() {
    const [user, setUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        Supabase.auth.getUser().then(u => {
            setUser(u);
        });
    });

    let profileComponent;
    if (user === null) {
        profileComponent = <LoadingComponent />;
    } else {
        profileComponent = "Loaded.";
    }

    return (
        <header className="bg-blue-200 py-3 shadow-md w-full">
            <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Club Cooking Logo"
                        className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                    />
                    <ResponsiveLink to="/">
                    <span className="text-xl font-semibold text-blue-900"> Club Cooking W&M </span>
                    </ResponsiveLink>
                </div>

                {/* Navigation (you can change these later) */}
                <div className="flex flex-row gap-6 text-blue-800 font-medium">
                    <nav className="">
                        <SectionLink to="/events">Events</SectionLink>
                    </nav>
                    { profileComponent }
                </div>
                
            </div>
        </header>
  );
}
