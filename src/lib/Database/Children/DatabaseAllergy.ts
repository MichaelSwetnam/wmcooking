import { Supabase } from "../../Supabase";
import type { DatabaseStorage } from "../Database";
import DBError from "../DBError";
import DBReturn from "../DBReturn";
import DatabaseChild from "./DatabaseChild";

type Key = "allergies";
export default class DatabaseAllergy extends DatabaseChild {    
    // Map<EventId => string[]>
    private events: {[x: string]: string[]} = {};
    // Map<AllergenId => Label> (string -> string)
    private allergens: Map<string, string> = new Map();
    private loaded = false;

    async loadAllergies() {
        if (this.loaded) return;

        const { data, error } = await Supabase
            .from("AllergyLabel")
            .select("*");
        
        const result = DBReturn.fromSupabase(data, error);
        if (result.isError()) throw new Error("Could not load allergen information!");
        
        const allergyLabels: { id: string, text: string }[] = result.unwrapData();
        for (const item of allergyLabels) {
            this.allergens.set(item.id, item.text);
        }
        this.loaded = true;
    }

    async getLabels(): Promise<string[]> {
        await this.loadAllergies()
        
        const r: string[] = [];
        this.allergens.forEach(v => r.push(v));
        return r;
    }

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

    /**
     * 
     * @param eventId 
     * @param allergies 
     * @returns 
     */
    async updateAllergiesForEvent(eventId: string, allergies: string[]): Promise<DBReturn<string[]>> {
        await this.loadAllergies();

        // Map of text -> id
        const textToId = new Map<string, string>();
        this.allergens.forEach((text, id) => textToId.set(text, id));

        // Map allergy label to id
        const ids: string[] = [];
        for (const allergyLabel of allergies) {
            const id = textToId.get(allergyLabel);
            if (id === undefined) return DBReturn.customError("updateAllergiesForEvent got a label " + allergyLabel + " that does not map to an id.")
            ids.push(id);
        }

        // Delete old relationships
        const { error: delError } = await Supabase
            .from("EventAllergies")
            .delete()
            .eq("event_id", eventId);
        if (delError) return DBReturn.fromError(DBError.build(delError));

        // Insert new relationships
        const rows = ids.map(i => {
            return { event_id: eventId, allergy_id: i }
        });
        const { error: insError } = await Supabase
            .from("EventAllergies")
            .insert(rows)
            .select();
        if (insError) return DBReturn.fromError(DBError.build(insError));    
    
        // Update cache
        this.events[eventId] = allergies;
        this.db.save();
        return DBReturn.success(allergies);
    }

    toCacheObject(): DatabaseStorage[Key] {
        return this.events;
    }
    updateFromCache(o: DatabaseStorage[Key]): void {
        this.events = o;
    }
}