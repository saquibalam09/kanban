export interface Task {
  id?: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  created_at?: Date;
}

export type Column = "TODO" | "IN_PROGRESS" | "DONE";
