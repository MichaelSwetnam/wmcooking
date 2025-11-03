import ResponsiveLink from "../components/ResponsiveLink";

export default function Home() {
    return <div className="flex-1 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold">This page is not completed. There is nothing here yet.</h2>
        <ResponsiveLink to="/">Go back to the main page</ResponsiveLink>
    </div>
}