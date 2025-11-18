import { useEffect, useState } from "react";
import type { EventRecord } from "../../lib/Database/Records/EventRecord";
import getBadges from "../../lib/getBadges";
import EventBadge from "./EventBadge";
import type { SignupRecord } from "../../lib/Database/Records/SignupRecord";
import Database from "../../lib/Database/Database";
import DBReturn from "../../lib/Database/DBReturn";
import OAuth from "../../lib/OAuth";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../Utility/LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import type ProfileRecord from "../../lib/Database/Records/ProfileRecord";
import SignInButton from "../Auth/SignInButton";

export default function EventPage({ event }: { event: EventRecord }) {
    const [signups, setSignups] = useState<DBReturn<SignupRecord[]> | null>(null);
    const [rsvpToggle, setRsvpToggle] = useState(false);
    const [user, setUser] = useState<DBReturn<ProfileRecord> | null>(null);
    const nav = useNavigate();

    useEffect(() => {
        const getSignups = async () => {
            const r = await Database.signups.getFromEvent(event.id);
            setSignups(r);
            return r;
        }

        const getAuth = async () => {
            const r = await OAuth.getUser();
            setUser(r);
            return r;
        }

        getSignups();
        getAuth();
    }, [event.id]);

    if (!signups)
        return <LoadingComponent />
    if (signups.isError()) 
        return <ErrorComponent message={signups.unwrapError().message} />

    let isRsvpd: boolean;
    if (user && user.isData()) {
        const userId = user.unwrapData().id;
        isRsvpd = signups.unwrapData().find(s => s.user_id === userId) !== undefined;
    } else isRsvpd = false;
    
    function RSVPButton() {
        setRsvpToggle(true);
        const SUS = signups!.unwrapData();

        if (isRsvpd) {
            // Remove RSVP
            const index = SUS.findIndex(s => s.user_id === user!.unwrapData().id);
            SUS.splice(index);
        } else {
            // Add RSVP
            SUS.push({ id: 1000, user_id: user!.unwrapData().id, event_id: event.id.toString() });
        }

        setSignups(new DBReturn(SUS));
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
                <p className="text-gray-800 font-semibold">Attending:</p>
                <p className="text-gray-800 leading-relaxed text-sm md:text-base">{signups.unwrapData().length} people have RSVP'd.</p>
            </>}
        </div>
        <div className="flex flex-row justify-center items-center p-3 gap-3">
            { /* User is not logged in */}
            {event.requires_signup && (!user || user.isError()) && 
                <div className="flex flex-col justify-center gap-1">
                    <p>Log in to RSVP:</p>
                    <SignInButton />
                </div>
            }

            { /* User is logged in  */}
            {event.requires_signup && user?.isData() && (
                isRsvpd 
                ?
                <button onClick={RSVPButton} className="px-3 py-2 bg-green-300 rounded-lg shadow-mg hover:shadow-lg transition-shadow font-semibold">
                    ✅ You are attending
                </button> 
                : 
                (
                    !rsvpToggle
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
            {user && user.isData() && user.unwrapData().is_admin &&                
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
