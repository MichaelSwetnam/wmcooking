import { useContext, useEffect, useState } from "react";
import type { EventWrapper } from "../../lib/Database/Records/EventRecord";
import getBadges from "../../lib/getBadges";
import EventBadge from "./EventBadge";
import { UserContext } from "../Auth/UserContext";
import SignInButton from "../Auth/SignInButton";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../Utility/LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import type { SignupRecord } from "../../lib/Database/Records/SignupRecord";
import Database from "../../lib/Database/Database";
import type DBError from "../../lib/Database/DBError";

function RSVPButton({ isRsvpd, callback }: { isRsvpd: boolean, callback: (wasRsvpd: boolean) => Promise<boolean> }) {
    const [ userTouched, setUserTouched ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    // Error state
    if (error)
        return <ErrorComponent message={error} />

    // Loading an update
    if (loading)
        return <LoadingComponent />

    // Is RSVPD
    if (isRsvpd) {
        return <button onClick={() => callCallback(true)} className="px-3 py-2 bg-green-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold">
           ✅ You are attending
        </button> 
    }

    async function callCallback(wasRsvpd: boolean) {
        setUserTouched(true);
        setLoading(true);
        const result = await callback(wasRsvpd);
        if (!result) setError("Failed to update RSVP status.");
        setLoading(false);
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

function AttendeeSection({ signups, selfSignup, event }: { signups: SignupRecord[], selfSignup: SignupRecord | null, event: EventWrapper }) {
    const eventStart = event.getStartDate();
    const now = new Date();
    const diffMs = eventStart.getTime() - now.getTime();
    const twoHoursMs = 2 * 60 * 60 * 1000;
    
    const signupCount = signups.length + (selfSignup ? 1 : 0);
    const eventFull = signupCount >= event.capacity;
    const eventStarted = eventStart.getTime() <= now.getTime();
    const lessThanTwoHours = diffMs < twoHoursMs;

    let failureMessage: string | undefined;
    if (eventFull)
        failureMessage = "This event is full. Try signing up for one of our next events!";
    else if (eventStarted)
        failureMessage = "This event has already started, so you cannot sign up.";
    else if (lessThanTwoHours)
        failureMessage = "You cannot sign up less than two hours before an event. Try asking if you can attend in the GroupMe.";

    return <div>
        <p className="text-gray-800 font-semibold">Attending: ({signupCount} / {event.capacity})</p>
        { failureMessage && <p className="text-red-500 font-semibold">{failureMessage}</p>}
        { !failureMessage && 
            <ol className="w-full items-center pl-3 list-decimal">
            {
                selfSignup && <li key={0}> {selfSignup.user_name}</li>
            }
            {
                signups.map((s, i) => <li key={i + 1}>{s.user_name}</li>)
            }
            </ol>
        }
    </div>
}

export default function EventPage({ event }: { event: EventWrapper}) {
    const nav = useNavigate();
    const { user } = useContext(UserContext);
    const [ signups, setSignups ] = useState<SignupRecord[] | null>(null);
    const [ selfSignup, setSelfSignup ] = useState<SignupRecord | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<DBError | null>();

    // Get signup information
    useEffect(() => {
        (async () => {
            if (!event.requires_signup) {
                setSignups(null);
                setSelfSignup(null);
                setLoading(false);
                return;
            }

            // Here is some very dumb code which gets the signup and then adds the profile name into it. I should have probably reworked signup to include this field but I'm lazy so I did not.
            const r = await Database.signups.getFromEvent(event.id);
            if (r.isError()) {
                setError(r.unwrapError());
                return;
            }
            const data: SignupRecord[] = [];

            /** If no one is signed in, then there is no self signup */
            if (!user) {
                setSignups(data);
                setSelfSignup(null);
                setLoading(false);
                return;
            }
            
            /** If the user is signed in, remove their signup from data and put it in selfSignup */
            const userSignupIndex = data.findIndex(s => event.id.toString() == s.event_id && s.user_id === user.getId());
            if (userSignupIndex !== -1) {
                setSelfSignup(data[userSignupIndex]);
                data.splice(userSignupIndex, 1);
            }

            setLoading(false);
            setSignups(data);
        })();      
    }, [user, event.id, event.requires_signup]);

    if (error) return <ErrorComponent message={error.message} />
    if (loading) return <LoadingComponent />;

    // Bools
    const isLoggedIn = !!user;
    const isRsvpd = !!selfSignup;
    const isExecMember = user && user.isPrivileged();

    // Add / remove signup functions
    async function addSignup(): Promise<boolean> {
        if (!user) return false;
        
        // There wasn't a signup - add it
        const r = await Database.signups.invokeInsert(event.id.toString(), user.getId());
        if (r.isError()) {
            setError(r.unwrapError());
        }
            
        setSelfSignup(r.unwrapData());
        return r.isData();
    }   

    async function removeSignup(): Promise<boolean> {
        if (!selfSignup) return false;

        const r = await Database.signups.invokeDelete(selfSignup.id.toString());
        r.ifError(e => 
            setError(e)
        );
        setSelfSignup(null);
        
        return r.isData();
    }

    // Response to RSVP button being pressed
    async function changeRSVP(was: boolean): Promise<boolean> {
        if (!user) return false;
        
        let result: boolean;
        switch (was) {
            case true: 
                result = await removeSignup();
                break;

            case false: 
                result = await addSignup(); 
                break;

            default: throw new Error("Unreachable");
        }
        
        return result;
    }

    // Add required buttons.
    const buttons: React.ReactNode[] = [];
    if (event.requires_signup) {
        if (!isLoggedIn) {
            buttons.push(<SigninButtonSection key={0} />);
        } else {
            buttons.push(<RSVPButton isRsvpd={isRsvpd} callback={changeRSVP} key={0} />);
        }
    }

    if (isExecMember) {
        buttons.push(
            <button
                key={1}
                className="px-3 py-2 bg-blue-300 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold"
                onClick={() => nav(`/events/${event.id}/edit`)}
            >
                Edit
            </button>
        );
    }


    // Return
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
            <div className="p-5">
                <p className="text-gray-800 font-semibold">Description:</p>
                <p className="text-gray-800 leading-relaxed text-sm md:text-base">{event.description}</p>
                { event.requires_signup && signups && <AttendeeSection signups={signups} selfSignup={selfSignup} event={event} />}
                {/* Buttons */}
                <div className="flex flex-row justify-center items-center gap-2 pb-5">
                    { ...buttons }
                </div>
            </div>
        </div>
    );
}