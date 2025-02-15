"use client";

import { useState } from "react";
import PageContainer from "../components/PageContainer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion } from "framer-motion";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

const CalendarPage = () => {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Patient: John Doe - Checkup",
      start: "2024-03-25T10:00:00",
      end: "2024-03-25T11:00:00",
      color: "#007E85",
    },
    {
      id: "2",
      title: "Patient: Jane Smith - Follow-up",
      start: "2024-03-26T14:00:00",
      end: "2024-03-26T15:00:00",
      color: "#1F2937",
    },
  ]);

  const handleDateClick = (arg: any) => {
    const title = prompt("Enter appointment details:");
    if (title) {
      setEvents([
        ...events,
        {
          id: String(events.length + 1),
          title,
          start: arg.dateStr,
          end: arg.dateStr,
          color: "#007E85",
        },
      ]);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (window.confirm(`Are you sure you want to delete this appointment?`)) {
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  return (
    <PageContainer title="Appointment Calendar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Calendar Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#007E85]">
            Manage Appointments
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#007E85] text-white rounded-lg hover:bg-[#006670] transition-colors">
            <FiPlus />
            <span>New Appointment</span>
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="650px"
            events={events}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => (
              <motion.div
                className="p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sm font-medium">
                  {eventInfo.event.title}
                </div>
                <div className="text-xs text-gray-600">
                  {eventInfo.timeText}
                </div>
              </motion.div>
            )}
            eventClassNames="hover:shadow-md transition-shadow"
            dayHeaderClassNames="bg-[#007E85] text-white"
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
            nowIndicator
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            weekends={false}
            eventBackgroundColor="#007E85"
            eventBorderColor="#007E85"
            eventTextColor="#ffffff"
          />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#007E85] mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {events
              .sort(
                (a, b) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime()
              )
              .map((event) => (
                <motion.div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-[#007E85] hover:text-[#006670] p-2 rounded-full hover:bg-[#007E85]/10">
                      <FiEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-500/10">
                      <FiTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default CalendarPage;
