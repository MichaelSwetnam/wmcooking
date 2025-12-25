import { useContext, useEffect, useState } from "react";
import type { EventWrapper } from "../../lib/Database/Records/EventRecord";
import getBadges from "../../lib/getBadges";
import EventBadge from "./EventBadge";
import type { SignupRecord } from "../../lib/Database/Records/SignupRecord";
import Database from "../../lib/Database/Database";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../Utility/LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import SignInButton from "../Auth/SignInButton";
import DBError from "../../lib/Database/DBError";
import { UserContext } from "../Auth/UserContext";

export default function EventPage({ event }: { event: EventWrapper }) {
    const [error, setError] = useState<DBError | null>(null); 
    const [signups, setSignups] = useState<SignupRecord[] | null>(null);
    const [selfSignup, setSelfSignup] = useState<SignupRecord | null>(null);

    const { user } = useContext(UserContext);

    // Whether the RSVP button has been clicked at least once (changes from "Click to RSVP" -> "Attending")
    const [rsvpToggle, setRsvpToggle] = useState(false);
    const nav = useNavigate();

    const isRsvpd = selfSignup !== null;

    /** Get information from DB */
    useEffect(() => {
        const getSignups = async () => {
            if (!event.requires_signup) {
                setSignups([]);
                setSelfSignup(null);
                return;
            }
            
            const r = await Database.signups.getFromEvent(event.id);
            if (r.isError()) {
                setError(r.unwrapError());
                return;
            }

            const data = r.unwrapData();
            
            /** If no one is signed in, then there is no self signup */
            if (!user) {
                setSignups(data);
                setSelfSignup(null);
                return;
            }
            
            /** If the user is signed in, remove their signup from data and put it in selfSignup */
            const userSignupIndex = data.findIndex(s => event.id.toString() == s.event_id && s.user_id === user.getId());
            if (userSignupIndex !== -1) {
                setSelfSignup(data[userSignupIndex]);
                data.splice(userSignupIndex, 1);
            }

            setSignups(data);
        }
        getSignups();
    }, [event.id, event.requires_signup, user]);

    /** Guard Statements */
    if (error)
        return <ErrorComponent message={error.message} />
    if (!signups)
        return <LoadingComponent />

    const signupCount = signups.length + (selfSignup ? 1 : 0);

    const now = new Date();
    const eventStart = event.getStartDate();
    const diffMs = eventStart.getTime() - now.getTime();
    const twoHoursMs = 2 * 60 * 60 * 1000;

    const eventStarted = eventStart.getTime() <= now.getTime();
    const lessThanTwoHours = diffMs < twoHoursMs;
    
    const showSignupButton = !eventStarted && !lessThanTwoHours && event.requires_signup && user;

    /** Button OnClick */
    async function RSVPButton() {
        if (!user) return;

        setRsvpToggle(true);

        if (selfSignup !== null) {
            // There was a signup - remove it
            const r = await Database.signups.invokeDelete(selfSignup.id.toString());
            r.ifError(e => 
                setError(e)
            );

            setSelfSignup(null);
        } else {
            if (signupCount >= event.capacity) return; // Don't let someone signup if there are already too many signups.

            // There wasn't a signup - add it
            const r = await Database.signups.invokeInsert(event.id.toString(), user.getId());
            if (r.isError()) {
                setError(r.unwrapError());
                return;
            }
            
            setSelfSignup(r.unwrapData());
        }
    }

    return <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-full">
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
        <div className="flex flex-col gap-3 px-6 p-3">
            <p className="text-gray-800 font-semibold">Description:</p>
            <p className="text-gray-800 leading-relaxed text-sm md:text-base">{event.description}</p>
            {
                event.requires_signup && <>
                <p className="text-gray-800 font-semibold">Attending: ({signupCount} / {event.capacity})</p>
                {
                    signupCount >= event.capacity && <p className="text-red-500 font-semibold">This event is full. Try signing up for one of our next events!</p>
                }
                {
                    eventStarted && <p className="text-red-500 font-semibold">This event has already started, so you cannot sign up.</p>
                }
                {
                    !eventStarted && lessThanTwoHours && <p className="text-red-500 font-semibold">You cannot sign up less than two hours before an event. Try asking if you can attend in the GroupMe or emailing us.</p>
                }
                
                <ol className="w-full items-center pl-3 list-decimal">
                    {
                        user && selfSignup
                        ? <li key={0}> {user.getName()}</li>
                        : <></>
                    }
                    {
                        signups.map((s, i) => <li key={i + 1}>{s.user_name}</li>)
                    }
                </ol>
                
            </>}
        </div>
        <div className="flex flex-row justify-center items-center p-3 gap-3">
            { /* User is not logged in */}
            {event.requires_signup && !user && 
                <div className="flex flex-col justify-center gap-1">
                    <p>Log in to RSVP:</p>
                    <SignInButton />
                </div>
            }

            { /* User is logged in  */}
            {showSignupButton && (
                isRsvpd 
                ?
                <button onClick={RSVPButton} className="px-3 py-2 bg-green-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold">
                    ✅ You are attending
                </button> 
                : 
                (
                    (!rsvpToggle && signupCount < event.capacity )
                    ?
                    <button onClick={RSVPButton} className="px-3 py-2 bg-blue-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold">
                        Click to RSVP
                    </button>
                    :
                    <button onClick={RSVPButton} className="px-3 py-2 bg-red-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold">
                        ❌ You are not attending
                    </button>
                )
            )}

            { /* User is logged in AND exec */ }
            {user && user.isPrivileged() &&                
                <button
                    className="px-3 py-2 bg-blue-300 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold"
                    onClick={() => nav(`/events/${event.id}/edit`)}
                >
                    Edit
                </button>
            }
        </div>
        
    </div>;
}
