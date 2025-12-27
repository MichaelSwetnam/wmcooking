import DatabaseAllergy from "./Children/DatabaseAllergy";
import DatabaseEvents from "./Children/DatabaseEvents";
import DatabaseProfiles from "./Children/DatabaseProfiles";
import DatabaseSignup from "./Children/DatabaseSignup";

export type DatabaseStorage = {
    events: {
        nextEvents: {
            d: number[];
            livesUntil: number;
        },
        months: {
            [_: string]: {
                d: number[],
                livesUntil: number
            }
        }
    },
    allergies: { [x: number]: string[]}
};


export interface DBWrapper {
    save(): void;
}

class Database {
    /** The Store object automatically stores stuff in LocalStorage, so the Database storage is for random other information that should be stored, like event in a certain month, etc.  */
    private static readonly DATABASE_STORAGE_KEY = "DATABASE";
    public readonly events = new DatabaseEvents(this);
    public readonly profiles = new DatabaseProfiles(this);
    public readonly signups = new DatabaseSignup(this);
    public readonly allergies = new DatabaseAllergy(this);

    constructor() {
        const dbStorage = localStorage.getItem(Database.DATABASE_STORAGE_KEY);
        if (dbStorage) {
            const obj = JSON.parse(atob(dbStorage)) as DatabaseStorage;
            if (obj.events)
                this.events.updateFromCache(obj.events);
            if (obj.allergies)
                this.allergies.updateFromCache(obj.allergies);
        }
    }

    public save() {
        const obj: Partial<DatabaseStorage> = {};
        obj.events = this.events.toCacheObject();
        obj.allergies = this.allergies.toCacheObject();
        localStorage.setItem(Database.DATABASE_STORAGE_KEY, btoa(JSON.stringify(obj)));
    }
}

export default new Database();