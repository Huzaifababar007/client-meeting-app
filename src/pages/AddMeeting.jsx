import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createMeeting, getAllClients } from '../services/api';

export default function AddMeeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    clientId: location.state?.clientId || '',
    dateTime: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    async function fetchClients() {
      try {
        const clientsData = await getAllClients();
        setClients(clientsData || []);
      } catch (e) {
        console.error('Failed to load clients', e);
      }
    }
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMeeting(formData);
      setSuccessMessage('Meeting created successfully ✅');
      setTimeout(() => {
        const fromPath = location.state?.from || '/dashboard';
        const activeMenu = location.state?.activeMenu || 'Meetings';
        if (fromPath === '/dashboard') {
          navigate('/dashboard', { state: { activeMenu } });
        } else {
          navigate(fromPath, { state: { activeMenu } });
        }
      }, 1500);
    } catch (e) {
      console.error('Create meeting failed', e);
      setSuccessMessage('❌ Failed to create meeting');
      setTimeout(() => setSuccessMessage(''), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-20 blur-sm"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-10 rounded-2xl w-full max-w-xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Schedule Meeting</h1>

        {successMessage && (
          <div className="mb-4 text-green-400 font-medium text-center">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Meeting Title"
              required
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Client</label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id} className="text-black">
                  {c.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location (e.g., Zoom, Office)"
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Agenda, goals, etc."
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
            Create Meeting
          </button>
        </form>

        <button onClick={() => navigate('/dashboard', { state: { activeMenu: 'Meetings' } })} className="mt-6 w-full text-indigo-400 hover:text-indigo-300 font-medium transition duration-300 underline text-sm">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}


