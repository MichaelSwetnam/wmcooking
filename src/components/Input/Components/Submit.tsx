import { type AnyFormApi } from "@tanstack/react-form"
export function SubmitButton({ form, text}: { form: AnyFormApi, text: string }) {
     return <button
	  className="font-bold text-white bg-blue-400 p-3 rounded-md shadow-md"
	  type="submit"
	  onClick={() => { form.handleSubmit({ submitAction: 'backToMenu' })}}
     >{text}</button>
}
