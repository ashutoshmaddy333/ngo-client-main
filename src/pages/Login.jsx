"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeIcon as EyeClosed, Mail } from "lucide-react"
import { toast, Toaster } from "sonner"
import { useAuth } from "../contexts/authContext"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"

function Login() {
  const { getUserData, api } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const baseUrl = import.meta.env.VITE_BASE_URL
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.post(`${baseUrl}api/auth/login`, formData)

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("userId", res.data.user.id)
        getUserData(res.data.token)

        toast.success("Login successful")

        if (res.data.user && res.data.user.role === "admin") {
          navigate("/admin")
        } else if (res.data.user && res.data.user.role === "moderator") {
          navigate("/moderator")
        } else {
          navigate("/")
        }
      } else {
        toast.error("Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)

      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          toast.error("Invalid email or password")
        } else {
          toast.error(error.response.data?.message || "Login failed")
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please try again later.")
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <Toaster position="top-right" richColors />
      <section>
        <div className="w-full px-4 py-40 sm:px-6 lg:w-1/2 lg:px-8 mx-auto">
          <div className="mx-auto max-w-lg flex flex-col justify-center gap-2">
            <img src="/images/logo2.svg" className="h-12" alt="" />
            <h1 className="text-2xl font-bold sm:text-3xl text-center">Login!</h1>
          </div>
          <form className="mx-auto mb-0 mt-8 max-w-md space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <Mail className="h-4 w-4 text-gray-400" />
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="absolute inset-y-0 end-0 grid place-content-center px-4"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? (
                    <Eye className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeClosed className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                No account?
                <Link to={"/signup"} className="underline ml-1 text-lightOrange" href="#">
                  Sign up
                </Link>
              </p>

              <button
                type="submit"
                className="inline-block rounded-lg bg-lightOrange hover:bg-orange px-5 py-3 text-sm font-semibold duration-200 text-white"
                disabled={loading}
              >
                {loading ? <l-bouncy size="36" speed="1.75" color="white"></l-bouncy> : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Login

