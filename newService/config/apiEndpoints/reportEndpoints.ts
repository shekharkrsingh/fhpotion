import { API_BASE_URL } from "../apiConfig";

export const reportEndpoints = {
  getDoctorReports: (fromDate: string, toDate: string) => {
    let url = `${API_BASE_URL}reports/doctor?fromDate=${fromDate}`;
    if (toDate) {
      url += `&toDate=${toDate}`;
    }
    return url;
  },
};
