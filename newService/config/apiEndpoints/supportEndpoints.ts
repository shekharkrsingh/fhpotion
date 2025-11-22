import { API_BASE_URL } from "../apiConfig";

export const supportEndpoints = {
  createSupportTicket: `${API_BASE_URL}api/v1/support/tickets`,
  getSupportTicket: (ticketId: string) => `${API_BASE_URL}api/v1/support/tickets/${ticketId}`,
  getAllSupportTickets: `${API_BASE_URL}api/v1/support/tickets`,
  getSupportTicketsByStatus: (status: string) => `${API_BASE_URL}api/v1/support/tickets?status=${status}`,
};

