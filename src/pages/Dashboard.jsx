import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDateTime } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();

  // Preserve active menu when coming back from EditClient
  const [activeMenu, setActiveMenu] = useState(location.state?.activeMenu || "Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Settings state with localStorage persistence
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('profileData');
    return saved ? JSON.parse(saved) : {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      profilePicture: user?.profilePicture || ""
    };
  });
  
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      meetingReminders: true,
      newClientAlerts: true,
      emailNotifications: false
    };
  });
  
  const [appPreferences, setAppPreferences] = useState(() => {
    const saved = localStorage.getItem('appPreferences');
    return saved ? JSON.parse(saved) : {
      defaultMeetingDuration: "60",
      timeZone: "UTC+5",
      dateFormat: "MM/DD/YYYY"
    };
  });
  
  const [settingsMessage, setSettingsMessage] = useState("");

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePicture: user.profilePicture || ""
      }));
    }
  }, [user]);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [clientsRes, meetingsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/clients"),
          axios.get("http://localhost:5000/api/meetings")
        ]);
        setClients(clientsRes.data || []);
        setMeetings(meetingsRes.data || []);
        } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load data.");
        } finally {
          setLoading(false);
        }
      };
    fetchInitialData();
  }, []);

  // Remove the data fetching useEffect since we load all data initially

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setClients(clients.filter((client) => client._id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
      setError("Failed to delete client.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/clients/${id}`, { state: { activeMenu } });
  };


  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem('profileData', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => {
      const updated = {
        ...prev,
        [setting]: !prev[setting]
      };
      localStorage.setItem('notificationSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAppPreferenceChange = (e) => {
    const { name, value } = e.target;
    setAppPreferences(prev => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem('appPreferences', JSON.stringify(updated));
      return updated;
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => {
          const updated = {
            ...prev,
            profilePicture: e.target.result
          };
          localStorage.setItem('profileData', JSON.stringify(updated));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    setSettingsMessage("Updating profile...");
    
    const result = await updateUserProfile(profileData);
    
    if (result.success) {
      setSettingsMessage("Profile updated successfully ✅");
      updateUser(result.user);
      // Update localStorage with new user data
      localStorage.setItem('profileData', JSON.stringify(result.user));
    } else {
      setSettingsMessage(`❌ ${result.error}`);
    }
    
    setTimeout(() => setSettingsMessage(""), 3000);
  };

  const handleChangePassword = () => {
    setSettingsMessage("Password change feature coming soon!");
    setTimeout(() => setSettingsMessage(""), 3000);
  };

  const handleExportData = () => {
    setSettingsMessage("Data export feature coming soon!");
    setTimeout(() => setSettingsMessage(""), 3000);
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      setSettingsMessage("Account deletion feature coming soon!");
      setTimeout(() => setSettingsMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-20 blur-sm"></div>

      <aside
        className={`z-20 w-64 bg-white/10 backdrop-blur-md border-r border-white/10 p-6 flex flex-col space-y-6 transform transition-transform duration-300
        fixed top-0 bottom-0 left-0 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center mt-4">
           <div className="relative">
          <img
               src={profileData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=random&color=fff&size=80`}
            alt="User"
               className="w-20 h-20 rounded-full border-2 border-white mb-3 object-cover"
             />
             {activeMenu === "Settings" && (
               <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-full cursor-pointer transition duration-300">
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleProfilePictureChange}
                   className="hidden"
                 />
                 📷
               </label>
             )}
           </div>
           <h2 className="text-lg font-semibold">{user?.fullName || profileData.fullName}</h2>
           <p className="text-gray-300 text-sm">{user?.email || profileData.email}</p>
        </div>

        <nav className="flex-1 flex flex-col gap-3 mt-6">
          {["Home", "Clients", "Meetings", "Settings"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveMenu(item)}
              className={`text-left px-4 py-2 rounded-lg font-medium transition duration-300 ${
                activeMenu === item
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </aside>

      <button
        className="absolute top-4 left-4 z-30 md:hidden bg-indigo-600 px-4 py-2 rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Close" : "Menu"}
      </button>

      <main className="flex-1 p-6 md:ml-64 relative z-10 overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6">{activeMenu}</h1>

          {activeMenu === "Home" && (
            <>
              {/* Home Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <div className="bg-indigo-600 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
                  <h2 className="text-xl font-semibold mb-2">Total Clients</h2>
                  <p className="text-3xl font-bold">{clients.length}</p>
                   <p className="text-sm text-white/80 mt-1">Active clients</p>
                </div>

                 <div className="bg-green-600 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Meetings Scheduled
                  </h2>
                   <p className="text-3xl font-bold">{meetings.length}</p>
                   <p className="text-sm text-white/80 mt-1">Total meetings</p>
                </div>

                 <div className="bg-yellow-500 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Profile Completion
                  </h2>
                  <div className="w-full bg-white/20 rounded-full h-2.5 mt-2">
                    <div className="bg-white h-2.5 rounded-full w-[85%]"></div>
                  </div>
                  <p className="text-sm mt-2">85% completed</p>
                </div>
              </div>

               {/* Quick Actions */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-white/10 p-6 rounded-2xl">
                   <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                   <div className="space-y-3">
                     <button 
                       onClick={() => navigate("/dashboard/clients/add")}
                       className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition duration-300 flex items-center justify-between"
                     >
                       <span>➕ Add New Client</span>
                       <span>→</span>
                     </button>
                     <button 
                       onClick={() => navigate("/dashboard/meetings/add")}
                       className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition duration-300 flex items-center justify-between"
                     >
                       <span>📅 Schedule Meeting</span>
                       <span>→</span>
                     </button>
                     <button 
                       onClick={() => setActiveMenu("Settings")}
                       className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition duration-300 flex items-center justify-between"
                     >
                       <span>⚙️ Update Profile</span>
                       <span>→</span>
                     </button>
                   </div>
                 </div>

                 <div className="bg-white/10 p-6 rounded-2xl">
                   <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
                   {meetings.length > 0 ? (
                     <div className="space-y-3">
                       {meetings
                         .filter(meeting => new Date(meeting.dateTime) > new Date())
                         .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
                         .slice(0, 3)
                         .map((meeting) => (
                           <div key={meeting._id} className="bg-white/5 p-3 rounded-lg">
                             <p className="font-semibold text-sm">{meeting.title}</p>
                             <p className="text-xs text-white/70">{meeting.clientId?.fullName || 'Unknown Client'}</p>
                             <p className="text-xs text-white/60">{formatDateTime(meeting.dateTime)}</p>
                           </div>
                         ))}
                     </div>
                   ) : (
                     <p className="text-white/70 text-sm">No upcoming meetings</p>
                   )}
                 </div>
               </div>

               {/* Recent Activity */}
              <div className="bg-white/10 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                 <div className="space-y-3">
                   {clients.length > 0 && (
                     <div className="flex items-center space-x-3 text-white/80 text-sm">
                       <span className="text-green-400">✅</span>
                       <span>Latest client: <strong>{clients[clients.length - 1]?.fullName}</strong> added</span>
                     </div>
                   )}
                   {meetings.length > 0 && (
                     <div className="flex items-center space-x-3 text-white/80 text-sm">
                       <span className="text-blue-400">📅</span>
                       <span>Latest meeting: <strong>{meetings[meetings.length - 1]?.title}</strong> scheduled</span>
                     </div>
                   )}
                   <div className="flex items-center space-x-3 text-white/80 text-sm">
                     <span className="text-yellow-400">⚠️</span>
                     <span>Profile completion: <strong>{profileData.phone ? 'Complete' : 'Phone number missing'}</strong></span>
                   </div>
                   <div className="flex items-center space-x-3 text-white/80 text-sm">
                     <span className="text-purple-400">📊</span>
                     <span>Dashboard last updated: <strong>{new Date().toLocaleDateString()}</strong></span>
                   </div>
                 </div>
               </div>

               {/* Statistics */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                 <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl">
                   <h3 className="text-lg font-semibold mb-2">Client Growth</h3>
                   <p className="text-2xl font-bold">{clients.length}</p>
                   <p className="text-sm text-blue-100">Total clients</p>
                 </div>
                 <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl">
                   <h3 className="text-lg font-semibold mb-2">Meeting Efficiency</h3>
                   <p className="text-2xl font-bold">{meetings.length}</p>
                   <p className="text-sm text-green-100">Scheduled meetings</p>
                 </div>
                 <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl">
                   <h3 className="text-lg font-semibold mb-2">System Status</h3>
                   <p className="text-2xl font-bold">Online</p>
                   <p className="text-sm text-purple-100">All systems operational</p>
                 </div>
              </div>
            </>
          )}

          {activeMenu === "Clients" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Client List</h2>
                <button
                  onClick={() => navigate("/dashboard/clients/add")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
                >
                  ➕ Add New Client
                </button>
              </div>

               {/* Search/Filter */}
               <div className="flex gap-4">
                 <div className="flex-1">
                   <input
                     type="text"
                     placeholder="Search clients by name, email, or company..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   />
                 </div>
                 <button
                   onClick={() => {
                     const csvContent = "data:text/csv;charset=utf-8," + 
                       "Name,Email,Company,Phone,Meetings,Last Meeting\n" +
                       filteredClients.map(client => {
                         const clientMeetings = meetings.filter(m => m.clientId?._id === client._id || m.clientId === client._id);
                         const lastMeeting = clientMeetings.length > 0 
                           ? clientMeetings.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))[0]
                           : null;
                         return `"${client.fullName}","${client.email}","${client.company || ''}","${client.phone || ''}","${clientMeetings.length}","${lastMeeting ? formatDateTime(lastMeeting.dateTime) : 'None'}"`;
                       }).join("\n");
                     const encodedUri = encodeURI(csvContent);
                     const link = document.createElement("a");
                     link.setAttribute("href", encodedUri);
                     link.setAttribute("download", "clients.csv");
                     document.body.appendChild(link);
                     link.click();
                     document.body.removeChild(link);
                   }}
                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
                 >
                   📊 Export CSV
                 </button>
               </div>

              {loading && <p className="text-white/70">Loading clients...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {!loading && clients.length === 0 && (
                <p className="text-white/70">No clients found.</p>
              )}

                             {/* Filter clients based on search term */}
               {(() => {
                 const filteredClients = clients.filter(client =>
                   client.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   client.company?.toLowerCase().includes(searchTerm.toLowerCase())
                 );

                 return (
              <ul className="space-y-4">
                     {filteredClients.map((client) => {
                   const clientMeetings = meetings.filter(m => m.clientId?._id === client._id || m.clientId === client._id);
                   const lastMeeting = clientMeetings.length > 0 
                     ? clientMeetings.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))[0]
                     : null;
                   
                   return (
                  <li
                    key={client._id}
                    className="bg-white/10 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between"
                  >
                       <div className="flex-1">
                      <p className="font-semibold">{client.fullName}</p>
                      <p className="text-sm text-white/70">{client.email}</p>
                         <p className="text-sm text-white/60">{client.company || 'No company'}</p>
                         <div className="flex items-center space-x-4 mt-2 text-xs text-white/50">
                           <span>📅 {clientMeetings.length} meetings</span>
                           {lastMeeting && (
                             <span>Last: {formatDateTime(lastMeeting.dateTime)}</span>
                           )}
                         </div>
                    </div>
                    <div className="flex space-x-2 mt-3 md:mt-0">
                      <button
                        onClick={() => handleEdit(client._id)}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                         <button
                           onClick={() => navigate(`/dashboard/clients/${client._id}`, { state: { activeMenu } })}
                           className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-md text-sm"
                         >
                           View
                         </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                   );
                 })}
              </ul>
                 );
               })()}
            </div>
          )}

          {activeMenu === "Meetings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Meetings</h2>
                <button
                  onClick={() => navigate("/dashboard/meetings/add")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
                >
                  ➕ Schedule Meeting
                </button>
              </div>

              {loading && <p className="text-white/70">Loading meetings...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && meetings.length === 0 && (
                <p className="text-white/70">No meetings found.</p>
              )}

              <ul className="space-y-4">
                {meetings.map((m) => (
                  <li key={m._id} className="bg-white/10 p-4 rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <p className="font-semibold">{m.title}</p>
                        <p className="text-sm text-white/70">{m.clientId?.fullName || m.clientId}</p>
                        <p className="text-sm text-white/70">{formatDateTime(m.dateTime)}</p>
                        {m.location && <p className="text-sm text-white/60">{m.location}</p>}
                      </div>
                      <div className="flex space-x-2 mt-3 md:mt-0">
                        <button
                          onClick={() => navigate(`/dashboard/meetings/edit/${m._id}`)}
                          className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await axios.delete(`http://localhost:5000/api/meetings/${m._id}`);
                              setMeetings((prev) => prev.filter((x) => x._id !== m._id));
                            } catch (e) {
                              console.error('Delete meeting failed', e);
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>) )}
              </ul>
            </div>
          )}

          {activeMenu === "Settings" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Settings</h2>
              
              {settingsMessage && (
                <div className="bg-green-600/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-md text-center">
                  {settingsMessage}
                </div>
              )}
              
              {/* Profile Settings */}
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button 
                    onClick={handleUpdateProfile}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-300"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Meeting Reminders</p>
                      <p className="text-sm text-gray-300">Get notified before meetings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.meetingReminders}
                        onChange={() => handleNotificationChange('meetingReminders')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Client Alerts</p>
                      <p className="text-sm text-gray-300">Notifications when clients are added</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.newClientAlerts}
                        onChange={() => handleNotificationChange('newClientAlerts')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-300">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* App Preferences */}
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
            <div className="space-y-4">
                                     <div>
                     <label className="block text-sm text-gray-300 mb-1">Default Meeting Duration</label>
                     <select 
                       name="defaultMeetingDuration"
                       value={appPreferences.defaultMeetingDuration}
                       onChange={handleAppPreferenceChange}
                       className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     >
                       <option value="30" className="bg-gray-800 text-white">30 minutes</option>
                       <option value="60" className="bg-gray-800 text-white">1 hour</option>
                       <option value="90" className="bg-gray-800 text-white">1.5 hours</option>
                       <option value="120" className="bg-gray-800 text-white">2 hours</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm text-gray-300 mb-1">Time Zone</label>
                     <select 
                       name="timeZone"
                       value={appPreferences.timeZone}
                       onChange={handleAppPreferenceChange}
                       className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     >
                       <option value="UTC-5" className="bg-gray-800 text-white">Eastern Time (UTC-5)</option>
                       <option value="UTC-6" className="bg-gray-800 text-white">Central Time (UTC-6)</option>
                       <option value="UTC-7" className="bg-gray-800 text-white">Mountain Time (UTC-7)</option>
                       <option value="UTC-8" className="bg-gray-800 text-white">Pacific Time (UTC-8)</option>
                       <option value="UTC+0" className="bg-gray-800 text-white">UTC</option>
                       <option value="UTC+1" className="bg-gray-800 text-white">Central European Time (UTC+1)</option>
                       <option value="UTC+5" className="bg-gray-800 text-white">Pakistan Time (UTC+5)</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm text-gray-300 mb-1">Date Format</label>
                     <select 
                       name="dateFormat"
                       value={appPreferences.dateFormat}
                       onChange={handleAppPreferenceChange}
                       className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     >
                       <option value="MM/DD/YYYY" className="bg-gray-800 text-white">MM/DD/YYYY</option>
                       <option value="DD/MM/YYYY" className="bg-gray-800 text-white">DD/MM/YYYY</option>
                       <option value="YYYY-MM-DD" className="bg-gray-800 text-white">YYYY-MM-DD</option>
                     </select>
                   </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={handleChangePassword}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition duration-300"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={handleExportData}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                  >
                    Export Data
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
