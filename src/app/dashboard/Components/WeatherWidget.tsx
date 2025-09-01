"use client"

import { motion } from "framer-motion"
import { MapPin, Thermometer, Wind, Eye, Droplets } from "lucide-react"
import { Switch } from "@/components/ui/switch"
interface WeatherWidgetProps {
  weatherData: any
  forecastData: any
  loading: boolean
  error: string
  locationEnabled: boolean
  locationPermissionDenied: boolean
  onLocationToggle: () => void
}

export function WeatherWidget({
  weatherData,
  forecastData,
  loading,
  error,
  locationEnabled,
  locationPermissionDenied,
  onLocationToggle,
}: WeatherWidgetProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded-lg mb-4 w-1/3"></div>
          <div className="h-16 bg-white/10 rounded-lg mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  if (!weatherData && !loading) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-3 sm:p-6 lg:p-8 rounded-xl shadow-2xl">
        <div className="relative w-full max-w-6xl mx-auto backdrop-blur-xl bg-white/5 rounded-3xl p-2 sm:p-6 lg:p-8 border border-white/10 shadow-lg">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse" />
          </div>
          <div className="relative z-10 text-center space-y-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Weather Information
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
                {locationPermissionDenied
                  ? "Location access was denied. Enable location to get weather data and personalized game suggestions."
                  : "Enable location to get personalized weather data and game suggestions based on current conditions."}
              </p>
              <div className="flex items-center justify-center space-x-4 mt-6">
                <span className="text-blue-100 font-medium">Enable Location</span>
                <Switch
                  checked={locationEnabled}
                  onCheckedChange={onLocationToggle}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">  NOW </h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-white text-sm">Location</span>
            <Switch
              checked={locationEnabled}
              onCheckedChange={onLocationToggle}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-6xl font-bold text-white">{Math.round(weatherData.main.temp)}°C</div>
              <div className="space-y-1">
                <div className="text-xl text-gray-300 capitalize">{weatherData.weather[0].description}</div>
                <div className="text-sm text-gray-400">Feels like {Math.round(weatherData.main.feels_like)}°C</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Wind</span>
              </div>
              <div className="text-xl font-semibold text-white">{weatherData.wind.speed} m/s</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Humidity</span>
              </div>
              <div className="text-xl font-semibold text-white">{weatherData.main.humidity}%</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Visibility</span>
              </div>
              <div className="text-xl font-semibold text-white">{(weatherData.visibility / 1000).toFixed(1)} km</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Pressure</span>
              </div>
              <div className="text-xl font-semibold text-white">{weatherData.main.pressure} hPa</div>
            </div>
          </div>
        </div>

        {forecastData && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">5-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecastData.list
                .filter((_: any, index: number) => index % 8 === 0)
                .slice(0, 5)
                .map((day: any, index: number) => (
                  <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                    <div className="text-sm text-gray-400 mb-2">
                      {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{Math.round(day.main.temp)}°</div>
                    <div className="text-xs text-gray-400 capitalize">{day.weather[0].description}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
