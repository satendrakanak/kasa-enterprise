import { userServerService } from "@/services/users/user.server";
import { getSession } from "@/lib/auth";
import { Course } from "@/types/course";
import DashboardClient from "@/components/profile/dashboard-client";
import { WeeklyProgress } from "@/types/user";
import { getErrorMessage } from "@/lib/error-handler";
import { orderServerService } from "@/services/orders/order.server";
import { Order } from "@/types/order";
import { courseExamsServerService } from "@/services/course-exams/course-exams.server";
import { ExamHistoryRecord } from "@/types/exam";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;
  let stats = {
    courses: 0,
    completed: 0,
    progress: 0,
    examsTaken: 0,
    examsPassed: 0,
    certificatesEarned: 0,
  };
  let courses: Course[] = [];
  let weeklyProgress: WeeklyProgress[] = [];
  let orders: Order[] = [];
  let examHistory: ExamHistoryRecord[] = [];

  try {
    const [statsRes, coursesRes, weeklyProgressRes, ordersRes, examHistoryRes] =
      await Promise.all([
        userServerService.getDashboardStats(session.id),
        userServerService.getEnrolledCourses(session.id),
        userServerService.getWeeklyProgress(session.id),
        orderServerService.getMine(),
        courseExamsServerService.getMyHistory(),
      ]);

    stats = statsRes.data;
    courses = coursesRes.data;
    weeklyProgress = weeklyProgressRes.data;
    orders = ordersRes.data;
    examHistory = examHistoryRes.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Welcome back 👋</h2>
        <p className="text-gray-500 text-sm">
          Keep learning and track your progress
        </p>
      </div>

      {/* 👇 client widget */}
      <DashboardClient
        stats={stats}
        courses={courses}
        weeklyProgress={weeklyProgress}
        orders={orders}
        examHistory={examHistory}
      />
    </div>
  );
}
