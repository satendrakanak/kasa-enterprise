import { apiServer } from "@/lib/api/server";
import { ApiResponse } from "@/types/api";
import { Article } from "@/types/article";

export const articleServerService = {
  getAll: () =>
    apiServer.get<ApiResponse<Article[]>>("/articles?isPublished=true"),
  getAllArticles: () =>
    apiServer.get<ApiResponse<{ data: Article[] }>>("/articles"),

  getFeaturedArticles: () =>
    apiServer.get<ApiResponse<Article[]>>("/articles/featured"),

  getRealtedArticles: (id: number) =>
    apiServer.get<ApiResponse<Article[]>>(`/articles/related/${id}`),

  getById: (id: number) =>
    apiServer.get<ApiResponse<Article>>(`/articles/${id}`),
  getBySlug: (slug: string) =>
    apiServer.get<ApiResponse<Article>>(`/articles/slug/${slug}`),
};
