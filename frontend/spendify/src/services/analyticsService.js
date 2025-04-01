import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const analyticsService = {
  async getAnalyticsData(userId, timeframe) {
    try {
      const response = await axios.get(`${API_URL}/reports/${userId}`, {
        params: { timeframe },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      throw error;
    }
  },
};
