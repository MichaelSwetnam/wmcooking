import { useNavigate } from "react-router-dom";
import { createCookingEvent, type CookingEventData } from "../lib/CookingEvent";
import { EventForm } from "../components/Forms/EventForm";

const defaultData = {
     background_image: "https://ysqrkscfqagmvjdglxcb.supabase.co/storage/v1/object/public/Images/crimdell.jpg",
     accessability: "AllStudents"
} as CookingEventData;

export function CreateEvent() {
     const nav = useNavigate();

     return <EventForm eventData={defaultData} allergens={[]} onSubmit={async (data) => {
	  const id = await createCookingEvent(data.event);
	  nav(`/events/${id}`);
     }}/>
}
