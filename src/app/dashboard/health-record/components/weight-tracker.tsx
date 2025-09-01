"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const weightData = [
  { date: "2024-01-01", weight: 75 },
  { date: "2024-01-08", weight: 74.5 },
  { date: "2024-01-15", weight: 74.2 },
  { date: "2024-01-22", weight: 73.8 },
  { date: "2024-01-29", weight: 73.5 },
  { date: "2024-02-05", weight: 73.2 },
  { date: "2024-02-12", weight: 73.0 },
]

export function WeightTracker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-green-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-4">Weight Tracker</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Starting Weight</p>
            <p className="text-lg font-semibold text-white">{weightData[0].weight} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Current Weight</p>
            <p className="text-lg font-semibold text-white">{weightData[weightData.length - 1].weight} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Weight Loss</p>
            <p className="text-lg font-semibold text-green-400">
              {(weightData[0].weight - weightData[weightData.length - 1].weight).toFixed(1)} kg
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

