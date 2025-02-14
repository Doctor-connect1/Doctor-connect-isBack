'use client';

import { useState } from 'react';
import { Calendar, Clock, FileText, Activity, Pill as Pills, ChevronRight, Bell, User, Heart, Clipboard } from 'lucide-react';
import Link from 'next/link';
// import Navbar from './../../components/Navbar';
// import Footer from './../../components/Footer';

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

const medications = [
  {
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2025-01-15',
    endDate: '2025-07-15'
  },
  {
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2025-02-01',
    endDate: '2025-08-01'
  }
];

const recentTests = [
  {
    name: 'Complete Blood Count',
    date: '2025-03-01',
    status: 'Completed',
    result: 'Normal'
  },
  {
    name: 'Lipid Panel',
    date: '2025-03-01',
    status: 'Completed',
    result: 'Review Required'
  },
  {
    name: 'Thyroid Function',
    date: '2025-02-15',
    status: 'Completed',
    result: 'Normal'
  }
];

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <p className="text-sm text-blue-200">Manage your health records easily</p>
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
        {/* Patient Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
                alt="Patient"
                className="h-24 w-24 rounded-full border-4 border-white object-cover"
              />
              <div className="ml-6 text-white">
                <h1 className="text-3xl font-bold">Sarah Anderson</h1>
                <p className="text-blue-100">Patient ID: P-2025-0123</p>
              </div>
              <button className="ml-auto bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center">
                <User className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">32 years</p>
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
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                <Link href="/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
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

            {/* Recent Test Results */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Test Results</h2>
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div key={test.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-gray-500">Date: {test.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                        test.result === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Current Medications */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Current Medications</h2>
                <Pills className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-4">
                {medications.map((medication) => (
                  <div key={medication.name} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{medication.name}</h3>
                    <p className="text-sm text-gray-500">Dosage: {medication.dosage}</p>
                    <p className="text-sm text-gray-500">Frequency: {medication.frequency}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      {medication.startDate} - {medication.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="ml-3">Schedule Appointment</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="ml-3">Request Medical Records</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <Clipboard className="h-5 w-5 text-blue-600" />
                    <span className="ml-3">View Lab Results</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}