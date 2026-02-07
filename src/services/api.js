import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.1.25:3000/api";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add interceptor to include token in requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  setToken(token) {
    localStorage.setItem("authToken", token);
  }

  clearToken() {
    localStorage.removeItem("authToken");
  }

  // Auth endpoints
  async register(data) {
    const payload = {
      ...data,
      accountType: "individual",
    };
    const response = await this.api.post("/auth/register", payload);
    return response.data;
  }

  async verifyRegister(data) {
    const response = await this.api.post("/auth/verify-register", data);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  // User endpoints
  async updatePersonalInfo(data) {
    const response = await this.api.patch("/user/update/personal", data);
    return response.data;
  }

  async updateLanguages(languages) {
    const response = await this.api.patch("/user/update/languages", {
      languages,
    });
    return response.data;
  }

  async updateSchedule(schedule) {
    const response = await this.api.patch("/user/update/availability", {
      schedule,
    });
    return response.data;
  }

  // Address endpoints
  async createAddress(data) {
    const response = await this.api.post("/address", data);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get("/user");
    return response.data;
  }

  // Ad endpoints - Supports both adlisting and stockad
  async createAd(adType, adData) {
    const response = await this.api.post(`/ads/${adType}`, adData);
    return response.data;
  }

  async getAdPlans(adType, adId) {
    const response = await this.api.get(`/ads/${adType}/${adId}/plans`);
    return response.data;
  }

  async applyAdPlans(adType, adId, plansData) {
    const response = await this.api.patch(
      `/ads/${adType}/${adId}/plans`,
      plansData,
    );
    return response.data;
  }
}

export const apiService = new ApiService();
