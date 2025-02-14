"use client";

import Link from "next/link";
import { BsCameraVideoFill, BsChatDots } from 'react-icons/bs';
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/doctors", label: "Doctors" },
    { href: "/contact", label: "Contact" },
    { 
      href: "/zoom", 
      label: "TeleConsult",
      icon: <BsCameraVideoFill className="h-5 w-5" />
    },
    {
      href: "/chat",
      label: "Messages",
      icon: <BsChatDots className="h-5 w-5" />
    },
  ];

  return (
    <div className="w-full h-[90px] bg-white">
      <div className="max-w-[1240px] mx-auto px-4 flex justify-between items-center h-full">
        <div>
          <h1 className="text-[#007E85] font-bold text-3xl">Doctor</h1>
        </div>
        <div className="hidden md:flex">
          <ul className="flex gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-black hover:text-[#007E85] duration-300"
                >
                  {item.icon && item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Button */}
        <div onClick={handleNav} className="block md:hidden">
          {nav ? (
            <AiOutlineClose size={30} className="text-black" />
          ) : (
            <AiOutlineMenu size={30} className="text-black" />
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={
            nav
              ? "md:hidden fixed left-0 top-[90px] flex flex-col items-center justify-between w-full h-[calc(100vh-90px)] bg-white ease-in duration-300 z-40"
              : "fixed left-[-100%] top-[90px] h-[calc(100vh-90px)] flex flex-col items-center justify-between ease-in duration-300"
          }
        >
          <ul className="w-full p-4">
            {navItems.map((item) => (
              <li key={item.href} className="py-4 hover:bg-gray-100">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 ml-4 text-black hover:text-[#007E85] duration-300"
                >
                  {item.icon && item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
