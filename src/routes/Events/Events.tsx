import { useLayoutEffect, useState } from "react";
import MobileCalendar from "./MobileCalendar";
import DesktopCalendar from "./DesktopCalendar";

export default function Events() {
    const [[ month, year ], setMonthYear ] = useState([new Date().getMonth(), new Date().getFullYear()]); 
    const [width, setWidth] = useState(window.innerWidth);

    // Listen to window resize
    useLayoutEffect(() => {
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth)
        })
    }, []);

    function incrementMonth() {
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth >= 12) {
            newMonth = 0;
            newYear++;
        }

        setMonthYear([ newMonth, newYear ]);
    }

    function decrementMonth() {
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setMonthYear([ newMonth, newYear ]);
    }

    
    return <div className="flex flex-col p-3 bg-white shadow-xl w-full gap-1 rounded-md">
        <div className="w-full bg-blue-200 rounded-md p-3 text-center text-xl font-semibold">
            <div className="flex flex-row justify-center items-center gap-3">
                <button className="aspect-video bg-blue-300 py-1 px-3 rounded-md shadow-sm cursor-pointer" onClick={decrementMonth}>{"<"}</button>
                <p>{new Date(year, month).toLocaleDateString('en-us', { month: "long", year: "numeric" })}</p>
                <button className="aspect-video bg-blue-300 py-1 px-3 rounded-md shadow-sm cursor-pointer" onClick={incrementMonth}>{">"}</button>
            </div>
        </div>
        { /* Tailwind CSS uses 48rem for md screens = 768 px https://tailwindcss.com/docs/responsive-design */ }
        {
            width < 768
            ? <MobileCalendar
                year={year}
		month={month}
            />
            : <DesktopCalendar
                year={year} 
                month={month} 
            />
        } 
    </div>
}
