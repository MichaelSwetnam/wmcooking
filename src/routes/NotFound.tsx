import { useLocation } from "react-router-dom";
import ResponsiveLink from "../components/Utility/ResponsiveLink";

export default function NotFound() {
    const loc = useLocation();

    return <div className="flex-1 flex flex-col justify-center items-center space-y-4">
        <div className="flex flex-col justify-center items-center gap-3">
            <div className="bg-red-500 p-5 rounded-md shadow-lg text-white text-center">
                <h2 className="text-3xl font-bold">Sorry, this page doesn't exist.</h2>
                <span>{loc.pathname}</span>
            </div>
            <ResponsiveLink to="/" className="text-xl">Return to the home page</ResponsiveLink>
        </div>
    </div>
}