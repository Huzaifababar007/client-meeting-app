import { createContext, useContext, useState, useEffect } from 'react';
import { 
  setAuthToken, 
  getAuthToken, 
  getUserProfile, 
  logoutUser as authLogout 
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          setAuthToken(token);
          const result = await getUserProfile();
          if (result.success) {
            setUser(result.user);
          } else {
            // Token is invalid, clear it
            setAuthToken(null);
          }
        }
      } catch (error) {
        console.log('Auth initialization error:', error);
        // Clear any invalid tokens
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    // Initialize auth immediately
    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    authLogout();
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
