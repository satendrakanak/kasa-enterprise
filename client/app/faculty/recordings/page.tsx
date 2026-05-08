import { FacultyRecordingsPage } from "@/components/faculty/dashboard/faculty-recordings-page";
import { facultyWorkspaceServer } from "@/services/faculty/faculty-workspace.server";

export default async function FacultyRecordingsRoutePage() {
  const recordings = await facultyWorkspaceServer.getRecordings();

  return <FacultyRecordingsPage recordings={recordings} />;
}
