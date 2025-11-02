import ConstructionImg from "../assets/christmas.jpg";
import EventBadge from "./EventBadge";

interface Props {
    name: string,
    badges: string[],
    description: string,
    titleColor: string,
    gradientFrom: string,
    gradientVia: string,
    gradientTo: string,
}
export default function EventCard({ name, badges, description, titleColor, gradientFrom, gradientTo, gradientVia }: Props) {
    const gradientStyle: React.CSSProperties = {
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientVia}, ${gradientTo})`
    };
        
    return <div className="flex flex-col bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 max-w-4xl">
        <div className={"flex flex-col items-center p-5 gap-1 bg-linear-to-r"} style={gradientStyle}>
            <span className={"font-bold text-2xl"} style={{ color: titleColor }}>{name}</span>
            <div className="flex flex-row gap-4">
                { badges.map(t => <EventBadge text={t} />) }
            </div>
            <img
                className="mt-4 rounded-xl max-h-60 object-cover shadow-inner"
                src={ConstructionImg}
                alt="Event"
            />
        </div>
        <div className="p-6 text-gray-800 leading-relaxed">
            {description}
        </div>
    </div>
}