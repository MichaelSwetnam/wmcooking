import logo from "../assets/cooking-logo.jpg";
import ResponsiveLink from "./ResponsiveLink";

interface SectionLinkProps {
     to: string, 
     children: React.ReactNode
};

function SectionLink({to, children}: SectionLinkProps) {
    return <ResponsiveLink to={to}> {children}</ResponsiveLink>
}

export default function Header() {
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
            <nav className="flex gap-6 text-blue-800 font-medium">
                <SectionLink to="/about">About</SectionLink>
                <SectionLink to="/events">Events</SectionLink>
                <SectionLink to="/recipes">Recipes</SectionLink>
                <SectionLink to="/health">Health & Safety</SectionLink>
           </nav>
        </div>
    </header>
  );
}
