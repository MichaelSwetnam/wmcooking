import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Home() {
    const nav = useNavigate();

    return <div className="flex-1 flex flex-col justify-center items-center gap-3">
        <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">This page is not completed yet! Check back later.</h2>
        <div className="flex flex-col md:flex-row gap-1">
            <p className="text-gray-700">If you have any questions or concerns, please email us at </p>
            <a href="mailto:cooking@wm.edu" className="text-gray-700 underline hover:text-blue-600 transition duration-150">cooking@wm.edu</a>
        </div>
        
        <Button onClick={() => nav("/")}>Return to Main Page</Button>
    </div>
}