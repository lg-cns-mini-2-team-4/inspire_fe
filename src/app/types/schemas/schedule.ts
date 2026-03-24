export interface ScheduleData {
    userId: number;
    title: string;
    date: string; // "yyyy-MM-dd"
    type: string; // STUDY, EXAM, DEADLINE, OTHER
    description: string;
    refId: number;
}