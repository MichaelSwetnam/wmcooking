export default function DisabledTextInput({ value }: { value: string }) {
    return <input disabled className="bg-gray-300 p-1 shadow-sm rounded-md text-center" type="text" value={value} />
}