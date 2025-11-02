import ResponsiveLink from "../components/ResponsiveLink";

export default function NotFound() {
    return <div className="flex-1 flex flex-col justify-center items-center space-y-4">
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold">Sorry, that page doesn't exist.</h2>
            <ResponsiveLink to="/">Return to the home page</ResponsiveLink>
        </div>
        <div className="flex flex-col justify-center items-center">
            <span>HTTP 404 - Not Found</span>
        </div>
    </div>
}