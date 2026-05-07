import { apiClient, withAuthRetry } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  CreateFacultyBatchPayload,
  CreateFacultySessionPayload,
  FacultyClassSession,
  FacultyCourseBatch,
  FacultyCourseStudent,
  FacultyExamAttempt,
} from "@/types/faculty-workspace";

export const facultyWorkspaceClient = {
  getCourseStudents: (courseId: number) =>
    withAuthRetry(() =>
      apiClient.get<ApiResponse<FacultyCourseStudent[]>>(
        `/api/faculty/courses/${courseId}/students`,
      ),
    ),

  createBatch: (data: CreateFacultyBatchPayload) =>
    withAuthRetry(() =>
      apiClient.post<ApiResponse<FacultyCourseBatch>>("/api/faculty/batches", data),
    ),

  updateBatch: (id: number, data: Partial<CreateFacultyBatchPayload>) =>
    withAuthRetry(() =>
      apiClient.patch<ApiResponse<FacultyCourseBatch>>(
        `/api/faculty/batches/${id}`,
        data,
      ),
    ),

  deleteBatch: (id: number) =>
    withAuthRetry(() =>
      apiClient.delete<ApiResponse<{ message: string }>>(
        `/api/faculty/batches/${id}`,
      ),
    ),

  addBatchStudent: (batchId: number, userId: number) =>
    withAuthRetry(() =>
      apiClient.post<ApiResponse<unknown>>(
        `/api/faculty/batches/${batchId}/students`,
        { userId },
      ),
    ),

  removeBatchStudent: (batchId: number, studentId: number) =>
    withAuthRetry(() =>
      apiClient.delete<ApiResponse<unknown>>(
        `/api/faculty/batches/${batchId}/students/${studentId}`,
      ),
    ),

  createSession: (data: CreateFacultySessionPayload) =>
    withAuthRetry(() =>
      apiClient.post<ApiResponse<FacultyClassSession>>(
        "/api/faculty/sessions",
        data,
      ),
    ),

  updateSession: (id: number, data: Partial<CreateFacultySessionPayload>) =>
    withAuthRetry(() =>
      apiClient.patch<ApiResponse<FacultyClassSession>>(
        `/api/faculty/sessions/${id}`,
        data,
      ),
    ),

  deleteSession: (id: number) =>
    withAuthRetry(() =>
      apiClient.delete<ApiResponse<{ message: string }>>(
        `/api/faculty/sessions/${id}`,
      ),
    ),

  getExamAttempt: (id: number) =>
    withAuthRetry(() =>
      apiClient.get<ApiResponse<FacultyExamAttempt>>(
        `/api/faculty/exam-attempts/${id}`,
      ),
    ),

  gradeExamAttempt: (
    id: number,
    data: {
      questionResults: Array<{
        questionId: number;
        score: number;
        isCorrect?: boolean;
        feedback?: string;
      }>;
    },
  ) =>
    withAuthRetry(() =>
      apiClient.patch<ApiResponse<FacultyExamAttempt>>(
        `/api/faculty/exam-attempts/${id}/grade`,
        data,
      ),
    ),
};
