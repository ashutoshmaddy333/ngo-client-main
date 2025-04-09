"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Users,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  UserCog,
  FileText,
  PieChart,
} from "lucide-react"
import { useAuth } from "../../contexts/authContext"

function AdminSidebar() {
  const [expanded, setExpanded] = useState({
    listings: false,
    users: false,
    settings: false,
  })
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Initialize expanded state based on current path
  useEffect(() => {
    const path = location.pathname
    if (path.includes("/admin/listings")) {
      setExpanded((prev) => ({ ...prev, listings: true }))
    }
    if (path.includes("/admin/users")) {
      setExpanded((prev) => ({ ...prev, users: true }))
    }
    if (path.includes("/admin/settings")) {
      setExpanded((prev) => ({ ...prev, settings: true }))
    }
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleExpand = (section) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section],
    })
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const isPathActive = (path) => {
    return location.pathname.includes(path)
  }

  return (
    <div className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-orange">Admin Panel</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="mt-6 px-4">
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
              isActive("/admin/dashboard") ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>

          <Link
            to="/admin/analytics"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
              isActive("/admin/analytics") ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <PieChart className="h-5 w-5 mr-3" />
            Analytics
          </Link>

          {/* Listings Management */}
          <div className="mb-2">
            <button
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                isPathActive("/admin/listings") ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => toggleExpand("listings")}
            >
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-3" />
                <span>Listings</span>
              </div>
              {expanded.listings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {expanded.listings && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  to="/admin/listings/all"
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive("/admin/listings/all")
                      ? "bg-orange/20 text-orange font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  All Listings
                </Link>
                <Link
                  to="/admin/listings/pending"
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive("/admin/listings/pending")
                      ? "bg-orange/20 text-orange font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Pending Approval
                </Link>
              </div>
            )}
          </div>

          {/* Users Management */}
          <div className="mb-2">
            <button
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                isPathActive("/admin/users") ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => toggleExpand("users")}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3" />
                <span>Users</span>
              </div>
              {expanded.users ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {expanded.users && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  to="/admin/users/all"
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive("/admin/users/all")
                      ? "bg-orange/20 text-orange font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <UserCog className="h-4 w-4 mr-3" />
                  All Users
                </Link>
                <Link
                  to="/admin/users/moderators"
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive("/admin/users/moderators")
                      ? "bg-orange/20 text-orange font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <UserCog className="h-4 w-4 mr-3" />
                  Moderators
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/admin/interests"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
              isActive("/admin/interests") ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart className="h-5 w-5 mr-3" />
            Interests
          </Link>

          {/* Settings */}
          <div className="mb-2">
            <button
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                isPathActive("/admin/settings") ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => toggleExpand("settings")}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </div>
              {expanded.settings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {expanded.settings && (
              <div className="ml-6 mt-2 space-y-2">
                <Link
                  to="/admin/settings/system"
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive("/admin/settings/system")
                      ? "bg-orange/20 text-orange font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  System Config
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="p-4 border-t">
        <button
          className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
