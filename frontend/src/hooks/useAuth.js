import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// import bcrypt from 'bcryptjs';

const useAuth = () => {
  const [user, setUser] = useState(null);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      console.error("Login error:", error.response?.data);  // ✅ See the backend's actual error
      toast.error(error.response?.data?.message || 'Login failed ❌');
      throw error;
    }
  };
  
  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { name, email, password });
      const { user } = response.data;
      
      // Set the user state after registration
      setUser(user);
      
      toast.success('Registration Successful 🎉');
      return user;
    } catch (error) {
      toast.error('Registration failed ❌');
      throw error; // Rethrow to handle it in the calling component
    }
  };

  // Logout function
  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully 👍');
  };

  return {
    user,
    login,
    register,
    logout,
  };
};

export default useAuth;
