const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string | object;
}

export const authService = {
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getProfile(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  setToken(token: string): void {
    localStorage.setItem("token", token);
  },

  removeToken(): void {
    localStorage.removeItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
