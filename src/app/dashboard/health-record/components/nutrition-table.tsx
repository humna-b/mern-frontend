"use client"

import { motion } from "framer-motion"

const nutritionData = [
  { name: "Calories", value: 2100, target: 2500, unit: "kcal" },
  { name: "Protein", value: 85, target: 100, unit: "g" },
  { name: "Carbs", value: 250, target: 300, unit: "g" },
  { name: "Fat", value: 65, target: 80, unit: "g" },
]

export function NutritionTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-4">Nutrition Overview</h3>
        <div className="space-y-4">
          {nutritionData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-300">{item.name}</p>
                <div className="mt-1 relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.target) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></motion.div>
                  </div>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium text-white">
                  {item.value} / {item.target} {item.unit}
                </p>
                <p className="text-xs text-gray-400">{Math.round((item.value / item.target) * 100)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

