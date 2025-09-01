"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Calendar, PlusCircle, Save, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input" 
import { Button } from "@/components/ui/button" 
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"  
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Achievement {
  name: string
  icon: string
  color: string
}

export default function UserProfile() {
  const { user, isLoaded } = useUser()
  const achievementInputRef = useRef<HTMLInputElement>(null) 
    const router = useRouter();

 const handleNavigate = () => {
    router.push('/dashboard');
  };
  const [bio, setBio] = useState<string>("")
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [editingBio, setEditingBio] = useState<boolean>(false)
  const [newBio, setNewBio] = useState<string>("")
  const [newAchievement, setNewAchievement] = useState<string>("")
  const [showAchievementInput, setShowAchievementInput] = useState<boolean>(false)
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Load user metadata when Clerk user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      const metadata = user.publicMetadata || {}
      setBio((metadata.bio as string) || "")
      setAchievements((metadata.achievements as Achievement[]) || [])
    }
  }, [isLoaded, user])

  // Focus the achievement input when it becomes visible
  useEffect(() => {
    if (showAchievementInput && achievementInputRef.current) {
      achievementInputRef.current.focus()
    }
  }, [showAchievementInput])

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBio(e.target.value)
    setHasChanges(true)
  }

  const handleAchievementKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newAchievement.trim()) {
      addAchievement()
    } else if (e.key === "Escape") {
      setShowAchievementInput(false)
      setNewAchievement("")
    }
  }

  const addAchievement = () => {
    if (!newAchievement.trim()) return

    const icons = ["Award", "Users", "Calendar"]
    const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500", "bg-red-500"]

    const newBadge: Achievement = {
      name: newAchievement,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setAchievements((prev) => [...prev, newBadge])
    setNewAchievement("")
    setHasChanges(true)
    setShowAchievementInput(false)
  }

  const removeAchievement = (index: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  const saveChanges = async () => {
    if (!user) return

    setIsSubmitting(true)
   try {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/update-profile`, {
    clerkId: user.id,
    bio: editingBio ? newBio : bio,
    achievements,
  }); 
  console.log(response);

  toast.success(response.data.message || "Profile updated successfully");

  if (editingBio) {
    setBio(newBio);
    setEditingBio(false);
  }
  setHasChanges(false);
} catch (error) {
  const errorMessage = "Failed to update profile";
  toast.error(errorMessage);
} finally {
      setIsSubmitting(false)
    }
  }

  // Show skeleton loading state while Clerk user is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
        <div className="w-full sm:max-w-6xl mx-auto relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image Skeleton */}
              <div className="w-48 h-48 rounded-full overflow-hidden flex items-center justify-center border-4 border-white/20 bg-white/10 animate-pulse" />

              <div className="text-center md:text-left w-full">
                {/* Name Skeleton */}
                <div className="h-9 w-64 bg-white/10 rounded-lg mb-2 animate-pulse" />
                {/* Email Skeleton */}
                <div className="h-5 w-48 bg-blue-400/20 rounded-lg mb-6 animate-pulse" />

                {/* Bio Skeleton */}
                <div className="mb-6">
                  <div className="h-20 w-full bg-white/10 rounded-lg mb-3 animate-pulse" />
                  <div className="h-9 w-24 bg-white/10 rounded-lg animate-pulse" />
                </div>

                {/* Achievements Skeleton */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-7 w-36 bg-white/10 rounded-lg animate-pulse" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>

                {/* Join Date Skeleton */}
                <div className="h-5 w-40 bg-white/10 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Bottom Card Skeleton */}
            <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10">
              <div className="h-7 w-48 bg-white/10 rounded-lg mb-2 animate-pulse" />
              <div className="h-5 w-64 bg-white/10 rounded-lg mb-4 animate-pulse" />
              <div className="h-10 w-32 bg-blue-500/30 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If no user is found
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-white">Please sign in to view your profile</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full sm:max-w-6xl mx-auto relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden flex items-center justify-center border-4 border-white/20">
                <img
                  src={user.imageUrl || "/placeholder.svg?height=192&width=192"}
                  alt={user.fullName || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"
              />
            </motion.div>

            <div className="text-center md:text-left w-full">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {user.fullName}
              </h1>
              <p className="text-blue-400 mb-2">{user.emailAddresses[0]?.emailAddress}</p>

              {/* Bio Section */}
              <div className="mb-6">
                {!editingBio ? (
                  <div className="group relative">
                    {bio ? (
                      <p className="text-gray-300 mb-3 leading-relaxed">{bio}</p>
                    ) : (
                      <p className="text-gray-500 italic mb-3">Set up your profile by adding an attractive bio</p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-black border-white/20 hover:bg-white/10 hover:text-blue-300 transition-all duration-300"
                      onClick={() => {
                        setEditingBio(true)
                        setNewBio(bio)
                      }}
                    >
                      {bio ? "Edit Bio" : "Add Bio"}
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-4"
                  >
                    <Input
                      value={newBio}
                      onChange={handleBioChange}
                      placeholder="Write something about yourself..."
                      className="bg-transparent border-white/20 text-white mb-3 focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-400"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                        onClick={() => setEditingBio(false)}
                      >
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        onClick={() => {
                          setBio(newBio)
                          setEditingBio(false)
                          setHasChanges(true)
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Achievements/Badges Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium text-lg">Achievements</h3>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
                      <button
                        onClick={() => setShowAchievementInput(!showAchievementInput)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                        aria-label="Add achievement"
                      >
                        {showAchievementInput ? (
                          <X className="w-4 h-4 text-white" />
                        ) : (
                          <PlusCircle className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {showAchievementInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          ref={achievementInputRef}
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          onKeyDown={handleAchievementKeyDown}
                          placeholder="Add a new achievement (press Enter)"
                          className="bg-transparent border-white/20 text-white focus:ring-2 focus:ring-green-500/50 placeholder:text-gray-400"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={addAchievement}
                          disabled={!newAchievement.trim()}
                          className="bg-green-500/20 border-white/20 text-white hover:bg-green-500/30"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {achievements && achievements.length > 0 ? (
                    achievements.map((badge, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative group">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                              >
                                <Badge variant="secondary" className={`${badge.color} text-white px-3 py-1`}>
                                  <Award className="w-4 h-4 mr-1" />
                                  {badge.name}
                                </Badge>
                              </motion.div>
                              <div
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => removeAchievement(index)}
                              >
                                <X className="w-3 h-3" />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Earned for exceptional performance</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-sm">Add your achievements to showcase your skills</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-end"
            >
              <Button
                onClick={saveChanges}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-semibold text-white mb-2">Ready to play?</h2>
            <p className="text-gray-300 mb-4">Join a game or create your own event!</p>
            <Button onClick={handleNavigate} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors duration-200">
              Find a Game
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
