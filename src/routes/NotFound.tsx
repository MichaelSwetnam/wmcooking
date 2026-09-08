import ResponsiveLink from "../components/Utility/ResponsiveLink";

export default function NotFound() {
    return <div className="flex-1 flex flex-col justify-center items-center space-y-4">
        <div className="flex flex-col justify-center items-center gap-3">
            <h2 className="text-3xl font-bold bg-red-500 p-5 rounded-md shadow-lg text-white">Sorry, that page doesn't exist.</h2>
            <ResponsiveLink to="/" className="text-xl">Return to the home page</ResponsiveLink>
        </div>
    </div>
}