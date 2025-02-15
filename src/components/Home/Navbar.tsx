"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

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
          <Link
            href="/"
            className={`relative ${pathname === '/' ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
              }`}
          >
            Home
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${pathname === '/' ? 'scale-x-100' : 'scale-x-0'
              }`}></span>
          </Link>
          <Link
            href="/service"
            className="text-gray-600 hover:text-teal-600"
          >
            Service
          </Link>
          <Link
            href="/contact"
            className={`relative ${pathname === '/contact' ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
              }`}
          >
            Contact Us
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform origin-left transition-transform duration-300 ${pathname === '/contact' ? 'scale-x-100' : 'scale-x-0'
              }`}></span>
          </Link>
          <Link href="/help" className="text-gray-600 hover:text-teal-600">Help</Link>
          <Link href="/blogs" className="text-gray-600 hover:text-teal-600">Blogs</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/firstsign" className="text-teal-600 hover:text-teal-700">
            Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}
