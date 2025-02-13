"use client";

import { useState } from "react";
import PageContainer from "../components/PageContainer";
import { FiSearch, FiFilter, FiEdit2, FiTrash2 } from "react-icons/fi";

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      email: "john@example.com",
      phone: "+1 234 567 890",
      lastVisit: "2024-03-15",
      nextAppointment: "2024-03-25",
      status: "Active",
    },
    // Add more fake patients
  ]);

  return (
    <PageContainer title="Patients">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] text-gray-800 placeholder-gray-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiFilter />
            <span className="text-black hover:text-[#007E85] transition-colors duration-200">
              Filters
            </span>
          </button>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-[#007E85]/10 flex items-center justify-center">
                          <span className="text-[#007E85] font-medium">
                            {patient.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#1F2937]">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {patient.age} years old
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800">{patient.email}</div>
                    <div className="text-sm text-gray-600">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800">
                      {patient.lastVisit}
                    </div>
                    <div className="text-sm text-gray-600">
                      Next: {patient.nextAppointment}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-[#007E85] hover:text-[#007E85]/80">
                        <FiEdit2 />
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default PatientsPage;
