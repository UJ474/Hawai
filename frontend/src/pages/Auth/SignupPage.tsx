import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthForm from "../../components/Auth/AuthForm";
import { authService } from "../../services/authService";
// import { useAuth } from "../../context/AuthContext";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  // const { login } = useAuth(); // Although signup doesn't directly log in, it might automatically log in after successful registration
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: { name?: string | undefined; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await authService.signup(data.name ?? "", data.email, data.password);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky/20 via-cloud to-tropical/10 p-6">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-tropical rounded-xl flex items-center justify-center shadow-lg shadow-tropical/20">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <h1 className="text-2xl font-bold text-ocean tracking-tight">Hawai</h1>
      </div>

      <AuthForm isSignup={true} onSubmit={handleSubmit} isLoading={isLoading} error={error} />

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed top-8 bg-palm/10 border border-palm/20 text-palm px-6 py-4 rounded-2xl shadow-xl shadow-palm/10 flex items-center gap-3"
            role="alert"
          >
            <div className="w-2 h-2 rounded-full bg-palm" />
            <span className="font-semibold">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-8 text-rock font-medium">
        Already have an account?{" "}
        <Link to="/login" className="text-tropical hover:text-ocean font-bold transition-colors">
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
