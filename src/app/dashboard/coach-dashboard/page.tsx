"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { 
  Activity, 
  Users, 
  Calendar, 
  Clock,
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";

interface SessionData {
  pastSessions: number;
  upcomingSessions: number;
  ongoingSessions: number;
  sessionsThisWeek: number;
}

interface StatCard {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
  description: string;
}

export default function CoachHome() {
  const { user, isLoaded } = useUser();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WEATHER_URL}/api/sessions/coach/${user.id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }
        
        const data: SessionData = await response.json();
        setSessionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchSessionData();
    }
  }, [user, isLoaded]);

  const getStats = (data: SessionData): StatCard[] => [
    {
      label: "Past Sessions",
      value: data.pastSessions.toString(),
      icon: Activity,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      description: "Completed successfully",
    },
    {
      label: "Upcoming Sessions",
      value: data.upcomingSessions.toString(),
      icon: Calendar,
      color: "text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      description: "Scheduled ahead",
    },
    {
      label: "Ongoing Sessions",
      value: data.ongoingSessions.toString(),
      icon: Clock,
      color: "text-amber-400",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      description: "Currently active",
    },
    {
      label: "This Week",
      value: data.sessionsThisWeek.toString(),
      icon: TrendingUp,
      color: "text-purple-400",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      description: "Sessions conducted",
    },
  ];

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-7xl p-8 mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-white/10 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded w-96 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/10 border-white/20 p-6 h-32">
                <div className="flex items-center justify-between mb-4">
                  <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                  <div className="h-8 bg-white/10 rounded w-12 animate-pulse"></div>
                </div>
                <div className="h-4 bg-white/10 rounded w-24 animate-pulse"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="backdrop-blur-lg bg-white/10 border-red-500/50 p-8 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Error Loading Data</h2>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  if (!sessionData) return null;

  const stats = getStats(sessionData);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl p-8 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-3">
            Welcome Back, {user?.firstName || 'Coach'}
          </h1>
          <p className="text-gray-400 text-lg">
            Here's an overview of your coaching activities and progress
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className={`backdrop-blur-lg bg-white/10 border-white/20 p-6 h-full hover:border-white/40 transition-all duration-300 relative overflow-hidden hover:bg-white/15`}>
                {/* Background decoration */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-white/10 ${stat.color} backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <motion.span 
                      className="text-4xl font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      {stat.value}
                    </motion.span>
                  </div>
                  
                  <div>
                    <p className="text-white font-semibold text-lg mb-1">{stat.label}</p>
                    <p className="text-gray-400 text-sm">{stat.description}</p>
                  </div>

                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl opacity-50"></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional insights section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8 hover:bg-white/15 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {sessionData.pastSessions + sessionData.sessionsThisWeek}
                </div>
                <p className="text-gray-400">Total Sessions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {sessionData.upcomingSessions > 0 ? '✓' : '⚠️'}
                </div>
                <p className="text-gray-400">
                  {sessionData.upcomingSessions > 0 ? 'Schedule Active' : 'No Upcoming'}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {sessionData.ongoingSessions > 0 ? 'LIVE' : 'IDLE'}
                </div>
                <p className="text-gray-400">Current Status</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}