"use client"

import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"

const host_url = import.meta.env.VITE_BASE_URL

function EditJob() {
  const { jobId } = useParams()
  const [formData, setFormData] = useState({})
  const [state, setState] = useState("")
  const [city, setCity] = useState("")
  const [file, setFile] = useState(null)

  useEffect(() => {
    const getServiceDetails = async () => {
      const response = await axios.get(`${host_url}/listings/job/${jobId}`)
      const data = response.data.data
      console.log(data)
      await getPincode(data.pincode)
      setFormData(data)
    }
    getServiceDetails()
  }, [])

  const getPincode = async (pincode) => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
      const data = response.data[0]
      if (data.Status === "Success") {
        const postOffice = data.PostOffice[0]
        setState(postOffice.State)
        setCity(postOffice.District)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFormData = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdatedForm = async (e) => {
    e.preventDefault()

    let image
    if (file) {
      image = URL.createObjectURL(file)
    }

    const finalFormData = { ...formData, files: image }
    console.log(finalFormData)

    const response = await axios.put(`${host_url}/listings/job/${jobId}`, finalFormData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })

    console.log(response)
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="customContainer my-2">
          <h1 className="text-lg font-semibold">Edit your Job details</h1>
        </div>
        <div className="customContainer bg-white px-3 mb-5 rounded-lg shadow-md">
          <div className="max-w-4xl max-sm:max-w-lg mx-auto p-4">
            <div className="text-center mb-4">
              <h4 className="text-neutral-800 font-semibold text-xl">Edit</h4>
            </div>

            <form>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                  <label className="text-gray-600 text-sm mb-1 font-medium block">Job Title</label>
                  <input
                    name="jobTitle"
                    type="text"
                    value={formData.jobTitle}
                    onChange={handleFormData}
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
                    value={formData.subCategory}
                    onChange={handleFormData}
                  >
                    <option value="">Select Sub-Category</option>
                    <option value="laptop">Laptop</option>
                    <option value="mobile">Mobile</option>
                    <option value="camera">Camera</option>
                    <option value="watch">Watch</option>
                    <option value="tv">TV</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-600 text-sm mb-1 font-medium block">Number of Positions</label>
                  <input
                    name="numberOfServices"
                    type="number"
                    value={formData.numberOfServices}
                    onChange={handleFormData}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                    placeholder="Enter Sevices quantity"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-1 block">Pincode</label>
                  <input
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleFormData}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all"
                    placeholder="Enter Pincode"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm mb-1 font-medium block">City</label>
                  <input
                    name="city"
                    type="text"
                    value={city}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all input-disabled"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm mb-1 font-medium block">State</label>
                  <input
                    name="state"
                    type="text"
                    value={state}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all input-disabled"
                    disabled
                  />
                </div>
                <div className="lg:col-span-2 md:col-span-1">
                  <label className="text-gray-600 text-sm mb-1 font-medium block">Job Description</label>
                  <textarea
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleFormData}
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded focus:bg-transparent outline-lightOrange transition-all resize-none"
                    id=""
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium mb-1 block">Upload file</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-gray-400 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
                  />
                  <p className="text-xs text-gray-400 mt-2">Maximum file size: 2MB & Max file count: 4</p>
                </div>
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  onClick={(e) => handleUpdatedForm(e)}
                  className="mx-auto block py-3 px-6 font-medium text-sm tracking-wider rounded text-white bg-lightOrange duration-200 hover:bg-orange focus:outline-none"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default EditJob

