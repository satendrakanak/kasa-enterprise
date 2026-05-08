import { FacultyRecordingsPage } from "@/components/faculty/dashboard/faculty-recordings-page";
import { facultyWorkspaceServer } from "@/services/faculty/faculty-workspace.server";

export default async function AdminRecordingsRoutePage() {
  const recordings = await facultyWorkspaceServer.getRecordings();

  return (
    <FacultyRecordingsPage
      recordings={recordings}
      title="Class Recordings"
      description="Review all faculty BBB recordings, sync processed sessions, and download archived S3 copies."
      calendarHref="/faculty/calendar"
    />
  );
}
