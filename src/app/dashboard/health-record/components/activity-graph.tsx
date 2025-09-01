"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", steps: 7000 },
  { name: "Tue", steps: 8500 },
  { name: "Wed", steps: 10000 },
  { name: "Thu", steps: 9000 },
  { name: "Fri", steps: 11000 },
  { name: "Sat", steps: 8000 },
  { name: "Sun", steps: 7500 },
]

export function ActivityGraph() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-4">Weekly Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
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
                dataKey="steps"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

