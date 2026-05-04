import { apiServer } from "@/lib/api/server";
import { ApiResponse, Paginated } from "@/types/api";
import { EmailTemplate } from "@/types/email-template";

export const emailTemplateServerService = {
  getAll: () =>
    apiServer.get<ApiResponse<Paginated<EmailTemplate>>>("/email-templates"),
};
