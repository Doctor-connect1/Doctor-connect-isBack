"use client";

import { useState } from "react";
import PageContainer from "./components/PageContainer";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";

const DoctorDashboard = () => {
  const [visitStats] = useState({
    total: 104,
    newPatients: { count: 40, growth: 51 },
    oldPatients: { count: 64, growth: -20 },
    revenue: 15600,
  });

  const chartData = [
    { name: "Mon", visits: 20 },
    { name: "Tue", visits: 35 },
    { name: "Wed", visits: 25 },
    { name: "Thu", visits: 40 },
    { name: "Fri", visits: 30 },
    { name: "Sat", visits: 15 },
    { name: "Sun", visits: 10 },
  ];

  const upcomingAppointments = [
    { id: 1, patient: "Sarah Johnson", time: "10:00 AM", type: "Checkup" },
    { id: 2, patient: "Mike Smith", time: "11:30 AM", type: "Follow-up" },
    { id: 3, patient: "Emma Davis", time: "2:00 PM", type: "Consultation" },
  ];

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FiUsers}
            title="Total Visits"
            value={visitStats.total}
            trend={"+12%"}
          />
          <StatCard
            icon={FiCalendar}
            title="New Patients"
            value={visitStats.newPatients.count}
            trend={`+${visitStats.newPatients.growth}%`}
          />
          <StatCard
            icon={FiTrendingUp}
            title="Old Patients"
            value={visitStats.oldPatients.count}
            trend={`${visitStats.oldPatients.growth}%`}
            trendDown
          />
          <StatCard
            icon={FiDollarSign}
            title="Revenue"
            value={`$${visitStats.revenue}`}
            trend={"+8%"}
          />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Weekly Visits Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#007E85"
                  fill="#007E85"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
          <div className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium">{apt.patient}</h4>
                  <p className="text-sm text-gray-500">{apt.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#007E85] font-medium">{apt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

interface StatCardProps {
  icon: any;
  title: string;
  value: string | number;
  trend: string;
  trendDown?: boolean;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendDown,
}: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-[#007E85]/10 rounded-lg">
        <Icon className="text-[#007E85] text-xl" />
      </div>
      <span
        className={`text-sm font-medium ${
          trendDown ? "text-red-500" : "text-green-500"
        }`}
      >
        {trend}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </div>
);

export default DoctorDashboard;
