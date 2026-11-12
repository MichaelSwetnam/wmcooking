import { useForm } from "@tanstack/react-form"
import Validators, { InputValidatorBuilder } from "../components/Input/Validators";
import Components from "../components/Input/InputComponents";
import { useParams } from "react-router-dom";
import ErrorComponent from "../components/Utility/ErrorComponent";
import { CookingEvent, useCookingEvent, useCookingEventAllergens } from "../lib/CookingEvent";
import LoadingComponent from "../components/Utility/LoadingComponent";

type DV = { event: { a: string, b: string, c: string }, allergens: string[] };

function EditEventForm({event, allergens}: { event: CookingEvent, allergens: string[]}) {
     const form = useForm({
	  defaultValues: { event: event.getRawData(), allergens: allergens }, 
	  // onSubmit will have extra field: allergens
	  onSubmit: ({ value }) => {
	       console.log(value);
	  }
     });

     return <form
	  className="w-full flex flex-col items-center gap-3"
	  onSubmit={e => {
	       e.preventDefault();
	       e.stopPropagation();
	       form.handleSubmit();
	  }}
     >
	  <form.Field
	       name="event.name"
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	       children = {Components.Text()} 
	  />
	  <form.Field
	       name="event.location"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.required())
		    .add(Validators.lengthGreaterEqual(3))
		    .build()
	       }
	       children = {Components.Text()} 
	  />
	  <form.Field
	       name="event.start_timestamp"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .add(Validators.required())
		    .add(Validators.isDateAfter(new Date()))
		    .build()
	       }
	       children={Components.DateTime()}
	  />
	  <form.Field
	       name="event.end_timestamp"
	       validators={
		    new InputValidatorBuilder<DV>()
		    .addListenTarget("event.start_timestamp")
		    .add(Validators.required())
		    .add(({ value, fieldApi }) => {
			 const startTs = Date.parse(fieldApi.form.getFieldValue("event.start_timestamp"));
			 if (isNaN(startTs)) return 'Must be after the start time.';
			 const start = new Date(startTs);

			 let isAfter = Validators.isDateAfter(start)({ value });
			 return isAfter;
		    })
		    .build()
	       }
	       children={Components.DateTime()}
	  />
	  <form.Field 
	       name="event.description"
	       children={Components.TextArea()}
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	  /> 
	  <form.Field name="event.notable_link"
	       children={Components.Text()}
	       validators={InputValidatorBuilder.Single<DV>(Validators.isHyperlink())}/>
	  <form.Field
	       name="event.accessability"
	       children={Components.Selector([ { val: "ClubMembers", display: "Club Members" }, { val: "AllStudents", display: "All Students" } ])}
	       validators={InputValidatorBuilder.Single<DV>(Validators.required())}
	   />

	  <form.Field
	       name="allergens"
	       children={Components.Allergens()}
	  />

	  <form.Field
	       name="event.requires_signup"
	       children={Components.Checkbox()}
	  />

	  <form.Subscribe 
	       selector={state => state.values.event.requires_signup}
	       children={allows_signups => {
		    if (!allows_signups) return null;

		    return <form.Field
			 name="capacity"
			 children={Components.Number()}
			 validators={new InputValidatorBuilder<DV>().add(Validators.required()).build()}
		    />

	       }}
	  />

	  <form.Field
	       name="event.background_image"
	       children={Components.BackgroundSelector()}
	  />

	  {<Components.Submit form={form} text="Submit" />}
     </form>
}

export default function EditEvent() {
     const { id } = useParams();

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

     return <EditEventForm event={event} allergens={allergens} /> 
}
