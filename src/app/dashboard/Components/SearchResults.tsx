import type React from "react"
import { Search } from "lucide-react"
import { UserCard } from "./UserCard"

interface Achievement {
  icon: string
  name: string
  color: string
  _id: string
}

interface SearchUser {
  _id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
  bio: string
  achievements: Achievement[]
}

interface FriendRequest {
  clerkId: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
  bio: string
}

interface Friend {
  clerkId: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
  role: string
  isCoach: string
  bio: string
  achievments: any
}

interface UserInfo {
  friendRequests: FriendRequest[]
  friends: Friend[]
}

interface SearchUser {
  clerkId: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
  bio: string
}

interface SearchResultsProps {
  searchResults: SearchUser[]
  isSearching: boolean
  hasSearched: boolean
  sendingRequest: string | null
  hasRequestBeenSent: (clerkId: string) => boolean
  sendFriendRequest: (clerkId: string) => void
  cancelFriendRequest: (clerkId: string) => void
  userInfo?: any | null
  acceptingRequest?: string | null
  deletingRequest?: string | null
  acceptFriendRequest?: (clerkId: string) => void
  deleteFriendRequest?: (clerkId: string) => void
}


const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  isSearching,
  hasSearched,
  sendingRequest,
  hasRequestBeenSent,
  sendFriendRequest,
  cancelFriendRequest,
  userInfo,
  acceptingRequest,
  deletingRequest,
  acceptFriendRequest,
  deleteFriendRequest,
}) => {
  // Helper function to check if a user has sent me a friend request
  const hasSentMeRequest = (clerkId: string) => {
    return userInfo?.friendRequests?.some((request : any) => request.clerkId === clerkId) || false
  }

  // Helper function to check if a user is already my friend
  const isAlreadyFriend = (clerkId: string) => {
    return userInfo?.friends?.some((friend : any) => friend.clerkId === clerkId) || false
  }

  if (isSearching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl p-6 animate-pulse border border-purple-500/20 h-[200px]"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 bg-[#3a3b3c] rounded-xl"></div>
              <div className="flex-1">
                <div className="h-5 bg-[#3a3b3c] rounded mb-2"></div>
                <div className="h-4 bg-[#3a3b3c] rounded w-3/4"></div>
              </div>
            </div>
            <div className="h-4 bg-[#3a3b3c] rounded mb-4"></div>
            <div className="h-10 bg-[#3a3b3c] rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (hasSearched && searchResults.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-900/50 rounded-2xl p-12 border border-purple-500/20 text-center shadow-lg">
        <div className="w-16 h-16 bg-[#3a3b3c] rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-[#b0b3b8]" />
        </div>
        <h3 className="text-xl font-semibold text-[#e4e6ea] mb-2">No Users Found</h3>
        <p className="text-[#b0b3b8]">We couldn't find any users matching your search criteria.</p>
      </div>
    )
  }

  if (searchResults.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {searchResults.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            hasRequestBeenSent={hasRequestBeenSent(user.clerkId)}
            sendingRequest={sendingRequest}
            onAddFriend={sendFriendRequest}
            onCancelRequest={cancelFriendRequest}
            isSearchResult={true}
            hasSentMeRequest={hasSentMeRequest(user.clerkId)}
            acceptingRequest={acceptingRequest}
            deletingRequest={deletingRequest}
            onAcceptRequest={acceptFriendRequest}
            onDeleteRequest={deleteFriendRequest}
            isAlreadyFriend={isAlreadyFriend(user.clerkId)}
          />
        ))}
      </div>
    )
  }

  return null
}

export default SearchResults
