"use client"

import { useState, useEffect } from "react"
import { Check, CheckCheck, ChevronLeft, Square, SquareCheckBig, X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

function UserModeration() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/mod/profiles?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setUsers(response.data.data)
      setTotalPages(response.data.totalPages || 1)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users for moderation")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage])

  const handleActivate = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/mod/profiles/approve-reject`,
        { userId, action: "approve" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )

      // Update local state
      setUsers(users.map((user) => (user._id === userId ? { ...user, status: "active" } : user)))

      toast.success("User activated successfully")
    } catch (error) {
      console.error("Error activating user:", error)
      toast.error("Failed to activate user")
    }
  }

  const handleDeactivate = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/mod/profiles/approve-reject`,
        { userId, action: "reject" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )

      // Update local state
      setUsers(users.map((user) => (user._id === userId ? { ...user, status: "inactive" } : user)))

      toast.error("User deactivated successfully")
    } catch (error) {
      console.error("Error deactivating user:", error)
      toast.error("Failed to deactivate user")
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.warning("No users selected")
      return
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/mod/profiles/bulk-approve-reject`,
        { userIds: selectedUsers, action },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )

      // Update local state
      setUsers(
        users.map((user) =>
          selectedUsers.includes(user._id) ? { ...user, status: action === "approve" ? "active" : "inactive" } : user,
        ),
      )

      setSelectedUsers([])

      if (action === "approve") {
        toast.success(`${selectedUsers.length} users activated successfully`)
      } else {
        toast.error(`${selectedUsers.length} users deactivated successfully`)
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error)
      toast.error(`Failed to ${action} users`)
    }
  }

  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const selectAllUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/mod/profiles/all-ids`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setSelectedUsers(response.data.userIds)
    } catch (error) {
      console.error("Error selecting all users:", error)
      toast.error("Failed to select all users")
    }
  }

  const unselectAllUsers = () => {
    setSelectedUsers([])
  }

  return (
    <div>
      <div className="container mx-auto lg:p-6 md:p-6 p-2">
        <div className="join mb-3 flex overflow-scroll hideScrollbar">
          <button className="btn btn-outline border-gray-200 join-item" onClick={selectAllUsers}>
            <SquareCheckBig className="w-5 h-5" /> Select All
          </button>
          <button className="btn btn-outline border-gray-200 join-item" onClick={unselectAllUsers}>
            <Square className="w-5 h-5" /> Unselect All
          </button>
          <button
            className="btn btn-outline border-gray-200 join-item"
            onClick={() => handleBulkAction("approve")}
            disabled={selectedUsers.length === 0}
          >
            <CheckCheck className="w-5 h-5" />
            Activate Selected
          </button>
          <button
            className="btn btn-outline border-gray-200 join-item"
            onClick={() => handleBulkAction("reject")}
            disabled={selectedUsers.length === 0}
          >
            <X className="w-5 h-5" />
            Deactivate Selected
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="bg-white border-b">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleSelectUser(user._id)}
                        />
                      </td>
                      <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phoneNumber}</td>
                      <td className="px-6 py-4">{`${user.city || ""}, ${user.state || ""}`}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`capitalize font-medium ${
                            user.status === "active"
                              ? "text-green-500"
                              : user.status === "inactive"
                                ? "text-red-500"
                                : "text-yellow-500"
                          }`}
                        >
                          {user.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="join">
                          <button
                            className="btn btn-outline btn-success join-item"
                            onClick={() => handleActivate(user._id)}
                            disabled={user.status === "active"}
                          >
                            <Check className="w-5 h-5" />
                            Activate
                          </button>
                          <button
                            className="btn btn-outline btn-danger join-item"
                            onClick={() => handleDeactivate(user._id)}
                            disabled={user.status === "inactive"}
                          >
                            <X className="w-5 h-5" />
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center">
                      No users found for moderation
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

export default UserModeration

