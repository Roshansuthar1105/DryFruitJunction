// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const BACKEND_API=import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          // In a real app, you would verify the token with your backend
          const userData = JSON.parse(localStorage.getItem('user'))
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        toast.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BACKEND_API}/api/auth/login`, { email, password });
      toast.success("Logged In Successfully !")
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed' )
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };
  
  const register = async (userData) => {
    try {
      const response = await axios.post(`${BACKEND_API}/api/auth/register`, userData);
      toast.success("Sign In successfully")
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed' )
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
  const logout = () => {
    toast.success("Logged Out !")
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('sweetDelightsCart')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        BACKEND_API,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)