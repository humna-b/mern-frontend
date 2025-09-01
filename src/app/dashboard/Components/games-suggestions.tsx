"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { useState, useEffect } from "react"

interface GameSuggestionsProps {
  weatherData: any
}

interface Game {
  id: number
  title: string
  description: string
  players: number
}

interface ApiResponse {
  recommendations: Game[]
  total_options: number
  weather_summary: {
    cloudiness: number
    condition: string
    temperature: number
    wind_speed: number
  }
}

// Default game images mapping
const gameImages: { [key: string]: string } = {
  Cricket: "/images/cricket.jpg",
  Football: "/images/football.jpg",
  Baseball: "/images/baseball.jpg",
  Tennis: "/images/tennis.jpg",
  Badminton: "/images/badmintion.jpg",
  Photography: "/images/cricket.jpg", // fallback
  Fishing: "/images/football.jpg", // fallback
  "Board Games": "/images/baseball.jpg", // fallback
  "Roller Skating": "/images/tennis.jpg", // fallback
  "Night Photography": "/images/badmintion.jpg", // fallback
  "Outdoor Photography": "/images/cricket.jpg", // fallback
  "Photography Walk": "/images/football.jpg", // fallback
}

function GameSkeleton() {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-6 bg-white/20 rounded mb-2" />
          <div className="h-4 bg-white/10 rounded" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white/10 rounded mr-2" />
          <div className="h-4 bg-white/10 rounded w-20" />
        </div>
        <div className="w-full h-8 bg-white/10 rounded-lg" />
      </div>
    </div>
  )
}

export function GameSuggestions({ weatherData }: GameSuggestionsProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const fetchGameRecommendations = async (weather: any) => {
    setLoading(true)
    setError("")

    try {
      const requestData = {
        main: { temp: weather.main.temp },
        wind: { speed: weather.wind.speed },
        clouds: { all: weather.clouds.all },
        weather: [{ main: weather.weather[0].main }],
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/games-suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }) 
      

      if (!response.ok) {
        throw new Error("Failed to fetch game recommendations")
      } 

      const data: ApiResponse = await response.json() 
      console.log('data',data)
      setGames(data.recommendations)
    } catch (err) {
      console.error("Error fetching game recommendations:", err)
      setError("Failed to load game recommendations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (weatherData) {
      fetchGameRecommendations(weatherData)
    }
  }, [weatherData])

  // Show default message when no weather data
  if (!weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
            Recommended Sports
          </h2>
          <p className="text-gray-400">
            Enable location to get personalized game recommendations based on current weather conditions.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-purple-500/20 via-pink-500/20 to-red-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent mb-6">
          Recommended Sports
        </h2>

        {error && (
          <div className="text-red-400 text-center mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? // Show 6 skeleton cards while loading
              [...Array(6)].map((_, index) => <GameSkeleton key={index} />)
            : games.map((game, index) => {
                // Get image based on game title or use fallback
                const gameImage = gameImages[game.title] || gameImages["Cricket"]

                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={gameImage || "/placeholder.svg?height=192&width=384"}
                        alt={game.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                        <p className="text-sm text-gray-300 line-clamp-2">{game.description}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>
                          {game.players} player{game.players !== 1 ? "s" : ""}
                        </span>
                      </div>
                     <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  disabled
  className="w-full py-2 cursor-default bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600  opacity-70"
>
  Suggested
</motion.button>

                    </div>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </motion.div>
  )
}
