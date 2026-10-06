// API service for MitraVerify frontend
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:5001/api";

class ApiService {
  constructor() {
    const saved = localStorage.getItem("token");
    if (!saved || saved === "undefined" || saved === "null" || saved.trim() === "") {
      localStorage.removeItem("token");
      this.token = null;
    } else {
      this.token = saved;
    }
  }

  async request(endpoint, options = {}) {
    const token = this.token || localStorage.getItem("token");
    const hasValidToken = token && token !== "undefined" && token !== "null" && token.trim() !== "";
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(hasValidToken && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Update token
  setToken(token) {
    if (token && token !== "undefined" && token !== "null" && token.trim() !== "") {
      this.token = token;
      localStorage.setItem("token", token);
    } else {
      this.token = null;
      localStorage.removeItem("token");
    }
  }

  // Authentication
  async login(username, password) {
    const response = await this.request("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.request("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async logout() {
    this.setToken(null);
    return { success: true };
  }

  // Verification
  async verifyContent(data) {
    return this.request("/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async analyzeImage(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    return this.request("/analyze-image", {
      method: "POST",
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }

  async verifyUrl(data) {
    return this.request("/verify-url", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getHistory(page = 1, contentType = null) {
    const params = new URLSearchParams({ page: page.toString() });
    if (contentType) params.append("content_type", contentType);

    return this.request(`/history?${params.toString()}`);
  }

  // Education
  async getEducationModules(difficulty = "all", language = "en") {
    const params = new URLSearchParams({ difficulty, language });
    return this.request(`/education/modules?${params.toString()}`);
  }

  async trackProgress(progressData) {
    return this.request("/education/progress", {
      method: "POST",
      body: JSON.stringify(progressData),
    });
  }

  // User stats
  async getUserStats() {
    return this.request("/user/stats");
  }

  async getUserProfile() {
    return this.request("/auth/profile");
  }

  async updateProfile(profileData) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }
}

const apiService = new ApiService();
export default apiService;
