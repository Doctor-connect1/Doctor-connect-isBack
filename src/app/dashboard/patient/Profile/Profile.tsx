'use client';

import { useState } from 'react';
import { User, Heart, Activity, Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ProfileProps {
  updateProfile: (data: {
    name?: string;
    height?: string;
    weight?: string;
  }) => void;
  initialData: {
    name: string;
    height: string;
    weight: string;
  };
}

export default function Profile({ updateProfile, initialData }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    height: initialData?.height || '',
    weight: initialData?.weight || '',
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <nav className="mt-6">
          <ul>
            <li className="py-3 px-4 mt-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
              <Link href="/dashboard/patient/Profile">Profile</Link>
            </li>
            <li className="py-3 px-4 mt-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
              <Link href="/dashboard/patient/appointments">Appointments</Link>
            </li>
            <li className="py-3 px-4 mt-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
              <Link href="/dashboard/patient/medical-history">Medical History</Link>
            </li>
            <li className="py-3 px-4 mt-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
              <Link href="/dashboard/patient/Prescriptions">Prescriptions</Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full md:w-3/4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center">
              <User className="h-6 w-6 text-blue-600" />
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-500">Name</p>
                {isEditing ? (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                  />
                ) : (
                  <p className="font-medium">{formData.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Activity className="h-6 w-6 text-blue-600" />
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-500">Height</p>
                {isEditing ? (
                  <input
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                  />
                ) : (
                  <p className="font-medium">{formData.height}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Activity className="h-6 w-6 text-blue-600" />
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-500">Weight</p>
                {isEditing ? (
                  <input
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mt-1"
                  />
                ) : (
                  <p className="font-medium">{formData.weight}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-blue-600" />
                <span className="ml-3">View Medical History</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-blue-600" />
                <span className="ml-3">Schedule Appointment</span>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}