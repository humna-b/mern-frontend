"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useClerk, useUser } from "@clerk/nextjs"
import { Calendar, UserCog, HeartPulse, GamepadIcon, UserCircle, LogOut, Menu, X, Lock, Briefcase } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()

  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isCoach, setIsCoach] = useState(false)

  useEffect(() => {
    if (user?.publicMetadata?.isCoach === true) {
      setIsCoach(true)
    } else {
      setIsCoach(false)
    }
  }, [user])

  const menuItems = [ 
    { icon: Calendar, label: "Home", href: "/dashboard" },
    { icon: Calendar, label: "Manage Tournaments", href: "/dashboard/event-management" },
    { icon: UserCog, label: "Coach Hiring", href: "/dashboard/coaches" ,
         disabled: isCoach,
      tooltip: isCoach ? "You are already registered as a coach" : null, 

     },
    // { icon: HeartPulse, label: "Health Record", href: "/dashboard/health-record" },
    { icon: UserCircle, label: "User Profile", href: "/dashboard/user-profile" }, 
    { icon: UserCircle, label: "Find Friends?", href: "/dashboard/find-friends" },

    {
      icon: UserCog,
      label: "Register as a Coach",
      href: "/dashboard/coach-registeration",
      disabled: isCoach,
      tooltip: isCoach ? "You are already registered as a coach" : null,
    },
    {
      icon: Briefcase,
      label: "Coach Portal",
      href: "/dashboard/coach-dashboard",
      disabled: !isCoach,
      tooltip: !isCoach ? "Register as a coach to access this feature" : null,
    },
  ]

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)

      await signOut()

      await new Promise((resolve) => setTimeout(resolve, 500))

      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const renderMenuItem = (item: any) => {
    const isActive = pathname === item.href

    if (item.disabled) {
      return (
        <TooltipProvider key={item.label}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-not-allowed opacity-50 bg-transparent text-gray-500`}
              >
                <item.icon className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{item.label}</span>
                <Lock className="w-4 h-4 ml-auto text-gray-500" />
              </div>
            </TooltipTrigger>
            {item.tooltip && (
              <TooltipContent side="right">
                <p>{item.tooltip}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <li key={item.label}>
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-white/10"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-gray-400"}`} />
          <span className="font-medium">{item.label}</span>
        </Link>
      </li>
    )
  }

  return (
    <>
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-white">Sportify Weather</h1>
          <div className="w-6"></div> {/* Placeholder for balance */}
        </div>
      </nav>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 bottom-0 z-40 w-64 bg-gradient-to-b from-black via-blue-950 to-gray-950 border-r border-gray-800 transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full pt-16 md:pt-0">
          {/* Header */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <ul className="space-y-2">{menuItems.map(renderMenuItem)}</ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 mt-auto">
            <button
              onClick={() => setShowSignOutModal(true)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      <Dialog open={showSignOutModal} onOpenChange={setShowSignOutModal}>
        <DialogContent className="bg-black border border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <LogOut className="h-5 w-5 text-white" />
              Sign Out
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-800 text-black hover:bg-gray-900 hover:text-white"
              onClick={() => setShowSignOutModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-200"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                  Signing Out...
                </>
              ) : (
                "Yes, Sign Out"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
