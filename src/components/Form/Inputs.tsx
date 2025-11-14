export function InputLabel({ name }: { name: string }) {
    return <p className="w-full font-semibold text-gray-600">{name}</p>
}

export type InputProp<T> = { id: string, startValue: T, onChange: (id: string, value: T) => void };
