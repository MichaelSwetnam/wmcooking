import { useContext, useState } from "react";
import EventBadge from "../Event/Badges";
import { UserContext } from "../Auth/UserContext";
import SignInButton from "../Auth/SignInButton";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../Utility/LoadingComponent";
import ErrorComponent from "../Utility/ErrorComponent";
import { CookingEvent, deleteCookingEvent } from "../../lib/CookingEvent";
import AllergySection from "./AllergySection";
import { EventSignup, useSignupsFromEvent } from "../../lib/EventSignup";

function DeleteButton({ event } : { event: CookingEvent }) {
    const nav = useNavigate();
    const [buttonState, setButtonState] = useState<"Unclicked" | "Unconfirmed" | "LoadingDeleted" | "Deleted">("Unclicked");
    const [error, setError] = useState<string | null>(null);

    const { user } = useContext(UserContext);
    if (!user || !user.isAdmin) return <ErrorComponent message="You cannot delete events without admin access." />

    async function onClick() {
        // Cannot delete twice
        if (buttonState === "Deleted") return;
        
        // Make sure the user confirms delete
        if (buttonState === "Unclicked") {
            setButtonState("Unconfirmed");
            return;
        }

        // Start deleting the event
        if (buttonState === "Unconfirmed") {
            setButtonState("LoadingDeleted");
	       
	    try { await deleteCookingEvent(event.id) }
	    catch (e) {
	       setError(e.message);
	       return;
	    }
 
            // Event is deleted successfully => should navigate now.
            setButtonState("Deleted");
            nav("/");
            return;
        }
    }

    if (error) {
        return <ErrorComponent message="Could not delete event." technical={error} />
    }

    switch (buttonState) {
        case "Unclicked":
            return <button
                className="px-3 py-2 bg-red-400 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold cursor-pointer"
                onClick={onClick}
            >
                Delete
            </button>
        
        case "Unconfirmed":
            return <button
                className="px-3 py-2 bg-red-400 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold cursor-pointer"
                onClick={onClick}
            >
                ⚠️Click again to delete⚠️
            </button>

        case "LoadingDeleted":
            return <LoadingComponent />

        case "Deleted":
            return <ErrorComponent message="Event is deleted. You should have been redirected." />
    }
}   

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
        return <button onClick={() => callCallback(true)} className="px-3 py-2 bg-green-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold cursor-pointer">
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
        return <button onClick={() => callCallback(false)} className="px-3 py-2 bg-blue-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold cursor-pointer">
            Click to RSVP
        </button>
    }

    // Is RSVP and user clicked
    return <button onClick={() => callCallback(false)} className="px-3 py-2 bg-red-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold cursor-pointer">
        ❌ You are not attending
    </button>
}

function SigninButtonSection() {
    return <div className="flex flex-col justify-center gap-1">
        <p>Log in to RSVP:</p>
        <SignInButton />
    </div>;
}

function AttendeeSection({ signups, selfSignup, event }: { signups: EventSignup[], selfSignup: EventSignup | null, event: CookingEvent }) {
    const eventStart = event.getStartDate();
    const now = new Date();
    const diffMs = eventStart.getTime() - now.getTime();
    const twoHoursMs = 2 * 60 * 60 * 1000;

    const signupCount = signups.length + (selfSignup ? 1 : 0);
    const eventFull = signupCount >= event.capacity;
    const eventStarted = eventStart.getTime() <= now.getTime();
    const lessThanTwoHours = diffMs < twoHoursMs;

    let failureMessage: string | undefined;
    if (eventFull && !selfSignup)
        failureMessage = "This event is full. Try signing up for one of our next events!";
    else if (eventStarted && !selfSignup)
        failureMessage = "This event has already started, so you cannot sign up.";
    else if (lessThanTwoHours && !selfSignup)
        failureMessage = "You cannot sign up less than two hours before an event. Try asking if you can attend in the GroupMe.";

    return <div>
        <p className="text-gray-800 font-semibold">Attending: ({signupCount} / {event.capacity})</p>
        { failureMessage && <p className="text-red-500 font-semibold">{failureMessage}</p>}
        <ol className="w-full items-center pl-3 list-decimal">

	{/* TODO: Get signup name instead of id  */}
        {
            selfSignup && <li key={0}> {selfSignup.profileName}</li>
        }
        {
            signups.map((s, i) => <li key={i + 1}>{s.profileName}</li>)
        }
        </ol>
    </div>
}

