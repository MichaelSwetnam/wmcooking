import { useContext, useState } from "react";
import type { EventWrapper } from "../../lib/Database/Records/EventRecord";
import getBadges from "../../lib/getBadges";
import EventBadge from "./EventBadge";
import { UserContext } from "../Auth/UserContext";
import SignInButton from "../Auth/SignInButton";
import { useNavigate } from "react-router-dom";

function RSVPButton({ isRsvpd, callback }: { isRsvpd: boolean, callback: (wasRsvpd: boolean) => void }) {
    const [ userTouched, setUserTouched ] = useState(false);

    // Is RSVPD
    if (isRsvpd) {
        return <button onClick={() => callback(true)} className="px-3 py-2 bg-green-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold">
           ✅ You are attending
        </button> 
    }

    function callCallback(wasRsvpd: boolean) {
        setUserTouched(true);
        callback(wasRsvpd);
    }

    // Is not RSVPD && user has not clicked
    if (!userTouched) {
        return <button onClick={() => callCallback(false)} className="px-3 py-2 bg-blue-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold">
            Click to RSVP
        </button>
    }

    // Is RSVP and user clicked
    return <button onClick={() => callCallback(false)} className="px-3 py-2 bg-red-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold">
        ❌ You are not attending
    </button>
}

function SigninButtonSection() {
    return <div className="flex flex-col justify-center gap-1">
        <p>Log in to RSVP:</p>
        <SignInButton />
    </div>;
}

function AttendeeSection() {
    /**
    {
//                 event.requires_signup && <>
//                 <p className="text-gray-800 font-semibold">Attending: ({signupCount} / {event.capacity})</p>
//                 {
//                     signupCount >= event.capacity && <p className="text-red-500 font-semibold">This event is full. Try signing up for one of our next events!</p>
//                 }
//                 {
//                     eventStarted && <p className="text-red-500 font-semibold">This event has already started, so you cannot sign up.</p>
//                 }
//                 {
//                     !eventStarted && lessThanTwoHours && <p className="text-red-500 font-semibold">You cannot sign up less than two hours before an event. Try asking if you can attend in the GroupMe or emailing us.</p>
//                 }
                
//                 <ol className="w-full items-center pl-3 list-decimal">
//                     {
//                         user && selfSignup
//                         ? <li key={0}> {user.getName()}</li>
//                         : <></>
//                     }
//                     {
//                         signups.map((s, i) => <li key={i + 1}>{s.user_name}</li>)
//                     }
//                 </ol>
                
//             </>}
     */

    throw new Error("Not Implemented");
    return <div>Placeholder</div>;
}

export default function EventPage({ event }: { event: EventWrapper}) {
    const nav = useNavigate();
    const { user } = useContext(UserContext);

    const isLoggedIn = !!user;
    const isExecMember = user && user.isPrivileged();

    const buttons: React.ReactNode[] = [];
    if (event.requires_signup) {
        if (!isLoggedIn) {
            buttons.push(<SigninButtonSection />);
        } else {
            buttons.push(<RSVPButton isRsvpd={true} callback={() => { throw new Error("Not Implemented"); }} />);
        }
    }

    if (isExecMember) {
        buttons.push(
            <button
                className="px-3 py-2 bg-blue-300 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold"
                onClick={() => nav(`/events/${event.id}/edit`)}
            >
                Edit
            </button>
        );
    }


    return (
        <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-full">
            {/* Background image portion */}
            <div className={"flex flex-col items-center p-5 gap-1 h-[40vh]"} style={{
                backgroundImage: `url(${event.background_image})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}>
                <div className="p-2 rounded-xl bg-white shadow-sm">
                    <span className={"font-bold text-2xl text-black"}>{event.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    { getBadges(event).map((t, i) => <EventBadge key={i} text={t} />) }
                </div>
            </div>
            {/* White background portion */}
            <div>
                <p className="text-gray-800 font-semibold">Description:</p>
                <p className="text-gray-800 leading-relaxed text-sm md:text-base">{event.description}</p>
                <AttendeeSection />
                {/* Buttons */}
                <div className="flex flex-row justify-center items-center gap-2 pb-5">
                    { ...buttons }
                </div>
            </div>
        </div>
    );
}