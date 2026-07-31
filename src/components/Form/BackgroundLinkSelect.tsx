import { useState } from "react";
import type { InputProp } from "./Inputs";
import ShortTextInput from "./Text/ShortTextInput";


export default function Component({ id, startValue, onChange }: InputProp<string>) {
    const [customUrl, setCustomUrl] = useState("");
    const [url, _setUrl] = useState(startValue);

    function setUrl(url: string) {
        _setUrl(url);
        onChange(id, url);
    }

    return <div className="p-2 bg-white shadow-sm rounded-sm gap-1">
        <div className="flex flex-col justify-center">
            <span className="text-center font-semibold">Current Image:</span>
            
            <img src={url} className="object-scale-down h-48" />
            <span className="text-gray-500 text-sm font-semibold text-center">{url}</span>
        </div>
        <div className="flex flex-col justify-center">
            <span className="text-center font-semibold">From URL:</span>
            <div className="flex flex-row p-1 gap-2 w-full">
                <ShortTextInput startValue={customUrl} onChange={(_, v) => setCustomUrl(v)} id="" />
                <button className="bg-green-500 p-1 shadow-sm rounded-md" onClick={e => {
                    setUrl(customUrl);
                    setCustomUrl("");
                    e.preventDefault();
                }}>Select</button>
            </div>
            <span className="text-gray text-sm font-normal text-center">⚠️: Only use permanent links here. Images are not saved to the database, when input using this method.</span>
        </div>
    </div>
}