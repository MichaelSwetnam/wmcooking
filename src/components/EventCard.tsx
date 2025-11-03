import EventBadge from "./EventBadge";

interface Props {
    name: string,
    badges: string[],
    description: string,
    titleColor: string,
    backgroundImage: string
}
export default function EventCard({ name, badges, description, titleColor, backgroundImage }: Props) {
    return <div className="flex flex-col bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 min-w-3xl max-w-3xl">
        <div className={"flex flex-col items-center p-5 gap-1"} style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
        }}>
            <div className="mb-60 p-2 rounded-xl bg-white shadow-sm">
                <span className={"font-bold text-2xl"} style={{ color: titleColor }}>{name}</span>
            </div>
            <div className="flex flex-row gap-4">
                { badges.map(t => <EventBadge text={t} />) }
            </div>
        </div>
        <div className="p-6 text-gray-800 leading-relaxed">
            {description}
        </div>
    </div>
}