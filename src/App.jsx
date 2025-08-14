import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import AddClient from './pages/AddClient';
import EditClient from './pages/EditClient';
import AddMeeting from './pages/AddMeeting';
import EditMeeting from './pages/EditMeeting';

// Simple test component
const TestComponent = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">React is Working! 🎉</h1>
      <p className="text-xl">If you can see this, React is rendering properly.</p>
      <a href="/" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
        Go to Login Page
      </a>
    </div>
  </div>
);

// Simple fallback component
const FallbackComponent = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Loading...</h1>
      <p className="text-xl">Please wait while the application loads.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/test" element={<TestComponent />} />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/meetings/add" element={
              <ProtectedRoute>
                <AddMeeting />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/meetings/edit/:id" element={
              <ProtectedRoute>
                <EditMeeting />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } /> 
            <Route path="/dashboard/clients/add" element={
              <ProtectedRoute>
                <AddClient />
              </ProtectedRoute>
            } />        
            <Route path="/dashboard/clients/edit/:id" element={
              <ProtectedRoute>
                <EditClient />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/clients/:id" element={
              <ProtectedRoute>
                <ClientDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={<FallbackComponent />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}
