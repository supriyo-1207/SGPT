import React from 'react';
import Title from '../components/CommonComponents/Title';
import Input from '../components/FormComponents/Input';
import Button from '../components/FormComponents/Button';
import Google from '../components/FormComponents/GoogleButton';
import FormFooter from '../components/FormComponents/FormFooter';
import {toast } from 'react-toastify';
function Register() {
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
  
      // Handle form submission
      const formData = new FormData(e.target);
  
      const name = formData.get('name');
      const email = formData.get('email');
      const gender = formData.get('gender');
      const password = formData.get('password');
  
      // Send the form data to the server
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, gender, email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        console.log(data);
        toast.success("Registration successful! Redirecting to login page...");
        window.location.href = '/';
      } else {
        console.error("Error:", data.message);
        toast.error(data.message); // Show actual error message
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };
  
  return (
    <>
      <Title titleName="Register" />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md border border-gray-300 bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            {/* <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            /> */}
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              Sign up to your account
            </h2>
          </div>

          <div className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input label="Full Name" type="text" name="name" id="name" autoComplete="name" required={true} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  id="gender"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Input label="Email address" type="email" name="email" id="email" autoComplete="email" required={true} />
              </div>

              <div>
                <Input label="Password" type="password" name="password" id="password" autoComplete="current-password" required={true} />
              </div>

              <div>
                <Button label="Sign up" type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" />
              </div>
            </form>

            <Google />

            <FormFooter message="Already have an account?" link="Sign in" url="/" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
