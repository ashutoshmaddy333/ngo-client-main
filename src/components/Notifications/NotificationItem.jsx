"use client"

import { Bell, Package, LifeBuoy, CheckCircle, XCircle, UserCheck, User, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"

const getIcon = (type) => {
  switch (type) {
    case "interest_matched":
      return <UserCheck className="text-green-500" />
    case "service_request":
      return <LifeBuoy className="text-blue-500" />
    case "profile_matched":
      return <User className="text-purple-500" />
    case "ad_approved":
      return <CheckCircle className="text-green-500" />
    case "ad_rejected":
      return <XCircle className="text-red-500" />
    case "product_interest":
      return <ShoppingBag className="text-orange-500" />
    case "job_interest":
      return <Package className="text-indigo-500" />
    default:
      return <Bell className="text-gray-500" />
  }
}

const getTitle = (type) => {
  switch (type) {
    case "interest_matched":
      return "Interest Matched"
    case "service_request":
      return "Service request accepted"
    case "profile_matched":
      return "Profile Matched"
    case "ad_approved":
      return "Ad Approved"
    case "ad_rejected":
      return "Ad Rejected"
    case "product_interest":
      return "Product Interest"
    case "job_interest":
      return "Job Application"
    default:
      return "Notification"
  }
}

function NotificationItem({ notification, onMarkAsRead }) {
  const { _id, type, message, read, createdAt, relatedItem, relatedItemType } = notification

  const getRedirectUrl = () => {
    if (!relatedItem) return "#"

    if (relatedItemType === "product") return `/productDetail/${relatedItem._id}`
    if (relatedItemType === "service") return `/serviceDetail/${relatedItem._id}`
    if (relatedItemType === "job") return `/jobDetail/${relatedItem._id}`
    if (relatedItemType === "matrimony") return `/matrimonyProfile/${relatedItem._id}`
    return "#"
  }

  const handleClick = () => {
    if (!read) {
      onMarkAsRead(_id)
    }
  }

  return (
    <Link
      to={getRedirectUrl()}
      className={`flex items-center gap-2 py-3 px-2 border-b border-gray-200 hover:bg-gray-100 duration-200 ${!read ? "bg-blue-50" : ""}`}
      onClick={handleClick}
    >
      <div className="border-r border-gray-300 px-3">{getIcon(type)}</div>
      <div className="flex-1">
        <p className="font-semibold">{getTitle(type)}</p>
        <p className="text-xs text-gray-500">{message}</p>
        <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
      </div>
      {!read && <div className="w-2 h-2 rounded-full bg-lightOrange mr-1"></div>}
    </Link>
  )
}

export default NotificationItem
