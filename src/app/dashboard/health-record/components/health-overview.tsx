"use client"

import { motion } from "framer-motion"
import { Heart, Activity, Brain } from "lucide-react"

const healthMetrics = [
  { name: "Heart Health", icon: Heart, value: 85, color: "from-red-500 to-pink-500" },
  { name: "Physical Fitness", icon: Activity, value: 72, color: "from-green-500 to-emerald-500" },
  { name: "Mental Wellbeing", icon: Brain, value: 90, color: "from-blue-500 to-indigo-500" },
]

export function HealthOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {healthMetrics.map((metric, index) => (
        <div
          key={metric.name}
          className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r ${metric.color} opacity-20 blur-3xl rounded-full`}
            />
          </div>

          <div className="relative z-10">
            <metric.icon className="w-8 h-8 text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{metric.name}</h3>
            <div className="flex items-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-700 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <motion.circle
                    className={`stroke-current bg-white text-slate-200 text-${metric.color.split(" ")[1]}`}
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${metric.value * 2.512} 251.2` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  ></motion.circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{metric.value}%</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Current Status</p>
                <p className="text-lg font-semibold text-white">
                  {metric.value >= 80 ? "Excellent" : metric.value >= 60 ? "Good" : "Needs Improvement"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

