"use client"

import { motion } from "framer-motion"
import { Footprints, Heart, Flame } from "lucide-react" 
import React from "react"
import { Line, LineChart, ResponsiveContainer } from "recharts"

interface StatsWidgetProps {
  title: string
  value: number
  maxValue: number
  color: string
  gradientId: string
  icon: "steps" | "heart" | "flame"
  data: Array<{ value: number }>
}

const icons = {
  steps: Footprints,
  heart: Heart,
  flame: Flame,
}

export function StatsWidget({ title, value, maxValue, color, gradientId, icon, data }: StatsWidgetProps) {
  const percentage = (value / maxValue) * 100
  const Icon = icons[icon] 
  const [clientValue, setClientValue] = React.useState<string>('');

  React.useEffect(() => {
    const value = localStorage.getItem('key');
    setClientValue(value as string);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 p-6"
    >
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            `linear-gradient(45deg, ${color}22, transparent)`,
            `linear-gradient(225deg, ${color}22, transparent)`,
            `linear-gradient(45deg, ${color}22, transparent)`,
          ],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="absolute inset-0 blur-xl" style={{ background: color }} />
              <Icon className="relative z-10 w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-lg font-medium text-white">{title}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            View Details
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <svg className="w-32 h-32" viewBox="0 0 128 128">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.5 }} />
                </linearGradient>
              </defs>
              <circle
                className="text-gray-700/30"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
              />
              <motion.circle
                stroke={`url(#${gradientId})`}
                strokeWidth="12"
                strokeLinecap="round"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
                style={{
                  strokeDasharray: "351.858 351.858",
                  strokeDashoffset: 351.858 - (percentage / 100) * 351.858,
                }}
                initial={{ strokeDashoffset: 351.858 }}
                animate={{
                  strokeDashoffset: 351.858 - (percentage / 100) * 351.858,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-white"
              >
                {value}
              </motion.p>
              <p className="text-sm text-white/60">/{maxValue}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <defs>
                    <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    fill={`url(#${gradientId}-area)`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-center">
                <p className="text-sm text-white/60">Avg</p>
                <p className="text-sm font-medium text-white">
                  {(data.reduce((acc, curr) => acc + curr.value, 0) / data.length).toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/60">Max</p>
                <p className="text-sm font-medium text-white">{Math.max(...data.map((d) => d.value))}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/60">Min</p>
                <p className="text-sm font-medium text-white">{Math.min(...data.map((d) => d.value))}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

