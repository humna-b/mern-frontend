"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function RegisterCoach() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isAlreadyCoach, setIsAlreadyCoach] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user?.publicMetadata?.isCoach === true) {
      setIsAlreadyCoach(true)
      toast.info("You are already registered as a coach!")
    }
  }, [user])

  const resetForm = () => {
    setYearsOfExperience(0)
    setCertifications([])
    setSpecialities([])
    setPreferredSessionDuration("60 min")
    setBio("")
    setLanguages([])
    setCertificationInput("")
    setSpecialityInput("")
    setLanguageInput("")
  }

  // Form state
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0)
  const [certifications, setCertifications] = useState<string[]>([])
  const [specialities, setSpecialities] = useState<string[]>([])
  const [preferredSessionDuration, setPreferredSessionDuration] = useState<string>("60 min")
  const [bio, setBio] = useState<string>("")
  const [languages, setLanguages] = useState<string[]>([])

  // Input state for tag fields
  const [certificationInput, setCertificationInput] = useState<string>("")
  const [specialityInput, setSpecialityInput] = useState<string>("")
  const [languageInput, setLanguageInput] = useState<string>("")

  // Handler for adding tags
  const addTag = (
    input: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    inputSetter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (input.trim()) {
      setter((prev) => [...prev, input.trim()])
      inputSetter("")
    }
  }

  // Handler for removing tags
  const removeTag = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => prev.filter((_, i) => i !== index))
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("You must be logged in to register as a coach")
      return
    }

    if (!yearsOfExperience || !preferredSessionDuration || !bio) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}/api/register-coach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          yearsOfExperience,
          certification: certifications,
          specialities,
          preferredSessionDuration,
          bio,
          languages,
        }),
      })

      const data = await response.json()

      if (response.status === 201) {
        toast.success(data.message || "Successfully registered as a coach!")
        resetForm() 
        window.location.reload();
        router.push(`/dashboard/coach-dashboard?coachId=${user.id}`)
      } else {
        toast.error(data.message || "Failed to register as a coach")
      }
    } catch (error) {
      toast.error("An error occurred while registering")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto py-12 px-4">
      <ToastContainer position="top-right" autoClose={5000} />

      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Register Coach</h1>
        <p className="text-gray-300">Define your expertise and coaching preferences</p>
      </motion.div>

      {isAlreadyCoach ? (
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg bg-white/10 border-0 p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-3">You're Already a Coach!</h2>
            <p className="text-gray-300 mb-6">
              You have already registered as a coach. You can access your coach portal to manage your sessions and
              profile.
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              onClick={() => router.push(`/dashboard/coach-dashboard?coachId=${user?.id}`)}
            >
              Go to Coach Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expertise Level */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                {/* Trophy icon here */}
                Expertise Level
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Years of Experience *</label>
                  <Input
                    type="number"
                    placeholder="Enter years"
                    className="bg-white/5 border-white/10 text-white"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Certifications</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm flex items-center"
                      >
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeTag(index, setCertifications)}
                          className="ml-2 text-yellow-300 hover:text-yellow-100"
                        >
                          {/* X icon here */}
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add certification"
                      className="bg-white/5 border-white/10 text-white"
                      value={certificationInput}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag(certificationInput, setCertifications, setCertificationInput)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                      onClick={() => addTag(certificationInput, setCertifications, setCertificationInput)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Specialities */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                {/* Brain icon here */}
                Specialities
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {specialities.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm flex items-center"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeTag(index, setSpecialities)}
                        className="ml-2 text-blue-300 hover:text-blue-100"
                      >
                        {/* X icon here */}
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add speciality"
                    className="bg-white/5 border-white/10 text-white"
                    value={specialityInput}
                    onChange={(e) => setSpecialityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(specialityInput, setSpecialities, setSpecialityInput)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                    onClick={() => addTag(specialityInput, setSpecialities, setSpecialityInput)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Training Preferences */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                {/* Dumbbell icon here */}
                Training Preferences
              </h2>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Preferred Session Duration *</label>
                <div className="flex gap-2">
                  {["30 min", "45 min", "60 min", "90 min"].map((duration) => (
                    <Button
                      key={duration}
                      type="button"
                      variant={preferredSessionDuration === duration ? "default" : "outline"}
                      size="sm"
                      className={
                        preferredSessionDuration === duration
                          ? "bg-purple-600 text-white"
                          : "border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                      }
                      onClick={() => setPreferredSessionDuration(duration)}
                    >
                      {duration}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Additional Information */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                {/* Clock icon here */}
                Additional Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Bio *</label>
                  <Textarea
                    placeholder="Tell us about your coaching philosophy and approach..."
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm flex items-center"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => removeTag(index, setLanguages)}
                          className="ml-2 text-green-300 hover:text-green-100"
                        >
                          {/* X icon here */}
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add language"
                      className="bg-white/5 border-white/10 text-white"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag(languageInput, setLanguages, setLanguageInput)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                      onClick={() => addTag(languageInput, setLanguages, setLanguageInput)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {/* Loader2 icon here */}
                  Registering...
                </>
              ) : (
                <>
                  {/* Save icon here */}
                  Register as Coach
                </>
              )}
            </Button>
          </motion.div>
        </form>
      )}
    </motion.div>
  )
}
