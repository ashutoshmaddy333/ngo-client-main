"use client"

import { useState, useEffect } from "react"
import { Bell, Trash2 } from "lucide-react"
import NotificationItem from "./NotificationItem"
import { toast } from "sonner"
import { useAuth } from "../../contexts/authContext"

function NotificationCenter() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { api } = useAuth()

  const fetchNotifications = async () => {
    if (!localStorage.getItem("token")) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.get("api/notifications")

      if (response.data && response.data.data) {
        setNotifications(response.data.data)
      } else {
        setNotifications([])
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications")

      // Don't show toast for network errors when component mounts
      if (isOpen) {
        if (error.code === "ERR_NETWORK") {
          toast.error("Network error. Please check your connection.")
        } else if (error.response?.status === 401) {
          toast.error("Authentication error. Please log in again.")
        } else {
          toast.error("Failed to load notifications")
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    if (!localStorage.getItem("token")) return

    try {
      const response = await api.get("api/notifications/count")

      if (response.data && typeof response.data.count === "number") {
        setUnreadCount(response.data.count)
      } else {
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
      // Don't set unread count to 0 on error to avoid flickering
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await api.put("api/notifications/mark-read", { notificationIds: [notificationId] })

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to mark notification as read")
      }
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((notification) => !notification.read).map((notification) => notification._id)

    if (unreadIds.length === 0) return

    try {
      await api.put("api/notifications/mark-read", { notificationIds: unreadIds })

      // Update local state
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to mark all notifications as read")
      }
    }
  }

  // Add notification cleanup functionality
  const cleanupNotifications = async () => {
    try {
      await api.delete("api/notifications/cleanup")

      toast.success("Old notifications cleaned up")
      fetchNotifications() // Refresh notifications
    } catch (error) {
      console.error("Error cleaning up notifications:", error)

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to clean up notifications")
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchNotifications()
      fetchUnreadCount()

      // Set up polling for new notifications
      const interval = setInterval(() => {
        fetchUnreadCount()
      }, 60000) // Check every minute

      return () => clearInterval(interval)
    }
  }, [])

  return (
    <div className="drawer drawer-end w-auto">
      <input
        id="notification-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <div className="drawer-content">
        <label
          htmlFor="notification-drawer"
          className="btn btn-ghost btn-circle drawer-button"
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen) fetchNotifications()
          }}
        >
          <div className="indicator">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="bg-lightOrange border-lightOrange badge badge-xs badge-primary indicator-item">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </label>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="notification-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setIsOpen(false)}
        ></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <div className="flex justify-between items-center border-b border-gray-400 pb-2 mb-1">
            <p className="font-semibold text-lg">Notifications</p>
            <div className="flex items-center gap-2">
              {notifications.length > 10 && (
                <button
                  onClick={cleanupNotifications}
                  className="text-xs text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Clean up old
                </button>
              )}
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-blue-500 hover:underline">
                  Mark all as read
                </button>
              )}
              <div className="bg-lightOrange text-white rounded-full px-3 py-1">
                <span>{notifications.length}</span>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <l-tail-chase size="30" speed="1.75" color="#FA812F"></l-tail-chase>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <button onClick={fetchNotifications} className="mt-2 text-sm text-lightOrange hover:underline">
                  Try again
                </button>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem key={notification._id} notification={notification} onMarkAsRead={markAsRead} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter
