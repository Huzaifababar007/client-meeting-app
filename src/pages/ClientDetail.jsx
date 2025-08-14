import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getClientById } from "../services/api";
import { getAllMeetings } from "../services/api";
import { formatDateTime } from "../utils/formatDate";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [client, setClient] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientData, meetingsData] = await Promise.all([
          getClientById(id),
          getAllMeetings()
        ]);
        
        setClient({
          fullName: clientData?.fullName || clientData?.name || "",
          email: clientData?.email || "",
          phone: clientData?.phone || "",
          address: clientData?.address || clientData?.company || "",
        });
        
        // Filter meetings for this client
        const clientMeetings = meetingsData.filter(m => 
          m.clientId?._id === id || m.clientId === id
        );
        setMeetings(clientMeetings);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/dashboard/clients/edit/${id}`, { 
      state: { 
        from: location.state?.from || "/dashboard/clients",
        activeMenu: location.state?.activeMenu || "Clients"
      } 
    });
  };

  const handleBack = () => {
    navigate(location.state?.from || "/dashboard/clients", {
      state: { activeMenu: location.state?.activeMenu || "Clients" }
    });
  };

  const handleAddMeeting = () => {
    navigate(`/dashboard/meetings/add`, {
      state: { 
        clientId: id,
        from: `/dashboard/clients/${id}`,
        activeMenu: location.state?.activeMenu || "Clients"
      }
    });
  };

  const handleEditMeeting = (meetingId) => {
    navigate(`/dashboard/meetings/edit/${meetingId}`, {
      state: { 
        from: `/dashboard/clients/${id}`,
        activeMenu: location.state?.activeMenu || "Clients"
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-20 blur-sm"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-10 rounded-2xl w-full max-w-4xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Client Details</h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-white/70">Loading...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
                <div className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20">
                  {client.fullName}
                </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
                <div className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20">
                  {client.email}
                </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone</label>
                <div className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20">
                  {client.phone}
                </div>
          </div>

          <div>
                <label className="block text-sm text-gray-300 mb-1">Company/Address</label>
                <div className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20">
                  {client.address}
                </div>
              </div>
            </div>

            {/* Meetings Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Meetings ({meetings.length})</h2>
                <button
                  onClick={handleAddMeeting}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
                >
                  ➕ Add Meeting
                </button>
              </div>

              {meetings.length === 0 ? (
                <p className="text-white/70 text-center py-4">No meetings scheduled for this client.</p>
              ) : (
                <div className="space-y-3">
                  {meetings
                    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
                    .map((meeting) => (
                      <div key={meeting._id} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{meeting.title}</h3>
                            <p className="text-xs text-white/70">{formatDateTime(meeting.dateTime)}</p>
                            {meeting.location && (
                              <p className="text-xs text-white/60">📍 {meeting.location}</p>
                            )}
                            {meeting.notes && (
                              <p className="text-xs text-white/60 mt-1">{meeting.notes}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleEditMeeting(meeting._id)}
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-xs ml-2"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
          </div>

            <div className="flex justify-between pt-4">
            <button
              type="button"
                onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Back
            </button>

            <button
                type="button"
                onClick={handleEdit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
                Edit Client
            </button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
