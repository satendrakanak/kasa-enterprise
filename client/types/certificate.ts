import { Course } from "./course";
import { FileType } from "./file";
import { User } from "./user";

export type Certificate = {
  id: number;
  certificateNumber: string;
  issuedAt: string;
  emailedAt: string | null;
  file: FileType | null;
  course: Pick<Course, "id" | "title" | "slug">;
  user: Pick<User, "id" | "firstName" | "lastName" | "email">;
};
