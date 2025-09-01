import { motion } from "framer-motion"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  alternativeAction: string
  alternativeActionLink: string
}

export function AuthLayout({ children, title, subtitle, alternativeAction, alternativeActionLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-950 to-[#153036] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">{title}</h2>
          <p className="mt-2 text-center text-sm text-gray-400">{subtitle}</p>
        </motion.div>
        {children}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <Link
            href={alternativeActionLink}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-300"
          >
            {alternativeAction}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

