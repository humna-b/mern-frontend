"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Clock, Award, Globe, Code, Mail, Calendar, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface CoachProfile {
  _id: string
  yearsOfExperience: number
  userId: string
  certification: string[]
  specialities: string[]
  preferredSessionDuration: string
  bio: string
  languages: string[]
  createdAt: string
  updatedAt: string
  __v: number
  firstName: string
  lastName: string
  email: string
  profileImageUrl: string
}

export default function CoachProfile() {
  const { user } = useUser()
  const [profile, setProfile] = useState<CoachProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/coach-profile?coachId=${user.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="text-center md:text-left space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-20 w-full max-w-md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-red-900/20 border-red-700 p-8">
            <div className="text-red-300 text-lg text-center">{error || "Profile not found"}</div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 md:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-32"></div>
              <CardContent className="p-8 -mt-16">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                      <img
                        src={profile.profileImageUrl || "/placeholder.svg?height=128&width=128"}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-800 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{profile.email}</span>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                      {profile.bio || "No bio available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Experience & Duration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Experience & Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-amber-300 font-semibold">Years of Experience</p>
                        <p className="text-white text-2xl font-bold">{profile.yearsOfExperience}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-300 font-semibold">Session Duration</p>
                        <p className="text-white text-2xl font-bold">{profile.preferredSessionDuration}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {profile.languages.map((language, index) => (
                      <Badge
                        key={index}
                        className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2 text-sm font-medium capitalize"
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Specialties & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Specialties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-400" />
                    Specialties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {profile.specialities.map((specialty, index) => (
                      <Badge
                        key={index}
                        className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm font-medium"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.certification.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <div
                          className={`w-3 h-3 rounded-full ${cert.toLowerCase() === "yes" ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <span className="text-gray-300 capitalize">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Profile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Member Since</p>
                    <p className="text-white font-semibold">{formatDate(profile.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                    <p className="text-white font-semibold">{formatDate(profile.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <style jsx global>{`
        .Toastify__toast {
          background: #1f2937 !important;
          border: 1px solid #374151 !important;
          color: #ffffff !important;
        }
        
        .Toastify__toast--success {
          border-left: 4px solid #10b981 !important;
        }
        
        .Toastify__toast--error {
          border-left: 4px solid #ef4444 !important;
        }
      `}</style>
    </>
  )
}
