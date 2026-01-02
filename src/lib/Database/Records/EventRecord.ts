import Database from "../Database";
import DBReturn from "../DBReturn";

export interface EventRecord {
    accessability: "AllStudents" | "ClubMembers";
    description: string;
    id: number;
    location: string;
    name: string;
    background_image: string;
    requires_signup: boolean;
    capacity: number;

    start_time: string;
    end_time: string;
    date: string;
}

export class EventWrapper implements EventRecord {
    accessability: "AllStudents" | "ClubMembers";
    description: string;
    id: number;
    location: string;
    name: string;
    background_image: string;
    requires_signup: boolean;
    capacity: number;

    start_time: string;
    end_time: string;
    date: string;

    private allergens: string[] | undefined;

    constructor(record: EventRecord) {
        this.accessability = record.accessability;
        this.description = record.description;
        this.id = record.id;
        this.location = record.location;
        this.name = record.name;
        this.background_image = record.background_image;
        this.requires_signup = record.requires_signup;
        this.start_time = record.start_time;
        this.end_time = record.end_time;
        this.date = record.date;
        this.capacity = record.capacity;
    }

    /**
     * Pulls allergy labels from the database and stores them in the wrapper class.
     * @returns Allergies listed for event.
     */
    async getAllergyLabels(): Promise<DBReturn<string[]>> {
        if (this.allergens) return new DBReturn(this.allergens);

        const r = await Database.allergies.getAllergiesForEvent(this.id.toString());
        r.ifData(arr => this.allergens = arr);
        return r;
    }

    /**
     * Sets the allergy labels on the client copy of the event. These changes will not set to DB unless #saveAllergyLabels is called.
     * @param labels 
     */
    async setAllergyLabels(labels: string[]) {
        this.allergens = labels;
    }

    /**
     * Updates stored allergy information to the database and local storage.
     * @returns Updates set of allergens from the database.
     */
    async saveAllergyLabels(): Promise<DBReturn<string[]>> {
        if (!this.allergens) this.getAllergyLabels();
        
        const r = await Database.allergies.updateAllergiesForEvent(this.id.toString(), this.allergens!);
        r.ifData(arr => this.allergens = arr);
        return r;
    }

    getStartDate(): Date {
        return new Date(`${this.date}T${this.start_time}`)
    }

    getEndDate(): Date {
        return new Date(`${this.date}T${this.end_time}`)
    }

    toRecord(): EventRecord { 
        const r = { ...this };
        r.allergens = undefined;
        return r;
    }
}
