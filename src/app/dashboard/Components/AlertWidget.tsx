"use client"

import { motion } from "framer-motion"
import { Bell } from "lucide-react"

export function AlertWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-2xl p-6 glow"
    >
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-xl rounded-full" />
          <Bell className="relative z-10 w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-xl font-medium text-white">Get Automatic Alerts For Sudden Changes</h3>
      </div>

      <div className="relative h-4 bg-gray-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "75%" }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500"
        />
        <motion.div
          animate={{
            x: [-100, 300],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
        />
      </div>
    </motion.div>
  )
}

