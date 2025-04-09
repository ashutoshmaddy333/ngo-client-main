"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/authContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"

function ProductCard({ product }) {
  const { userInterests, api } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const hasShownInterest = userInterests.some((interest) => interest.listing._id === product._id)

  async function showInterest(id) {
    // Don't proceed if already loading or interest shown
    if (isLoading || hasShownInterest) return

    setIsLoading(true)

    try {
      // Check if token exists
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to show interest")
        setIsLoading(false)
        return
      }

      // Use the api instance from auth context
      const res = await api.post("/api/interests", {
        listingId: id,
        listingType: "product",
        message: "hello",
      })

      if (res.data && res.data.success) {
        toast.success("Interest shown successfully")
      } else {
        toast.error(res.data?.message || "Failed to show interest")
      }
    } catch (error) {
      console.error("Error showing interest:", error)

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else if (error.response?.status === 401) {
        toast.error("Please login to show interest")
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Invalid request")
      } else {
        toast.error("Failed to show interest. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-72 bg-white border border-lightOrange rounded-lg overflow-hidden">
      <Link to={`/productDetail/${product._id}`}>
        <img
          src={product.files?.[0] || "/placeholder.svg"}
          className="w-full h-40 object-cover"
          alt={product.title}
          onError={(e) => (e.target.src = "/placeholder.svg")}
        />
        <div className="px-5 py-3">
          <h4 className="text-lg font-semibold mb-1 truncate" title={product.title}>
            {product.title}
          </h4>
          <p className="text-sm text-gray-500">
            {product.city}, {product.state} ({product.pincode})
          </p>
          <p className="text-sm text-gray-500">Qty.: {product.quantity}</p>
          <p className="text-sm text-gray-500">
            Status: <span className="text-green-500 capitalize font-medium">{product.status}</span>
          </p>
        </div>
      </Link>
      <button
        onClick={() => showInterest(product._id)}
        disabled={hasShownInterest || isLoading}
        className={`btn-block w-full duration-200 text-white font-medium text-sm py-2 ${
          hasShownInterest
            ? "bg-gray-400 cursor-not-allowed"
            : isLoading
              ? "bg-lightOrange opacity-70 cursor-wait"
              : "bg-lightOrange hover:bg-orange"
        }`}
      >
        {isLoading ? "Processing..." : hasShownInterest ? "Interest shown" : "Show Interest"}
      </button>
    </div>
  )
}

export default ProductCard

