import { useForm } from "@tanstack/react-form";
import type { ProfileData } from "../../lib/Profile";
import Validators, { InputValidatorBuilder } from "../Input/Validators";
import Components from "../Input/InputComponents";

export function ProfileForm({ profileData, onSubmit }: { profileData: ProfileData, onSubmit: (a: ProfileData) => void }) {
     const form = useForm({
	  defaultValues: profileData,
	  onSubmit: ({ value }) => onSubmit(value)
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
	       name="id"
	       children={Components.TextDisabled()}
	  />
	  <form.Field 
	       name="email"
	       children={Components.TextDisabled()}
	  />
	  <form.Field
	       name="name"
	       validators={InputValidatorBuilder.Single<ProfileData>(Validators.required())}
	       children = {Components.Text()} 
	  />


	  {<Components.Submit form={form} text="Submit" />}

     </form>
}
