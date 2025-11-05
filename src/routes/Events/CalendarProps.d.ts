import type { EventRecord } from "../../lib/Database";

export type CalendarProps = {
    year: number,
    month: number,
    increment: () => void,
    decrement: () => void,
    info: Map<string, EventRecord[]>
};