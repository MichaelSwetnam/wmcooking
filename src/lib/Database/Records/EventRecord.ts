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
    notable_link: string | null;

    start_time: string;
    end_time: string;
    date: string;
}

export class EventWrapper implements EventRecord {
    readonly accessability: "AllStudents" | "ClubMembers";
    readonly description: string;
    readonly id: number;
    readonly location: string;
    readonly name: string;
    readonly background_image: string;
    readonly requires_signup: boolean;
    readonly capacity: number;
    readonly notable_link: string | null;

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
        this.notable_link = record.notable_link;
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

    static placeholder(): Partial<EventRecord> {
        const startTime = new Date();
        const dateString = `${startTime.getFullYear()}-${startTime.getMonth() + 1}-${startTime.getDate()}`
        const startTimeString = `${startTime.getHours()}:${startTime.getMinutes()}:00`;

        return {
            accessability: "ClubMembers",
            description: "Placeholder event description",
            location: "Location: TBA",
            name: "Placeholder Event",
            background_image: "https://ysqrkscfqagmvjdglxcb.supabase.co/storage/v1/object/public/Images/placeholder.webp",
            requires_signup: false,
            capacity: 20,
            notable_link: null,
            start_time: startTimeString,
            end_time: startTimeString,
            date: dateString,
        }
    }
}