'use client';

import { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const medicalHistory = [
  {
    id: 1,
    condition: 'Hypertension',
    date: '2025-01-10',
    notes: 'Managed with medication.',
  },
  {
    id: 2,
    condition: 'Diabetes',
    date: '2025-02-15',
    notes: 'Regular monitoring required.',
  },
  {
    id: 3,
    condition: 'Asthma',
    date: '2025-03-05',
    notes: 'Use inhaler as needed.',
  },
];

function MedicalHistory() {
  const [activeTab, setActiveTab] = useState('history');

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
              <Link href="/dashboard/patient/medical-history.tsx">Medical History</Link>
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
          <h2 className="text-xl font-semibold">Medical History</h2>
          <div className="space-y-4">
            {medicalHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{entry.condition}</h3>
                  <p className="text-sm text-gray-500">Date: {entry.date}</p>
                  <p className="text-sm text-gray-500">Notes: {entry.notes}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicalHistory;