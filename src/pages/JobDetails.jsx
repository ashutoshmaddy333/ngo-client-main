"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import Loader from "../components/Loader/Loader"
import { useAuth } from "../contexts/authContext"
import { toast } from "sonner"

function JobDetails() {
  const [loading, setLoading] = useState(true)
  const [jobData, setJobData] = useState({})
  const [applying, setApplying] = useState(false)
  const { id } = useParams()
  const { userInterests, api } = useAuth()
  const hasApplied = userInterests.some((interest) => interest.listing._id === jobData?._id)

  useEffect(() => {
    async function getJobDetails() {
      setLoading(true)
      try {
        const response = await api.get(`/api/listings/job/${id}`)
        if (response.data?.success) {
          setJobData(response.data.data)
        } else {
          toast.error("Failed to load job details")
        }
      } catch (error) {
        console.error("Job details error:", error)
        if (error.code === "ERR_NETWORK") {
          toast.error("Network error. Please check your connection.")
        } else {
          toast.error("Failed to load job details")
        }
      } finally {
        setLoading(false)
      }
    }

    getJobDetails()
  }, [id, api])

  async function showInterest(jobId) {
    setApplying(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login to apply")
        return
      }

      const response = await api.post(
        "/api/interests",
        {
          listingId: jobId,
          listingType: "job",
          message: "hello",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10 second timeout
        },
      )

      if (response.data?.success) {
        toast.success("Application submitted successfully!")
        // Close the modal
        document.getElementById("job_application_modal").close()
        // You might want to refresh the user's interests here
      } else {
        toast.error(response.data?.message || "Failed to apply")
      }
    } catch (error) {
      console.error("Application error:", error)
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else if (error.response?.status === 401) {
        toast.error("Please login to apply")
      } else {
        toast.error(error.response?.data?.message || "Failed to apply")
      }
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="customContainer my-2">
          <p className="text-lg font-semibold">Job Details</p>
        </div>

        <div className="customContainer bg-white px-3 mb-5 rounded-lg shadow-md grid md:grid-cols-2 gap-4">
          <div className="grid place-content-center">
            <img src="/images/job-cover-img.svg" className="h-[280px]" alt={jobData.jobTitle || "Job"} />
          </div>

          <div className="space-y-2 lg:p-5 md:p-5 p-2">
            <p className="text-sm text-gray-500">
              Ad Id: <span className="font-semibold">{jobData._id}</span>
            </p>
            <h1 className="text-xl font-semibold">{jobData.jobTitle}</h1>

            <div>
              <p className="text-xs font-medium text-gray-500">Description</p>
              <p>{jobData.description}</p>
            </div>

            <ul className="list-disc list-outside grid grid-cols-2 pl-4 place-content-center">
              <li>
                <p className="text-xs font-medium text-gray-500">Pincode</p>
                <p>{jobData.pincode}</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">City</p>
                <p>{jobData.city}</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">State</p>
                <p>{jobData.state}</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">Country</p>
                <p>India</p>
              </li>
            </ul>

            <hr />

            <ul className="list-disc list-outside grid grid-cols-2 pl-4">
              <li>
                <p className="text-sm text-gray-500">Category</p>
                <p>Job</p>
              </li>
              <li>
                <p className="text-sm text-gray-500">Sub-Category</p>
                <p>{jobData.subCategory}</p>
              </li>
              <li>
                <p className="text-sm text-gray-500">Services Offered</p>
                <p>{jobData.numberOfServices}</p>
              </li>
            </ul>

            <div>
              {hasApplied ? (
                <button
                  className="btn-block rounded-lg bg-gray-400 duration-200 text-white font-medium text-sm py-2 cursor-not-allowed"
                  disabled
                >
                  Applied
                </button>
              ) : (
                <>
                  <button
                    className="w-full py-2 bg-lightOrange text-white rounded-lg hover:bg-orange transition-colors"
                    onClick={() => document.getElementById("job_application_modal").showModal()}
                  >
                    Apply to this Job
                  </button>

                  <dialog id="job_application_modal" className="modal">
                    <div className="modal-box">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" disabled={applying}>
                          ✕
                        </button>
                      </form>
                      <h3 className="font-bold text-lg">Confirm Application</h3>
                      <p className="py-4">Are you sure you want to apply for this job?</p>
                      <div className="modal-action">
                        <button
                          className="btn"
                          onClick={() => document.getElementById("job_application_modal").close()}
                          disabled={applying}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => showInterest(jobData._id)}
                          className="btn bg-lightOrange text-white hover:bg-orange"
                          disabled={applying}
                        >
                          {applying ? "Applying..." : "Confirm Apply"}
                        </button>
                      </div>
                    </div>
                  </dialog>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default JobDetails

