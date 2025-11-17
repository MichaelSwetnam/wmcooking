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
    }
};


export interface DBWrapper {
    save(): void;
}

class Database {
    private static readonly DATABASE_STORAGE_KEY = "DATABASE";
    public readonly events = new DatabaseEvents(this);
    public readonly profiles = new DatabaseProfiles(this);
    public readonly signups = new DatabaseSignup(this);

    constructor() {
        const dbStorage = localStorage.getItem(Database.DATABASE_STORAGE_KEY);
        if (dbStorage) {
            const obj = JSON.parse(dbStorage) as DatabaseStorage;
            if (obj.events)
                this.events.updateFromCache(obj.events);
            // if (obj.profiles)
                // this.profiles.updateFromCache(obj.profiles);
        }
    }

    public save() {
        const obj: Partial<DatabaseStorage> = {};
        obj.events = this.events.toCacheObject();
        // obj.profiles = this.profiles.toCacheObject();

        localStorage.setItem(Database.DATABASE_STORAGE_KEY, JSON.stringify(obj));

    }
}

export default new Database();