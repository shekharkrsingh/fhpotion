import { apiConnector } from "@/newService/apiConnector";
import { reportEndpoints } from "@/newService/config/apiEndpoints";

/**
 * Get doctor reports as PDF
 * @param fromDate - Start date in yyyy-MM-dd format
 * @param toDate - End date in yyyy-MM-dd format (optional, defaults to today)
 * @returns Promise<{ pdfData: Uint8Array; fileName: string }> - PDF data and filename
 * @throws Error if report generation fails or validation fails
 */
export const getDoctorReports = async (
  fromDate: string,
  toDate?: string,
): Promise<{ pdfData: Uint8Array; fileName: string }> => {
  try {
    validateDates(fromDate, toDate);

    const response = await apiConnector({
      method: "GET",
      url: reportEndpoints.getDoctorReports(fromDate, toDate),
      tokenRequired: true,
      responseType: 'arraybuffer',
    });

    if (response.status === 200 && response.data?.byteLength > 100) {
      const pdfData = new Uint8Array(response.data);
      const fileName = `doctor_report_${fromDate}_to_${toDate || 'today'}.pdf`;

      validatePdfHeader(pdfData);
      return { pdfData, fileName };
    }

    throw new Error("Failed to generate report - invalid data received");
  } catch (error: any) {
    console.error('API Error:', error);
    throw new Error(getErrorMessage(error));
  }
};

// Helper Functions

/**
 * Validate date format and range
 * @param fromDate - Start date in yyyy-MM-dd format
 * @param toDate - End date in yyyy-MM-dd format (optional)
 * @throws Error if date format is invalid or fromDate is after toDate
 */
const validateDates = (fromDate: string, toDate?: string): void => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(fromDate)) {
    throw new Error("Invalid fromDate format. Please use yyyy-MM-dd format.");
  }

  if (toDate && !dateRegex.test(toDate)) {
    throw new Error("Invalid toDate format. Please use yyyy-MM-dd format.");
  }

  const from = new Date(fromDate);
  const to = toDate ? new Date(toDate) : new Date();
  
  if (from > to) {
    throw new Error("fromDate cannot be after toDate");
  }
};

/**
 * Validate PDF file header
 * @param pdfData - PDF file data as Uint8Array
 */
const validatePdfHeader = (pdfData: Uint8Array): void => {
  if (pdfData.length >= 4) {
    const header = String.fromCharCode(...pdfData.slice(0, 4));
    if (header !== '%PDF') {
      console.warn('Warning: Response data may not be a valid PDF file');
    }
  }
};

/**
 * Get user-friendly error message from API error
 * @param error - Error object from API call
 * @returns string - User-friendly error message
 */
const getErrorMessage = (error: any): string => {
  if (error?.response?.status === 401) {
    return "Unauthorized. Please log in again.";
  }
  if (error?.response?.status === 404) {
    return "No report data found for the specified date range.";
  }
  if (error?.response?.status === 400) {
    return "Invalid date parameters provided.";
  }
  return error?.message || "Something went wrong while generating the report.";
};