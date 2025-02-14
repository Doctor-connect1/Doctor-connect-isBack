'use client';

import { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const prescriptions = [
  {
    id: 1,
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2025-01-15',
    endDate: '2025-07-15',
  },
  {
    id: 2,
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2025-02-01',
    endDate: '2025-08-01',
  },
];

export default function Prescriptions() {
  const [activeTab, setActiveTab] = useState('prescriptions');

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
          <h2 className="text-xl font-semibold">Current Prescriptions</h2>
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{prescription.medication}</h3>
                  <p className="text-sm text-gray-500">Dosage: {prescription.dosage}</p>
                  <p className="text-sm text-gray-500">Frequency: {prescription.frequency}</p>
                  <p className="text-sm text-gray-500">Duration: {prescription.startDate} - {prescription.endDate}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}