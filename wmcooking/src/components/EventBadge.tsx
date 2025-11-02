interface Props {
    text: string
}
export default function EventBadge({ text }: Props) {
    return <div className="bg-white p-2 rounded-xl shadow-sm hover:shadow-md transition duration-300">
        <span className="font-semibold">{text}</span>
    </div>
}