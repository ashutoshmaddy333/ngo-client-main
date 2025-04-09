"use client"

import { useState, useEffect } from "react"
import { Check, ChevronLeft, Square, SquareCheckBig, X, UserCog, Shield, UserX } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [roleFilter, setRoleFilter] = useState("all")

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/admin/users?page=${page}&role=${roleFilter}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 10000, // 10 second timeout
        },
      )

      if (response.data.success) {
        setUsers(response.data.data || [])
        setTotalPages(response.data.totalPages || 1)
      } else {
        toast.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.")
      } else {
        toast.error("Failed to fetch users for management")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage, roleFilter])

  // Update the handleStatusChange function to use the bulk endpoint
  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Changed from api/admin/users/{userId}/status to api/admin/users/bulk
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/admin/users/bulk`,
        {
          userIds: [userId], // Send as array for consistency with bulk operations
          action: "status",
          value: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 5000,
        },
      )

      if (response.data.success) {
        // Update local state
        setUsers(users.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)))
        toast.success(`User status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update user status")
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to update user status")
      }
    }
  }

  // Update the handleRoleChange function to use the bulk endpoint as well
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/admin/users/bulk`,
        {
          userIds: [userId],
          action: "role",
          value: newRole,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 5000,
        },
      )

      if (response.data.success) {
        // Update local state
        setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))
        toast.success(`User role updated to ${newRole}`)
      } else {
        toast.error("Failed to update user role")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to update user role")
      }
    }
  }

  const handleBulkAction = async (action, value) => {
    if (selectedUsers.length === 0) {
      toast.warning("No users selected")
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/admin/users/bulk`,
        {
          userIds: selectedUsers,
          action,
          value,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 10000,
        },
      )

      if (response.data.success) {
        // Update local state based on action
        if (action === "role") {
          setUsers(users.map((user) => (selectedUsers.includes(user._id) ? { ...user, role: value } : user)))
          toast.success(`Updated ${selectedUsers.length} users to role: ${value}`)
        } else if (action === "status") {
          setUsers(users.map((user) => (selectedUsers.includes(user._id) ? { ...user, status: value } : user)))
          toast.success(`Updated ${selectedUsers.length} users to status: ${value}`)
        }

        setSelectedUsers([])
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

  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const selectAllUsers = () => {
    const allIds = users.map((user) => user._id)
    setSelectedUsers(allIds)
  }

  const unselectAllUsers = () => {
    setSelectedUsers([])
  }

  return (
    <div>
      <div className="container mx-auto lg:p-6 md:p-6 p-2">
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="join mb-3 flex overflow-scroll hideScrollbar">
            <button className="btn btn-outline border-gray-200 join-item" onClick={selectAllUsers}>
              <SquareCheckBig className="w-5 h-5" /> Select All
            </button>
            <button className="btn btn-outline border-gray-200 join-item" onClick={unselectAllUsers}>
              <Square className="w-5 h-5" /> Unselect All
            </button>
            <div className="dropdown dropdown-end">
              <button className="btn btn-outline border-gray-200 join-item">
                <UserCog className="w-5 h-5" /> Change Role
              </button>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button onClick={() => handleBulkAction("role", "user")}>User</button>
                </li>
                <li>
                  <button onClick={() => handleBulkAction("role", "moderator")}>Moderator</button>
                </li>
                <li>
                  <button onClick={() => handleBulkAction("role", "admin")}>Admin</button>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown-end">
              <button className="btn btn-outline border-gray-200 join-item">
                <Shield className="w-5 h-5" /> Change Status
              </button>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button onClick={() => handleBulkAction("status", "active")}>Activate</button>
                </li>
                <li>
                  <button onClick={() => handleBulkAction("status", "inactive")}>Deactivate</button>
                </li>
                <li>
                  <button onClick={() => handleBulkAction("status", "suspended")}>Suspend</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="ml-auto">
            <select
              className="select select-bordered w-full max-w-xs"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="moderator">Moderators</option>
              <option value="admin">Admins</option>
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
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
                      <td className="px-6 py-4">{user.phoneNumber || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="dropdown dropdown-hover">
                          <div
                            tabIndex={0}
                            role="button"
                            className={`
                            badge 
                            ${
                              user.role === "admin"
                                ? "badge-primary"
                                : user.role === "moderator"
                                  ? "badge-secondary"
                                  : "badge-ghost"
                            }
                            capitalize
                          `}
                          >
                            {user.role}
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <button onClick={() => handleRoleChange(user._id, "user")}>User</button>
                            </li>
                            <li>
                              <button onClick={() => handleRoleChange(user._id, "moderator")}>Moderator</button>
                            </li>
                            <li>
                              <button onClick={() => handleRoleChange(user._id, "admin")}>Admin</button>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="dropdown dropdown-hover">
                          <div
                            tabIndex={0}
                            role="button"
                            className={`
                            badge 
                            ${
                              user.status === "active"
                                ? "badge-success"
                                : user.status === "inactive"
                                  ? "badge-warning"
                                  : user.status === "suspended"
                                    ? "badge-error"
                                    : "badge-ghost"
                            }
                            capitalize
                          `}
                          >
                            {user.status || "active"}
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <button onClick={() => handleStatusChange(user._id, "active")}>Active</button>
                            </li>
                            <li>
                              <button onClick={() => handleStatusChange(user._id, "inactive")}>Inactive</button>
                            </li>
                            <li>
                              <button onClick={() => handleStatusChange(user._id, "suspended")}>Suspended</button>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="join">
                          <button
                            className="btn btn-outline btn-sm btn-success join-item"
                            onClick={() => handleStatusChange(user._id, "active")}
                            disabled={user.status === "active"}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-outline btn-sm btn-danger join-item"
                            onClick={() => handleStatusChange(user._id, "inactive")}
                            disabled={user.status === "inactive"}
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-outline btn-sm btn-warning join-item"
                            onClick={() => handleStatusChange(user._id, "suspended")}
                            disabled={user.status === "suspended"}
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center">
                      No users found
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

export default UserManagement
