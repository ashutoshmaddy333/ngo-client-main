"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, Toaster } from "sonner"
import { BarChart3, Users, Package, LifeBuoy, BriefcaseBusiness, Gem, Heart, Settings, LogOut } from "lucide-react"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAds: 0,
    totalInterests: 0,
    adsByType: {
      product: 0,
      service: 0,
      job: 0,
      matrimony: 0,
    },
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}auth/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        if (!response.data.user || response.data.user.role !== "admin") {
          toast.error("You don't have permission to access this page")
          navigate("/")
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        navigate("/")
      }
    }

    checkAdmin()
    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}admin/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      setStats(response.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-orange">Admin Panel</h2>
        </div>

        <nav className="mt-6">
          <button
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "dashboard" ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Dashboard
          </button>

          <button
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "users" ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </button>

          <button
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "products" ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("products")}
          >
            <Package className="h-5 w-5 mr-3" />
            Products
          </button>

          <button
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "services" ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("services")}
          >
            <LifeBuoy className="h-5 w-5 mr-3" />
            Services
          </button>

          <button
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "jobs" ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("jobs")}
          >
            <BriefcaseBusiness className="h-5 w-5 mr-3" />
            Jobs
          </button>

          <button
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "matrimony" ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("matrimony")}
          >
            <Gem className="h-5 w-5 mr-3" />
            Matrimony
          </button>

          <button
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "interests" ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("interests")}
          >
            <Heart className="h-5 w-5 mr-3" />
            Interests
          </button>

          <button
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "settings" ? "bg-orange text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </button>

          <button
            className="flex items-center px-6 py-3 w-full text-red-500 hover:bg-red-50 mt-10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        </header>

        <main className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <l-tail-chase size="40" speed="1.75" color="#FA812F"></l-tail-chase>
            </div>
          ) : activeTab === "dashboard" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Users Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              {/* Total Ads Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <Package className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Ads</p>
                    <p className="text-2xl font-semibold">{stats.totalAds}</p>
                  </div>
                </div>
              </div>

              {/* Total Interests Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 mr-4">
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Interests</p>
                    <p className="text-2xl font-semibold">{stats.totalInterests}</p>
                  </div>
                </div>
              </div>

              {/* Ads by Type */}
              <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-3">
                <h2 className="text-lg font-semibold mb-4">Ads by Type</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-orange mr-2" />
                      <p className="text-sm font-medium">Products</p>
                    </div>
                    <p className="text-2xl font-semibold mt-2">{stats.adsByType.product}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <LifeBuoy className="h-5 w-5 text-orange mr-2" />
                      <p className="text-sm font-medium">Services</p>
                    </div>
                    <p className="text-2xl font-semibold mt-2">{stats.adsByType.service}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <BriefcaseBusiness className="h-5 w-5 text-orange mr-2" />
                      <p className="text-sm font-medium">Jobs</p>
                    </div>
                    <p className="text-2xl font-semibold mt-2">{stats.adsByType.job}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Gem className="h-5 w-5 text-orange mr-2" />
                      <p className="text-sm font-medium">Matrimony</p>
                    </div>
                    <p className="text-2xl font-semibold mt-2">{stats.adsByType.matrimony}</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-3">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                {stats.recentActivity.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.recentActivity.map((activity, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{activity.action}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{activity.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-center text-gray-500">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management interface will be implemented here
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

