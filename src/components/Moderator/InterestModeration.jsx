"use client"

import { useState, useEffect } from "react"
import { Check, CheckCheck, ChevronLeft, Square, SquareCheckBig, X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

function InterestModeration() {
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Update the fetchInterests function to use the correct endpoint and handle pagination on frontend
  const fetchInterests = async (page = 1) => {
    setLoading(true)
    try {
      // Changed from api/mod/interests?page=1 to api/mod/interests
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/mod/interests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.data && response.data.data) {
        const allInterests = response.data.data

        // Handle pagination on the frontend
        const itemsPerPage = 10 // Adjust as needed
        const totalItems = allInterests.length
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage)

        // Get the current page of interests
        const startIndex = (page - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedInterests = allInterests.slice(startIndex, endIndex)

        setInterests(paginatedInterests)
        setTotalPages(calculatedTotalPages)
      } else {
        setInterests([])
        setTotalPages(1)
        toast.error("Failed to fetch interests for moderation")
      }
    } catch (error) {
      console.error("Error fetching interests:", error)
      toast.error("Failed to fetch interests for moderation")
      setInterests([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterests(currentPage)
  }, [currentPage])

  const handleApprove = async (interestId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/mod/interests/approve-reject`,
        { interestId, action: "approve" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )

      // Update local state
      setInterests(
        interests.map((interest) => (interest._id === interestId ? { ...interest, status: "approved" } : interest)),
      )

      toast.success("Interest approved successfully")
    } catch (error) {
      console.error("Error approving interest:", error)
      toast.error("Failed to approve interest")
    }
  }

  const handleReject = async (interestId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/mod/interests/approve-reject`,
        { interestId, action: "reject" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )

      // Update local state
      setInterests(
        interests.map((interest) => (interest._id === interestId ? { ...interest, status: "rejected" } : interest)),
      )

      toast.error("Interest rejected successfully")
    } catch (error) {
      console.error("Error rejecting interest:", error)
      toast.error("Failed to reject interest")
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedInterests.length === 0) {
      toast.warning("No interests selected")
      return
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/mod/interests/bulk-approve-reject`,
        { interestIds: selectedInterests, action },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )

      // Update local state
      setInterests(
        interests.map((interest) =>
          selectedInterests.includes(interest._id)
            ? { ...interest, status: action === "approve" ? "approved" : "rejected" }
            : interest,
        ),
      )

      setSelectedInterests([])

      if (action === "approve") {
        toast.success(`${selectedInterests.length} interests approved successfully`)
      } else {
        toast.error(`${selectedInterests.length} interests rejected successfully`)
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error)
      toast.error(`Failed to ${action} interests`)
    }
  }

  const toggleSelectInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((id) => id !== interestId))
    } else {
      setSelectedInterests([...selectedInterests, interestId])
    }
  }

  const selectAllInterests = () => {
    const allIds = interests.map((interest) => interest._id)
    setSelectedInterests(allIds)
  }

  const unselectAllInterests = () => {
    setSelectedInterests([])
  }

  return (
    <div>
      <div className="container mx-auto lg:p-6 md:p-6 p-2">
        <div className="join mb-3 flex overflow-scroll hideScrollbar">
          <button className="btn btn-outline border-gray-200 join-item" onClick={selectAllInterests}>
            <SquareCheckBig className="w-5 h-5" /> Select All
          </button>
          <button className="btn btn-outline border-gray-200 join-item" onClick={unselectAllInterests}>
            <Square className="w-5 h-5" /> Unselect All
          </button>
          <button
            className="btn btn-outline border-gray-200 join-item"
            onClick={() => handleBulkAction("approve")}
            disabled={selectedInterests.length === 0}
          >
            <CheckCheck className="w-5 h-5" />
            Approve Selected
          </button>
          <button
            className="btn btn-outline border-gray-200 join-item"
            onClick={() => handleBulkAction("reject")}
            disabled={selectedInterests.length === 0}
          >
            <X className="w-5 h-5" />
            Reject Selected
          </button>
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
                    From User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    To User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Listing Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Listing Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {interests.length > 0 ? (
                  interests.map((interest) => (
                    <tr key={interest._id} className="bg-white border-b">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selectedInterests.includes(interest._id)}
                          onChange={() => toggleSelectInterest(interest._id)}
                        />
                      </td>
                      <td className="px-6 py-4">{interest.sender?.email || "Unknown"}</td>
                      <td className="px-6 py-4">{interest.receiver?.email || "Unknown"}</td>
                      <td className="px-6 py-4 capitalize">{interest.listingType}</td>
                      <td className="px-6 py-4">
                        {interest.listing?.title || interest.listing?.jobTitle || "Unknown"}
                      </td>
                      <td className="px-6 py-4">{interest.message}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`capitalize font-medium ${
                            interest.status === "approved"
                              ? "text-green-500"
                              : interest.status === "rejected"
                                ? "text-red-500"
                                : "text-yellow-500"
                          }`}
                        >
                          {interest.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(interest.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="join">
                          <button
                            className="btn btn-outline btn-success join-item"
                            onClick={() => handleApprove(interest._id)}
                            disabled={interest.status === "approved"}
                          >
                            <Check className="w-5 h-5" />
                            Approve
                          </button>
                          <button
                            className="btn btn-outline btn-danger join-item"
                            onClick={() => handleReject(interest._id)}
                            disabled={interest.status === "rejected"}
                          >
                            <X className="w-5 h-5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center">
                      No interests found for moderation
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

export default InterestModeration
