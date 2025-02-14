'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'Patient' // or 'Doctor'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Redirect to dashboard or home page
      router.push('/');

    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-6xl">
        {/* Left side with Image */}
        <div className="hidden lg:block w-1/2 rounded-l">
          <img
            src="https://images.pexels.com/photos/5207095/pexels-photo-5207095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Replace this with a relevant image URL
            alt="Medical Theme"
            className="w-full h-full h-25"
          />
        </div>

        {/* Right side with Form */}
        <div className="w-full lg:w-1/2 p-8 bg-white rounded-r-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Sign up for an account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>
              <div>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>
              <div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="Username"
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                />
              </div>
              <div>
                <select
                  name="role"
                  required
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
                >
                  <option value="">Select Role</option>
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00897B] hover:bg-[#007F6A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00897B]"
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Link to login page */}
          <div className="mt-4 text-center">
            <p>
              Already have an account?{' '}
              <a href="/login" className="text-[#00897B] hover:text-[#007F6A] font-medium">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
