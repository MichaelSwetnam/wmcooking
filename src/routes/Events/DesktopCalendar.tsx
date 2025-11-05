import { useNavigate } from "react-router-dom";
import type { EventRecord } from "../../lib/Database"

interface DateBaseProps {
  day: Date;
  info: EventRecord[];
  active: boolean;
}

function ActiveDate({ day, info }: DateBaseProps) {
  const nav = useNavigate();
  const sorted = [...info].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div className="p-2 flex flex-col items-center justify-center bg-white rounded-md shadow-sm hover:shadow-md transition-all w-full">
      <p>
        {day.toLocaleDateString("en-us", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </p>

      <div className="w-full flex flex-col gap-1 overflow-y-auto mt-1">
        {sorted.map((x, i) => (
          <button
            key={i}
            className="[background:repeating-linear-gradient(45deg,#fdba74_0px,#fdba74_16px,#fb923c_16px,#fb923c_32px)] text-gray-800
                       flex flex-col lg:flex-row justify-center items-center gap-2
                       rounded-md p-2 shadow-sm hover:shadow-md active:scale-95 transition-all w-full text-left cursor-pointer"
            onClick={() => nav(`/events/${x.id}`)}
          >
            <p className="font-semibold">
              {new Date(x.start).toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              })}
            </p>
            <p className="text-center">{x.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function InactiveDate({ day, info }: DateBaseProps) {
  const nav = useNavigate();
  const sorted = [...info].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div className="p-2 flex flex-col items-center justify-center
                    bg-gray-200 text-gray-500
                    [background:repeating-linear-gradient(45deg,#f3f4f6_0px,#f3f4f6_20px,#e5e7eb_20px,#e5e7eb_40px)]
                    rounded-md shadow-sm hover:shadow-md transition-all w-full">
      <p>
        {day.toLocaleDateString("en-us", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </p>

      <div className="w-full flex flex-col gap-1 overflow-y-auto mt-1">
        {sorted.map((x, i) => (
          <button
            key={i}
            className="bg-gray-200 text-gray-700
                       flex flex-col lg:flex-row justify-center items-center gap-2
                       rounded-md p-2 shadow-sm hover:shadow-md active:scale-95 transition-all w-full text-left cursor-pointer"
            onClick={() => nav(`/events/${x.id}`)}
          >
            <p className="font-semibold">
              {new Date(x.start).toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              })}
            </p>
            <p className="text-center">{x.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CurrentDate({ day, info }: DateBaseProps) {
  const nav = useNavigate();
  const sorted = [...info].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div className="
        p-2 flex flex-col items-center justify-center bg-blue-200 rounded-md shadow-md hover:shadow-lg transition-all w-full
        border-4 border-blue-400
    ">
        <div>
            <p>
            {day.toLocaleDateString("en-us", {
                weekday: "short",
                month: "short",
                day: "numeric",
            })}
            </p>

            <div className="w-full flex flex-col gap-1 overflow-y-auto mt-1">
                {sorted.map((x, i) => (
                    <button
                        key={i}
                        className="[background:repeating-linear-gradient(45deg,#bfdbfe_0px,#bfdbfe_16px,#60a5fa_16px,#60a5fa_32px)] text-gray-800
                                flex flex-col lg:flex-row justify-center items-center gap-2
                                rounded-md p-2 shadow-sm hover:shadow-md active:scale-95 transition-all w-full text-left cursor-pointer"
                        onClick={() => nav(`/events/${x.id}`)}
                    >
                        <p className="font-semibold">
                        {new Date(x.start).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            hour12: true,
                        })}
                        </p>
                        <p className="text-center">{x.name}</p>
                    </button>
                ))}
                </div>
            </div>
        </div>
    );
}

function DateBase({ day, info, active }: DateBaseProps) {
  const isToday = new Date().toDateString() === day.toDateString();

  if (isToday) return <CurrentDate day={day} info={info} active={true} />;
  if (active) return <ActiveDate day={day} info={info} active={true} />;
  return <InactiveDate day={day} info={info} active={false} />;
}


function DateBuilder({ month, day, info }: { month: number, day: Date, info: EventRecord[] }) {
    if (day.getMonth() != month) {
        return <DateBase day={day} info={info} active={false} />;
    }

    return <DateBase day={day} info={info} active={true} />;
}

export default function DesktopCalendar({ year, month, info }: { year: number, month: number, info: Map<string, EventRecord[]>}) {
    // Create the calendar layout
    const prevMonthLength = new Date(year, month, 0).getDate();
    const monthLength = new Date(year, month + 1, 0).getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month, monthLength).getDay();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevMonthLength - i));
    }
    for (let i = 0; i < monthLength; i++) {
        days.push(new Date(year, month, i + 1));
    }
    for (let i = 1; i < 7 - lastDay; i++) {
        days.push(new Date(year, month + 1, i));
    }

    return <div className="flex flex-col w-full gap-1">
        <div className="grid grid-cols-7 gap-2 rounded-lg">
            {days.map((x, i) => (
                <DateBuilder month={month} day={x} info={info.get(`${x.getMonth()}/${x.getDate()}`) ?? []} key={i} />
            ))}
        </div>
    </div>
}