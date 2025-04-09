"use client"

import { useAuth } from "../contexts/authContext"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import { X } from "lucide-react"
import { toast, Toaster } from "sonner"
import { useState } from "react"
import axios from "axios"

function YourAds() {
  const { userAds, receivedInterests, getUserAds } = useAuth()
  const [loading, setLoading] = useState({})

  const options2 = {
    type: "slide",
    perPage: 4,
    gap: "0.75rem",
    pagination: true,
    arrows: false,
    perMove: 1,
    breakpoints: {
      1200: {
        perPage: 3,
      },
      900: {
        perPage: 2,
        autoplay: true,
        arrows: true,
      },
      600: {
        perPage: 1,
        autoplay: true,
        pagination: false,
        arrows: true,
      },
    },
  }

  const handleAcceptInterest = async (interestId) => {
    setLoading((prev) => ({ ...prev, [interestId]: true }))
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}interests/${interestId}/respond`,
        { action: "accept" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      toast.success("Interest accepted successfully")
      setLoading((prev) => ({ ...prev, [interestId]: false }))
      // Refresh the received interests
      getUserAds()
    } catch (error) {
      console.error("Error accepting interest:", error)
      toast.error("Failed to accept interest")
      setLoading((prev) => ({ ...prev, [interestId]: false }))
    }
  }

  const handleRejectInterest = async (interestId) => {
    setLoading((prev) => ({ ...prev, [interestId]: true }))
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}interests/${interestId}/respond`,
        { action: "reject" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      toast.error("Interest rejected successfully")
      setLoading((prev) => ({ ...prev, [interestId]: false }))
      // Refresh the received interests
      getUserAds()
    } catch (error) {
      console.error("Error rejecting interest:", error)
      toast.error("Failed to reject interest")
      setLoading((prev) => ({ ...prev, [interestId]: false }))
    }
  }

  const handleDeactivateAd = async (adId, type) => {
    setLoading((prev) => ({ ...prev, [`deactivate-${adId}`]: true }))
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/listings/${type}/${adId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      toast.success("Ad deactivated successfully")
      setLoading((prev) => ({ ...prev, [`deactivate-${adId}`]: false }))
      // Refresh the user ads
      getUserAds()
    } catch (error) {
      console.error("Error deactivating ad:", error)
      toast.error("Failed to deactivate ad")
      setLoading((prev) => ({ ...prev, [`deactivate-${adId}`]: false }))
    }
  }

  return (
    <>
      <Navbar />
      <Toaster position="top-right" richColors />
      <main>
        <div className="customContainer my-2">
          <h1 className="text-lg font-semibold">Your Ads</h1>
        </div>
        <div className="customContainer bg-white mb-5 rounded-lg shadow-md p-6">
          <h2 className="font-semibold mb-2 text-center text-orange">Your Product Ads</h2>
          <div>
            <Splide aria-label="services slides" options={options2} className="pb-8">
              {userAds?.product?.map((product) => {
                return (
                  <SplideSlide key={product._id} className="flex justify-center items-center">
                    <div className="bg-white border border-lightOrange rounded-lg overflow-hidden">
                      <img
                        src={product.files[0] || "/images/product1.jpg"}
                        className="w-full h-48 object-cover"
                        alt=""
                      />
                      <div className="px-5 my-3">
                        <h4 className="text-lg font-semibold mb-1">{product.title}</h4>
                        <p className="text-sm text-gray-500">
                          {product.city}, {product.state} ({product.pincode})
                        </p>
                        <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                        <p className="text-sm text-gray-500">
                          Status: <span className="text-green-500 capitalize">{product.status}</span>
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 px-2 my-3">
                        <button
                          className="btn-block rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2 col-span-2"
                          onClick={() => document.getElementById(`interestReceivedModal${product._id}`).showModal()}
                        >
                          Interests received
                        </button>
                        <dialog id={`interestReceivedModal${product._id}`} className="modal">
                          <div className="modal-box">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold text-lg">Interests Received:</h3>
                              <button>
                                <X
                                  className="h-6 w-6"
                                  onClick={() => document.getElementById(`interestReceivedModal${product._id}`).close()}
                                />
                              </button>
                            </div>
                            {receivedInterests
                              .filter((interest) => interest.listing._id === product._id)
                              .map((interest) => {
                                return (
                                  <div key={interest._id} className="border border-lightOrange rounded-lg p-2 mb-2">
                                    <p>
                                      Name:{" "}
                                      <span className="font-semibold">
                                        {interest.sender.firstName} {interest.sender.lastName}
                                      </span>
                                    </p>
                                    <p>
                                      Email: <span className="font-semibold">{interest.sender.email}</span>
                                    </p>
                                    <p>
                                      Phone:{" "}
                                      <span className="font-semibold">
                                        {interest.sender.phoneNumber || "Not provided"}
                                      </span>
                                    </p>
                                    <p>
                                      Address:{" "}
                                      <span className="font-semibold">
                                        {interest.sender.city || ""}, {interest.sender.state || ""}
                                      </span>
                                    </p>
                                    <p>
                                      Status:{" "}
                                      <span
                                        className={`font-semibold capitalize ${
                                          interest.status === "accepted"
                                            ? "text-green-500"
                                            : interest.status === "rejected"
                                              ? "text-red-500"
                                              : "text-yellow-500"
                                        }`}
                                      >
                                        {interest.status || "pending"}
                                      </span>
                                    </p>
                                    {interest.status === "pending" && (
                                      <div className="flex justify-end gap-2 mt-2">
                                        <button
                                          className="btn-ghost duration-200 py-1 px-2 rounded-lg"
                                          onClick={() => handleRejectInterest(interest._id)}
                                          disabled={loading[interest._id]}
                                        >
                                          {loading[interest._id] ? (
                                            <l-tail-chase size="15" speed="1.75" color="#FA4032"></l-tail-chase>
                                          ) : (
                                            "Decline"
                                          )}
                                        </button>
                                        <button
                                          className="bg-lightOrange text-white hover:bg-orange duration-200 py-1 px-2 rounded-lg"
                                          onClick={() => handleAcceptInterest(interest._id)}
                                          disabled={loading[interest._id]}
                                        >
                                          {loading[interest._id] ? (
                                            <l-tail-chase size="15" speed="1.75" color="white"></l-tail-chase>
                                          ) : (
                                            "Accept"
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            {receivedInterests.filter((interest) => interest.listing._id === product._id).length ===
                              0 && <p className="text-center py-4 text-gray-500">No interests received yet</p>}
                          </div>
                        </dialog>
                        <Link
                          to={`/editProduct/${product._id}`}
                          className="btn-block text-center rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => document.getElementById(`deactivateModal${product._id}`).showModal()}
                          className="btn-block rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2"
                        >
                          Deactivate
                        </button>
                        <dialog id={`deactivateModal${product._id}`} className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg">Are you sure?</h3>
                            <p className="py-4 text-sm">
                              If you deactivate your ad, it will be no longer visible to users.
                            </p>
                            <div className="modal-action">
                              <button
                                className="btn mr-2"
                                onClick={() => document.getElementById(`deactivateModal${product._id}`).close()}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn bg-lightOrange text-white hover:bg-orange"
                                onClick={() => {
                                  handleDeactivateAd(product._id, "product")
                                  document.getElementById(`deactivateModal${product._id}`).close()
                                }}
                                disabled={loading[`deactivate-${product._id}`]}
                              >
                                {loading[`deactivate-${product._id}`] ? (
                                  <l-tail-chase size="15" speed="1.75" color="white"></l-tail-chase>
                                ) : (
                                  "Confirm"
                                )}
                              </button>
                            </div>
                          </div>
                        </dialog>
                      </div>
                    </div>
                  </SplideSlide>
                )
              })}
              {(!userAds?.product || userAds.product.length === 0) && (
                <div className="text-center py-8 text-gray-500 w-full">
                  <p>No product ads found</p>
                  <Link to="/postAd" className="text-lightOrange hover:underline mt-2 inline-block">
                    Post a product ad
                  </Link>
                </div>
              )}
            </Splide>
          </div>
          <h2 className="font-semibold mb-2 text-center text-orange">Your Service Ads</h2>
          <div>
            <Splide aria-label="services slides" options={options2} className="pb-8">
              {userAds?.service?.map((service) => {
                return (
                  <SplideSlide key={service._id} className="flex justify-center items-center">
                    <div className="bg-white border border-lightOrange rounded-lg overflow-hidden">
                      <img
                        src={service.files[0] || "/images/product1.jpg"}
                        className="w-full h-48 object-cover"
                        alt=""
                      />
                      <div className="px-5 my-3">
                        <h4 className="text-lg font-semibold mb-1 truncate">{service.title}</h4>
                        <p className="text-sm text-gray-500">
                          {service.city}, {service.state} ({service.pincode})
                        </p>
                        <p className="text-sm text-gray-500">Qty: {service.numberOfServices}</p>
                        <p className="text-sm text-gray-500">
                          Status: <span className="text-green-500">{service.status}</span>
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 px-2 my-3">
                        <button
                          className="btn-block rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2 col-span-2"
                          onClick={() => document.getElementById(`interestReceivedModal${service._id}`).showModal()}
                        >
                          Interests received
                        </button>
                        <dialog id={`interestReceivedModal${service._id}`} className="modal">
                          <div className="modal-box">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold text-lg">Interests Received:</h3>
                              <button>
                                <X
                                  className="h-6 w-6"
                                  onClick={() => document.getElementById(`interestReceivedModal${service._id}`).close()}
                                />
                              </button>
                            </div>
                            {receivedInterests
                              .filter((interest) => interest.listing._id === service._id)
                              .map((interest) => {
                                return (
                                  <div key={interest._id} className="border border-lightOrange rounded-lg p-2 mb-2">
                                    <p>
                                      Name:{" "}
                                      <span className="font-semibold">
                                        {interest.sender.firstName} {interest.sender.lastName}
                                      </span>
                                    </p>
                                    <p>
                                      Email: <span className="font-semibold">{interest.sender.email}</span>
                                    </p>
                                    <p>
                                      Phone:{" "}
                                      <span className="font-semibold">
                                        {interest.sender.phoneNumber || "Not provided"}
                                      </span>
                                    </p>
                                    <p>
                                      Address:{" "}
                                      <span className="font-semibold">
                                        {interest.sender.city || ""}, {interest.sender.state || ""}
                                      </span>
                                    </p>
                                    <p>
                                      Status:{" "}
                                      <span
                                        className={`font-semibold capitalize ${
                                          interest.status === "accepted"
                                            ? "text-green-500"
                                            : interest.status === "rejected"
                                              ? "text-red-500"
                                              : "text-yellow-500"
                                        }`}
                                      >
                                        {interest.status || "pending"}
                                      </span>
                                    </p>
                                    {interest.status === "pending" && (
                                      <div className="flex justify-end gap-2 mt-2">
                                        <button
                                          className="btn-ghost duration-200 py-1 px-2 rounded-lg"
                                          onClick={() => handleRejectInterest(interest._id)}
                                          disabled={loading[interest._id]}
                                        >
                                          {loading[interest._id] ? (
                                            <l-tail-chase size="15" speed="1.75" color="#FA4032"></l-tail-chase>
                                          ) : (
                                            "Decline"
                                          )}
                                        </button>
                                        <button
                                          className="bg-lightOrange text-white hover:bg-orange duration-200 py-1 px-2 rounded-lg"
                                          onClick={() => handleAcceptInterest(interest._id)}
                                          disabled={loading[interest._id]}
                                        >
                                          {loading[interest._id] ? (
                                            <l-tail-chase size="15" speed="1.75" color="white"></l-tail-chase>
                                          ) : (
                                            "Accept"
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            {receivedInterests.filter((interest) => interest.listing._id === service._id).length ===
                              0 && <p className="text-center py-4 text-gray-500">No interests received yet</p>}
                          </div>
                        </dialog>
                        <Link
                          to={`/editService/${service._id}`}
                          className="btn-block text-center rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => document.getElementById(`deactivateModal${service._id}`).showModal()}
                          className="btn-block rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2"
                        >
                          Deactivate
                        </button>
                        <dialog id={`deactivateModal${service._id}`} className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg">Are you sure?</h3>
                            <p className="py-4 text-sm">
                              If you deactivate your ad, it will be no longer visible to users.
                            </p>
                            <div className="modal-action">
                              <button
                                className="btn mr-2"
                                onClick={() => document.getElementById(`deactivateModal${service._id}`).close()}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn bg-lightOrange text-white hover:bg-orange"
                                onClick={() => {
                                  handleDeactivateAd(service._id, "service")
                                  document.getElementById(`deactivateModal${service._id}`).close()
                                }}
                                disabled={loading[`deactivate-${service._id}`]}
                              >
                                {loading[`deactivate-${service._id}`] ? (
                                  <l-tail-chase size="15" speed="1.75" color="white"></l-tail-chase>
                                ) : (
                                  "Confirm"
                                )}
                              </button>
                            </div>
                          </div>
                        </dialog>
                      </div>
                    </div>
                  </SplideSlide>
                )
              })}
              {(!userAds?.service || userAds.service.length === 0) && (
                <div className="text-center py-8 text-gray-500 w-full">
                  <p>No service ads found</p>
                  <Link to="/postAd" className="text-lightOrange hover:underline mt-2 inline-block">
                    Post a service ad
                  </Link>
                </div>
              )}
            </Splide>
          </div>
          <h2 className="font-semibold mb-2 text-center text-orange">Your Jobs Ads</h2>
          <div>
            <Splide aria-label="jobs slides" options={options2} className="pb-8">
              {userAds?.job?.map((job) => {
                return (
                  <>
                    <SplideSlide key={job._id} className="flex justify-center items-center">
                      <div className="w-72 bg-white inline-block border border-lightOrange rounded-lg overflow-hidden">
                        <div className="px-5 py-3">
                          <h4 className="text-lg font-semibold mb-1">{job.jobTitle}</h4>
                          <p className="text-sm text-gray-500">
                            {job.city}, {job.state} ({job.pincode})
                          </p>
                          <p className="text-sm text-gray-500">Positions: {job.numberOfServices}</p>
                          <p className="text-md text-gray-700 font-medium mt-1">Company name</p>
                          <p className="text-sm text-gray-500">
                            Status: <span className="text-green-500">Active</span>
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 px-2 my-3">
                          <button
                            className="btn-block rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2 col-span-2"
                            onClick={() => document.getElementById(`interestReceivedModal${job._id}`).showModal()}
                          >
                            Interests received
                          </button>
                          <dialog id={`interestReceivedModal${job._id}`} className="modal">
                            <div className="modal-box">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-lg">Interests Received:</h3>
                                <button>
                                  <X
                                    className="h-6 w-6"
                                    onClick={() => document.getElementById(`interestReceivedModal${job._id}`).close()}
                                  />
                                </button>
                              </div>
                              {receivedInterests
                                .filter((interest) => interest.listing._id === job._id)
                                .map((interest, index) => {
                                  return (
                                    <div key={index} className="border border-lightOrange rounded-lg p-2 mb-2">
                                      <p>
                                        Name:{" "}
                                        <span className="font-semibold">
                                          {interest.sender.firstName} {interest.sender.lastName}
                                        </span>
                                      </p>
                                      <p>
                                        Email: <span className="font-semibold">{interest.sender.email}</span>
                                      </p>
                                      <p>
                                        Phone:{" "}
                                        <span className="font-semibold">
                                          {interest.sender.phoneNumber || "Not provided"}
                                        </span>
                                      </p>
                                      <p>
                                        Address:{" "}
                                        <span className="font-semibold">
                                          {interest.sender.city || ""}, {interest.sender.state || ""}
                                        </span>
                                      </p>
                                      <p>
                                        Status:{" "}
                                        <span
                                          className={`font-semibold capitalize ${
                                            interest.status === "accepted"
                                              ? "text-green-500"
                                              : interest.status === "rejected"
                                                ? "text-red-500"
                                                : "text-yellow-500"
                                          }`}
                                        >
                                          {interest.status || "pending"}
                                        </span>
                                      </p>
                                      {interest.status === "pending" && (
                                        <div className="flex justify-end gap-2 mt-2">
                                          <button
                                            className="btn-ghost duration-200 py-1 px-2 rounded-lg"
                                            onClick={() => handleRejectInterest(interest._id)}
                                            disabled={loading[interest._id]}
                                          >
                                            {loading[interest._id] ? (
                                              <l-tail-chase size="15" speed="1.75" color="#FA4032"></l-tail-chase>
                                            ) : (
                                              "Decline"
                                            )}
                                          </button>
                                          <button
                                            className="bg-lightOrange text-white hover:bg-orange duration-200 py-1 px-2 rounded-lg"
                                            onClick={() => handleAcceptInterest(interest._id)}
                                            disabled={loading[interest._id]}
                                          >
                                            {loading[interest._id] ? (
                                              <l-tail-chase size="15" speed="1.75" color="white"></l-tail-chase>
                                            ) : (
                                              "Accept"
                                            )}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              {receivedInterests.filter((interest) => interest.listing._id === job._id).length ===
                                0 && <p className="text-center py-4 text-gray-500">No interests received yet</p>}
                            </div>
                          </dialog>
                          <Link
                            to={`/editJob/${job._id}`}
                            className="btn-block text-center rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => document.getElementById(`deactivateModal${job._id}`).showModal()}
                            className="btn-block rounded-lg bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2"
                          >
                            Deactivate
                          </button>
                          <dialog id={`deactivateModal${job._id}`} className="modal">
                            <div className="modal-box">
                              <h3 className="font-bold text-lg">Are you sure?</h3>
                              <p className="py-4 text-sm">
                                If you deactivate your ad, it will be no longer visible to users.
                              </p>
                              <div className="modal-action">
                                <button
                                  className="btn mr-2"
                                  onClick={() => document.getElementById(`deactivateModal${job._id}`).close()}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn bg-lightOrange text-white hover:bg-orange"
                                  onClick={() => {
                                    handleDeactivateAd(job._id, "job")
                                    document.getElementById(`deactivateModal${job._id}`).close()
                                  }}
                                  disabled={loading[`deactivate-${job._id}`]}
                                >
                                  {loading[`deactivate-${job._id}`] ? (
                                    <l-tail-chase size="15" speed="1.75" color="white"></l-tail-chase>
                                  ) : (
                                    "Confirm"
                                  )}
                                </button>
                              </div>
                            </div>
                          </dialog>
                        </div>
                      </div>
                    </SplideSlide>
                  </>
                )
              })}
              {(!userAds?.job || userAds.job.length === 0) && (
                <div className="text-center py-8 text-gray-500 w-full">
                  <p>No job ads found</p>
                  <Link to="/postAd" className="text-lightOrange hover:underline mt-2 inline-block">
                    Post a job ad
                  </Link>
                </div>
              )}
            </Splide>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default YourAds

