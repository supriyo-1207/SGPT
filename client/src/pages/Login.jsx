import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Mic, History, Bot } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: 'http://localhost:3000', // Base URL for API requests
  withCredentials: true, // Include credentials (cookies) in requests
  headers: {
    'Content-Type': 'application/json' // Set default content type to JSON
  }
});

const Login = () => {
  // State variables to store email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();

  // Effect to check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a GET request to check authentication status
        const response = await api.get('/auth/check');
        if (response.status === 200) {
          // If authenticated, show a toast message and redirect to chat page
          toast.info("You are already logged in!");
          navigate('/chat');
        }
      } catch (error) {
        // If not authenticated, log the error and stay on the login page
        console.log("User not logged in, continue to login page.");
      }
    };

    checkAuth();
  }, [navigate]); // Dependency array ensures this effect runs only when `navigate` changes

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Make a POST request to the login endpoint with email and password
      const response = await api.post('/login', { email, password });
      if (response.status === 200) {
        // If login is successful, show a success toast and redirect to chat page
        toast.success("Login successful!");
        navigate('/chat');
      }
    } catch (error) {
      // Handle login errors
      console.error("Login error:", error);
      if (error.response) {
        // If the server responds with an error, display the error message
        toast.error(error.response.data.message || 'Login failed');
      } else {
        // If there's a connection error, display a generic error message
        toast.error('Connection error. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-xl p-8">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-600 ml-2">SGPT</h1>
          </div>
          <p className="text-gray-600">Chat with different AI models using text or voice</p>
        </div>

        {/* Email Input Field */}
        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <Lock className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right mt-2">
              < Link to="/forgot" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="mb-4">
          <button
            onClick={handleSubmit} // Attach the handleSubmit function to the button click
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center justify-center">
          <span className="border-b w-1/4"></span>
          <span className="text-sm text-gray-500 px-2">or</span>
          <span className="border-b w-1/4"></span>
        </div>

        {/* Continue with Google Button */}
        <div className="mb-6">
          <button
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer Section */}
        <div className="mt-8 border-t pt-6">
          <div className="text-center text-sm text-gray-600">
            <div className="flex justify-center space-x-6 mb-4">
              <div className="flex items-center">
                <Bot className="h-4 w-4 text-gray-500 mr-1" />
                <span>Multiple Models</span>
              </div>
              <div className="flex items-center">
                <Mic className="h-4 w-4 text-gray-500 mr-1" />
                <span>Voice Chat</span>
              </div>
              <div className="flex items-center">
                <History className="h-4 w-4 text-gray-500 mr-1" />
                <span>Chat History</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;