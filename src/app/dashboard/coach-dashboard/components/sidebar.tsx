"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Award, UserCircle, LogOut, X } from "lucide-react"

const menuItems = [
  { icon: Activity, label: "Sessions", href: "/dashboard/coach-dashboard/sessions" },
  { icon: Award, label: "Dashboard", href: "/dashboard/coach-dashboard" },
  { icon: UserCircle, label: "My Profile", href: "/dashboard/coach-dashboard/profile" },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleLogout = async () => {
    try {
      await signOut({ redirectUrl: "/" })
    } catch (error) {
      console.error("Logout failed:", error)
      router.push("/") // fallback redirect
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Coach Portal</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-white hover:text-blue-200 focus:outline-none lg:hidden"
        >
          <X className="h-6 w-6" />
        </motion.button>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <motion.li key={item.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? "bg-white/20 text-white shadow-lg" : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-black via-blue-950 to-slate-950 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-black via-blue-950 to-slate-950 backdrop-blur-xl border-r border-white/10 z-40">
        {sidebarContent}
      </div>
    </>
  )
}
