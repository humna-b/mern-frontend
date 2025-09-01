"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Clock, Users, Calendar, CheckCircle, XCircle, AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Session {
  _id: string
  sessionName: string
  sessionCoach: string
  students: string[]
  sessionStartTime: string
  sessionEndTime: string
  totalParticipants: number
  accepted: boolean
  rejected: boolean
  createdAt: string
  updatedAt: string
}

interface SessionsData {
  pastSessions: Session[]
  ongoingSessions: Session[]
  upcomingSessions: Session[]
}

const SkeletonCard = () => (
  <Card className="bg-gray-800 border-gray-700">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-5 bg-gray-700 rounded mb-2 w-3/4 animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-700 rounded w-20 animate-pulse"></div>
      </div>
      <div className="h-5 bg-gray-700 rounded w-12 animate-pulse"></div>
    </CardContent>
  </Card>
)

export default function CoachingSessions() {
  const { user } = useUser()
  const [sessionsData, setSessionsData] = useState<SessionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/sessions/coach?coachId=${user.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch sessions")
        }

        const data = await response.json()
        setSessionsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast.error("Failed to load sessions")
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [user?.id])

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

  const cleanErrorMessage = (message: string) => {
    return message.replace(/\\"/g, '"').replace(/"/g, "")
  }

  const handleAcceptSession = async (sessionId: string) => {
    if (!user?.id) return

    setActionLoading((prev) => ({ ...prev, [`accept-${sessionId}`]: true }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/approve-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          sessionId: sessionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(cleanErrorMessage(data.message || "Failed to approve session"))
        return
      }

      toast.success("Session approved successfully!")

      // Refresh sessions data
      const sessionsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_URL}/api/sessions/coach?coachId=${user.id}`,
      )
      if (sessionsResponse.ok) {
        const updatedData = await sessionsResponse.json()
        setSessionsData(updatedData)
      }
    } catch (err) {
      toast.error("Failed to approve session. Please try again.")
    } finally {
      setActionLoading((prev) => ({ ...prev, [`accept-${sessionId}`]: false }))
    }
  }

  const handleRejectSession = async (sessionId: string) => {
    if (!user?.id) return

    setActionLoading((prev) => ({ ...prev, [`reject-${sessionId}`]: true }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/reject-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          sessionId: sessionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(cleanErrorMessage(data.message || "Failed to reject session"))
        return
      }

      toast.success("Session rejected successfully!")

      // Refresh sessions data
      const sessionsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_URL}/api/sessions/coach?coachId=${user.id}`,
      )
      if (sessionsResponse.ok) {
        const updatedData = await sessionsResponse.json()
        setSessionsData(updatedData)
      }
    } catch (err) {
      toast.error("Failed to reject session. Please try again.")
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reject-${sessionId}`]: false }))
    }
  }

  const renderStatusBadge = (session: Session, section: "past" | "ongoing" | "upcoming") => {
    if (section === "past") {
      if (session.accepted) {
        return (
          <Badge className="bg-green-600 text-white px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Accepted
          </Badge>
        )
      } else if (session.rejected) {
        return (
          <Badge className="bg-red-600 text-white px-3 py-1">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </Badge>
        )
      } else {
        return (
          <Badge className="bg-gray-600 text-white px-3 py-1">
            <AlertCircle className="w-4 h-4 mr-1" />
            Expired
          </Badge>
        )
      }
    }

    if (section === "ongoing") {
      return (
        <Badge className="bg-green-600 text-white px-3 py-1">
          <Sparkles className="w-4 h-4 mr-1" />
          Active
        </Badge>
      )
    }

    if (section === "upcoming") {
      if (session.accepted) {
        return (
          <Badge className="bg-green-600 text-white px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Accepted
          </Badge>
        )
      } else if (session.rejected) {
        return (
          <Badge className="bg-red-600 text-white px-3 py-1">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </Badge>
        )
      } else {
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAcceptSession(session._id)}
              disabled={actionLoading[`accept-${session._id}`]}
              className="bg-green-600 hover:bg-green-700 text-white h-8 px-4"
            >
              {actionLoading[`accept-${session._id}`] ? "Accepting..." : "Accept"}
            </Button>
            <Button
              size="sm"
              onClick={() => handleRejectSession(session._id)}
              disabled={actionLoading[`reject-${session._id}`]}
              className="bg-red-600 hover:bg-red-700 text-white h-8 px-4"
            >
              {actionLoading[`reject-${session._id}`] ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        )
      }
    }
  }

  const renderSessionCard = (session: Session, section: "past" | "ongoing" | "upcoming") => {
    const startDateTime = formatDateTime(session.sessionStartTime)
    const endDateTime = formatDateTime(session.sessionEndTime)
    const duration = getSessionDuration(session.sessionStartTime, session.sessionEndTime)

    return (
      <Card key={session._id} className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{session.sessionName}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {startDateTime.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {startDateTime.time} - {endDateTime.time}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {session.totalParticipants} participant{session.totalParticipants !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
            {renderStatusBadge(session, section)}
          </div>

          <div className="flex items-center justify-between">
            <Badge className="bg-blue-600 text-white px-3 py-1">
              <Clock className="w-4 h-4 mr-1" />
              {duration}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-800 rounded mb-3 w-80 animate-pulse"></div>
            <div className="h-5 bg-gray-800 rounded w-96 animate-pulse"></div>
          </div>

          <div className="grid gap-8">
            {/* Ongoing Sessions Skeleton */}
            <section>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="h-7 bg-gray-700 rounded w-48 animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkeletonCard />
                </CardContent>
              </Card>
            </section>

            {/* Upcoming Sessions Skeleton */}
            <section>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="h-7 bg-gray-700 rounded w-48 animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkeletonCard />
                  <SkeletonCard />
                </CardContent>
              </Card>
            </section>

            {/* Past Sessions Skeleton */}
            <section>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="h-7 bg-gray-700 rounded w-48 animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkeletonCard />
                  <SkeletonCard />
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Card className="bg-red-900 border-red-700 p-8">
              <div className="text-red-300 text-lg text-center">Error: {error}</div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Coaching Sessions</h1>
            <p className="text-gray-400">Manage your coaching sessions and track your progress</p>
          </div>

          <div className="grid gap-8">
            {/* Ongoing Sessions */}
            <section>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Ongoing Sessions
                    <Badge className="bg-green-600 text-white px-2 py-1 text-sm">
                      {sessionsData?.ongoingSessions.length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessionsData?.ongoingSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No ongoing sessions at the moment</div>
                  ) : (
                    sessionsData?.ongoingSessions
                      .filter((session) => session.accepted)
                      .map((session) => renderSessionCard(session, "ongoing"))
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Upcoming Sessions */}
            <section>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Upcoming Sessions
                    <Badge className="bg-blue-600 text-white px-2 py-1 text-sm">
                      {sessionsData?.upcomingSessions.length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessionsData?.upcomingSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No upcoming sessions scheduled</div>
                  ) : (
                    sessionsData?.upcomingSessions.map((session) => renderSessionCard(session, "upcoming"))
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Past Sessions */}
            <section>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    Past Sessions
                    <Badge className="bg-gray-600 text-white px-2 py-1 text-sm">
                      {sessionsData?.pastSessions.length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessionsData?.pastSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No past sessions found</div>
                  ) : (
                    sessionsData?.pastSessions.map((session) => renderSessionCard(session, "past"))
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
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
