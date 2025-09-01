"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Cloud,
  CloudLightning,
  CloudRain,
  Gamepad2,
  Moon,
  Sun,
  ChevronRight,
  Check,
  ArrowRight,
  Users,
  Zap,
  Menu,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LogOut, User } from "lucide-react" 
import { useClerk } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const globalStyles = `
   @keyframes lightning {
     0%, 95%, 98% {
       opacity: 0;
     }
     96%, 97% {
       opacity: 0.8;
     }
   }
   
   @keyframes rain {
     0% {
       transform: translateY(-100%);
     }
     100% {
       transform: translateY(1000%);
     }
   }
   
   @keyframes float {
     0% {
       transform: translateX(-10px);
     }
     50% {
       transform: translateX(10px);
     }
     100% {
       transform: translateX(-10px);
     }
   }
   
   /* Responsive adjustments */
   @media (max-width: 768px) {
     .animate-rain {
       animation-duration: 0.8s !important;
     }
   }
 `

function Home() {
  const navItems = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ]
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false) 
    const [sheetOpen, setSheetOpen] = useState(false)
  const router = useRouter() 
    const { signOut } = useClerk();
  const { isSignedIn, user } = useUser()
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Add the global styles to the document
    const styleElement = document.createElement("style")
    styleElement.innerHTML = globalStyles
    document.head.appendChild(styleElement)

    return () => {
      // Clean up the style element when the component unmounts
      document.head.removeChild(styleElement)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      // Modal will automatically close after sign-out
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Navbar */}
      <header className="border-b border-gray-800 bg-black/40 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Weather Sportify
            </h1>
          </div>

          {/* Desktop navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-white hover:text-purple-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
            {isSignedIn ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-purple-500/50 p-0 hover:bg-gray-800/50"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                        {user?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-gray-900 border-gray-800 text-white p-3">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                          {user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{user?.fullName || "User"}</p>
                        <p className="text-xs text-gray-400">{user?.emailAddresses[0]?.emailAddress || ""}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 hover:text-white hover:bg-gray-800 text-white"
                      onClick={() => router.push("/dashboard")}
                    >
                      <User className="h-4 w-4 text-purple-400" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 hover:text-white hover:bg-gray-800 text-white"
                      onClick={() => setShowSignOutModal(true)}
                    >
                      <LogOut className="h-4 w-4 text-purple-400" />
                      Sign out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                onClick={() => {
                  router.push("/sign-in")
                }}
                className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Get Started
              </Button>
            )}
          </nav>

          {/* Mobile navigation */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-gray-900 border-gray-800">
              <SheetTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent px-4 py-2"></SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 py-4 border-b border-gray-800">
                  <Cloud className="h-6 w-6 text-purple-400" />
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    Weather Sportify
                  </h2>
                </div>
                <nav className="flex flex-col gap-1 py-6">
                  {navItems.map((item) => (
                  <a
                key={item.name}
                href={item.href}
                onClick={() => setSheetOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                      {item.name === "Home" && <Cloud className="h-5 w-5 text-purple-400" />}
                      {item.name === "Features" && <Zap className="h-5 w-5 text-blue-400" />}
                      {item.name === "How It Works" && <Gamepad2 className="h-5 w-5 text-purple-400" />}
                      {item.name === "Testimonials" && <Users className="h-5 w-5 text-blue-400" />}
                      {item.name === "Contact" && <MailIcon className="h-5 w-5 text-purple-400" />}

                      {item.name}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto border-t border-gray-800 pt-6 pb-4 px-4">
                  {isSignedIn ? (
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-500/50">
                        <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                          {user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{user?.fullName || "User"}</p>
                        <p className="text-xs text-gray-400">{user?.emailAddresses[0]?.emailAddress || ""}</p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-black border-gray-700 hover:bg-gray-800 "
                            onClick={() => router.push("/dashboard")}
                          >
                            Dashboard
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-black border-gray-700 hover:bg-gray-800 hover:text-gray-200"
                            onClick={() => setShowSignOutModal(true)}
                          >
                            Sign out
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        router.push("/sign-in")
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/80 to-gray-950"></div>

          <div className="container relative mx-auto px-4 flex flex-col items-center text-center z-10">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/30">
              Revolutionary Game Recommendation
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Play the Perfect Game for Every Weather
            </h1>
            <p className="text-lg md:text-xl text-white max-w-3xl mb-8">
              Weather Sportify uses advanced AI to recommend the perfect games based on your local weather conditions.
              Enhance your gaming experience with personalized suggestions that match your mood and environment.
            </p>
            <div className="flex flex-row gap-4">
              <Button
                size="lg"
                onClick={() => {
                  isSignedIn ? router.push("/dashboard") : router.push("/sign-in")
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Try for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl">
              <div className="flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-bold text-purple-400">500K+</h3>
                <p className="text-white text-sm md:text-base">Active Users</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-bold text-blue-400">10K+</h3>
                <p className="text-white text-sm md:text-base">Games Analyzed</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-bold text-purple-400">98%</h3>
                <p className="text-white text-sm md:text-base">Satisfaction Rate</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-bold text-blue-400">24/7</h3>
                <p className="text-white text-sm md:text-base">Weather Updates</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30">
                Powerful Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose Weather Sportify?</h2>
              <p className="text-white max-w-2xl mx-auto">
                Our innovative platform combines weather data with gaming preferences to create the ultimate gaming
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden hover:border-purple-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <CloudRain className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">Real-Time Weather Integration</CardTitle>
                  <CardDescription className="text-gray-300">
                    Connects to local weather data to provide up-to-the-minute recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {["Accurate local forecasts", "Hourly updates", "Global coverage", "Historical data"].map(
                      (item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-white">{item}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden hover:border-blue-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <Gamepad2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">AI-Powered Game Matching</CardTitle>
                  <CardDescription className="text-gray-300">
                    Our advanced algorithm learns your preferences and matches them with weather conditions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Personalized recommendations",
                      "Mood-based suggestions",
                      "Genre preferences",
                      "Play time optimization",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden hover:border-purple-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">Social Gaming Community</CardTitle>
                  <CardDescription className="text-gray-300">
                    Connect with other players experiencing similar weather conditions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {["Weather-based matchmaking", "Community events", "Game reviews", "Friend recommendations"].map(
                      (item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-white">{item}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/30">
                Simple Process
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How Weather Sportify Works</h2>
              <p className="text-white max-w-2xl mx-auto">
                Our platform makes it easy to find the perfect game for any weather condition in just a few simple
                steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="relative flex flex-col items-center text-center">
                <div className="absolute top-10 right-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-transparent hidden md:block"></div>
                <div className="h-20 w-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 relative z-10">
                  <span className="text-2xl font-bold text-purple-400">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Connect Weather</h3>
                <p className="text-white">
                  Allow access to your location or enter it manually to get accurate weather data.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="absolute top-10 right-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-transparent hidden md:block"></div>
                <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 relative z-10">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Set Preferences</h3>
                <p className="text-white">
                  Tell us about your gaming habits, favorite genres, and available platforms.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Get Recommendations</h3>
                <p className="text-white">
                  Receive personalized game suggestions based on current weather and your preferences.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button
                size="lg"
                onClick={() => {
                  isSignedIn ? router.push("/dashboard") : router.push("/sign-in")
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Your Weather Gaming Journey
              </Button>
            </div>
          </div>
        </section>

        {/* Weather Moods Section */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30">
                Weather Moods
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Perfect Games for Every Weather</h2>
              <p className="text-white max-w-2xl mx-auto">
                Different weather conditions create different gaming moods. Discover how Weather Sportify enhances your
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Rainy Days Card */}
              <div className="group relative h-80 overflow-hidden rounded-xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-950/90 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=300')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,180,255,0.2),transparent_70%)]"></div>

                {/* Rain Animation */}
                <div className="absolute inset-0 opacity-70">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 bg-blue-300/30 rounded-full animate-rain"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 10}%`,
                        height: `${Math.random() * 20 + 15}px`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${Math.random() * 1 + 1}s`,
                      }}
                    ></div>
                  ))}
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-blue-500/20 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-blue-500/30">
                    <CloudRain className="h-12 w-12 text-blue-300" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">Rainy Days</h3>
                  <p className="mb-4 text-blue-100">Cozy, atmospheric games that match the mood of rainy weather.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-100 border-blue-500/30">Story-Rich</Badge>
                    <Badge className="bg-blue-500/20 text-blue-100 border-blue-500/30">Atmospheric</Badge>
                    <Badge className="bg-blue-500/20 text-blue-100 border-blue-500/30">Adventure</Badge>
                  </div>
                </div>
              </div>

              {/* Sunny Days Card */}
              <div className="group relative h-80 overflow-hidden rounded-xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-600/80 to-amber-900/90 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=300')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,200,50,0.5),transparent_70%)]"></div>

                {/* Sun Rays Animation */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="h-40 w-40 rounded-full bg-yellow-500 blur-xl animate-pulse"></div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-yellow-500/20 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-yellow-500/30">
                    <Sun className="h-12 w-12 text-yellow-300" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">Sunny Days</h3>
                  <p className="mb-4 text-yellow-100">
                    Vibrant, action-packed games that complement bright sunny days.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-500/30">Action</Badge>
                    <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-500/30">Racing</Badge>
                    <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-500/30">Sports</Badge>
                  </div>
                </div>
              </div>

              {/* Cloudy Days Card */}
              <div className="group relative h-80 overflow-hidden rounded-xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-700/80 to-slate-900/90 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=300')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,200,200,0.2),transparent_70%)]"></div>

                {/* Cloud Animation */}
                <div className="absolute inset-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-white/10 rounded-full blur-md animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 50}%`,
                        width: `${Math.random() * 100 + 50}px`,
                        height: `${Math.random() * 60 + 30}px`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 10 + 15}s`,
                      }}
                    ></div>
                  ))}
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-slate-500/20 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-slate-500/30">
                    <Cloud className="h-12 w-12 text-slate-300" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">Cloudy Days</h3>
                  <p className="mb-4 text-slate-100">Strategic and thoughtful games for overcast weather.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge className="bg-slate-500/20 text-slate-100 border-slate-500/30">Strategy</Badge>
                    <Badge className="bg-slate-500/20 text-slate-100 border-slate-500/30">Puzzle</Badge>
                    <Badge className="bg-slate-500/20 text-slate-100 border-slate-500/30">Simulation</Badge>
                  </div>
                </div>
              </div>

              {/* Stormy Nights Card */}
              <div className="group relative h-80 overflow-hidden rounded-xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-purple-950/90 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=300')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(150,120,255,0.3),transparent_70%)]"></div>

                {/* Lightning Animation */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-white/0">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 bg-white/80"
                        style={{
                          opacity: 0,
                          animation: `lightning 4s ${i * 1.3}s infinite`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-purple-500/20 p-3 backdrop-blur-sm group-hover:bg-purple-500/30">
                    <CloudLightning className="h-12 w-12 text-purple-300" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">Stormy Nights</h3>
                  <p className="mb-4 text-purple-100">Intense, immersive experiences that match stormy conditions.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-100 border-purple-500/30">Horror</Badge>
                    <Badge className="bg-purple-500/20 text-purple-100 border-purple-500/30">Thriller</Badge>
                    <Badge className="bg-purple-500/20 text-purple-100 border-purple-500/30">Survival</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/30">
                User Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What Our Users Say</h2>
              <p className="text-white max-w-2xl mx-auto">
                Join thousands of satisfied gamers who have discovered their perfect weather-matched games.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "Casual Gamer",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "Weather Sportify completely changed how I choose games. Now I look forward to rainy days for the perfect atmospheric adventure!",
                },
                {
                  name: "Sarah Chen",
                  role: "Hardcore Gamer",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "The AI recommendations are spot on! It's like the app knows exactly what game will match my mood based on the weather outside.",
                  featured: true,
                },
                {
                  name: "Michael Rodriguez",
                  role: "Game Developer",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "As a developer, I'm impressed by the technology. The weather-to-game matching algorithm is incredibly sophisticated.",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className={`bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden ${
                    testimonial.featured ? "md:scale-105 border-purple-500/30" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <CardTitle className="text-lg text-white">{testimonial.name}</CardTitle>
                        <CardDescription className="text-gray-300">{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white italic">"{testimonial.quote}"</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Moon
                          key={star}
                          className={`h-4 w-4 ${
                            star === 5 && !testimonial.featured ? "text-gray-600" : "text-purple-400 fill-purple-400"
                          }`}
                        />
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/30">
                Get Started Today
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Elevate Your Gaming Experience with Weather
              </h2>
              <p className="text-xl text-white mb-8">
                Join thousands of gamers who have discovered the perfect match between weather and gaming.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => {
                    isSignedIn ? router.push("/dashboard") : router.push("/sign-in")
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Start Free Trial <Zap className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-black hover:text-white hover:bg-gray-800"
                >
                  Learn More <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30">
                  Contact Us
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Get in Touch</h2>
                <p className="text-white mb-6">
                  Have questions about Weather Sportify? Our team is here to help you get started.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <MailIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-white">Email Us</h3>
                      <p className="text-gray-300">support@weathersportify.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <PhoneIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-white">Call Us</h3>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-white">Visit Us</h3>
                      <p className="text-gray-300">123 Gaming Street, San Francisco, CA 94107</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <TwitterIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <FacebookIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Send Us a Message</CardTitle>
                  <CardDescription className="text-gray-300">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-white">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-white">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-white">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-white">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      ></textarea>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Send Message
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

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
          <div className="flex justify-center py-4">
            <div className="h-20 w-20 rounded-full bg-black flex items-center justify-center border border-gray-800">
              <Avatar className="h-16 w-16 ring-2 ring-white/20">
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                  {user?.firstName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
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

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-sm border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Weather Sportify
                </h2>
              </div>
              <p className="text-white mb-6 max-w-md">
                Weather Sportify is the revolutionary platform that connects your gaming experience with real-time
                weather conditions, providing personalized game recommendations that match your mood and environment.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <TwitterIcon className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="hover:text-purple-400 transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    GDPR Compliance
                  </a>
                </li>
              </ul>

              <h3 className="font-medium text-lg mt-6 mb-4 text-white">Subscribe</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-white"
                />
                <Button className="rounded-l-none bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Weather Sportify. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MailIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function MapPinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

function FacebookIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function TwitterIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

export default Home
