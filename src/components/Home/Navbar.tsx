"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BsCameraVideoFill, BsChatDots } from 'react-icons/bs';
import { Map } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
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
          {/* Existing links */}
          <Link href="/" className={`relative ${pathname === "/" ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}>
            Home
          </Link>
          <Link href="/service" className="text-gray-600 hover:text-teal-600">
            Service
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-teal-600">
            Contact Us
          </Link>
          <Link href="/help" className="text-gray-600 hover:text-teal-600">
            Help
          </Link>
          <Link href="/blogs" className="text-gray-600 hover:text-teal-600">
            Blogs
          </Link>
          <Link 
            href="/find-doctors" 
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Map className="h-5 w-5" />
            <span>Find Doctors</span>
          </Link>

          {/* Chat and Video icons - only show when logged in */}
          {isAuthenticated && (
            <>
              <Link 
                href="/zoom" 
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600"
              >
                <BsCameraVideoFill className="h-5 w-5" />
                <span>TeleConsult</span>
              </Link>
              <Link 
                href="#"
                onClick={handleChatClick}
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600"
              >
                <BsChatDots className="h-5 w-5" />
                <span>Messages</span>
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {getMenuItems()}
        </div>
      </div>
    </nav>
  );
}
