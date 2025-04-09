"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ArrowDown, ArrowUp } from "lucide-react"

function Dashboard() {
  const [stats, setStats] = useState({
    totalAdsLive: 0,
    totalAdsPending: 0,
    totalActiveUsers: 0,
    totalDeactivatedUsers: 0,
    totalAdsRejected: 0,
    adsLiveChange: 0,
    adsPendingChange: 0,
    activeUsersChange: 0,
    deactivatedUsersChange: 0,
    adsRejectedChange: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setStats(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        // Fallback to sample data if API fails
        setStats({
          totalAdsLive: 1500,
          totalAdsPending: 100,
          totalActiveUsers: 500,
          totalDeactivatedUsers: 100,
          totalAdsRejected: 50,
          adsLiveChange: 5,
          adsPendingChange: -10,
          activeUsersChange: 8,
          deactivatedUsersChange: 2,
          adsRejectedChange: -5,
        })
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  const StatCard = ({ title, value, change, isPositiveGood = true }) => {
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
        <div className="space-y-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-500 dark:text-gray-400">
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
    <div className="h-screen">
      <div className="grid gap-4 lg:gap-8 md:grid-cols-3 p-8">
        <StatCard title="Total Ads Live" value={stats.totalAdsLive} change={stats.adsLiveChange} />
        <StatCard
          title="Total Ads waiting for approval"
          value={stats.totalAdsPending}
          change={stats.adsPendingChange}
          isPositiveGood={false}
        />
        <StatCard title="Total Active Users" value={stats.totalActiveUsers} change={stats.activeUsersChange} />
        <StatCard
          title="Total Users Deactivated"
          value={stats.totalDeactivatedUsers}
          change={stats.deactivatedUsersChange}
          isPositiveGood={false}
        />
        <StatCard
          title="Total Ads Rejected"
          value={stats.totalAdsRejected}
          change={stats.adsRejectedChange}
          isPositiveGood={false}
        />
      </div>
    </div>
  )
}

export default Dashboard

