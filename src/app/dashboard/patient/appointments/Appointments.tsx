'use client';

import { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const upcomingAppointments = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2025-04-15',
    time: '10:00 AM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    date: '2025-04-20',
    time: '02:30 PM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  }
];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <nav className="mt-6">
          <ul>
            <li className="py-3 px-4 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
              <Link href="dashboard/patient/Profile">Profile</Link>
            </li>
            <li className="py-3 px-4 mt-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
              <Link href="dashboard/patient/appointments">Appointments</Link>
            </li>
            <li className="py-3 px-4 mt-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
              <Link href="dashboard/patient/medical-history">Medical History</Link>
            </li>
            <li className="py-3 px-4 mt-2 bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800">
              <Link href="dashboard/patient/Prescriptions">Prescriptions</Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full md:w-3/4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <img
                  src={appointment.image}
                  alt={appointment.doctor}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{appointment.doctor}</h3>
                  <p className="text-sm text-gray-500">{appointment.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointment.date}</p>
                  <p className="text-sm text-gray-500">{appointment.time}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
