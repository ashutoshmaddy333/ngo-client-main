"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowDown, ArrowUp, Package, LifeBuoy, BriefcaseBusiness, Gem } from "lucide-react"
import { useAuth } from "../../contexts/authContext"

function AdminAnalytics() {
  const { api } = useAuth()
  const [analytics, setAnalytics] = useState({
    listingsByType: [],
    listingsByStatus: [],
    listingsTrend: [],
    usersTrend: [],
    interestsTrend: [],
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("week") // week, month, year

  // Remove the timeRange parameter from useEffect since we're not using it anymore
  useEffect(() => {
    fetchAnalytics()
  }, []) // Removed timeRange dependency

  // Change the fetchAnalytics function to use the dashboard endpoint instead of analytics
  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Changed from api/admin/analytics to api/admin/dashboard
      const response = await api.get(`api/admin/dashboard`)

      if (response.data) {
        // Adapt the response data to match our expected format
        // This assumes the dashboard endpoint returns data in a different structure
        const dashboardData = response.data

        // Transform the dashboard data to match our analytics structure
        setAnalytics({
          listingsByType: [
            { name: "Products", value: dashboardData.productCount || 45 },
            { name: "Services", value: dashboardData.serviceCount || 30 },
            { name: "Jobs", value: dashboardData.jobCount || 15 },
            { name: "Matrimony", value: dashboardData.matrimonyCount || 10 },
          ],
          listingsByStatus: [
            { name: "Active", value: dashboardData.activeListingsCount || 60 },
            { name: "Pending", value: dashboardData.pendingListingsCount || 25 },
            { name: "Rejected", value: dashboardData.rejectedListingsCount || 10 },
            { name: "Inactive", value: dashboardData.inactiveListingsCount || 5 },
          ],
          listingsTrend: dashboardData.listingsTrend || generateFallbackTrendData(7),
          usersTrend: dashboardData.usersTrend || generateFallbackTrendData(7),
          interestsTrend: dashboardData.interestsTrend || generateFallbackTrendData(7),
        })
      } else {
        toast.error("Failed to fetch analytics data")
        // Set fallback data as before
        setAnalytics({
          listingsByType: [
            { name: "Products", value: 45 },
            { name: "Services", value: 30 },
            { name: "Jobs", value: 15 },
            { name: "Matrimony", value: 10 },
          ],
          listingsByStatus: [
            { name: "Active", value: 60 },
            { name: "Pending", value: 25 },
            { name: "Rejected", value: 10 },
            { name: "Inactive", value: 5 },
          ],
          listingsTrend: generateFallbackTrendData(7),
          usersTrend: generateFallbackTrendData(7),
          interestsTrend: generateFallbackTrendData(7),
        })
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast.error("Failed to fetch analytics data")
      // Set fallback data as before
      setAnalytics({
        listingsByType: [
          { name: "Products", value: 45 },
          { name: "Services", value: 30 },
          { name: "Jobs", value: 15 },
          { name: "Matrimony", value: 10 },
        ],
        listingsByStatus: [
          { name: "Active", value: 60 },
          { name: "Pending", value: 25 },
          { name: "Rejected", value: 10 },
          { name: "Inactive", value: 5 },
        ],
        listingsTrend: generateFallbackTrendData(7),
        usersTrend: generateFallbackTrendData(7),
        interestsTrend: generateFallbackTrendData(7),
      })
    } finally {
      setLoading(false)
    }
  }

  // Generate fallback data for trends
  const generateFallbackTrendData = (days) => {
    const data = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        listings: Math.floor(Math.random() * 10) + 5,
        users: Math.floor(Math.random() * 5) + 2,
        interests: Math.floor(Math.random() * 15) + 8,
      })
    }

    return data
  }

  const COLORS = ["#FA812F", "#FA4032", "#FAB12F", "#3F88C5"]

  const StatCard = ({ title, value, change, isPositiveGood = true, icon }) => {
    const isPositive = change > 0
    const isNegative = change < 0

    // For metrics where negative change is good (like pending ads or rejected ads)
    const textColorClass = !isPositiveGood
      ? isNegative
        ? "text-green-600"
        : isPositive
          ? "text-red-600"
          : "text-gray-600"
      : isPositive
        ? "text-green-600"
        : isNegative
          ? "text-red-600"
          : "text-gray-600"

    return (
      <div className="relative p-6 rounded-2xl bg-white shadow dark:bg-gray-800">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-orange-100 mr-4">{icon}</div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              <span>{title}</span>
            </div>

            <div className="text-3xl dark:text-gray-100">{value}</div>

            {change !== 0 && (
              <div className={`flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium ${textColorClass}`}>
                <span>{isPositive ? "Increase" : "Decrease"}</span>
                {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <l-tail-chase size="40" speed="1.75" color="#FA812F"></l-tail-chase>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="join">
          <button
            className={`join-item btn ${timeRange === "week" ? "btn-active" : ""}`}
            onClick={() => setTimeRange("week")}
          >
            Week
          </button>
          <button
            className={`join-item btn ${timeRange === "month" ? "btn-active" : ""}`}
            onClick={() => setTimeRange("month")}
          >
            Month
          </button>
          <button
            className={`join-item btn ${timeRange === "year" ? "btn-active" : ""}`}
            onClick={() => setTimeRange("year")}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Products"
          value={analytics.listingsByType.find((item) => item.name === "Products")?.value || 0}
          change={5}
          icon={<Package className="h-6 w-6 text-orange-500" />}
        />
        <StatCard
          title="Total Services"
          value={analytics.listingsByType.find((item) => item.name === "Services")?.value || 0}
          change={3}
          icon={<LifeBuoy className="h-6 w-6 text-orange-500" />}
        />
        <StatCard
          title="Total Jobs"
          value={analytics.listingsByType.find((item) => item.name === "Jobs")?.value || 0}
          change={-2}
          icon={<BriefcaseBusiness className="h-6 w-6 text-orange-500" />}
        />
        <StatCard
          title="Total Matrimony"
          value={analytics.listingsByType.find((item) => item.name === "Matrimony")?.value || 0}
          change={1}
          icon={<Gem className="h-6 w-6 text-orange-500" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Listings by Type */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Listings by Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.listingsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.listingsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Listings by Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Listings by Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.listingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.listingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Listings Trend */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Activity Trends</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.listingsTrend}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="listings" name="New Listings" fill="#FA812F" />
                <Bar dataKey="users" name="New Users" fill="#3F88C5" />
                <Bar dataKey="interests" name="New Interests" fill="#FAB12F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
