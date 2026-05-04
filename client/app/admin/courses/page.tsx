import { CoursesListLoader } from "@/components/admin/courses/courses-list-loader";
import { getErrorMessage } from "@/lib/error-handler";
import { courseServerService } from "@/services/courses/course.server";
import { Course } from "@/types/course";
const CoursesPage = async () => {
  let courses: Course[] = [];
  try {
    const response = await courseServerService.getAllCourses();
    courses = response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }

  return (
    <div>
      <CoursesListLoader courses={courses} />
    </div>
  );
};

export default CoursesPage;
