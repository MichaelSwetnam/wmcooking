import EventBadge from "./EventBadge";

interface Props {
    name: string,
    badges: string[],
    description: string,
    titleColor: string,
    backgroundImage: string
}
export default function EventCard({ name, badges, description, titleColor, backgroundImage }: Props) {
    return <div className="flex flex-col bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 max-w-4xl">
        <div className={"flex flex-col items-center p-5 gap-1"} style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
        }}>
            <span className={"font-bold text-2xl mb-60"} style={{ color: titleColor }}>{name}</span>
            <div className="flex flex-row gap-4">
                { badges.map(t => <EventBadge text={t} />) }
            </div>

        </div>
        <div className="p-6 text-gray-800 leading-relaxed">
            {description}
        </div>
    </div>
}