"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Award, Code, Globe, Users, Calendar, CheckCircle, XCircle, AlertCircle, Sparkles, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import BookingModal from "./booking-modal"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CoachDetails {
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
}

interface Coach {
  _id: string
  clerkId: string
  __v: number
  achievements: any[]
  bio: string
  coaches: any[]
  createdSessions: any[]
  createdTournaments: any[]
  email: string
  firstName: string
  friendRequests: any[]
  friends: any[]
  invitedSessions: any[]
  invitedSessionsAsCoach: string[]
  invitedTournaments: any[]
  isCoach: string
  lastName: string
  profileImageUrl: string
  role: string
  sentRequests: any[]
  coachDetails: CoachDetails
}

interface CoachesResponse {
  coaches: Coach[]
}

interface Session {
  _id: string
  sessionName: string
  sessionCoach: {
    _id: string
    clerkId: string
    email: string
    firstName: string
    lastName: string
    profileImageUrl: string
    bio: string
    isCoach: string
    role: string
    // ... other coach properties
  }
  students: string[]
  sessionStartTime: string
  sessionEndTime: string
  totalParticipants: number
  accepted: boolean
  rejected: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

interface UserSessionsData {
  createdSessions: Session[]
  pastSessions: Session[]
  ongoingSessions: Session[]
  upcomingSessions: Session[]
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useUser()
  const [userSessionsData, setUserSessionsData] = useState<UserSessionsData | null>(null)
  const [userSessionsLoading, setUserSessionsLoading] = useState(true)

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/coaches`)
        if (!response.ok) {
          throw new Error("Failed to fetch coaches")
        }
        const data: CoachesResponse = await response.json()
        setCoaches(data.coaches)
      } catch (error) {
        console.error("Error fetching coaches:", error)
       toast.error("Failed to load coaches. Please try again later.");

      } finally {
        setLoading(false)
      }
    }

    fetchCoaches()
  }, [toast])

  useEffect(() => {
    const fetchUserSessions = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/sessions/user?clerkId=${user.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch user sessions")
        }

        const data = await response.json()
        setUserSessionsData(data)
      } catch (err) {
        toast.error("Failed to load user sessions")
      } finally {
        setUserSessionsLoading(false)
      }
    }

    fetchUserSessions()
  }, [user?.id])

  const handleBookSession = (coach: Coach) => {
    setSelectedCoach(coach)
    setIsModalOpen(true)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const getSessionDuration = (start: string, end: string) => {
    const startTime = new Date(start)
    const endTime = new Date(end)
    const diffMs = endTime.getTime() - startTime.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))
    return `${diffMins} min`
  }

  const renderUserStatusBadge = (session: Session) => {
    if (session.accepted) {
      return (
        <Badge className="bg-green-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Accepted
        </Badge>
      )
    } else if (session.rejected) {
      return (
        <Badge className="bg-red-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Rejected
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Pending
        </Badge>
      )
    }
  }

  const renderUserSessionCard = (session: Session) => {
    const startDateTime = formatDateTime(session.sessionStartTime)
    const endDateTime = formatDateTime(session.sessionEndTime)
    const duration = getSessionDuration(session.sessionStartTime, session.sessionEndTime)
    const now = new Date()
    const sessionStart = new Date(session.sessionStartTime)
    const sessionEnd = new Date(session.sessionEndTime)

    let statusBadge = renderUserStatusBadge(session)

    if (sessionStart <= now && now <= sessionEnd && session.accepted) {
      statusBadge = (
        <Badge className="bg-green-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Active
        </Badge>
      )
    }

    if (sessionEnd < now && !session.accepted && !session.rejected) {
      statusBadge = (
        <Badge className="bg-gray-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Expired
        </Badge>
      )
    }

    return (
      <Card key={session._id} className="bg-gray-800/50 border-gray-700 w-full max-w-full">
        <CardContent className="p-4 sm:p-6">
          {/* Header with session name and status badge */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-white break-words flex-1 min-w-0">
                {session.sessionName}
              </h3>
              <div className="flex-shrink-0">
                {statusBadge}
              </div>
            </div>
          </div>
          
          {/* Coach Information */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-700/30 rounded-lg">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={session.sessionCoach.profileImageUrl || "/placeholder.svg?height=40&width=40"}
                alt={`${session.sessionCoach.firstName} ${session.sessionCoach.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium text-sm sm:text-base break-words">
                {session.sessionCoach.firstName} {session.sessionCoach.lastName}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm break-all">
                {session.sessionCoach.email}
              </p>
            </div>
          </div>

          {/* Session details - responsive stack on mobile */}
          <div className="space-y-2 mb-4">
            <div className="bg-gray-700/20 p-2 sm:p-3 rounded flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-300 break-words">
                {startDateTime.date}
              </span>
            </div>
            
            <div className="bg-gray-700/20 p-2 sm:p-3 rounded flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-300 break-words">
                {startDateTime.time} - {endDateTime.time}
              </span>
            </div>
            
            <div className="bg-gray-700/20 p-2 sm:p-3 rounded flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-300">
                {session.totalParticipants} participant{session.totalParticipants !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-start">
            <Badge className="bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {duration}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-white mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Coach</h1>
        <p className="text-gray-300">Browse our elite roster of professional coaches</p>
      </motion.div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {loading
          ? // Skeleton loading
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden backdrop-blur-lg bg-white/10 border-0 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </Card>
            ))
          : coaches.map((coach) => (
              <motion.div
                key={coach._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden backdrop-blur-lg bg-white/10 border-0">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={coach.profileImageUrl || "/placeholder.svg?height=64&width=64"}
                          alt={`${coach.firstName} ${coach.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{`${coach.firstName} ${coach.lastName}`}</h3>
                        <p className="text-blue-300">{coach.coachDetails.specialities[0] || "Coach"}</p>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="flex items-center text-gray-300 mb-2">
                        <Globe className="w-5 h-5 mr-2 text-emerald-400" />
                        <span>Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {coach.coachDetails.languages.map((language, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-emerald-900/30 text-emerald-300 border-emerald-700"
                          >
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Specialities */}
                    <div className="mb-4">
                      <div className="flex items-center text-gray-300 mb-2">
                        <Code className="w-5 h-5 mr-2 text-purple-400" />
                        <span>Specialities</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {coach.coachDetails.specialities.map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-purple-900/30 text-purple-300 border-purple-700"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        <span>{coach.coachDetails.preferredSessionDuration}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Award className="w-5 h-5 mr-2 text-amber-400" />
                        <span>{coach.coachDetails.yearsOfExperience} years experience</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleBookSession(coach)}
                    >
                      Book Session
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* My Sessions Section */}
      <div className="mt-12 md:mt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-white mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">My Sessions</h2>
          <p className="text-gray-300">Manage your created and invited sessions</p>
        </motion.div>

        {userSessionsLoading ? (
          <div className="grid gap-6 md:gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="h-7 bg-gray-700 rounded w-48 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-20 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="created" className="mb-8">
            <TabsList className="bg-gray-800/50 border-gray-700 w-full grid grid-cols-2 md:w-auto md:grid-cols-none md:flex">
              <TabsTrigger value="created" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
                My Sessions
              </TabsTrigger>
              <TabsTrigger value="invited" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm">
                Invited Sessions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="mt-6">
              

              <div className="space-y-4">
                {userSessionsData?.createdSessions && userSessionsData.createdSessions.length > 0 ? (
                  userSessionsData.createdSessions.map((session) => renderUserSessionCard(session))
                ) : (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-400">You haven't created any sessions yet.</p>
                      {/* <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Session
                      </Button> */}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="invited" className="mt-6">
              <div className="space-y-6 md:space-y-8">
                {/* Ongoing Invited Sessions */}
                <section>
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg sm:text-xl text-white flex flex-wrap items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="break-words">Ongoing Sessions</span>
                        <Badge className="bg-green-600 text-white px-2 py-1 text-xs flex-shrink-0">
                          {userSessionsData?.ongoingSessions.length || 0}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userSessionsData?.ongoingSessions.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm sm:text-base">No ongoing sessions at the moment</div>
                      ) : (
                        <div className="space-y-4">
                          {userSessionsData?.ongoingSessions.map((session) => renderUserSessionCard(session))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>

                {/* Upcoming Invited Sessions */}
                <section>
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg sm:text-xl text-white flex flex-wrap items-center gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                        <span className="break-words">Upcoming Sessions</span>
                        <Badge className="bg-blue-600 text-white px-2 py-1 text-xs flex-shrink-0">
                          {userSessionsData?.upcomingSessions.length || 0}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userSessionsData?.upcomingSessions.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm sm:text-base">No upcoming sessions scheduled</div>
                      ) : (
                        <div className="space-y-4">
                          {userSessionsData?.upcomingSessions.map((session) => renderUserSessionCard(session))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>

                {/* Past Invited Sessions */}
                <section>
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg sm:text-xl text-white flex flex-wrap items-center gap-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <span className="break-words">Past Sessions</span>
                        <Badge className="bg-gray-600 text-white px-2 py-1 text-xs flex-shrink-0">
                          {userSessionsData?.pastSessions.length || 0}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userSessionsData?.pastSessions.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm sm:text-base">No past sessions found</div>  
                      ) : (
                        <div className="space-y-4">
                          {userSessionsData?.pastSessions.map((session) => renderUserSessionCard(session))}
                        </div>
                      )}
                    </CardContent>  
                  </Card>
                </section>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Booking Modal */}
      {selectedCoach && (
        <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} coach={selectedCoach} />
      )}
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
    </div>
  )
}