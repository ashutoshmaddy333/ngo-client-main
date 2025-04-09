"use client"

import { useState } from "react"
import Navbar from "../components/Navbar/Navbar"
import TermCond from "../components/TermCond/TermCond"
import Footer from "../components/Footer/Footer"
import axios from "axios"
import { toast, Toaster } from "sonner"

function PostAd() {
  const [activeTab, setActiveTab] = useState("tab1")
  const [selectedFiles, setSelectedFiles] = useState([])

  const [pincode, setPincode] = useState("")
  const [state, setState] = useState("")
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(null)

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
    setSelectedFiles(files)
  }

  const fetchPincodeData = async (value) => {
    setLoading(true)

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`)
      const data = response.data[0]

      if (data.Status === "Success") {
        const postOffice = data.PostOffice[0] // First matching location
        setState(postOffice.State)
        setCity(postOffice.District)
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

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    setPincode("")
    setState("")
    setCity("")
  }

  async function handleSubmit(e, type) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Convert termsAccepted to boolean
    data.termsAccepted = data.termsAccepted === 'on';
    
    const images = selectedFiles.map((file) => URL.createObjectURL(file));
    const finalData = { ...data, files: images };
  
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/listings/${type}`,
        finalData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(res);
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <Toaster position="top-right" richColors />
        <div className="customContainer my-2">
          <p className="text-lg font-semibold">Post Ad</p>
        </div>
        <div className="customContainer bg-white mb-5 rounded-lg shadow-md">
          <div className="p-4">
            <div className="flex w-[100%] border-b px-1 space-x-2 overflow-x-auto">
              <button
                id="tab1"
                className={`px-4 py-2 rounded-t ${
                  activeTab === "tab1"
                    ? "text-white font-bold bg-lightOrange"
                    : "bg-gray-200 text-gray-600 font-semibold"
                }`}
                onClick={() => handleTabClick("tab1")}
              >
                Product
              </button>
              <button
                id="tab2"
                className={`px-4 py-2 rounded-t ${
                  activeTab === "tab2"
                    ? "text-white font-bold bg-lightOrange"
                    : "bg-gray-200 text-gray-600 font-semibold"
                }`}
                onClick={() => handleTabClick("tab2")}
              >
                Service
              </button>
              <button
                id="tab3"
                className={`px-4 py-2 rounded-t ${
                  activeTab === "tab3"
                    ? "text-white font-bold bg-lightOrange"
                    : "bg-gray-200 text-gray-600 font-semibold"
                }`}
                onClick={() => handleTabClick("tab3")}
              >
                Job
              </button>
              <button
                id="tab4"
                className={`px-4 py-2 rounded-t ${
                  activeTab === "tab4"
                    ? "text-white font-bold bg-lightOrange"
                    : "bg-gray-200 text-gray-600 font-semibold"
                }`}
                onClick={() => handleTabClick("tab4")}
              >
                Matrimony
              </button>
            </div>

            {activeTab === "tab1" && (
              <div id="tab1Content">
                <div className="max-w-4xl max-sm:max-w-lg mx-auto p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-neutral-800 font-semibold text-xl">Add Product Details</h4>
                  </div>

                  <form onSubmit={(e) => handleSubmit(e, "product")}>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Title</label>
                        <input
                          name="title"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Product title"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Sub-Category of Ad</label>
                        <select
                          name="subCategory"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          id=""
                        >
                          <option value="">Select Sub-Category</option>
                          <option value="furniture">Furniture</option>
                          <option value="kitchen-dining">Kitchen & Dining</option>
                          <option value="home-decor">Home Décor</option>
                          <option value="fine-art">Fine Art</option>
                          <option value="pets">Pets</option>
                          <option value="electronics">Electronics</option>
                          <option value="bedroom-decor">Bedroom Décor</option>
                          <option value="books">Books</option>
                          <option value="medical-equipments">Medical Equipments</option>
                          <option value="clothes">Clothes</option>
                          <option value="shoes-chappals">Shoes, Chappals</option>
                          <option value="toys-cycles">Toys, Cycles</option>
                          <option value="sports-specific">Sports Specific</option>
                          <option value="school-kits">School Kits</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Quantity</label>
                        <input
                          name="quantity"
                          type="number"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Product quantity"
                        />
                      </div>
                      <div className="relative">
                        <label className="text-gray-600 text-sm font-medium mb-1 block">Pincode</label>
                        <input
                          name="pincode"
                          type="number"
                          maxLength="6"
                          value={pincode}
                          onChange={handlePincodeChange}
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Pincode"
                          disabled={loading}
                        />
                        {loading && (
                          <div className="absolute top-9 right-4">
                            <l-tail-chase size="20" speed="1.75" color="#FA4032"></l-tail-chase>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">State</label>
                        <input
                          name="state"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter State"
                          value={state}
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">City</label>
                        <input
                          name="city"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter City"
                          value={city}
                        />
                      </div>
                      <div className="lg:col-span-2 md:col-span-1">
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Description</label>
                        <textarea
                          rows="4"
                          name="description"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          id=""
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 font-medium mb-1 block">Upload file</label>
                        <input
                          type="file"
                          className="w-full text-gray-400 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
                          multiple
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={handleFileChange}
                          max="4"
                        />
                        <p className="text-xs text-gray-400 mt-2">Maximum file size: 2MB & Max file count: 4</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-5">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="text-gray-800 ml-3 block text-xs">
                        <span>I accept the</span>
                        <TermCond />
                      </label>
                    </div>
                    <div className="mt-8">
                      <button
                        type="submit"
                        className="mx-auto block py-3 px-6 font-medium text-sm tracking-wider rounded text-white bg-lightOrange duration-200 hover:bg-orange focus:outline-none"
                      >
                        Post Ad
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {activeTab === "tab2" && (
              <div id="tab2Content">
                <div className="max-w-4xl max-sm:max-w-lg mx-auto p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-neutral-800 font-semibold text-xl">Add Service Details</h4>
                  </div>

                  <form onSubmit={(e) => handleSubmit(e, "service")}>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Title</label>
                        <input
                          name="title"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Service title"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Sub-Category of Ad</label>
                        <select
                          name="subCategory"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          id=""
                        >
                          <option value="">Select Sub-Category</option>
                          <option value="dance">Dance</option>
                          <option value="instruments">Instruments</option>
                          <option value="karate">Karate</option>
                          <option value="boxing">Boxing</option>
                          <option value="sports-specific">Sports Specific</option>
                          <option value="personality-development">Personality Development</option>
                          <option value="public-speaking">Public Speaking</option>
                          <option value="tailoring">Tailoring</option>
                          <option value="beauty-salon">Beauty Salon</option>
                          <option value="fitness-training">Fitness Training</option>
                          <option value="coaching-classes">Coaching Classes</option>
                          <option value="cooking">Cooking</option>
                          <option value="stock-market">Stock Market</option>
                          <option value="sales">Sales</option>
                          <option value="interview-preparation">Interview Preparation</option>
                          <option value="entrance-exam-preparation">Entrance Exam Preparation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Number of Services </label>
                        <input
                          name="numberOfServices"
                          type="number"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Sevices quantity"
                        />
                      </div>
                      <div className="relative">
                        <label className="text-gray-600 text-sm font-medium mb-1 block">Pincode</label>
                        <input
                          name="pincode"
                          type="number"
                          maxLength="6"
                          value={pincode}
                          onChange={handlePincodeChange}
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Pincode"
                          disabled={loading}
                        />
                        {loading && (
                          <div className="absolute top-9 right-4">
                            <l-tail-chase size="20" speed="1.75" color="#FA4032"></l-tail-chase>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">State</label>
                        <input
                          name="state"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter State"
                          value={state}
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">City</label>
                        <input
                          name="city"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter City"
                          value={city}
                        />
                      </div>
                      <div className="lg:col-span-2 md:col-span-1">
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Description</label>
                        <textarea
                          rows="4"
                          name="description"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          id=""
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 font-medium mb-1 block">Upload file</label>
                        <input
                          type="file"
                          className="w-full text-gray-400 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
                          multiple
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={handleFileChange}
                          max="4"
                        />
                        <p className="text-xs text-gray-400 mt-2">Maximum file size: 2MB & Max file count: 4</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-5">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="text-gray-800 ml-3 block text-xs">
                        <span>I accept the</span>
                        <TermCond />
                      </label>
                    </div>
                    <div className="mt-8">
                      <button
                        type="submit"
                        className="mx-auto block py-3 px-6 font-medium text-sm tracking-wider rounded text-white bg-lightOrange duration-200 hover:bg-orange focus:outline-none"
                      >
                        Post Ad
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {activeTab === "tab3" && (
              <div id="tab3Content">
                <div className="max-w-4xl max-sm:max-w-lg mx-auto p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-neutral-800 font-semibold text-xl">Add Job Details</h4>
                  </div>

                  <form onSubmit={(e) => handleSubmit(e, "job")}>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Job Title</label>
                        <input
                          name="jobTitle"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Job title"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Category of Ad</label>
                        <select
                          name="subCategory"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          id=""
                        >
                          <option value="">Select Sub-Category</option>
                          <option value="technology">Technology (S/w or H/w)</option>
                          <option value="marketing">Marketing</option>
                          <option value="hr">HR</option>
                          <option value="admin">Admin</option>
                          <option value="accounts-finance">Accounts & Finance</option>
                          <option value="banking">Banking</option>
                          <option value="security">Security</option>
                          <option value="call-center">Call Center</option>
                          <option value="office-infrastructure">Office Infrastructure</option>
                          <option value="legal">Legal</option>
                          <option value="medical">Medical</option>
                          <option value="hospitality">Hospitality</option>
                          <option value="education">Education</option>
                          <option value="driver">Driver</option>
                          <option value="worker">Worker</option>
                          <option value="pharma">Pharma</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="aviation">Aviation</option>
                          <option value="construction">Construction</option>
                          <option value="supply-chain">Supply Chain</option>
                          <option value="management">Management</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Number of Positions</label>
                        <input
                          name="numberOfServices"
                          type="number"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Sevices quantity"
                        />
                      </div>
                      <div className="relative">
                        <label className="text-gray-600 text-sm font-medium mb-1 block">Pincode</label>
                        <input
                          name="pincode"
                          type="number"
                          maxLength="6"
                          value={pincode}
                          onChange={handlePincodeChange}
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter Pincode"
                          disabled={loading}
                        />
                        {loading && (
                          <div className="absolute top-9 right-4">
                            <l-tail-chase size="20" speed="1.75" color="#FA4032"></l-tail-chase>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">State</label>
                        <input
                          name="state"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter State"
                          value={state}
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm mb-1 font-medium block">City</label>
                        <input
                          name="city"
                          type="text"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          placeholder="Enter City"
                          value={city}
                        />
                      </div>
                      <div className="lg:col-span-2 md:col-span-1">
                        <label className="text-gray-600 text-sm mb-1 font-medium block">Job Description</label>
                        <textarea
                          rows="4"
                          name="description"
                          className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                          id=""
                        ></textarea>
                      </div>
                      {/* <div>
                                            <label className="text-sm text-gray-600 font-medium mb-1 block">Upload file</label>
                                            <input type="file"
                                                className="w-full text-gray-400 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                                            <p className="text-xs text-gray-400 mt-2">Maximum file size: 2MB & Max file count: 4</p>
                                        </div> */}
                    </div>
                    <div className="flex items-center mt-5">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="text-gray-800 ml-3 block text-xs">
                        <span>I accept the</span>
                        <TermCond />
                      </label>
                    </div>
                    <div className="mt-8">
                      <button
                        type="submit"
                        className="mx-auto block py-3 px-6 font-medium text-sm tracking-wider rounded text-white bg-lightOrange duration-200 hover:bg-orange focus:outline-none"
                      >
                        Post Ad
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {activeTab === "tab4" && (
              <div id="tab4Content">
                <div className="max-w-4xl max-sm:max-w-lg mx-auto p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-neutral-800 font-semibold text-xl">Add Matrimony Profile</h4>
                  </div>

                  <form onSubmit={(e) => handleSubmit(e, "matrimony")}>
  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">First Name</label>
      <input
        name="firstName"
        type="text"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter your first name"
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Middle Name</label>
      <input
        name="middleName"
        type="text"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter your middle name (optional)"
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Last Name</label>
      <input
        name="lastName"
        type="text"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter your last name"
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Gender</label>
      <select
        name="gender"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option hidden>Select your gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Age</label>
      <input
        name="age"
        type="number"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter your age (18 to 80 years)"
        min="18"
        max="80"
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Religion</label>
      <select
        name="religion"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select Religion</option>
        <option value="doesnt-matter">Doesn't Matter</option>
        <option value="hindu">Hindu</option>
        <option value="muslim">Muslim</option>
        <option value="sikh">Sikh</option>
        <option value="christian">Christian</option>
        <option value="buddhist">Buddhist</option>
        <option value="jain">Jain</option>
        <option value="parsi">Parsi</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Caste</label>
      <input
        name="caste"
        type="text"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter your caste (optional)"
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Marital Status</label>
      <select
        name="maritalStatus"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select Marital Status</option>
        <option value="doesnt-matter">Doesn't Matter</option>
        <option value="never-married">Never Married</option>
        <option value="awaiting-divorce">Awaiting Divorce</option>
        <option value="divorced">Divorced</option>
        <option value="widowed">Widowed</option>
        <option value="annulled">Annulled</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Blood Group</label>
      <select
        name="bloodGroup"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select Blood Group</option>
        <option value="a-positive">A Positive</option>
        <option value="a-negative">A Negative</option>
        <option value="b-positive">B Positive</option>
        <option value="b-negative">B Negative</option>
        <option value="ab-positive">AB Positive</option>
        <option value="ab-negative">AB Negative</option>
        <option value="o-positive">O Positive</option>
        <option value="o-negative">O Negative</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Height</label>
      <input
        name="height"
        type="text"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter your height (e.g., 5 ft 2 inch)"
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Weight</label>
      <input
        name="weight"
        type="number"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter your weight (40 to 120 kg)"
        min="40"
        max="120"
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Education</label>
      <input
        name="education"
        type="text"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter your highest education"
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Occupation</label>
      <select
        name="occupation"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select Occupation</option>
        <option value="doesnt-matter">Doesn't Matter</option>
        <option value="private-sector">Private Sector</option>
        <option value="govt-public-sector">Govt / Public Sector</option>
        <option value="civil-services">Civil Services</option>
        <option value="defence">Defence</option>
        <option value="business-self-employed">Business / Self Employed</option>
        <option value="professional">Professional (Doctor, CA, etc.)</option>
        <option value="not-working">Not Working</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Income Range</label>
      <select
        name="incomeRange"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select Income Range</option>
        <option value="less-than-5-lakhs">Less than 5 Lakhs</option>
        <option value="5-10-lakhs">5 to 10 Lakhs</option>
        <option value="10-20-lakhs">10 to 20 Lakhs</option>
        <option value="20-30-lakhs">20 to 30 Lakhs</option>
        <option value="above-30-lakhs">Above 30 Lakhs</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Food Preferences</label>
      <select
        name="foodPreference"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select Food Preference</option>
        <option value="doesnt-matter">Doesn't Matter</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="non-vegetarian">Non-Vegetarian</option>
        <option value="eggetarian">Eggetarian</option>
        <option value="jain">Jain</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Do you smoke?</label>
      <select
        name="smoking"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select choice</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Do you drink?</label>
      <select
        name="drinking"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select choice</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">
        Ready to relocate within Country?
      </label>
      <select
        name="relocateWithinCountry"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select choice</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">
        Ready to relocate outside Country?
      </label>
      <select
        name="relocateoutsideCountry"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select choice</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
    <div className="relative">
      <label className="text-gray-600 text-sm font-medium mb-1 block">Pincode</label>
      <input
        name="pincode"
        type="number"
        maxLength="6"
        value={pincode}
        onChange={handlePincodeChange}
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter 6-digit pincode"
        disabled={loading}
      />
      {loading && (
        <div className="absolute top-9 right-4">
          <l-tail-chase size="20" speed="1.75" color="#FA4032"></l-tail-chase>
        </div>
      )}
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">State</label>
      <input
        name="state"
        type="text"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter State"
        value={state}
        readOnly
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">City</label>
      <input
        name="city"
        type="text"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        placeholder="Enter City"
        value={city}
        readOnly
      />
    </div>
    <div>
      <label className="text-gray-600 text-sm mb-1 font-medium block">Country</label>
      <select
        name="country"
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
        id=""
      >
        <option value="">Select Country</option>
        <option value="india">India</option>
        <option value="usa">USA</option>
        <option value="canada">Canada</option>
        <option value="uk">UK</option>
        <option value="australia">Australia</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div>
      <label className="text-sm text-gray-600 font-medium mb-1 block">Upload Photos</label>
      <input
        type="file"
        className="w-full text-gray-400 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
        multiple
        accept="image/jpeg, image/png, image/jpg"
        onChange={handleFileChange}
        max="4"
      />
      <p className="text-xs text-gray-400 mt-2">Maximum file size: 2MB & Max file count: 4</p>
    </div>
  </div>
  <div>
    <label className="text-gray-600 text-sm font-medium mb-1 block">
      Other info / Partner expectations
    </label>
    <textarea
      name="otherInfo"
      className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
      rows="4"
      placeholder="Enter any additional information or your expectations from a partner"
      id=""
    ></textarea>
  </div>
  <div className="flex items-center mt-5">
    <input
      id="remember-me"
      name="termsAccepted"
      type="checkbox"
      className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label htmlFor="remember-me" className="text-gray-800 ml-3 block text-xs">
      <span>I accept the</span>
      <TermCond />
    </label>
  </div>
  <div className="mt-8">
    <button
      type="submit"
      className="mx-auto block py-3 px-6 font-medium text-sm tracking-wider rounded text-white bg-lightOrange duration-200 hover:bg-orange focus:outline-none"
    >
      Post Ad
    </button>
  </div>
</form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default PostAd

