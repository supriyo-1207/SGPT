import React from 'react';
import Title from '../components/CommonComponents/Title';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Home, ArrowLeft, HelpCircle } from 'lucide-react';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/chat');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <Title titleName="Page Not Found" />
      <div className="flex h-screen bg-gray-100">
        <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center mb-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-blue-600 ml-2">SGPT</h1>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-6xl font-bold text-gray-800 mb-4">404</h2>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h3>
            <p className="text-gray-600 mb-6">
              Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleGoHome}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </button>
              <button
                onClick={handleGoBack}
                className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 mb-3">Need assistance?</p>
            <Link to="/contact" className="inline-flex items-center text-blue-600 hover:underline">
              <HelpCircle className="h-4 w-4 mr-1" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;