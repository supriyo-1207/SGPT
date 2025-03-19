import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/CommonComponents/Title';
import Input from '../components/FormComponents/Input';
import Button from '../components/FormComponents/Button';
import Google from '../components/FormComponents/GoogleButton';
import FormFooter from '../components/FormComponents/FormFooter';
import { toast } from 'react-toastify';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');

      const response = await api.post('/login', {
        email,
        password
      });

      if (response.status === 200) {
        toast.success("Login successful!");
        navigate('/chat');
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        // Server responded with an error
        toast.error(error.response.data.message || 'Login failed');
        navigate('/register');
      } else if (error.request) {
        // Request was made but no response
        toast.error('No response from server. Please try again.');
      } else {
        // Error in request setup
        toast.error('Connection error. Please try again.');
      }
    }
  };

  return (
    <>
      <Title titleName="Login" />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md border border-gray-300 bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            {/* <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            /> */}
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  label="Email address" 
                  type="email" 
                  name="email" 
                  id="email" 
                  autoComplete="email" 
                  required={true} 
                />
              </div>

              <div>
                <Input 
                  label="Password" 
                  type="password" 
                  name="password" 
                  id="password" 
                  autoComplete="current-password" 
                  required={true} 
                />
              </div>

              <div>
                <Button 
                  label="Sign in" 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                />
              </div>
            </form>

            <Google />

            <FormFooter 
              message="Don't have an account?" 
              link="Sign up" 
              url="/Register" 
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;