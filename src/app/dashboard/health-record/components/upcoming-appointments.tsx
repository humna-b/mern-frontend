"use client"

import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"

const appointments = [
  { id: 1, title: "Annual Check-up", doctor: "Dr. Smith", date: "2024-02-15", time: "10:00 AM" },
  { id: 2, title: "Dental Cleaning", doctor: "Dr. Johnson", date: "2024-03-01", time: "2:30 PM" },
  { id: 3, title: "Eye Exam", doctor: "Dr. Williams", date: "2024-03-10", time: "11:15 AM" },
]

export function UpcomingAppointments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-4">Upcoming Appointments</h3>
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <h4 className="text-lg font-medium text-white mb-2">{appointment.title}</h4>
              <p className="text-sm text-gray-300 mb-1">with {appointment.doctor}</p>
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{appointment.date}</span>
                <Clock className="w-4 h-4 ml-4 mr-2" />
                <span>{appointment.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

