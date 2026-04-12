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
      if (response.token) {
        // In a real app, you might decode the token to get user data or fetch it separately
        // For now, we'll just store a dummy user object for context.
        login(response.token, { id: "1", name: "User", email: data.email }); 
        navigate("/"); // Redirect to home page or dashboard
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm isSignup={false} onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      <div className="absolute bottom-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
