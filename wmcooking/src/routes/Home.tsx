import { InstagramEmbed } from "react-social-media-embed";
import ConstructionImg from "../assets/construction.avif";

export default function Home() {
    return <div className="flex-1 flex flex-col md:flex-row justify-center">
        <div className="flex-2 flex flex-col items-center">
            <h2 className="pt-5 text-2xl font-bold">Welcome to the Cooking Club!</h2>
            <p>Pardon our dust, this website is still in construction.</p>
            <img src={ConstructionImg}></img>
        </div>
        <div className="flex-1 flex flex-col justify-center p-3">
            <span className="font-semibold text-xl">Check out our instagram for updates and news.</span>
            <InstagramEmbed url="https://www.instagram.com/wmclubcooking/"/>
        </div>
    </div>
}