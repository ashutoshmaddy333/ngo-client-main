"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/authContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"

function ServiceCard({ service }) {
  const { userInterests, api } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const hasShownInterest = userInterests.some((interest) => interest.listing._id === service._id)

  async function showInterest(id) {
    // Don't proceed if already loading or interest shown
    if (isLoading || hasShownInterest) return

    setIsLoading(true)

    try {
      // Verify user is authenticated
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to show interest")
        setIsLoading(false)
        return
      }

      // Verify backend URL is configured
      if (!api?.defaults?.baseURL) {
        toast.error("Service unavailable. Please try again later.")
        console.error("API baseURL not configured")
        setIsLoading(false)
        return
      }

      // Make the API call
      const response = await api.post(
        "api/interests",
        {
          listingId: id,
          listingType: "service",
          message: "hello",
        },
        {
          timeout: 10000, // 10 second timeout
        },
      )

      toast.success("Interest shown successfully!")
      console.log("Interest response:", response.data)
    } catch (error) {
      console.error("Interest error:", error)

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your internet connection.")
      } else if (error.response) {
        // Server responded with error status
        toast.error(error.response.data?.message || "Failed to show interest")
      } else if (error.request) {
        // No response received
        toast.error("Server not responding. Please try again later.")
      } else {
        // Other errors
        toast.error("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-72 bg-white border border-lightOrange rounded-lg overflow-hidden">
      <Link to={`/serviceDetail/${service._id}`}>
        <img
          src={service.files[0] || "/placeholder.svg"}
          className="w-full h-48 object-cover"
          alt={service.title}
          onError={(e) => (e.target.src = "/placeholder.svg")}
        />
        <div className="px-5 py-3">
          <h4 className="text-lg font-semibold mb-1 truncate">{service.title}</h4>
          <p className="text-sm text-gray-500">
            {service.city}, {service.state} ({service.pincode})
          </p>
          <p className="text-sm text-gray-500">Quantity: {service.quantity}</p>
          <p className="text-sm text-gray-500">
            Status: <span className="text-green-500 capitalize font-medium">{service.status}</span>
          </p>
        </div>
      </Link>

      <button
        onClick={() => showInterest(service._id)}
        disabled={hasShownInterest || isLoading}
        className={`w-full duration-200 text-white font-medium text-sm py-2 ${
          hasShownInterest
            ? "bg-gray-400 cursor-not-allowed"
            : isLoading
              ? "bg-lightOrange opacity-70 cursor-wait"
              : "bg-lightOrange hover:bg-orange"
        }`}
      >
        {isLoading ? "Processing..." : hasShownInterest ? "Interest Shown" : "Show Interest"}
      </button>
    </div>
  )
}

export default ServiceCard

