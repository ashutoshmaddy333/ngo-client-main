"use client"

import { useState, useEffect } from "react"
import { Check, CheckCheck, ChevronLeft, Square, SquareCheck, X } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "../../contexts/authContext"

function ListingModeration({ isAdmin = false }) {
  const { api } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedListings, setSelectedListings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [listingType, setListingType] = useState("all")
  const [statusFilter, setStatusFilter] = useState("pending")

  // Enhanced API request handler with better error reporting
  const handleApiRequest = async (apiCall, successMessage, errorMessage) => {
    try {
      const result = await apiCall()
      if (successMessage) {
        toast.success(successMessage)
      }
      return { success: true, data: result.data }
    } catch (error) {
      console.error(`${errorMessage}:`, error)

      if (error.response) {
        // The server responded with an error status code
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
        console.error("Response headers:", error.response.headers)

        const errorMsg = error.response.data?.message || error.response.statusText || "Unknown error"
        toast.error(`${errorMessage}: ${errorMsg}`)
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request sent but no response received:", error.request)
        toast.error(`${errorMessage}: No response from server`)
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message)
        toast.error(`${errorMessage}: ${error.message}`)
      }

      return { success: false, error }
    }
  }

  const fetchListings = async (page = 1, type = "all", status = "pending") => {
    setLoading(true)

    // Determine the correct API endpoint based on user role
    const endpoint = isAdmin
      ? `api/admin/listings?page=${page}&type=${type}&status=${status}`
      : `api/mod/listings?page=${page}&type=${type}&status=${status}`

    const result = await handleApiRequest(
      () => api.get(endpoint),
      null, // No success toast for fetching
      "Failed to fetch listings for moderation",
    )

    if (result.success) {
      setListings(result.data.data || [])
      setTotalPages(result.data.totalPages || 1)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchListings(currentPage, listingType, statusFilter)
  }, [currentPage, listingType, statusFilter])

  const handleApprove = async (listingId) => {
    const endpoint = isAdmin ? `api/admin/listings/${listingId}/status` : `api/mod/listings/approve-reject`

    // Adjust payload structure to match backend expectations
    const payload = isAdmin
      ? { status: "active" }
      : {
          listingId,
          action: "approve",
          // Add any additional fields the backend might expect
          reason: "", // Optional reason field
        }

    const result = await handleApiRequest(
      () => api.post(endpoint, payload),
      "Listing approved successfully",
      "Failed to approve listing",
    )

    if (result.success) {
      // Update local state
      setListings(listings.map((listing) => (listing._id === listingId ? { ...listing, status: "active" } : listing)))
    }
  }

  const handleReject = async (listingId) => {
    const endpoint = isAdmin ? `api/admin/listings/${listingId}/status` : `api/mod/listings/approve-reject`

    // Adjust payload structure to match backend expectations
    const payload = isAdmin
      ? { status: "rejected" }
      : {
          listingId,
          action: "reject",
          // Add any additional fields the backend might expect
          reason: "", // Optional reason field
        }

    const result = await handleApiRequest(
      () => api.post(endpoint, payload),
      "Listing rejected successfully",
      "Failed to reject listing",
    )

    if (result.success) {
      // Update local state
      setListings(listings.map((listing) => (listing._id === listingId ? { ...listing, status: "rejected" } : listing)))
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedListings.length === 0) {
      toast.warning("No listings selected")
      return
    }

    const endpoint = isAdmin ? `api/admin/listings/bulk` : `api/mod/listings/bulk-approve-reject`

    const payload = isAdmin ? { listingIds: selectedListings, action } : { listingIds: selectedListings, action }

    const actionLabel = action === "approve" ? "approve" : "reject"
    const successMessage =
      action === "approve"
        ? `${selectedListings.length} listings approved successfully`
        : `${selectedListings.length} listings rejected successfully`

    const result = await handleApiRequest(
      () => api.post(endpoint, payload),
      successMessage,
      `Failed to ${actionLabel} listings`,
    )

    if (result.success) {
      // Update local state
      setListings(
        listings.map((listing) =>
          selectedListings.includes(listing._id)
            ? { ...listing, status: action === "approve" ? "active" : "rejected" }
            : listing,
        ),
      )
      setSelectedListings([])
    }
  }

  const toggleSelectListing = (listingId) => {
    if (selectedListings.includes(listingId)) {
      setSelectedListings(selectedListings.filter((id) => id !== listingId))
    } else {
      setSelectedListings([...selectedListings, listingId])
    }
  }

  const selectAllListings = async () => {
    const allIds = listings.map((listing) => listing._id)
    setSelectedListings(allIds)
    toast.success(`Selected ${allIds.length} listings`)
  }

  const unselectAllListings = () => {
    setSelectedListings([])
    toast.info("All listings unselected")
  }

  const getListingDetailUrl = (listing) => {
    const { type, _id } = listing
    if (type === "product") return `/productDetail/${_id}`
    if (type === "service") return `/serviceDetail/${_id}`
    if (type === "job") return `/jobDetail/${_id}`
    if (type === "matrimony") return `/matrimonyProfile/${_id}`
    return "#"
  }

  return (
    <div>
      <div className="container mx-auto">
        <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
          <div className="join flex overflow-scroll hideScrollbar">
            <button className="btn btn-outline border-gray-200 join-item" onClick={selectAllListings}>
              <SquareCheck className="w-5 h-5" /> Select All
            </button>
            <button className="btn btn-outline border-gray-200 join-item" onClick={unselectAllListings}>
              <Square className="w-5 h-5" /> Unselect All
            </button>
            <button
              className="btn btn-outline border-gray-200 join-item"
              onClick={() => handleBulkAction("approve")}
              disabled={selectedListings.length === 0}
            >
              <CheckCheck className="w-5 h-5" />
              Approve Selected
            </button>
            <button
              className="btn btn-outline border-gray-200 join-item"
              onClick={() => handleBulkAction("reject")}
              disabled={selectedListings.length === 0}
            >
              <X className="w-5 h-5" />
              Reject Selected
            </button>
          </div>

          <div className="flex gap-2">
            <select
              className="select select-bordered w-full max-w-xs"
              value={listingType}
              onChange={(e) => {
                setListingType(e.target.value)
                setCurrentPage(1)
                setSelectedListings([])
              }}
            >
              <option value="all">All Types</option>
              <option value="product">Products</option>
              <option value="service">Services</option>
              <option value="job">Jobs</option>
              <option value="matrimony">Matrimony</option>
            </select>

            <select
              className="select select-bordered w-full max-w-xs"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
                setSelectedListings([])
              }}
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Statuses</option>
            </select>

            <button className="btn btn-outline" onClick={() => fetchListings(currentPage, listingType, statusFilter)}>
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <l-tail-chase size="40" speed="1.75" color="#FA812F"></l-tail-chase>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3">
                    View
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {listings.length > 0 ? (
                  listings.map((listing) => (
                    <tr key={listing._id} className="bg-white border-b">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selectedListings.includes(listing._id)}
                          onChange={() => toggleSelectListing(listing._id)}
                        />
                      </td>
                      <td className="px-6 py-4">{listing.title || listing.jobTitle || listing.firstName}</td>
                      <td className="px-6 py-4 capitalize">{listing.type}</td>
                      <td className="px-6 py-4 capitalize">{listing.subCategory || "N/A"}</td>
                      <td className="px-6 py-4">{listing.owner?.email || "Unknown"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`
                          badge 
                          ${
                            listing.status === "active"
                              ? "badge-success"
                              : listing.status === "pending"
                                ? "badge-warning"
                                : listing.status === "rejected"
                                  ? "badge-error"
                                  : "badge-ghost"
                          }
                          capitalize
                        `}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(listing.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Link to={getListingDetailUrl(listing)} target="_blank" className="text-blue-500 underline">
                          View
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="join">
                          <button
                            className="btn btn-outline btn-sm btn-success join-item"
                            onClick={() => handleApprove(listing._id)}
                            disabled={listing.status === "active"}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-outline btn-sm btn-danger join-item"
                            onClick={() => handleReject(listing._id)}
                            disabled={listing.status === "rejected"}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center">
                      No listings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <ol className="flex justify-center text-xs font-medium space-x-1 mt-3">
            <li>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center w-8 h-8 border border-gray-200 rounded"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li key={i}>
                <button
                  onClick={() => setCurrentPage(i + 1)}
                  className={`block w-8 h-8 text-center border rounded leading-8 ${
                    currentPage === i + 1 ? "text-white bg-lightOrange border-lightOrange" : "border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center w-8 h-8 border border-gray-200 rounded"
              >
                <ChevronLeft className="w-3 h-3 rotate-180" />
              </button>
            </li>
          </ol>
        )}
      </div>
    </div>
  )
}

export default ListingModeration
