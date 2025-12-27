import { Supabase } from "../../Supabase";
import type { DatabaseStorage } from "../Database";
import DBReturn from "../DBReturn";
import DatabaseChild from "./DatabaseChild";

type Key = "allergies";
export default class DatabaseAllergy extends DatabaseChild {    
    // Map<EventId => string[]>
    events: {[x: string]: string[]} = {};

    async getAllergiesForEvent(eventId: string): Promise<DBReturn<string[]>> {
        if (this.events[eventId] !== undefined)
            return new DBReturn(this.events[eventId]);

        const { data, error } = await Supabase
            .from("EventAllergies") 
            .select(`allergy_id, "AllergyLabel" (text)`)
            .eq('event_id', eventId);

        const result = DBReturn.fromSupabase(data, error);
        if (result.isError()) return result.mapError();

        const allergies = result.unwrapData() as unknown as { allergy_id: string, AllergyLabel: { text: string }}[];
        const allergyStrings = [];
        for (const entry of allergies) {   
            allergyStrings.push(entry.AllergyLabel.text);
        }

        this.events[eventId] = allergyStrings;
        this.db.save();
        return new DBReturn(allergyStrings);
    }

    toCacheObject(): DatabaseStorage[Key] {
        return this.events;
    }
    updateFromCache(o: DatabaseStorage[Key]): void {
        this.events = o;
        console.log(o);
    }
}