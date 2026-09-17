import logo from "../assets/cooking-logo.png";
import ResponsiveLink from "./Utility/ResponsiveLink";
import SignInButton from "./Auth/SignInButton.tsx";
import { useContext } from "react";
import { UserContext } from "./Auth/UserContext";
import LoadingComponent from "./Utility/LoadingComponent.tsx";
import UserDropdown from "./UserDropdown.tsx";

export default function Header() {
     const { user, setUser, loaded } = useContext(UserContext);

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
		    { !loaded && <LoadingComponent /> }
		    { loaded && (user 
			 ? <UserDropdown user={user} onLogout={() => setUser(null)} />
			 : <SignInButton />
			 )
		    }
                    {/* { user?.isPrivileged() && <AddEvent /> }
                    } */}
                </div>
            </div>
        </header>
    );
}
