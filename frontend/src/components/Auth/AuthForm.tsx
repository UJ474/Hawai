import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthFormProps {
  isSignup: boolean;
  onSubmit: (data: { name?: string; email: string; password: string }) => void;
  isLoading: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignup, onSubmit, isLoading, error }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      onSubmit({ name, email, password });
    } else {
      onSubmit({ email, password });
    }
  };

  const inputClasses = "w-full bg-white border border-sky/30 rounded-xl py-3 px-11 text-indigo placeholder:text-rock/50 focus:outline-none focus:ring-2 focus:ring-tropical/20 focus:border-tropical transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses = "block text-sm font-semibold text-ocean mb-1.5 ml-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="bg-white border border-sky/20 p-8 rounded-3xl shadow-[0_8px_30px_rgb(11,60,93,0.05)]">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-ocean to-tropical bg-clip-text text-transparent">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-rock mt-2">
            {isSignup ? "Sign up to get started with Hawai" : "Sign in to your account to continue"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-coral/10 border border-coral/20 text-coral px-4 py-3 rounded-xl text-sm flex items-center gap-2 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-coral" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-5">
          {isSignup && (
            <div className="relative">
              <label htmlFor="name" className={labelClasses}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky" />
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className={inputClasses}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <label htmlFor="email" className={labelClasses}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky" />
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sky hover:text-tropical transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {!isSignup && (
          <div className="flex items-center justify-between mt-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-5 h-5 border border-sky rounded-md bg-white peer-checked:bg-tropical peer-checked:border-tropical transition-all" />
                <svg className="absolute w-3.5 h-3.5 text-white left-[3px] opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-rock group-hover:text-indigo transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-sm font-semibold text-tropical hover:text-ocean transition-colors">
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-coral hover:bg-sunset text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_12px_rgba(255,94,91,0.2)] hover:shadow-[0_4px_20px_rgba(255,94,91,0.3)] transition-all duration-200 mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isSignup ? "Creating Account..." : "Signing in..."}</span>
            </>
          ) : (
            <span>{isSignup ? "Create Account" : "Sign In"}</span>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default AuthForm;
