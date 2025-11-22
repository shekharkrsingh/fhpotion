import { API_BASE_URL } from "../apiConfig";

export const reportEndpoints = {
  getDoctorReports: (fromDate: string, toDate: string| undefined) => {
    let url = `${API_BASE_URL}api/v1/reports/doctor?fromDate=${fromDate}`;
    if (toDate) {
      url += `&toDate=${toDate}`;
    }
    return url;
  },
};
