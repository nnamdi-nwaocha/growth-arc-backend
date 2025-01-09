import { DaysOfWeek } from "../enums";

// Time class for validation
export class Time {
    constructor(public hour: number, public minute: number) {
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            throw new Error('Invalid time format');
        }
    }

    toString(): string {
        return `${this.hour.toString().padStart(2, '0')}:${this.minute.toString().padStart(2, '0')}`;
    }
}

// Schedule structure
export interface TimeSlot {
    startTime: Time;
    endTime: Time;
}

export interface ClassSchedule {
    day: DaysOfWeek;
    time: TimeSlot[];
}