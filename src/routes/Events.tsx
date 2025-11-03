import { useState } from "react";
import EventCard from "../components/EventCard";
import Cookies from "../assets/cookies.jpeg"

export default function Events() {
    const [searchInput, setSearchInput] = useState('');

    return <div className="flex-1 flex flex-col justify-start items-center gap-2">
        <h2 className="font-bold text-3xl p-2 text-orange-700">This page is in construction</h2> 
        <p className="text-xl text-center md:text-left">
            It will look something like this:
        </p>

        <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="text-2xl bg-white p-2 mt-2 rounded-md text-black shadow-md hover:shadow-lg transition-shadow w-2/3 text-center"
        />
        <div>
            <EventCard
                name="Spooky Cookie Decoration"
                badges={["October 28, 2025", "7-9 PM", "Hardy Hall", "W&M Students"]}
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lacinia nisl rutrum augue varius, ac porta augue porta. Morbi venenatis pretium urna, ac pellentesque odio placerat at. Curabitur nisl nisi, ultricies in volutpat ut, porttitor eu est. Sed vitae commodo enim, at posuere felis. Sed sed turpis lectus. Vestibulum lacinia volutpat felis convallis iaculis. Fusce interdum, neque vitae euismod facilisis, velit erat molestie ex, sed imperdiet augue tellus sit amet arcu. Nullam felis mi, ultrices in cursus eu, faucibus et metus. In hac habitasse platea dictumst. "
                titleColor="black"
                backgroundImage={Cookies}
            />
        </div>
    </div>;
}