"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import { toast, Toaster } from "sonner"
import { ALargeSmall, Eye, EyeIcon as EyeClosed, Mail, MapPin, Smartphone } from "lucide-react"
import { useAuth } from "../contexts/authContext"

function Signup() {
  const { api } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [state, setState] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [timer, setTimer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mainLoading, setMainLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const fetchPincodeData = async (value) => {
    setLoading(true)

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${value}`)
      const data = await response.json()

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0] // First matching location
        setState(postOffice.State)
        setCity(postOffice.District)

        // Update form data with state and city
        setFormData((prev) => ({
          ...prev,
          state: postOffice.State,
          city: postOffice.District,
        }))
      } else {
        toast.error("Invalid PIN code. Please try again.")
        setState("")
        setCity("")
      }
    } catch (err) {
      toast.error("Error fetching pincode data. Try again later.")
      setState("")
      setCity("")
    } finally {
      setLoading(false)
    }
  }

  const handlePincodeChange = (e) => {
    const value = e.target.value
    setPincode(value)

    // Update form data
    setFormData((prev) => ({
      ...prev,
      pincode: value,
    }))

    if (timer) {
      clearTimeout(timer)
    }

    if (value.length === 6) {
      const newTimer = setTimeout(() => {
        fetchPincodeData(value)
      }, 1000)

      setTimer(newTimer)
    } else {
      setState("")
      setCity("")
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setMainLoading(true)
    try {
      const response = await api.post(`api/auth/register`, formData)

      if (response.data && response.data.success) {
        toast.success(response.data.message)
        navigate("/verifyOtp", { state: { userId: response.data.userId, otp: response.data.otp } })
      } else {
        toast.error("Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Signup error:", error)

      // Handle different error scenarios
      if (error.response) {
        toast.error(error.response.data?.message || "Registration failed", {
          description: "Please try with different email.",
        })
      } else if (error.request) {
        toast.error("No response from server. Please try again later.")
      } else {
        toast.error("An error occurred. Please try again.")
      }
    } finally {
      setMainLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <Toaster position="top-right" richColors />
      <section>
        <div className="w-full px-4 py-36 sm:px-6 lg:w-1/2 lg:px-8 mx-auto">
          <div className="mx-auto max-w-lg flex flex-col justify-center gap-2">
            <img src="/images/logo2.svg" className="h-12" alt="" />
            <h1 className="text-2xl font-bold sm:text-3xl text-center">Signup!</h1>
          </div>
          <form className="mx-auto mb-0 mt-8 max-w-lg space-y-4" onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter your First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <ALargeSmall className="h-5 w-5 text-gray-400" />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter your Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <ALargeSmall className="h-5 w-5 text-gray-400" />
                  </span>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
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
                <label htmlFor="phoneNumber" className="sr-only">
                  Mobile
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter mobile number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                  </span>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label htmlFor="gender" className="sr-only">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    id="gender"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="" hidden>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="pincode" className="sr-only">
                  Pincode
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter Pincode"
                    name="pincode"
                    value={pincode}
                    onChange={handlePincodeChange}
                    disabled={loading}
                    required
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    {loading ? (
                      <div className="absolute top-[50%] translate-y-[-50%] right-4">
                        <l-tail-chase size="20" speed="1.75" color="#FA4032"></l-tail-chase>
                      </div>
                    ) : (
                      <MapPin className="h-4 w-4 text-gray-400" />
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label htmlFor="state" className="sr-only">
                  State
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter State"
                    name="state"
                    value={state}
                    readOnly
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="city" className="sr-only">
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter City"
                    name="city"
                    value={city}
                    readOnly
                  />
                  <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </span>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
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
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm outline-none focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 end-0 grid place-content-center px-4"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {!showConfirmPassword ? (
                      <Eye className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeClosed className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Already have account?
                <Link to={"/login"} className="underline ml-1 text-lightOrange">
                  Login
                </Link>
              </p>

              <button
                type="submit"
                className="inline-block rounded-lg bg-lightOrange hover:bg-orange px-5 py-3 text-sm font-semibold duration-200 text-white"
                disabled={mainLoading}
              >
                {mainLoading ? <l-bouncy size="36" speed="1.75" color="white"></l-bouncy> : "Sign up"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Signup

