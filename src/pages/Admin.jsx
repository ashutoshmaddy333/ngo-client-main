"use client"

import { CircleGauge, Heart, Menu, Table2, Users } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Admin() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (!data.user || data.user.role !== "admin") {
          navigate("/")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        navigate("/")
      }
    }

    if (!token) {
      navigate("/login")
    } else {
      checkAdmin()
    }
  }, [token, navigate])

  return (
    <>
      <section>
        <div className="border-b py-2">
          <div className="customContainer py-2 flex items-center justify-between lg:justify-center md:justify-between">
            <h1 className="font-bold text-3xl text-orange text-center">Admin Panel</h1>
            <label htmlFor="my-drawer-2" className="drawer-button lg:hidden w-[30px] cursor-pointer">
              <Menu className="w-10 h-10 text-orange border px-2 py-1 rounded-lg" />
            </label>
          </div>
        </div>
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content bg-base-100">
            <Outlet />
          </div>
          <div className="drawer-side h-fit">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 border-r h-[100vh] lg:h-[90vh]">
              <li className="hover:translate-x-2 duration-200">
                <NavLink to={"dashboard"} className="text-lg">
                  <CircleGauge className="w-5 h-5 me-1 text-orange" />
                  Dashboard
                </NavLink>
              </li>
              <li className="hover:translate-x-2 duration-200">
                <NavLink to={"ads"} className="text-lg">
                  <Table2 className="w-5 h-5 me-1 text-orange" />
                  Ads
                </NavLink>
              </li>
              <li className="hover:translate-x-2 duration-200">
                <NavLink to={"users"} className="text-lg">
                  <Users className="w-5 h-5 me-1 text-orange" />
                  Users
                </NavLink>
              </li>
              <li className="hover:translate-x-2 duration-200">
                <NavLink to={"interests"} className="text-lg">
                  <Heart className="w-5 h-5 me-1 text-orange" />
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

export default Admin

