"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"

export function SyncUser() {
  const { user, isLoaded, isSignedIn } = useUser()
  const hasSynced = useRef(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return
    if (hasSynced.current) return
    hasSynced.current = true

    const syncUser = async () => {
      try {
       await fetch((process.env.NEXT_PUBLIC_WEATHER_URL || "") + "/api/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            profileImageUrl: user.imageUrl || "",
          }),
        })
      } catch (err) {
        console.error("Failed to sync user:", err)
      }
    }

    syncUser()
  }, [isLoaded, isSignedIn, user])

  return null
}