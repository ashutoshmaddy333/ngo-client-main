"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function NotLoggedIn({ Component }) {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  return <Component />
}

export default NotLoggedIn

