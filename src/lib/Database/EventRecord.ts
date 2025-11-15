export interface EventRecord {
    accessability: "AllStudents" | "ClubMembers";
    description: string;
    end: string;
    id: number;
    location: string;
    name: string;
    start: string;
    background_image: string;
    signup_link: string;
    requires_signup: boolean;
}