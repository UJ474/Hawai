import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../../components/Auth/AuthForm";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Although signup doesn't directly log in, it might automatically log in after successful registration
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await authService.signup(data.name, data.email, data.password);
      if (response.user) {
        setSuccessMessage("Account created successfully! You can now log in.");
        // Optionally, if signup automatically logs in:
        // if (response.token) {
        //   login(response.token, response.user);
        //   navigate("/");
        // }
        navigate("/login"); // Redirect to login page after successful signup
      } else if (response.error) {
        setError(typeof response.error === "string" ? response.error : JSON.stringify(response.error));
      } else {
        setError("An unknown error occurred during signup.");
      }
    } catch (err: any) {
      setError(err.message || "Network error during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm isSignup={true} onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      {successMessage && (
        <div className="absolute top-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <div className="absolute bottom-4 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
