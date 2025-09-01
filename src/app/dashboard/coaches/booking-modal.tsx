"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"
import { CalendarIcon, Clock, Users, Sparkles, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ToastContainer, toast } from "react-toastify"

interface Friend {
  _id: string
  clerkId: string
  firstName: string
  lastName: string
  profileImageUrl: string
}

interface AvailableFriendsResponse {
  availableFriends: Friend[]
}

interface Coach {
  _id: string
  clerkId: string
  firstName: string
  lastName: string
  profileImageUrl: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  coach: Coach
}

export default function BookingModal({ isOpen, onClose, coach }: BookingModalProps) {
  const { user } = useUser()
  const [sessionName, setSessionName] = useState("")
  const [date, setDate] = useState<Date>(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  })
  const [currentMonth, setCurrentMonth] = useState<Date>(date)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [availableFriends, setAvailableFriends] = useState<Friend[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingFriends, setIsFetchingFriends] = useState(false)
  const [timeError, setTimeError] = useState("")

  // Generate days for the current month view
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Day names for the calendar header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Optimized time options generation - only generate once
  const timeOptions = useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        options.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return options
  }, [])

  // Validate time selection
  const validateTimes = useCallback((start: string, end: string) => {
    if (!start || !end) {
      setTimeError("")
      return true
    }

    const startMinutes = Number.parseInt(start.split(":")[0]) * 60 + Number.parseInt(start.split(":")[1])
    const endMinutes = Number.parseInt(end.split(":")[0]) * 60 + Number.parseInt(end.split(":")[1])

    if (endMinutes <= startMinutes) {
      setTimeError("End time must be after start time")
      return false
    }

    if (endMinutes - startMinutes < 30) {
      setTimeError("Session must be at least 30 minutes long")
      return false
    }

    setTimeError("")
    return true
  }, [])

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  // Handle date selection
  const handleSelectDate = (day: Date) => {
    // Don't allow selecting dates in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (day < today) {
      return
    }

    setDate(day)
    setCalendarOpen(false)
  }

  // Debounced friends fetching with Clerk user integration
  useEffect(() => {
    if (!isOpen || !startTime || !endTime || !validateTimes(startTime, endTime) || !user?.id) {
      setAvailableFriends([])
      return
    }

    const timer = setTimeout(async () => {
      setIsFetchingFriends(true)

      try {
        const startDateTime = new Date(date)
        const [startHours, startMinutes] = startTime.split(":").map(Number)
        startDateTime.setHours(startHours, startMinutes, 0, 0)

        const endDateTime = new Date(date)
        const [endHours, endMinutes] = endTime.split(":").map(Number)
        endDateTime.setHours(endHours, endMinutes, 0, 0)

        const startTimeISO = startDateTime.toISOString()
        const endTimeISO = endDateTime.toISOString()

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WEATHER_URL}/api/get/availableFriendsForSession?userId=${user.id}&startTime=${startTimeISO}&endTime=${endTimeISO}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch available friends")
        }

        const data: AvailableFriendsResponse = await response.json()
        setAvailableFriends(data.availableFriends)
      } catch (error) {
        console.error("Error fetching available friends:", error)
        toast.error("Failed to load available friends. Please try again.")
      } finally {
        setIsFetchingFriends(false)
      }
    }, 500) // Debounce API calls

    return () => clearTimeout(timer)
  }, [date, startTime, endTime, isOpen, validateTimes, user?.id])

  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime)
    validateTimes(newStartTime, endTime)
  }

  const handleEndTimeChange = (newEndTime: string) => {
    setEndTime(newEndTime)
    validateTimes(startTime, newEndTime)
  }

  const handleCreateSession = async () => {
    if (!validateTimes(startTime, endTime) || !user?.id) {
      return
    }

    setIsLoading(true)

    const startDateTime = new Date(date)
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    startDateTime.setHours(startHours, startMinutes, 0, 0)

    const endDateTime = new Date(date)
    const [endHours, endMinutes] = endTime.split(":").map(Number)
    endDateTime.setHours(endHours, endMinutes, 0, 0)

    const sessionData = {
      clerkId: user.id,
      coachId: coach.clerkId,
      invitedMembers: selectedFriends,
      sessionName,
      sessionStartTime: startDateTime.toISOString(),
      sessionEndTime: endDateTime.toISOString(),
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      })

      if (response.status === 409) {
        // Handle conflict error (coach already booked)
        const errorData = await response.json()
        toast.error(errorData.message || "Coach is already registered to another appointment on this date.")
        return
      }

      if (!response.ok) {
        // Handle other HTTP errors
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.message || "Failed to create session. Please try again.")
        return
      }

      toast.success("Your session has been booked successfully.")
      onClose()
    } catch (error) {
      console.error("Error creating session:", error)
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFriendSelection = (clerkId: string) => {
    setSelectedFriends((prev) => (prev.includes(clerkId) ? prev.filter((id) => id !== clerkId) : [...prev, clerkId]))
  }

  // Don't render if user is not loaded
  if (!user) {
    return null
  }

  // Get today's date with time set to midnight for comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-0 shadow-2xl backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 pointer-events-none" />

        <DialogHeader className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-12 w-12 ring-2 ring-blue-500/50">
              <AvatarImage
                src={coach.profileImageUrl || "/placeholder.svg?height=48&width=48"}
                alt={`${coach.firstName} ${coach.lastName}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {coach.firstName[0]}
                {coach.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Book a Session
              </DialogTitle>
              <p className="text-slate-400 text-sm">
                with {coach.firstName} {coach.lastName}
              </p>
            </div>
            <Sparkles className="ml-auto h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-6 relative">
          <div className="grid gap-3">
            <Label htmlFor="session-name" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              Session Name
            </Label>
            <Input
              id="session-name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name..."
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-blue-400" />
              Date
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 hover:border-blue-500 transition-all duration-200 backdrop-blur-sm text-white",
                    !date && "text-white",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-slate-800 border-slate-600 shadow-2xl pointer-events-auto"
                align="start"
                sideOffset={4}
                style={{ zIndex: 99999 }}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {/* Custom Calendar Implementation */}
                <div className="space-y-4 p-4 relative z-50 pointer-events-auto">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        previousMonth()
                      }}
                      className="h-7 w-7 bg-transparent p-0 text-white hover:bg-slate-700 rounded-md pointer-events-auto cursor-pointer relative z-10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous month</span>
                    </Button>
                    <div className="font-medium text-white">{format(currentMonth, "MMMM yyyy")}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        nextMonth()
                      }}
                      className="h-7 w-7 bg-transparent p-0 text-white hover:bg-slate-700 rounded-md pointer-events-auto cursor-pointer relative z-10"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next month</span>
                    </Button>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {dayNames.map((day) => (
                      <div key={day} className="text-xs text-slate-400 font-medium py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Add empty cells for days before the start of the month */}
                    {Array.from({ length: days[0].getDay() }).map((_, index) => (
                      <div key={`empty-start-${index}`} className="h-9 w-9" />
                    ))}

                    {/* Render the days of the month */}
                    {days.map((day) => {
                      const isSelected = isSameDay(day, date)
                      const isCurrentDay = isToday(day)
                      const isPast = day < today

                      return (
                        <Button
                          key={day.toString()}
                          variant="ghost"
                          size="icon"
                          disabled={isPast}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectDate(day)
                          }}
                          className={cn(
                            "h-9 w-9 p-0 font-normal rounded-md relative z-10 pointer-events-auto cursor-pointer",
                            isSelected && "bg-blue-600 text-white hover:bg-blue-600",
                            isCurrentDay && !isSelected && "bg-slate-700 text-white",
                            isPast && "text-slate-500 opacity-50 cursor-not-allowed pointer-events-none",
                            !isSelected && !isCurrentDay && !isPast && "text-white hover:bg-slate-700",
                          )}
                        >
                          {format(day, "d")}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="start-time" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-400" />
                Start Time
              </Label>
              <Select value={startTime} onValueChange={handleStartTimeChange}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600 hover:border-green-500 focus:border-green-500 transition-all duration-200 backdrop-blur-sm text-white">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 border-slate-600 backdrop-blur-xl">
                  {timeOptions.map((time) => (
                    <SelectItem key={`start-${time}`} value={time} className="hover:bg-slate-700/50 text-white">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="end-time" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-400" />
                End Time
              </Label>
              <Select value={endTime} onValueChange={handleEndTimeChange}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600 hover:border-red-500 focus:border-red-500 transition-all duration-200 backdrop-blur-sm text-white">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 border-slate-600 backdrop-blur-xl">
                  {timeOptions.map((time) => (
                    <SelectItem key={`end-${time}`} value={time} className="hover:bg-slate-700/50 text-white">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Error */}
          {timeError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-300">{timeError}</span>
            </div>
          )}

          <div className="grid gap-3">
            <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" />
              Invite Friends
              {selectedFriends.length > 0 && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {selectedFriends.length} selected
                </Badge>
              )}
            </Label>
            {isFetchingFriends ? (
              <div className="flex items-center justify-center py-8 bg-slate-800/30 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                <span className="ml-3 text-sm text-slate-400">Loading available friends...</span>
              </div>
            ) : availableFriends.length > 0 ? (
              <div className="max-h-[200px] overflow-y-auto space-y-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                {availableFriends.map((friend) => (
                  <div
                    key={friend.clerkId}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggleFriendSelection(friend.clerkId)}
                  >
                    <Checkbox
                      id={`friend-${friend.clerkId}`}
                      checked={selectedFriends.includes(friend.clerkId)}
                      onCheckedChange={() => toggleFriendSelection(friend.clerkId)}
                      className="border-slate-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <Avatar className="h-8 w-8 ring-1 ring-slate-600">
                        <AvatarImage
                          src={friend.profileImageUrl || "/placeholder.svg?height=32&width=32"}
                          alt={`${friend.firstName} ${friend.lastName}`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white text-xs">
                          {friend.firstName[0]}
                          {friend.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Label htmlFor={`friend-${friend.clerkId}`} className="cursor-pointer text-slate-200 font-medium">
                        {friend.firstName} {friend.lastName}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-800/30 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                <Users className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">
                  {startTime && endTime && !timeError
                    ? "No friends available for this time slot."
                    : "Select valid start and end time to see available friends."}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="relative gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSession}
            disabled={isLoading || !!timeError}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Booking...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Book Session
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
