import { useEffect, useState } from "react";
import type { InputProp } from "./Inputs";
import ShortTextInput from "./Text/ShortTextInput";
import Database from "../../lib/Database/Database";

function ImageComp({ url, onClick }: { url: string, onClick: (url: string) => void  }) {
    return <img 
        src={url} 
        className="object-scale-down h-30 rounded-sm shadow-md transition-all duration-100 border-blue-600 border-0 hover:border-4" 
        onClick={() => onClick(url)}
    />
}

export default function Component({ id, startValue, onChange }: InputProp<string>) {
    const [customUrl, setCustomUrl] = useState("");
    const [url, _setUrl] = useState(startValue);
    const [loadedUrls, setLoadedUrls] = useState<string[] | null>(null);

    useEffect(() => {
        Database.images.get().then(d => {
            setLoadedUrls(d.unwrapData());
        });
    }, []); 

    function setUrl(url: string) {
        _setUrl(url);
        onChange(id, url);
    }

    return <div className="p-2 bg-white shadow-sm rounded-sm flex flex-col gap-4">
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
        <div className="flex flex-col justify-center">
            <span className="text-center font-semibold">Stored Images:</span>
            <div className="flex flex-wrap p-1 gap-2 w-full">
                {
                    loadedUrls && loadedUrls.map(url => <ImageComp onClick={setUrl} url={url} />)
                }
            </div>
            <span className="text-gray text-sm font-normal text-center">✅: These links are permanent and will never be invalid.</span>
            <span className="text-gray text-sm font-normal text-center">ℹ️: There's not currently a way to add new stored images, other than manually through the database.</span>
        </div>
    </div>
}