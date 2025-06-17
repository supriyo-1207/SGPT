import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use Link for navigation
import { Mail, Lock, User, Mic, History, Bot, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

//  Define API instance to handle requests with cookies
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Ensures cookies are sent
  headers: { 'Content-Type': 'application/json' }
});

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('signup'); // 'signup', 'verification'
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate(); // Use React Router for navigation

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/check'); //  API call
        if (response.status === 200) {
          toast.info("You are already logged in!");
          navigate('/chat'); // Redirect if authenticated
        }
      } catch (error) {
        console.log("User not logged in, continue to registration page.");
      }
    };

    checkAuth();
  }, [navigate]);

  //  Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      //  Send the form data to the server
      const response = await api.post('/register', {
        fullName,
        email,
        password,
        confirmPassword
      });

      if (response.status === 201) {
        toast.success("Registration successful! Please verify your email.");
        setStep('verification'); // Move to verification step
        startCountdown(); // Start countdown for resend button
      } else {
        toast.error(response.data.message); // Show actual error message
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  //  Handle resend verification email
  const handleResendVerification = () => {
    if (countdown > 0) return;

    setIsResending(true);
    //  Call API to resend verification email
    api.post('/resend-verification', { email })
      .then(() => {
        toast.success("Verification email resent!");
        startCountdown();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to resend email.");
      })
      .finally(() => {
        setIsResending(false);
      });
  };

  //  Start countdown for resend button
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  //  Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      // Verify the code with the server
      const response = await api.post('/verify-email', { email, code: verificationCode });
      if (response.status === 200) {
        toast.success("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate('/'); // Redirect to login page
        }, 2000);
      } else {
        toast.error(response.data.message); // Show actual error message
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Invalid verification code. Please try again.");
    }
  };

  // Sign up form
  if (step === 'signup') {
    return (
      <div className="flex  bg-gray-100">
        <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-blue-600 ml-2">SGPT</h1>
            </div>
            <p className="text-gray-600">Create your account to start chatting</p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="w-full focus:outline-none"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
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
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full focus:outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mb-6 flex items-center justify-center">
            <span className="border-b w-1/4"></span>
            <span className="text-sm text-gray-500 px-2">or</span>
            <span className="border-b w-1/4"></span>
          </div>

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
              Sign up with Google
            </button>
          </div>

          <div className="mb-4 text-sm">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
              <p className="text-gray-600">
                By creating an account, you agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

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
  }

  // Email verification form
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-xl p-8">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-600 ml-2">SGPT</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-sm text-blue-700">
              Please check your inbox and enter the verification code below to complete your registration.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyCode}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verificationCode">
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Verify Email
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendVerification}
            disabled={countdown > 0 || isResending}
            className={`flex items-center justify-center mx-auto text-sm ${
              countdown > 0 || isResending ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
            }`}
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend code in ${countdown}s`
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Resend verification code
              </>
            )}
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setStep('signup')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;