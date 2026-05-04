import { apiServer } from "@/lib/api/server";
import { ApiResponse } from "@/types/api";
import { Certificate } from "@/types/certificate";

export const certificateServerService = {
  getMine: () => apiServer.get<ApiResponse<Certificate[]>>("/certificates/my"),
};
