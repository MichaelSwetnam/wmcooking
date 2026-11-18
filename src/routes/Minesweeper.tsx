import { useState } from "react";
import LoadingComponent from "../components/Utility/LoadingComponent";

function Cell({ i, neighborBombs }: {i: number, neighborBombs: number, onReveal: (x: number, y: number) => void}) {
     /*
     const x = i % 12;
     const y = Math.floor(i / 12);

     should call onReveal(x, y) when revealed.
     */

     const [ flagged, setFlagged ] = useState(false);

     return <button 
	  className="border hover:bg-white"
	  onClick={() => { 
	       setFlagged(!flagged); 
	  }}
     >
     {(flagged ? '🚩' : neighborBombs)}
     </button>
}

export function Minesweeper() { 
     const cells = new Array(12 * 12).fill(0);
    
     if (cells.length <= 0)
	 return <LoadingComponent />

    function onReveal(x: number, y: number) {
	  console.log(x, y);
    }

     return <div className="bg-blue-400 rounded-md p-5 aspect-square h-dvh flex flex-col w-full items-center">
	  <div className="w-full flex flex-row justify-center">
	       <h2 className="text-xl">Minesweeper</h2>
	  </div>
	  <div className="aspect-square h-full grid grid-cols-12 grid-rows-12 gap-1">
	       { cells.map((_, i) => <Cell neighborBombs={0} i={i} key={i} onReveal={onReveal} />) }
	  </div>
     </div>
}
