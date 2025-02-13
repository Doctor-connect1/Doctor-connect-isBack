"use client";

import { motion } from "framer-motion";
import PageContainer from "../components/PageContainer";

export default function HistoryPage() {
  const visits = [
    { id: 1, patient: "John Doe", date: "2023-07-15", status: "Completed" },
    { id: 2, patient: "Jane Smith", date: "2023-07-10", status: "Cancelled" },
    {
      id: 3,
      patient: "Michael Johnson",
      date: "2023-07-05",
      status: "Completed",
    },
  ];

  return (
    <PageContainer title="Visit History">
      <div className="space-y-4">
        {visits.map((visit, index) => (
          <motion.div
            key={visit.id}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#1F2937]">{visit.patient}</h3>
                <p className="text-sm text-gray-600">Date: {visit.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  visit.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {visit.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}
