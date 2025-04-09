"use client"

import { CircleGauge, Heart, Menu, Table2, Users } from "lucide-react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast, Toaster } from "sonner"
import { useAuth } from "../contexts/authContext"

function Moderator() {
  const navigate = useNavigate()
  const { userData, api } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    // Check if user is moderator
    const checkModerator = async () => {
      if (!token) {
        navigate("/login")
        return
      }

      setIsLoading(true)

      try {
        // First check if we already have userData from context
        if (userData) {
          if (userData.role !== "moderator" && userData.role !== "admin") {
            toast.error("You don't have permission to access this page")
            navigate("/")
          }
          setIsLoading(false)
          return
        }

        // If not, fetch the profile
        const response = await api.get("api/auth/profile")

        if (response.data && response.data.user) {
          if (response.data.user.role !== "moderator" && response.data.user.role !== "admin") {
            toast.error("You don't have permission to access this page")
            navigate("/")
          }
        } else {
          throw new Error("Invalid user data")
        }
      } catch (error) {
        console.error("Error checking moderator status:", error)
        toast.error("Authentication error. Please log in again.")
        navigate("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkModerator()
  }, [token, userData, navigate, api])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <l-tail-chase size="40" speed="1.75" color="#FA812F"></l-tail-chase>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <section className="h-screen flex flex-col">
        <div className="border-b py-2">
          <div className="customContainer py-2 flex items-center justify-between lg:justify-center md:justify-between">
            <h1 className="font-bold text-3xl text-orange text-center">Moderator Panel</h1>
            <label htmlFor="my-drawer-2" className="drawer-button lg:hidden w-[30px] cursor-pointer">
              <Menu className="w-10 h-10 text-orange border px-2 py-1 rounded-lg" />
            </label>
          </div>
        </div>
        <div className="drawer lg:drawer-open flex-1">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content bg-base-100 p-4 overflow-auto">
            <Outlet />
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 border-r h-full bg-white">
              <li className="hover:translate-x-2 duration-200">
                <NavLink
                  to="/moderator/dashboard"
                  className={({ isActive }) => (isActive ? "text-lg bg-orange text-white" : "text-lg")}
                >
                  <CircleGauge className="w-5 h-5 me-1" />
                  Dashboard
                </NavLink>
              </li>
              <li className="hover:translate-x-2 duration-200">
                <NavLink
                  to="/moderator/listings"
                  className={({ isActive }) => (isActive ? "text-lg bg-orange text-white" : "text-lg")}
                >
                  <Table2 className="w-5 h-5 me-1" />
                  Listings
                </NavLink>
              </li>
              <li className="hover:translate-x-2 duration-200">
                <NavLink
                  to="/moderator/users"
                  className={({ isActive }) => (isActive ? "text-lg bg-orange text-white" : "text-lg")}
                >
                  <Users className="w-5 h-5 me-1" />
                  Users
                </NavLink>
              </li>
              <li className="hover:translate-x-2 duration-200">
                <NavLink
                  to="/moderator/interests"
                  className={({ isActive }) => (isActive ? "text-lg bg-orange text-white" : "text-lg")}
                >
                  <Heart className="w-5 h-5 me-1" />
                  Interests
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

export default Moderator
