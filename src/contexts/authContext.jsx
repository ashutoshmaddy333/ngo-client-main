"use client"

import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

const AuthContext = createContext()

// Ensure the API instance is properly configured
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "https://ngo-main-3.onrender.com", // Fallback URL if env var is not set
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout for all requests
})

// Add request interceptor to handle token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Ensure URL doesn't have double slashes (except after http:// or https://)
    if (config.url && config.url.startsWith("/") && config.baseURL && config.baseURL.endsWith("/")) {
      config.url = config.url.substring(1)
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS errors more gracefully
    if (error.message === "Network Error") {
      console.error("Network error occurred:", error)
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out:", error)
    } else if (error.response?.status === 401) {
      // Handle unauthorized errors (expired token, etc.)
      console.error("Authentication error:", error)
      // Could add auto-logout here if needed
    }
    return Promise.reject(error)
  },
)

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  const [productsList, setProductsList] = useState([])
  const [servicesList, setServicesList] = useState([])
  const [jobsList, setJobsList] = useState([])
  const [matrimonailProfiles, setMatrimonailProfiles] = useState([])
  const [userAds, setUserAds] = useState([])
  const [userInterests, setUserInterests] = useState([])
  const [receivedInterests, setReceivedInterests] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      getUserData()
      getUserAds()
      getUserInterests()
      getReceivedInterests()
    }
    getProductListings()
    getServiceListings()
    getJobsListings()
    getMatrimonailProfiles()
  }, [token])

  async function getUserData(tokenGen) {
    setLoading(true)
    try {
      const res = await api.get(`api/auth/profile`, {
        headers: { Authorization: `Bearer ${tokenGen || token}` },
      })

      if (res.data && res.data.user) {
        setUserData(res.data.user)
      } else {
        console.error("Invalid user data format:", res.data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else if (error.response?.status === 401) {
        // Token might be invalid or expired
        localStorage.removeItem("token")
        setUserData(null)
      }
    } finally {
      setLoading(false)
    }
  }

  async function getProductListings() {
    try {
      const res = await api.get(`api/listings/product`)
      setProductsList(res.data.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      // Set empty array to prevent undefined errors
      setProductsList([])
    }
  }

  async function getServiceListings() {
    try {
      const res = await api.get(`api/listings/service`)
      setServicesList(res.data.data || [])
    } catch (error) {
      console.error("Error fetching services:", error)
      // Set empty array to prevent undefined errors
      setServicesList([])
    }
  }

  async function getJobsListings() {
    try {
      const res = await api.get(`api/listings/job`)
      setJobsList(res.data.data || [])
    } catch (error) {
      console.error("Error fetching jobs:", error)
      // Set empty array to prevent undefined errors
      setJobsList([])
    }
  }

  async function getMatrimonailProfiles() {
    try {
      const res = await api.get(`api/listings/matrimony`)
      setMatrimonailProfiles(res.data.data || [])
    } catch (error) {
      console.error("Error fetching matrimony profiles:", error)
      // Set empty array to prevent undefined errors
      setMatrimonailProfiles([])
    }
  }

  async function getUserAds() {
    if (!token) return

    try {
      const res = await api.get(`api/listings/my-listings`)
      setUserAds(res.data.data || [])
    } catch (error) {
      console.error("Error fetching user ads:", error)
      // Set empty array to prevent undefined errors
      setUserAds([])
    }
  }

  async function getUserInterests() {
    if (!token) return

    try {
      const res = await api.get(`api/interests/sent`)
      setUserInterests(res.data.data || [])
    } catch (error) {
      console.error("Error fetching user interests:", error)
      // Set empty array to prevent undefined errors
      setUserInterests([])
    }
  }

  async function getReceivedInterests() {
    if (!token) return

    try {
      const res = await api.get(`api/interests/received`)
      setReceivedInterests(res.data.data || [])
    } catch (error) {
      console.error("Error fetching received interests:", error)
      // Set empty array to prevent undefined errors
      setReceivedInterests([])
    }
  }

  async function respondToInterest(interestId, action) {
    try {
      const res = await api.put(`api/interests/${interestId}/respond`, { action })

      // Update local state
      setReceivedInterests(
        receivedInterests.map((interest) =>
          interest._id === interestId
            ? { ...interest, status: action === "accept" ? "accepted" : "rejected" }
            : interest,
        ),
      )

      if (action === "accept") {
        toast.success("Interest accepted successfully")
      } else {
        toast.error("Interest rejected successfully")
      }

      return res.data
    } catch (error) {
      console.error("Error responding to interest:", error)

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to respond to interest")
      }
      throw error
    }
  }

  function logout() {
    localStorage.removeItem("token")
    setUserData(null)
    setUserAds([])
    setUserInterests([])
    setReceivedInterests([])
  }

  const values = {
    userData,
    getUserData,
    logout,
    productsList,
    servicesList,
    jobsList,
    matrimonailProfiles,
    userAds,
    userInterests,
    receivedInterests,
    loading,
    respondToInterest,
    getUserAds,
    getUserInterests,
    getReceivedInterests,
    api, // Export the api instance for use in other components
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