export default function EventPage({ event }: { event: CookingEvent }) {
    const nav = useNavigate();
    const { user } = useContext(UserContext);

    let signups: EventSignup[] | null;
    let selfSignup: EventSignup | null;
    if (!event.requiresSignup) {
	 signups = null;
	 selfSignup = null;
    }

    const { data: signupsData, error, isLoading } = useSignupsFromEvent(event.id);

    if (error) return <ErrorComponent message={error.message} />
    if (isLoading) return <LoadingComponent />;

    signupsData.sort((a, b) => b.getDateCreated().getTime() - a.getDateCreated().getTime());

    if (signupsData && !user) {
	 // If there is no logged in user, there is no self signup
	 selfSignup = null;
	 signups = signupsData;
    }

    if (signupsData && user) {
	 // Remove selfSignup from signups
	 const selfIndex = signupsData.findIndex(d => d.profileId === user.id);
	 if (selfIndex !== -1) {
	      selfSignup = signupsData[selfIndex];
	      signups = signupsData.slice(selfIndex, 1);
	 } else {
	      selfSignup = null;
	      signups = signupsData;
	 }

    }

    // Bools
    const isLoggedIn = !!user;
    const isRsvpd = !!selfSignup;
    const isExecMember = user && user.isAdmin;

    // Add / remove signup functions
    async function addSignup(): Promise<boolean> {
        if (!user) return false;
     
	// TODO 
        // There wasn't a signup - add it
        // const r = await Database.signups.invokeInsert(event.id.toString(), user.getId());
        // if (r.isError()) {
        //     setError(r.unwrapError());
        // }
        //
        // setSelfSignup(r.unwrapData());
        // return r.isData();
	return true;
    }   

    async function removeSignup(): Promise<boolean> {
        if (!selfSignup) return false;

	// TODO
        // const r = await Database.signups.invokeDelete(selfSignup.id.toString());
        // r.ifError(e => 
        //     setError(e)
        // );
        // setSelfSignup(null);
        
        // return r.isData();
	return true;
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
    if (event.requiresSignup) {
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
                className="px-3 py-2 bg-blue-300 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold cursor-pointer"
                onClick={() => nav(`/events/${event.id}/edit`)}
            >
                Edit
            </button>
        );
        buttons.push(
            <DeleteButton event={event} />
        )
    }


    // Return
    return (
        <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-full">
            {/* Background image portion */}
            <div className={"flex flex-col items-center p-5 gap-1 h-[40vh]"} style={{
                backgroundImage: `url(${event.backgroundImageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}>
                <div className="p-2 rounded-xl bg-white shadow-sm">
                    <span className={"font-bold text-2xl text-black"}>{event.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    { event.getBadges().map((t, i) => <EventBadge key={i} text={t} />) }
                </div>
            </div>
            {/* White background portion */}
            <div className="p-5 flex flex-col gap-3">
                <div>
                    <p className="text-gray-800 font-semibold">Description:</p>
                    <p className="text-gray-800 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{event.description}</p>
                </div>
                {
                    event.notableLink && <div>
                        <p className="text-gray-800 font-semibold">More information here:</p>
                        <a target="_blank" className="text-blue-600 underline" href={event.notableLink}>{event.notableLink}</a>
                    </div>
                }

	       <AllergySection event={event} />
                { event.requiresSignup && signups && <AttendeeSection signups={signups} selfSignup={selfSignup} event={event} />}
                {/* Buttons */}
                <div className="flex flex-row justify-center items-center gap-2 pb-5">
                    { ...buttons }
                </div>
            </div>
        </div>
    );
}
