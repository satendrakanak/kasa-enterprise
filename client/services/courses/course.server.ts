import { apiServer } from "@/lib/api/server";
import { ApiResponse } from "@/types/api";
import { Course } from "@/types/course";

export const courseServerService = {
  getAll: () =>
    apiServer.get<ApiResponse<Course[]>>("/courses?isPublished=true"),
  getAllCourses: () =>
    apiServer.get<ApiResponse<{ data: Course[] }>>("/courses"),

  getPopularCourses: () =>
    apiServer.get<ApiResponse<Course[]>>("/courses/featured"),

  getRealtedCourses: (id: number) =>
    apiServer.get<ApiResponse<Course[]>>(`/courses/related/${id}`),

  getById: (id: number) => apiServer.get<ApiResponse<Course>>(`/courses/${id}`),
  getBySlug: (slug: string) =>
    apiServer.get<ApiResponse<Course>>(`/courses/slug/${slug}`),
  getLearningCourseBySlug: (slug: string) =>
    apiServer.get<ApiResponse<Course>>(`/courses/learn/${slug}`),
};
