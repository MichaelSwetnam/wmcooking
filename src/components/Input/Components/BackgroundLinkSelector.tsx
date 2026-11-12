import type { AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";
import { InputWrapper } from "../InputWrapper";
import { useDatabaseImages } from "../../../lib/DatabaseImages";
import LoadingComponent from "../../Utility/LoadingComponent";
import ErrorComponent from "../../Utility/ErrorComponent";

function ImageComp({ url, onClick }: { url: string, onClick: (url: string) => void  }) {
    return <img 
        src={url} 
        className="object-scale-down h-30 rounded-sm shadow-md transition-all duration-100 border-blue-600 border-0 hover:border-4" 
        onClick={() => onClick(url)}
    />
}

export function BackgroundLinkSelector({ field }: { field: AnyFieldApi }) {
     const url = field.state.value;
     const [ customUrl, setCustomUrl ] = useState("");
     const { data: loadedUrls, isLoading, error } = useDatabaseImages();
     if (isLoading) return <LoadingComponent />
     if (error) return <ErrorComponent message="Could not load database images" technical={error.message} />

     function setUrl(url: string) {
	  field.handleChange(url);
     }
     
     return <InputWrapper field={field}>
	  <div className="p-2 bg-white shadow-sm rounded-sm flex flex-col gap-4">
	     <div className="flex flex-col justify-center">
		 <span className="text-center font-semibold">Current Image:</span>
		 
		 <img src={url} className="object-scale-down h-48" />
	     </div>
	     <div className="flex flex-col justify-center">
		 <span className="text-center font-semibold">From URL:</span>
		 <div className="flex flex-row p-1 gap-2 w-full">
		    <input
			 type="text"
			 className="bg-white p-1 rounded-sm shadow-sm w-full text-center"
			 value={customUrl}
			 onChange={(e) => { setCustomUrl(e.target.value) }}
		    />
		     <button className="bg-green-500 p-1 shadow-sm rounded-md" onClick={e => {
			 setUrl(customUrl);
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
     </InputWrapper>
}
