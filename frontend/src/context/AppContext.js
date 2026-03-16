import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

const BASE_URL = 'http://localhost:5000/api';

const apiCall = async (method, endpoint, body = null) => {
  const token = localStorage.getItem('titan_token');
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const AppProvider = ({ children }) => {
  const [toast,     setToast]     = useState({ show: false, message: '', type: 'success' });
  const [isAdmin,   setIsAdmin]   = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading,   setLoading]   = useState(false);

  // Toast
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  }, []);

  // Session restore on page refresh
  useEffect(() => {
    const token = localStorage.getItem('titan_token');
    const user  = localStorage.getItem('titan_user');
    if (token && user) {
      try {
        setIsAdmin(true);
        setAdminUser(JSON.parse(user));
      } catch {
        localStorage.removeItem('titan_token');
        localStorage.removeItem('titan_user');
      }
    }
  }, []);

  // Admin Login
  const adminLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiCall('POST', '/auth/login', { email, password });
      localStorage.setItem('titan_token', data.token);
      localStorage.setItem('titan_user', JSON.stringify(data.user));
      setIsAdmin(true);
      setAdminUser(data.user);
      showToast(`Welcome back, ${data.user.name}! 👋`);
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Login failed. Check credentials.', 'error');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Admin Logout
  const adminLogout = () => {
    localStorage.removeItem('titan_token');
    localStorage.removeItem('titan_user');
    setIsAdmin(false);
    setAdminUser(null);
    showToast('Logged out successfully');
  };

  // Contact Form Submit
  const submitContact = async (formData) => {
    try {
      const data = await apiCall('POST', '/contacts', formData);
      showToast(data.message || "✅ Message sent! We'll contact you within 24 hours.");
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Something went wrong', 'error');
      return { success: false };
    }
  };

  // Membership Enroll
  const enrollMembership = async (formData) => {
    try {
      const data = await apiCall('POST', '/memberships/enroll', formData);
      showToast(data.message || '🎉 Enrollment successful! Welcome to Titan!');
      return { success: true };
    } catch (err) {
      showToast(err.message || 'Enrollment failed', 'error');
      return { success: false };
    }
  };

  return (
    <AppContext.Provider value={{
      toast, showToast,
      isAdmin, adminUser, adminLogin, adminLogout,
      loading, setLoading,
      submitContact, enrollMembership,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;