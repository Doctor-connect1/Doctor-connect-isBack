'use client';

import { useState } from 'react';
import { User, Heart, Activity, Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <nav className="mt-6">
          <ul>
            <li className="py-3 px-4 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
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
          <h2 className="text-xl font-semibold">Patient Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <User className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">Sarah Anderson</p>
              </div>
            </div>
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Blood Type</p>
                <p className="font-medium">A+</p>
              </div>
            </div>
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Height/Weight</p>
                <p className="font-medium">5'6" / 130 lbs</p>
              </div>
            </div>
            <div className="flex items-center">
              <Bell className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">Allergies</p>
                <p className="font-medium">Penicillin</p>
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
                <span className="ml-3">Edit Profile</span>
              </div>
            </button>
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