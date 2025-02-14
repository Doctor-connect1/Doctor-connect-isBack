// components/LoginForm.js
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const LoginForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            if (!response.ok) {
                throw new Error(data.message);
            }
            // Redirect to dashboard or home page
            router.push('/');

        } catch (error: any) {
            setError(error.message);
        }
    };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value,
    //     });
    // };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
                <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                Email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email"
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                Password:
                            </label>
                            <input
                                id="password"
                                type="password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                                className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://via.placeholder.com/600x800')" }}>
            </div>
        </div>
    );
};

export default LoginForm;
