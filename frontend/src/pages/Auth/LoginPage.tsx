import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../../components/Auth/AuthForm";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data.email, data.password);
      if (response.token && response.user) {
        login(response.token, response.user);
        navigate("/"); // Redirect to home page
      } else if (response.token) {
        // Fallback: decode user from token if user data not in response
        const payload = JSON.parse(atob(response.token.split(".")[1]));
        login(response.token, {
          id: payload.id,
          name: payload.name || data.email.split("@")[0],
          email: payload.email || data.email,
        });
        navigate("/");
      } else if (response.error) {
        setError(typeof response.error === "string" ? response.error : JSON.stringify(response.error));
      } else {
        setError("An unknown error occurred during login.");
      }
    } catch (err: any) {
      setError(err.message || "Network error during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky/20 via-cloud to-tropical/10 p-6">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-tropical rounded-xl flex items-center justify-center shadow-lg shadow-tropical/20">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <h1 className="text-2xl font-bold text-ocean tracking-tight">Hawai</h1>
      </div>
      
      <AuthForm isSignup={false} onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      
      <p className="mt-8 text-rock font-medium">
        Don't have an account?{" "}
        <Link to="/signup" className="text-tropical hover:text-ocean font-bold transition-colors">
          Create one for free
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
