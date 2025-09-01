"use client"

import { Sidebar } from "./Components/Sidebar"
import { useState, useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // or a loading spinner
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-blue-950 to-slate-900">
      <Sidebar />
      <div className="flex-grow md:ml-64 pt-8 md:pt-0">
        <main className="">{children}</main>
      </div>
    </div>
  )
}

