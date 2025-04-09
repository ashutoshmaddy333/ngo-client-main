"use client"

import { useAuth } from "../contexts/authContext"
import { Lock, Save, Upload } from "lucide-react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner" // Changed from toast to sonner
import axios from "axios"

const host_url = import.meta.env.VITE_BASE_URL

function Profile() {
  const { userData, getUserData, api } = useAuth()
  const [formData, setFormData] = useState(userData || {})
  const [state, setState] = useState("")
  const [city, setCity] = useState("")
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (userData) {
      setFormData(userData)
      if (userData.city) setCity(userData.city)
      if (userData.state) setState(userData.state)

      // Set preview URL if user has a profile image
      if (userData.profileImage && userData.profileImage !== "default.png") {
        setPreviewUrl(`${host_url}/uploads/profile/${userData.profileImage}`)
      }
    }
  }, [userData])

  const handleFormData = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Create a preview URL for the selected image
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(selectedFile)
    }
  }

  const uploadProfileImage = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("profileImage", file)

    try {
      const res = await api.post("api/auth/upload-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (res.data.success) {
        toast.success("Profile image updated successfully")
        getUserData() // Refresh user data
      } else {
        toast.error("Failed to update profile image")
      }
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast.error(error.response?.data?.message || "An error occurred while uploading profile image")
    } finally {
      setUploading(false)
    }
  }

  // Function to look up city and state from pincode
  const lookupPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) return

    try {
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
      if (res.data && res.data[0].Status === "Success" && res.data[0].PostOffice) {
        const postOffice = res.data[0].PostOffice[0]
        setCity(postOffice.Block || postOffice.Name)
        setState(postOffice.State)
        setFormData((prev) => ({
          ...prev,
          city: postOffice.Block || postOffice.Name,
          state: postOffice.State,
        }))
      }
    } catch (error) {
      console.error("Error looking up pincode:", error)
    }
  }

  const handlePincodeChange = (e) => {
    const pincode = e.target.value
    handleFormData(e)
    if (pincode.length === 6) {
      lookupPincode(pincode)
    }
  }

  const handleUpdatedForm = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData(e.target)

    // Add profile image if available
    if (file) {
      formDataToSend.append("profileImage", file)
    }

    try {
      const response = await api.put("api/auth/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        toast.success("Profile updated successfully")
        getUserData() // Refresh user data
        setFile(null) // Clear file selection after successful update
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.response?.data?.message || "An error occurred while updating profile")
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    const oldPassword = e.target.oldPassword.value
    const newPassword = e.target.newPassword.value
    const confirmPassword = e.target.confirmPassword.value

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    try {
      const response = await api.put("api/auth/change-password", { oldPassword, newPassword })

      if (response.data.success) {
        toast.success("Password updated successfully")
        document.getElementById("updatePasswordModal").close()
        e.target.reset()
      } else {
        toast.error("Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error(error.response?.data?.message || "An error occurred while updating password")
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="customContainer my-2">
          <p className="text-lg font-semibold">Edit Profile</p>
        </div>
        <div className="customContainer bg-white mb-5 rounded-lg shadow-md">
          <div className="p-6 lg:col-span-3 lg:p-8">
            {/* Profile Image Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-lightOrange">
                  {previewUrl ? (
                    <img src={previewUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <span className="text-5xl">👤</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-lightOrange text-white p-2 rounded-full hover:bg-orange duration-200"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdatedForm} className="space-y-4 mb-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                name="profileImage"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter your first name"
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleFormData}
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter your last name"
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleFormData}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Email address"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleFormData}
                    disabled
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Mobile Number"
                    type="number"
                    id="phone"
                    name="mobile"
                    value={formData.mobile || ""}
                    onChange={handleFormData}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender || ""}
                    className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                    onChange={handleFormData}
                  >
                    <option hidden>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-1 block">Pincode</label>
                  <input
                    name="pincode"
                    type="text"
                    value={formData.pincode || ""}
                    onChange={handlePincodeChange}
                    className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                    placeholder="Enter Pincode"
                    maxLength={6}
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm mb-1 font-medium block">City</label>
                  <input
                    name="city"
                    type="text"
                    value={city}
                    className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200 input-disabled"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm mb-1 font-medium block">State</label>
                  <input
                    name="state"
                    type="text"
                    value={state}
                    className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200 input-disabled"
                    disabled
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-lightOrange hover:bg-orange duration-200 px-5 py-2 font-medium text-white"
                >
                  <Save className="inline-block h-4 w-4" /> SAVE CHANGES
                </button>
              </div>
            </form>
            <div>
              <button
                type="button"
                className="w-full text-sm rounded-lg bg-white ring-1 ring-lightOrange hover:bg-lightOrange hover:text-white duration-200 px-5 py-2 font-medium text-lightOrange"
                onClick={() => document.getElementById("updatePasswordModal").showModal()}
              >
                <Lock className="inline-block h-4 w-4" /> UPDATE PASSWORD
              </button>
              <dialog id="updatePasswordModal" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">
                    <Lock className="inline-block" /> Update Password!
                  </h3>
                  <form
                    onSubmit={handlePasswordUpdate}
                    className="mt-4 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2"
                  >
                    <label className="form-control w-full lg:col-span-2 md:col-span-2 col-span-1">
                      <div className="label">
                        <span className="label-text">Old Password</span>
                      </div>
                      <input
                        type="password"
                        placeholder="Enter your old password"
                        className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                        name="oldPassword"
                        required
                      />
                    </label>
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">New Password</span>
                      </div>
                      <input
                        type="password"
                        placeholder="Enter your new password"
                        className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                        name="newPassword"
                        required
                        minLength="6"
                      />
                    </label>
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Confirm New Password</span>
                      </div>
                      <input
                        type="password"
                        placeholder="Confirm your new password"
                        className="w-full rounded-lg border outline-none border-gray-200 p-3 text-sm focus:ring-1 ring-lightOrange duration-200"
                        name="confirmPassword"
                        required
                        minLength="6"
                      />
                    </label>
                    <div className="mt-3 lg:col-span-2 md:col-span-2 col-span-1 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-2">
                      <button
                        type="button"
                        className="bg-gray-200 text-gray-600 py-3 rounded-lg text-sm font-medium"
                        onClick={() => document.getElementById("updatePasswordModal").close()}
                      >
                        CANCEL
                      </button>
                      <button type="submit" className="bg-lightOrange text-white py-3 rounded-lg text-sm font-medium">
                        <Save className="inline-block h-4 w-4" /> SAVE & UPDATE
                      </button>
                    </div>
                  </form>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Profile
