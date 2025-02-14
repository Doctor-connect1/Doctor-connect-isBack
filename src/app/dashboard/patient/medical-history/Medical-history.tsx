'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface MedicalCondition {
  id: number;
  condition: string;
  date: string;
  notes: string;
}

interface PastAppointment {
  id: number;
  date: string;
  doctorName: string;
  diagnosis: string;
  healthStatus: 'improved' | 'unchanged' | 'deteriorated';
  followUpNeeded: boolean;
}

function MedicalHistory() {
  const [activeTab, setActiveTab] = useState('history');
  const [pastAppointments, setPastAppointments] = useState<PastAppointment[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch past appointments
        const appointmentsResponse = await fetch('/api/patient/appointments/past');
        const appointmentsData = await appointmentsResponse.json();
        setPastAppointments(appointmentsData);

        // Fetch medical conditions
        const conditionsResponse = await fetch('/api/patient/conditions');
        const conditionsData = await conditionsResponse.json();
        setMedicalConditions(conditionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'improved':
        return 'text-green-500';
      case 'deteriorated':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Medical History</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                Conditions
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                Past Visits
              </button>
            </div>
          </div>

          {activeTab === 'history' ? (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4">Loading medical conditions...</div>
              ) : medicalConditions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No medical conditions recorded</div>
              ) : (
                medicalConditions.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">{entry.condition}</h3>
                      <p className="text-sm text-gray-500">Date: {new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Notes: {entry.notes}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4">Loading past appointments...</div>
              ) : pastAppointments.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No past appointments found</div>
              ) : (
                pastAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium">
                          Visit with Dr. {appointment.doctorName}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Date: {new Date(appointment.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Diagnosis: {appointment.diagnosis}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm">Health Status:</span>
                        <span className={`text-sm font-medium ${getHealthStatusColor(appointment.healthStatus)}`}>
                          {appointment.healthStatus.charAt(0).toUpperCase() + appointment.healthStatus.slice(1)}
                        </span>
                        {appointment.followUpNeeded && (
                          <span className="text-sm text-orange-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Follow-up needed
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicalHistory;