"use client"

import type React from "react"
import { UserPlus, X, Loader2, Mail, Award, Check, UserCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Trophy, Star, Target, Zap } from "lucide-react"

// Icon mapping for achievements
const iconMap: { [key: string]: any } = {
  Award: Award,
  Calendar: Calendar,
  Trophy: Trophy,
  Star: Star,
  Target: Target,
  Zap: Zap,
}

interface Achievement {
  icon: string
  name: string
  color: string
  _id: string
}

interface UserCardProps {
  user: {
    _id: string
    clerkId: string
    email: string
    firstName: string
    lastName: string
    profileImageUrl: string
    bio: string
    achievements?: Achievement[]
  }
  hasRequestBeenSent: boolean
  sendingRequest: string | null
  onAddFriend: (clerkId: string) => void
  onCancelRequest: (clerkId: string) => void
  isSearchResult?: boolean
  // New props for handling incoming friend requests
  hasSentMeRequest?: boolean
  acceptingRequest?: string | null
  deletingRequest?: string | null
  onAcceptRequest?: (clerkId: string) => void
  onDeleteRequest?: (clerkId: string) => void
  // New prop for checking if already friends
  isAlreadyFriend?: boolean
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  hasRequestBeenSent,
  sendingRequest,
  onAddFriend,
  onCancelRequest,
  isSearchResult = false,
  hasSentMeRequest = false,
  acceptingRequest = null,
  deletingRequest = null,
  onAcceptRequest,
  onDeleteRequest,
  isAlreadyFriend = false,
}) => {
  const getAchievementIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Award
    return IconComponent
  }

  const truncateBio = (bio: string, maxLength = 20) => {
    if (!bio) return ""
    return bio.length > maxLength ? bio.substring(0, maxLength) + "..." : bio
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  const renderActionButtons = () => {
    // If already friends, show static friends button
    if (isAlreadyFriend) {
      return (
        <button
          disabled
          className="w-full z-10 bg-[#42b883]/20 text-[#42b883] font-semibold py-2 px-4 text-sm rounded-lg flex items-center justify-center border border-[#42b883]/30 cursor-default"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Friends
        </button>
      )
    }

    // If this user has sent me a friend request, show accept/decline buttons
    if (hasSentMeRequest && onAcceptRequest && onDeleteRequest) {
      return (
        <div className="flex space-x-3 z-10 relative ">
          <button
            onClick={() => onAcceptRequest(user.clerkId)}
            disabled={acceptingRequest === user.clerkId}
            className="flex-1 bg-[#42b883] hover:bg-[#369870] text-white font-semibold py-2 px-4 text-sm rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#42b883]/25 hover:scale-105"
          >
            {acceptingRequest === user.clerkId ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Accept
              </>
            )}
          </button>
          <button
            onClick={() => onDeleteRequest(user.clerkId)}
            disabled={deletingRequest === user.clerkId}
            className="flex-1 bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6ea] hover:text-white font-semibold py-2 px-4 text-sm rounded-lg transition-all duration-300 flex items-center justify-center border border-[#4e4f50] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            {deletingRequest === user.clerkId ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Decline
              </>
            )}
          </button>
        </div>
      )
    }

    // If I have sent them a request, show cancel button
    if (hasRequestBeenSent) {
      return (
        <button
          onClick={() => onCancelRequest(user.clerkId)}
          disabled={sendingRequest === user.clerkId}
          className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-red-200 font-medium py-2 px-4 text-sm rounded-lg transition-all duration-300 flex items-center justify-center border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm hover:scale-105"
        >
          {sendingRequest === user.clerkId ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <X className="h-3 w-3 mr-1" />
              Cancel Request
            </>
          )}
        </button>
      )
    }

    // Default: show add friend button
    return (
      <button
        onClick={() => onAddFriend(user.clerkId)}
        disabled={sendingRequest === user.clerkId}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 text-sm rounded-lg transition-all duration-300 flex items-center justify-center border border-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25 hover:scale-105"
      >
        {sendingRequest === user.clerkId ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <>
            <UserPlus className="h-3 w-3 mr-1" />
            Add Friend
          </>
        )}
      </button>
    )
  }

  return (
    <div
      className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 ${
        hasSentMeRequest ? "ring-2 ring-green-500/30" : ""
      } ${isAlreadyFriend ? "ring-2 ring-blue-500/30" : ""}`}
    >
      {/* Glowing border effect for incoming requests */}
      {hasSentMeRequest && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/5 opacity-100 rounded-2xl"></div>
      )}

      {/* Glowing border effect for friends */}
      {isAlreadyFriend && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/5 opacity-100 rounded-2xl"></div>
      )}

      {/* Card Content Container with fixed height and flex layout */}
      <div className="h-[200px] flex flex-col">
        {/* Header Section */}
        <div className="p-6 flex-shrink-0">
          {/* Profile Header */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative flex-shrink-0">
              <Avatar className="h-16 w-16 ring-2 ring-purple-500/30 shadow-lg">
                <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} alt={user.firstName} />
                <AvatarFallback className="bg-purple-500 text-white font-bold text-lg">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              {hasSentMeRequest && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900/50 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
              {isAlreadyFriend && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-gray-900/50 flex items-center justify-center">
                  <UserCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg leading-tight mb-1">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-[#b0b3b8] text-sm flex items-center mb-1">
                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{user.email}</span>
              </p>
              {user.bio && <p className="text-gray-300 text-xs leading-relaxed">{truncateBio(user.bio, 20)}</p>}
              {hasSentMeRequest && (
                <div className="flex items-center text-green-400 text-xs mt-1">
                  <span>• Sent you a friend request</span>
                </div>
              )}
              {isAlreadyFriend && (
                <div className="flex items-center text-blue-400 text-xs mt-1">
                  <span>• Already friends</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - Flexible height */}
        <div className="px-6 flex-1 flex flex-col">{/* Removed achievements section as requested */}</div>

        {/* Action Buttons - Fixed at bottom with 20px margin */}
        <div className="p-6 pt-0 mt-auto">{renderActionButtons()}</div>
      </div>
    </div>
  )
}
