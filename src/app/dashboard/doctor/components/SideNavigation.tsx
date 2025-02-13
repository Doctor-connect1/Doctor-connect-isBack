import { IconType } from "react-icons";
import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiClock,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";

interface NavItem {
  icon: IconType;
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: FiGrid, href: "/dashboard", label: "Dashboard" },
  { icon: FiCalendar, href: "/dashboard/calendar", label: "Calendar" },
  { icon: FiUsers, href: "/dashboard/patients", label: "Patients" },
  { icon: FiClock, href: "/dashboard/history", label: "History" },
  { icon: FiSettings, href: "/dashboard/settings", label: "Settings" },
];

const SideNavigation = () => {
  return (
    <nav className="fixed left-0 h-screen w-32 flex flex-col items-center py-8">
      <div className="flex flex-col items-center gap-8 h-full">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#007E85] text-xl">+</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-6">
          {navItems.map((item, index) => (
            <NavButton
              key={item.href}
              icon={item.icon}
              href={item.href}
              label={item.label}
              isActive={index === 0} // Temporarily set first item as active
            />
          ))}
        </div>

        {/* Logout Button at Bottom */}
        <div className="mt-auto">
          <NavButton
            icon={FiLogOut}
            href="/logout"
            label="Logout"
            isActive={false}
          />
        </div>
      </div>
    </nav>
  );
};

interface NavButtonProps {
  icon: IconType;
  href: string;
  label: string;
  isActive?: boolean;
}

const NavButton = ({ icon: Icon, href, label, isActive }: NavButtonProps) => {
  return (
    <Link href={href}>
      <div className="group relative flex items-center">
        <div
          className={`p-3 rounded-xl transition-colors ${
            isActive
              ? "bg-white text-[#007E85]"
              : "text-white hover:bg-white/10"
          }`}
        >
          <Icon size={20} />
        </div>

        {/* Tooltip */}
        <div className="absolute left-16 hidden group-hover:block bg-white px-2 py-1 rounded-md shadow-md">
          <span className="text-sm text-[#007E85]">{label}</span>
        </div>
      </div>
    </Link>
  );
};

export default SideNavigation;
