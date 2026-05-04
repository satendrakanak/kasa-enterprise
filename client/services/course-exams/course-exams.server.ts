import { apiServer } from "@/lib/api/server";
import { ApiResponse } from "@/types/api";
import {
  AdminExamOverview,
  ExamHistoryRecord,
  UserExamAccessOverview,
} from "@/types/exam";

export const courseExamsServerService = {
  getMyHistory: () =>
    apiServer.get<ApiResponse<ExamHistoryRecord[]>>("/course-exams/my-history"),

  getAdminOverview: () =>
    apiServer.get<ApiResponse<AdminExamOverview>>(
      "/course-exams/admin-overview",
    ),

  getUserAccessOverview: (userId: number) =>
    apiServer.get<ApiResponse<UserExamAccessOverview[]>>(
      `/course-exams/admin/users/${userId}/access-overrides`,
    ),
};
