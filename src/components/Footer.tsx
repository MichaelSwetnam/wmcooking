export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-blue-200 py-3 shadow-md w-full">
            <div className="flex flex-col md:flex-row justify-between mx-auto px-6 text-center">
                <div className="flex-1 flex flex-col items-center mb-4 md:mb-0">
                    <span className="font-semibold">Contact Us!</span>
                    <span>
                        Send us an email at <a href="mailto:cooking@wm.edu" className="underline hover:text-blue-600 transition">cooking@wm.edu</a>
                    </span>
                    <span>
                        or message <a href="https://www.instagram.com/wmclubcooking" className="underline hover:text-blue-600 transition">@wmclubcooking</a> on Instagram!
                    </span>
                </div>

                { /* Could be filled with other information in these two columns */ }
                <div className="flex-1 flex flex-col items-center mb-4 md:mb-0">
                    {/* <ResponsiveLink className="underline" to="/admin">Admin Login</ResponsiveLink> */}
                </div>
                <div className="flex-1 flex flex-col items-center">
                    Copyright © {currentYear} Club Cooking
                </div>
            </div>
        </footer>
    );
}
