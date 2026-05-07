import { FacultyCoursesPage } from "@/components/faculty/dashboard/faculty-courses-page";
import { facultyWorkspaceServer } from "@/services/faculty/faculty-workspace.server";

export default async function FacultyCoursesRoutePage() {
  const courses = await facultyWorkspaceServer.getCourses();

  return <FacultyCoursesPage courses={courses} />;
}
