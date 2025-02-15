"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [role, setRole] = useState(null); // State to store the role
  const pathname = usePathname();
  const router = useRouter();

  // Menu items based on role
  const getMenuItems = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          <Link href="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
        </>
      );
    }

    if (user?.role === 'DOCTOR') {
      return (
        <>
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link href="/appointments" className="text-gray-700 hover:text-blue-600">Appointments</Link>
          <button onClick={logout} className="text-gray-700 hover:text-blue-600">Logout</button>
        </>
      );
    }

    return (
      <>
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link href="/find-doctors" className="text-gray-700 hover:text-blue-600">Find Doctors</Link>
        <button onClick={logout} className="text-gray-700 hover:text-blue-600">Logout</button>
      </>
    );
  };

  const handleChatClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Set cookie before navigation
    document.cookie = `token=${token}; path=/`;
    window.location.href = '/chat/roomId';
  };

  // Fetch the role from localStorage when the component mounts
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []); // Empty dependency array to run this once when the component mounts

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="https://i.pinimg.com/originals/2a/35/b1/2a35b15e65c10785fb21d0f7a63e1a72.jpg"
            alt="Healthcare Logo"
            width={100}
            height={100}
          />
          <span className="text-xl font-semibold">Healthcare</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {/* Conditionally render Home link */}
          <Link
            href="/"
            className={`relative ${
              pathname === "/"
                ? "text-teal-600"
                : "text-gray-600 hover:text-teal-600"
            }`}
          >
            Home
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${
                pathname === "/" ? "scale-x-100" : "scale-x-0"
              }`}
            ></span>
          </Link>

          {/* Conditionally render Service link */}
          <Link href="/service" className="text-gray-600 hover:text-teal-600">
            Service
          </Link>

          {/* Conditionally render Contact Us link */}
          <Link
            href="/contact"
            className={`relative ${
              pathname === "/contact"
                ? "text-teal-600"
                : "text-gray-600 hover:text-teal-600"
            }`}
          >
            Contact Us
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${
                pathname === "/contact" ? "scale-x-100" : "scale-x-0"
              }`}
            ></span>
          </Link>

          {/* Conditionally render Help and Blogs links */}
          <Link href="/help" className="text-gray-600 hover:text-teal-600">
            Help
          </Link>
          <Link href="/blogs" className="text-gray-600 hover:text-teal-600">
            Blogs
          </Link>
        </div>

        {/* Conditionally render different sections based on role */}
        <div className="flex items-center gap-4">
          {role === null ? ( // If no role is set (not logged in)
            <>
              <Link
                href="/signup"
                className="relative px-6 py-2 font-medium text-teal-600 rounded-lg group overflow-hidden"
              >
                <span className="relative z-10">Sign Up</span>
                <span className="absolute inset-0 w-0 h-full bg-teal-50 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/login"
                className="relative px-6 py-2 font-medium text-white bg-teal-600 rounded-lg group overflow-hidden hover:bg-teal-700 transition-all duration-300"
              >
                <span className="relative z-10">Log In</span>
                <span className="absolute inset-0 w-0 h-full bg-teal-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          ) : role === "Doctor" ? ( // If role is doctor
            <Link
              href="/dashboard"
              className="relative px-6 py-2 font-medium text-teal-600 rounded-lg group overflow-hidden"
            >
              <span className="relative z-10">Work</span>
              <span className="absolute inset-0 w-0 h-full bg-teal-50 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ) : role === "Patient" ? ( // If role is patient
            <Link
              href="/dashboard"
              className="relative px-6 py-2 font-medium text-teal-600 rounded-lg group overflow-hidden"
            >
              <span className="relative z-10">Find Doctor</span>
              <span className="absolute inset-0 w-0 h-full bg-teal-50 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
