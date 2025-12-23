export interface EventRecord {
    accessability: "AllStudents" | "ClubMembers";
    description: string;
    id: number;
    location: string;
    name: string;
    background_image: string;
    requires_signup: boolean;
    start: string;
    end: string;
}

export class EventWrapper {
    id: number;

    accessability: "AllStudents" | "ClubMembers";
    description: string;
    location: string;
    name: string;
    background_image: string;
    requires_signup: boolean;

    start: Date;
    end: Date;

    constructor(data: EventRecord) {
        this.accessability = data.accessability;
        this.description = data.description;
        this.id = data.id;
        this.location = data.location;
        this.background_image = data.background_image;
        this.requires_signup = data.requires_signup;
        this.name = data.name

        // TEMP
        this.start = new Date(data.start);
        this.end = new Date(data.end);

        console.log("Event ---");
        console.log(data.name + ": ");
        console.log(data.start);
        console.log(data.end);
    }

    toRecord(): EventRecord {
        return {
            id: this.id,
            accessability: this.accessability,
            description: this.description,
            location: this.location,
            name: this.name,
            background_image: this.background_image,
            requires_signup: this.requires_signup,
            start: new Date().toISOString(),
            end: new Date().toISOString()  
        }
    }
}