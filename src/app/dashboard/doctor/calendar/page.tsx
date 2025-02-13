import PageContainer from "../components/PageContainer";
import { FiUser, FiLock, FiBell, FiCreditCard } from "react-icons/fi";

export default function SettingsPage() {
  return (
    <PageContainer title="Settings">
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FiUser className="text-[#1F2937] text-xl" />
            <h2 className="text-xl font-semibold">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Name</span>
              <input
                type="text"
                defaultValue="Dr. Kim"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Email</span>
              <input
                type="email"
                defaultValue="dr.kim@clinic.com"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FiLock className="text-[#1F2937] text-xl" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-4">
              Change Password
            </button>
            <button className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-4">
              Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FiBell className="text-[#1F2937] text-xl" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FiCreditCard className="text-[#1F2937] text-xl" />
            <h2 className="text-xl font-semibold">Billing</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-4">
              Payment Methods
            </button>
            <button className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-4">
              Billing History
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}