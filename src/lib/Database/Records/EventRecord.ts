import Database from "../Database";
import type DBReturn from "../DBReturn";

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

    async getAllergyLabels(): Promise<DBReturn<string[]>> {
        return Database.allergies.getAllergiesForEvent(this.id.toString());
    }

    getStartDate(): Date {
        return new Date(`${this.date}T${this.start_time}`)
    }

    getEndDate(): Date {
        return new Date(`${this.date}T${this.end_time}`)
    }

    toRecord(): EventRecord { return { ...this }; }
}
