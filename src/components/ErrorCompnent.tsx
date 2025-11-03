import { useState } from "react"

interface Props {
    message: string,
    technical?: string
}

export default function Error({ message, technical }: Props) {
    const [ clicked, setClicked ] = useState(false);

    return <div className="flex-1 flex flex-col justify-center items-center bg-red-500 rounded-xl shadow-md p-3">
        <h2 className="font-bold text-2lx text-white">Something went wrong.</h2>
        <span className="text-white">{message}</span>
        
        { technical 
        ? (clicked
            ? <span className="text-gray-200 text-sm">{technical}</span>
            : <a className="text-gray-200 text-sm underline" onClick={() => setClicked(true)}>Click here for technical reason</a>
        )
        : <></> 
        }
    </div>
}