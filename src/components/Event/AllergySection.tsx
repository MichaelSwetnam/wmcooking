import LoadingComponent from "../Utility/LoadingComponent";
import ErrorComponent from "../Utility/ErrorComponent";
import { CookingEvent, useCookingEventAllergens } from "../../lib/CookingEvent.ts";

export default function AllergySection({ event }: { event: CookingEvent }) {
    const { data: allergies, error, isLoading } = useCookingEventAllergens(event.id);

    if (error) return <ErrorComponent message="Could not load allergy information. Please email cooking@wm.edu for more information on present allergens." technical={error.message} reveal={true} />

    if (isLoading) return <LoadingComponent />

    if (allergies!.length <= 0) return <div>
        <p className="text-gray-800 font-semibold">Allergy Information: </p>
        <p>No allergens have been listed for this event. For more information, please send an email to <a href="mailto:cooking@wm.edu" className="underline hover:text-blue-600 transition">cooking@wm.edu</a>.</p>
    </div>

    return <div>
        <p className="text-gray-800 font-semibold">Allergy Information:</p>
        <p>This event may contain the following allergens:</p>
        <ul className="w-full items-center pl-3 list-disc">
            {
                allergies!.sort().map((s, i) => <li key={i}>{s[0].toUpperCase() + s.slice(1).toLowerCase()}</li>)
            }
        </ul>
        <p>For more information, please send an email to <a href="mailto:cooking@wm.edu" className="underline hover:text-blue-600 transition">cooking@wm.edu</a>.</p>
    </div>
}
