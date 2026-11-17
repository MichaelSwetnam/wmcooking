import { useNavigate, useParams } from "react-router-dom";
import ErrorComponent from "../components/Utility/ErrorComponent";
import { updateCookingEvent, useCookingEvent } from "../lib/CookingEvent";
import LoadingComponent from "../components/Utility/LoadingComponent";
import { EventForm } from "../components/Forms/EventForm";
import { updateCookingEventAllergens, useCookingEventAllergens } from "../lib/Allergens";

export default function EditEvent() {
     const { id } = useParams();
     const nav = useNavigate();

     if (!id) {
	return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router. Given: '${id}'`} />
     }

     const parsedId = parseInt(id);
     if (isNaN(parsedId)) {
	return <ErrorComponent message="Could not find the event you are looking for." technical={`Expected :id property from router with type number. Given: '${id}' which is NaN.`} />
     }

     const { data: event, isLoading, error } = useCookingEvent(parsedId);
     const { data: allergens, isLoading: l2, error: e2} = useCookingEventAllergens(parsedId);


     if (isLoading || l2)
	return <LoadingComponent />

     if (error)
	return <ErrorComponent message="Could not find this event" technical={error.message}/>
     if (e2) 
	  return <ErrorComponent message="Could not find this event" technical={e2.message}/>

     return <EventForm eventData={event.getRawData()} allergens={allergens} onSubmit={(data) => {
	  updateCookingEvent(event.id, data.event);
	  updateCookingEventAllergens(event.id, data.allergens);
	  nav(`/events/${event.id}`);
     }}/>
}
