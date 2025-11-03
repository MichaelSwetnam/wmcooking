import Christmas from "../assets/christmas.jpg";
import Halloween from "../assets/halloween.jpeg";

import { InstagramEmbed } from "react-social-media-embed";
import EventCard from "../components/EventCard";

export default function Home() {
    const description = `Come on down to yee old Hardy Hall for Spooky Halloween Night. We will be serving spooky Halloween foods that will knock your pants off. AHHHHHHH. Lorem Ipsum dolor sit amet consectetur adipiscing lit. Quisque faucibus ex sapien vitae pellentesque sem placerat.  id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`;

    return <div className="flex-1 flex flex-col md:flex-row justify-center items-center md:items-start bg-linear-to-b from-orange-50 via-white to-orange-100 p-5 gap-8 rounded-3xl">
        { /* Main Content */ }
        <div className="flex-2 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
                <h2 className="pt-5 text-3xl md:text-4xl font-extrabold text-orange-700 text-center">Welcome to Club Cooking!</h2>
                <p className="text-xl text-center md:text-left">
                    Here's our next few events:
                </p>
            </div>
            <EventCard 
                name="Halloween Night" 
                badges={["October 30, 2025", "8:00PM", "Hardy Hall", "All W&M Students"]} 
                description={description}
                titleColor="orange"
                backgroundImage={Halloween}

            />
            <EventCard 
                name="Christmas Night" 
                badges={["December 10, 2025", "9:00PM", "Hardy Hall", "All W&M Students"]} 
                description={description}
                titleColor="white"
                backgroundImage={Christmas}
            />
        </div>

        { /* Social Media Sidebar */}
        <div className="flex-1 flex flex-col justify-start p-5 space-y-4 h-full gap-4">
            <div className="flex-1">
                <span className="font-semibold text-xl text-orange-700">Check out our instagram for updates and news.</span>
                <InstagramEmbed url="https://www.instagram.com/wmclubcooking/"/>
            </div>
            <div className="flex-1 h-full">
                <a href="https://flathatnews.com/2025/09/09/serving-up-community-club-cooking-aims-to-create-inclusive-space-for-sharing-food/" target="_blank" className="font-semibold text-xl text-blue-600 hover:text-blue-800 transition underline">or check out on this article on us by the Flat Hat.</a>
                <iframe className="w-full h-full"
                    src="https://flathatnews.com/2025/09/09/serving-up-community-club-cooking-aims-to-create-inclusive-space-for-sharing-food/" 
                    title="Flat Hat Article - Serving up community: Club Cooking aims to create inclusive space for sharing food"
                    loading="lazy"
                />
            </div>
        </div>
    </div>
}