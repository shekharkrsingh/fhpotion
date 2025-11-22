import { apiConnector } from "@/newService/apiConnector";
import { supportEndpoints } from "@/newService/config/apiEndpoints/supportEndpoints";
import logger from "@/utils/logger";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success?: boolean;
}

export interface SupportTicketRequest {
  subject: string;
  message: string;
  category: string;
}

export interface SupportTicketResponse {
  ticketId: string;
  doctorId: string;
  doctorEmail: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  adminResponse?: string;
  assignedTo?: string;
}

export const createSupportTicket = async (
  request: SupportTicketRequest
): Promise<SupportTicketResponse> => {
  try {
    const response = await apiConnector<ApiResponse<SupportTicketResponse>>({
      method: "POST",
      url: supportEndpoints.createSupportTicket,
      bodyData: request,
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.success && response.data?.data) {
      logger.log("Support ticket created successfully:", response.data.data.ticketId);
      return response.data.data;
    }

    const errorMessage = response.data?.message || 
      (response.data?.errorCode ? `Error: ${response.data.errorCode}` : "Failed to create support ticket");
    throw new Error(errorMessage);
  } catch (error: unknown) {
    logger.error("Error creating support ticket:", error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    const axiosError = error as any;
    if (axiosError?.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    
    if (axiosError?.response?.data?.errorCode) {
      throw new Error(`Error: ${axiosError.response.data.errorCode}`);
    }
    
    throw new Error("Failed to create support ticket. Please try again.");
  }
};

export const getSupportTicket = async (
  ticketId: string
): Promise<SupportTicketResponse> => {
  try {
    const response = await apiConnector<ApiResponse<SupportTicketResponse>>({
      method: "GET",
      url: supportEndpoints.getSupportTicket(ticketId),
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.success && response.data?.data) {
      return response.data.data;
    }

    throw new Error(response.data?.message || "Failed to fetch support ticket");
  } catch (error: unknown) {
    logger.error("Error fetching support ticket:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch support ticket. Please try again.";
    throw new Error(errorMessage);
  }
};

export const getAllSupportTickets = async (): Promise<SupportTicketResponse[]> => {
  try {
    const response = await apiConnector<ApiResponse<SupportTicketResponse[]>>({
      method: "GET",
      url: supportEndpoints.getAllSupportTickets,
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.success && response.data?.data) {
      return response.data.data;
    }

    throw new Error(response.data?.message || "Failed to fetch support tickets");
  } catch (error: unknown) {
    logger.error("Error fetching support tickets:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch support tickets. Please try again.";
    throw new Error(errorMessage);
  }
};

export const getSupportTicketsByStatus = async (
  status: string
): Promise<SupportTicketResponse[]> => {
  try {
    const response = await apiConnector<ApiResponse<SupportTicketResponse[]>>({
      method: "GET",
      url: supportEndpoints.getSupportTicketsByStatus(status),
      tokenRequired: true,
    });

    if (response.status === 200 && response.data?.success && response.data?.data) {
      return response.data.data;
    }

    throw new Error(response.data?.message || "Failed to fetch support tickets");
  } catch (error: unknown) {
    logger.error("Error fetching support tickets by status:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch support tickets. Please try again.";
    throw new Error(errorMessage);
  }
};

