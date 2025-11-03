import { useParams } from "react-router-dom";
import ErrorComponent from "../components/ErrorCompnent";
import Cookies from "../assets/cookies.jpeg";
import EventBadge from "../components/EventBadge";

function Success() {
    const badges = ["October 28, 2025", "7-9 PM", "Hardy Hall", "W&M Students"];
    const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lacinia nisl rutrum augue varius, ac porta augue porta. Morbi venenatis pretium urna, ac pellentesque odio placerat at. Curabitur nisl nisi, ultricies in volutpat ut, porttitor eu est. Sed vitae commodo enim, at posuere felis. Sed sed turpis lectus. Vestibulum lacinia volutpat felis convallis iaculis. Fusce interdum, neque vitae euismod facilisis, velit erat molestie ex, sed imperdiet augue tellus sit amet arcu. Nullam felis mi, ultrices in cursus eu, faucibus et metus. In hac habitasse platea dictumst. ";

    return <div className="flex-1 flex flex-col justify-start items-center gap-2">
        <h2 className="font-bold text-3xl p-2 text-orange-700">This page is in construction</h2> 
        <p className="text-xl text-center md:text-left">
            It will look something like this:
        </p>

        <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-full">
            <div className={"flex flex-col items-center p-5 gap-1"} style={{
                backgroundImage: `url(${Cookies})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}>
                <div className="mb-60 p-2 rounded-xl bg-white shadow-sm">
                    <span className={"font-bold text-2xl"} style={{ color: "black" }}>Spooky Cookie Decoration</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    { badges.map(t => <EventBadge text={t} />) }
                </div>
            </div>
            <div className="p-6 text-gray-800 leading-relaxed text-sm md:text-base">
                {description}
            </div>
            { /* DO NOT USE THIS SHIT EVERYTHING IS BAD AND UGLY */}
            <div className="pl-6 text-gray-800 leading-relatex text-sm md:text-base">Probably some more information down here</div>
            <div className="pl-6 text-gray-800 leading-relatex text-sm md:text-base">Maybe a link to TribeLink</div>
            <div className="pl-6 text-gray-800 leading-relatex text-sm md:text-base">Maybe a link to the recipe</div>
            <div className="pl-6 pb-6 text-gray-800 leading-relatex text-sm md:text-base">¯\_(ツ)_/¯</div>
        </div>
    </div>;
}

export default function EventPage() {
    const { id } = useParams();
    if (!id) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router. Given: '${id}'`} />
    }
    
    const  parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router with type number. Given: '${id}' which is NaN.`} />
    }
    
    return <Success />
}