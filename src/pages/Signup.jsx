import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const result = await registerUser(formData.fullName, formData.email, formData.password);
    
    if (result.success) {
      login(result.user);
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blur Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-20 blur-sm"></div>

      {/* Sign Up Form Box */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-10 rounded-2xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
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
