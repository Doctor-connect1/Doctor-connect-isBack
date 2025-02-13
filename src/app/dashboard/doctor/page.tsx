"use client";

import { useState } from "react";
import { FiCalendar, FiSearch, FiBell } from "react-icons/fi";

interface VisitStats {
  total: number;
  newPatients: {
    count: number;
    growth: number;
  };
  oldPatients: {
    count: number;
    growth: number;
  };
}

const DoctorDashboard = () => {
  const [visitStats] = useState<VisitStats>({
    total: 104,
    newPatients: {
      count: 40,
      growth: 51,
    },
    oldPatients: {
      count: 64,
      growth: -20,
    },
  });

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 max-w-4xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-6 py-3 bg-gray-100 rounded-2xl focus:outline-none text-black"
            />
            <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="font-medium">Dr. Kim</span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#007E85]">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
        <span className="text-black"> Good Morning </span><span className="text-[#007E85]">Dr. Kim!</span>
        </h1>
      </div>

      {/* Stats Card */}
      <div className="bg-[#007E85] text-white rounded-2xl p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg mb-4">Visits for Today</h2>
            <div className="text-5xl font-bold mb-6">{visitStats.total}</div>

            <div className="grid grid-cols-2 gap-4">
              {/* New Patients */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold">
                  {visitStats.newPatients.count}
                </div>
                <div className="flex items-center gap-2">
                  <span>New Patients</span>
                  <span className="text-green-400">
                    +{visitStats.newPatients.growth}%
                  </span>
                </div>
              </div>

              {/* Old Patients */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold">
                  {visitStats.oldPatients.count}
                </div>
                <div className="flex items-center gap-2">
                  <span>Old Patients</span>
                  <span className="text-red-400">
                    {visitStats.oldPatients.growth}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient List and Consultation Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Patient List</h2>
            <div className="flex items-center gap-2">
              <span>Today</span>
              <FiCalendar />
            </div>
          </div>
          {/* Add your patient list component here */}
        </div>

        <div className="bg-white rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Consultation</h2>
          {/* Add your consultation component here */}
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
