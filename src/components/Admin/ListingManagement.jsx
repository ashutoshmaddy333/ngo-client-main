"use client"

import { useState, useEffect } from "react"
import { Check, CheckCheck, ChevronLeft, Square, SquareCheckBig, X } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"

function ListingManagement() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedListings, setSelectedListings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [listingType, setListingType] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchListings = async (page = 1, type = "all", status = "all") => {
    setLoading(true)
    try {
      // Changed from api/admin/listings to api/admin/mod/listings
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/admin/mod/listings?page=${page}&type=${type}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 10000, // 10 second timeout
        },
      )

      if (response.data.success) {
        setListings(response.data.data || [])
        setTotalPages(response.data.totalPages || 1)
      } else {
        toast.error("Failed to fetch listings")
      }
    } catch (error) {
      console.error("Error fetching listings:", error)
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.")
      } else {
        toast.error("Failed to fetch listings for management")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings(currentPage, listingType, statusFilter)
  }, [currentPage, listingType, statusFilter])

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/mod/interests/approve-reject`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 5000,
        },
      )

      if (response.data.success) {
        // Update local state
        setListings(
          listings.map((listing) => (listing._id === listingId ? { ...listing, status: newStatus } : listing)),
        )
        toast.success(`Listing status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update listing status")
      }
    } catch (error) {
      console.error("Error updating listing status:", error)
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to update listing status")
      }
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedListings.length === 0) {
      toast.warning("No listings selected")
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/admin/listings/bulk`,
        {
          listingIds: selectedListings,
          action,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 10000,
        },
      )

      if (response.data.success) {
        // Update local state based on action
        if (action === "approve") {
          setListings(
            listings.map((listing) =>
              selectedListings.includes(listing._id) ? { ...listing, status: "active" } : listing,
            ),
          )
          toast.success(`Approved ${selectedListings.length} listings`)
        } else if (action === "reject") {
          setListings(
            listings.map((listing) =>
              selectedListings.includes(listing._id) ? { ...listing, status: "rejected" } : listing,
            ),
          )
          toast.error(`Rejected ${selectedListings.length} listings`)
        } else if (action === "delete") {
          setListings(listings.filter((listing) => !selectedListings.includes(listing._id)))
          toast.success(`Deleted ${selectedListings.length} listings`)
        }

        setSelectedListings([])
      } else {
        toast.error("Failed to perform bulk action")
      }
    } catch (error) {
      console.error("Error performing bulk action:", error)
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to perform bulk action")
      }
    }
  }

  const toggleSelectListing = (listingId) => {
    if (selectedListings.includes(listingId)) {
      setSelectedListings(selectedListings.filter((id) => id !== listingId))
    } else {
      setSelectedListings([...selectedListings, listingId])
    }
  }

  const selectAllListings = () => {
    const allIds = listings.map((listing) => listing._id)
    setSelectedListings(allIds)
  }

  const unselectAllListings = () => {
    setSelectedListings([])
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
      <div className="container mx-auto lg:p-6 md:p-6 p-2">
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="join mb-3 flex overflow-scroll hideScrollbar">
            <button className="btn btn-outline border-gray-200 join-item" onClick={selectAllListings}>
              <SquareCheckBig className="w-5 h-5" /> Select All
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
            <button
              className="btn btn-outline border-gray-200 join-item btn-error"
              onClick={() => handleBulkAction("delete")}
              disabled={selectedListings.length === 0}
            >
              <X className="w-5 h-5" />
              Delete Selected
            </button>
          </div>

          <div className="ml-auto flex gap-2">
            <select
              className="select select-bordered"
              value={listingType}
              onChange={(e) => {
                setListingType(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Types</option>
              <option value="product">Products</option>
              <option value="service">Services</option>
              <option value="job">Jobs</option>
              <option value="matrimony">Matrimony</option>
            </select>

            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
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
                            onClick={() => handleStatusChange(listing._id, "active")}
                            disabled={listing.status === "active"}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-outline btn-sm btn-danger join-item"
                            onClick={() => handleStatusChange(listing._id, "rejected")}
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

export default ListingManagement
