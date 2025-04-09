"use client"

import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"
import AdminSidebar from "../components/Admin/AdminSidebar"
import { useAuth } from "../contexts/authContext"

function AdminLayout() {
  const navigate = useNavigate()
  const { userData, api } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      if (!token) {
        navigate("/login")
        return
      }

      setIsLoading(true)

      try {
        // First check if we already have userData from context
        if (userData) {
          if (userData.role !== "admin") {
            toast.error("You don't have permission to access this page")
            navigate("/")
          }
          setIsLoading(false)
          return
        }

        // If not, fetch the profile
        const response = await api.get("api/auth/profile")

        if (response.data && response.data.user) {
          if (response.data.user.role !== "admin") {
            toast.error("You don't have permission to access this page")
            navigate("/")
          }
        } else {
          throw new Error("Invalid user data")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        toast.error("Authentication error. Please log in again.")
        navigate("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [token, userData, navigate, api])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <l-tail-chase size="40" speed="1.75" color="#FA812F"></l-tail-chase>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" richColors />
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
