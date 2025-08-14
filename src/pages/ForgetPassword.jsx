import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await forgotPassword(email);
    
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blur Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-20 blur-sm"></div>

      {/* Reset Password Box */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-10 rounded-2xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Forgot Password</h1>

        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-md text-center mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-400">
          Remember your password?{" "}
          <span
            className="text-indigo-400 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
