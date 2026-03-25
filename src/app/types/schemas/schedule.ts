export interface ScheduleData {
    id?: number;
    userId?: number;
    title: string;
    date: string; // "yyyy-MM-dd"
    type: string; // STUDY, EXAM, DEADLINE, OTHER
    description: string | undefined;
    refId?: number;
}