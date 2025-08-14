import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllClients, deleteClientById } from "../services/api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getAllClients();
        setClients(clientsData || []);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/dashboard/clients/${id}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/dashboard/clients/edit/${id}`); // ✅ Updated route
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;

    try {
      await deleteClientById(id);
      setClients((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete client.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-8 py-6 relative overflow-hidden">
      {/* Background blur image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-20 blur-sm"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Clients</h2>
          <button
            onClick={() => navigate("/dashboard/clients/add")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            ➕ Add New Client
          </button>
        </div>

        {loading && <p className="text-gray-300">Loading clients...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && clients.length === 0 && (
          <p className="text-gray-300">No clients found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client._id}
              role="button"
              onClick={() => handleCardClick(client._id)}
              className="cursor-pointer hover:shadow-xl transition-shadow bg-white/5 border border-white/10 text-white p-4 rounded-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">{client.fullName}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleEdit(e, client._id)}
                    className="text-blue-400 hover:text-blue-500"
                    title="Edit"
                  >
                    📝
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, client._id)}
                    className="text-red-400 hover:text-red-500"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div>
                <p className="text-gray-300">{client.email}</p>
                <p className="text-gray-400">{client.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
