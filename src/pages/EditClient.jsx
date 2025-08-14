import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getClientById, updateClientById } from "../services/api";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getClientById(id);
        const client = response;
        if (client) {
          setFormData({
            fullName: client.fullName || "",
            email: client.email || "",
            phone: client.phone || "",
            address: client.address || "",
          });
        }
      } catch (err) {
        console.error("Error fetching client:", err);
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClientById(id, formData);
      setSuccessMessage("Client updated successfully ✅");
      
      setTimeout(() => {
        // Navigate back to the appropriate location
        const fromPath = location.state?.from || "/dashboard/clients";
        const activeMenu = location.state?.activeMenu || "Clients";
        
        if (fromPath === "/dashboard/clients") {
          navigate("/dashboard", { state: { activeMenu } });
        } else {
          navigate(fromPath, { state: { activeMenu } });
        }
      }, 2000);
    } catch (err) {
      console.error("Error updating client:", err);
      setSuccessMessage("❌ Failed to update client.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleBack = () => {
    const fromPath = location.state?.from || "/dashboard/clients";
    const activeMenu = location.state?.activeMenu || "Clients";
    
    if (fromPath === "/dashboard/clients") {
      navigate("/dashboard", { state: { activeMenu } });
    } else {
      navigate(fromPath, { state: { activeMenu } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Image Blur */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-20 blur-sm"></div>

      {/* Glassmorphic Form Card */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-10 rounded-2xl w-full max-w-xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Client</h1>

        {successMessage && (
          <div className="mb-4 text-green-400 font-medium text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Client Name"
              required
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Client Email"
              required
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Client Phone"
              required
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Client Address"
              required
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Update Client
          </button>
        </form>

        <button
          onClick={handleBack}
          className="mt-6 w-full text-indigo-400 hover:text-indigo-300 font-medium transition duration-300 underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}