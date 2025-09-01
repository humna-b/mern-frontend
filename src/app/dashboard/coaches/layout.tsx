import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
export default function CoachesLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-blue-950 to-slate-900">
        {children} 
         <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="z-[9999]" // Ensure toasts appear above modals
        toastClassName="bg-slate-800 text-white border border-slate-700"
        progressClassName="bg-gradient-to-r from-blue-500 to-purple-500"
      />
      </div>
    )
  }
  
  