import ResponsiveLink from "./ResponsiveLink";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <header className="bg-blue-200 py-3 shadow-md">
            <div className="flex justify-between mx-auto px-6">
                <div className="flex-1 flex flex-col items-center">
                    <span className="font-semibold">Contact Us!</span>
                    <span>
                        Send us an email at <a href="mailto:cooking@wm.edu" className="underline hover:text-blue-600 transition">cooking@wm.edu</a>
                    </span>
                    <span>
                        or message <a href="https://www.instagram.com/wmclubcooking" className="underline hover:text-blue-600 transition">@wmclubcooking</a> on Instagram!
                    </span>
                </div>

                { /* Could be filled with other information in these two columns */ }
                <div className="flex-1 flex flex-col items-center">
                     <span className="font-semibold">Admin Login:</span>
                    <ResponsiveLink className="underline" to="/admin">Click here</ResponsiveLink>
                </div>
                <div className="flex-1 flex flex-col items-center">
                    Copyright © {currentYear} Club Cooking
                </div>
            </div>
        </header>
    );
}
