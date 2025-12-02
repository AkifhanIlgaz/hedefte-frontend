export interface Session {
  id: string;
  userId: string;
  exam: "TYT" | "AYT";
  type: string;
  lesson: string;
  topic: string;
  goal: string;
  notes: string;
  date: Date | string;
  duration: number;
  isCompleted: boolean;
}
