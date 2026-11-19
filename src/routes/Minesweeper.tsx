import { useEffect, useState } from "react";
import LoadingComponent from "../components/Utility/LoadingComponent";

function getColor(n: number): string {
     switch (n) {
	  case 1:
	       return "text-blue-600"
	  case 2:
	       return "text-green-600"
	  case 3:
	       return "text-red-600"
	  case 4:
	       return "text-blue-900"
	  case 5:
	       return "text-red-900"
	  case 6:
	       return "text-teal-600"
	  case 7:
	       return "text-black"
	  default:
	       return "text-gray-500"
     }
}

function Cell({ id, neighborBombs, flagged }: { id: number, neighborBombs: number, flagged: boolean }) {
     console.log(neighborBombs);

     return <div
	  className={`flex items-center justify-center border border-black bg-white hover:bg-blue-300 transition duration-150 font-extrabold text-xl font-mono ${getColor(neighborBombs)}`}
	  id={id.toString()}
     >
     {(flagged ? '🚩' : neighborBombs)}
     </div>
}

type CellData = {
     flagged: boolean,
     neighbors: number,
     isBomb: boolean
}

export function Minesweeper() {  
     const [ cells, setCells ] = useState<CellData[] | undefined>(undefined);

     useEffect(() => {
	  const mouseDown = (event: MouseEvent) => {
	       /* event.button:
		    0: Main button, usually the left button or the un-initialized state
		    1: Auxiliary button, usually the wheel button or the middle button (if present)
		    2: Secondary button, usually the right button
		    3: Fourth button, typically the Browser Back button
		    4: Fifth button, typically the Browser Forward button
		    * https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
	       */
	       
	      if (event.button === 0 || event.button === 2) {
		    const target = event.target as HTMLElement;
		    const id = parseInt(target.id);
		    if (isNaN(id)) return;


		    const x = id % 12;
		    const y = Math.floor(id / 12);

		    console.log(x, y);
	      }

	       event.preventDefault();
	  };

	  const contextMenu = (event: PointerEvent) => {
	       event.preventDefault();
	       return false;
	  }

	  window.addEventListener('mousedown', mouseDown);
	  window.addEventListener('contextmenu', contextMenu);

	  setCells(new Array(12 * 12).fill({ flagged: false, neighbors: 0, isBomb: false }));

	  // Cleanup
	  return () => {
	       window.removeEventListener('mousedown', mouseDown);
	       window.removeEventListener('contextmenu', contextMenu);
	  }
     }, []);
 
     if (!cells || cells.length <= 0)
	 return <LoadingComponent />


     return <div className="bg-blue-400 rounded-md p-5 aspect-square h-dvh flex flex-col w-full items-center">
	  <div className="w-full flex flex-row justify-center">
	       <h2 className="text-xl">Minesweeper</h2>
	  </div>
	  <div className="aspect-square h-full grid grid-cols-12 grid-rows-12 gap-1">
	       { cells.map((d, i) => <Cell flagged={d.flagged} neighborBombs={d.neighbors} id={i} key={i} />) }
	  </div>
     </div>
}
