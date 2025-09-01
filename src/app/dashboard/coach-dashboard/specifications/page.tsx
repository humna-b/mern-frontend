"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Dumbbell, Clock, Target, Award, Users, Plus, Save, Trophy, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function SpecificationsPage() {
  const [specialties, setSpecialties] = useState(["Strength Training", "HIIT"])

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Coach Specifications</h1>
        <p className="text-gray-300">Define your expertise and coaching preferences</p>
      </motion.div>

      <div className="space-y-6">
        {/* Basic Information */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Expertise Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Years of Experience</label>
                <Input type="number" placeholder="Enter years" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Certifications</label>
                <Input placeholder="Enter certifications" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Specialties */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              Specialties
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                    {specialty}
                  </span>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-dashed border-white/20 text-gray-300 hover:text-white"
                  onClick={() => setSpecialties([...specialties, "New Specialty"])}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Specialty
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Training Preferences */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-purple-400" />
              Training Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Preferred Session Duration</label>
                <div className="flex gap-2">
                  {["30 min", "45 min", "60 min", "90 min"].map((duration) => (
                    <Button
                      key={duration}
                      variant="outline"
                      size="sm"
                      className="border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      {duration}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Maximum Group Size</label>
                <Input
                  type="number"
                  placeholder="Enter max group size"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Additional Information */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg bg-white/10 border-0 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Bio</label>
                <Textarea
                  placeholder="Tell us about your coaching philosophy and approach..."
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Languages Spoken</label>
                <Input placeholder="e.g., English, Spanish" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
            <Save className="w-4 h-4 mr-2" />
            Save Specifications
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

