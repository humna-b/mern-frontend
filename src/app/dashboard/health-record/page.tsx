"use client"

import { motion } from "framer-motion"
import { HealthOverview } from "./components/health-overview"
import { ActivityGraph } from "./components/activity-graph"
import { NutritionTable } from "./components/nutrition-table"
import { UpcomingAppointments } from "./components/upcoming-appointments"
import { WeightTracker } from "./components/weight-tracker"

export default function HealthRecord() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Health Record
            </h1>
            <p className="text-gray-400 mt-2">Track and manage your health data</p>
          </div>
        </motion.div>

        {/* Health Overview */}
        <HealthOverview />

        {/* Activity and Nutrition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ActivityGraph />
          <NutritionTable />
        </div>

        {/* Appointments and Weight Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UpcomingAppointments />
          <WeightTracker />
        </div>
      </div>
    </div>
  )
}

