"use client"

import { useRef, useState, useEffect } from "react"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import axios from "axios"
import { useParams } from "react-router-dom"
import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import { toast } from "react-toastify"

function MatrimonyProfile() {
  const { id } = useParams()
  const mainSliderRef = useRef(null)
  const thumbSliderRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [hasShownInterest, setHasShownInterest] = useState(false)

  // Slider options
  const options = {
    type: "fade",
    heightRatio: 0.5,
    pagination: false,
    arrows: false,
    cover: true,
    height: "320px",
    width: "100%",
  }

  const options2 = {
    rewind: true,
    fixedWidth: 104,
    fixedHeight: 58,
    isNavigation: true,
    arrows: false,
    gap: 10,
    focus: "start",
    pagination: false,
    cover: true,
    dragMinThreshold: {
      mouse: 4,
      touch: 10,
    },
    breakpoints: {
      640: {
        fixedWidth: 66,
        fixedHeight: 38,
      },
    },
  }

  // Fetch profile data and check interest status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setProfileLoading(true)
        
        // Fetch profile data
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/listings/matrimony/${id}`
        )
        setProfile(profileResponse.data.data)
  
        // Check if current user has already shown interest
        const userId = localStorage.getItem("userId")
        
        // Only make the interest check call if userId exists and is valid
        if (userId && userId !== "undefined" && userId !== "null") {
          try {
            const interestResponse = await axios.get(
              `${import.meta.env.VITE_BASE_URL}api/interests/check`,
              {
                params: {
                  listingId: id,
                  userId: userId
                },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              }
            )
            console.log("Interest",interestResponse.data)
            setHasShownInterest(interestResponse.data.hasShownInterest)
          } catch (interestError) {
            console.error("Error checking interest status:", interestError)
            // Don't show an error toast for this specific error to improve UX
          }
        } else {
          // User is not logged in or userId is invalid, so they haven't shown interest
          setHasShownInterest(false)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load profile data")
      } finally {
        setProfileLoading(false)
      }
    } 
  
    if (id) {
      fetchData()
    }
  }, [id])

  const handleShowInterest = async () => {
    setIsLoading(true)
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        toast.error("Please login to show interest")
        setIsLoading(false)
        return
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/interests`,
        {
          listingId: id,
          listingType: "matrimony",
          message: "I'm interested in your matrimony profile"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          timeout: 5000
        }
      )

      if (response.data.success) {
        toast.success("Interest shown successfully!")
        setHasShownInterest(true)
      } else {
        toast.error(response.data.message || "Failed to show interest")
      }
    } catch (error) {
      console.error("Error showing interest:", error)
      if (error.response) {
        toast.error(error.response.data?.message || "Request failed")
      } else if (error.request) {
        toast.error("Server not responding")
      } else {
        toast.error("Error: " + error.message)
      }
    } finally {
      setIsLoading(false)
      setShowInterestModal(false)
    }
  }

  if (profileLoading) {
    return (
      <>
        <Navbar />
        <div className="customContainer my-10">
          <div className="animate-pulse bg-white rounded-lg shadow-md p-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="h-80 bg-gray-200 rounded-lg"></div>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="customContainer my-10">
          <div className="bg-white rounded-lg shadow-md p-5 text-center">
            <p className="text-lg">Profile not found</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="customContainer my-2">
          <p className="text-lg font-semibold">Matrimony Profile</p>
        </div>
        <div className="customContainer bg-white px-3 mb-5 rounded-lg shadow-md grid md:grid-cols-2 gap-4">
          <div className="grid gap-2 py-5">
            <Splide options={options} ref={mainSliderRef} id="main-slider">
              {profile.documents?.length > 0 ? (
                profile.documents.map((doc, index) => (
                  <SplideSlide key={index}>
                    <img 
                      src={doc} 
                      alt={`Profile view ${index + 1}`} 
                      className="w-full h-full object-contain rounded-lg" 
                    />
                  </SplideSlide>
                ))
              ) : (
                <SplideSlide>
                  <img 
                    src="/images/female-avatar.jpg" 
                    alt="Default profile" 
                    className="w-full h-full object-contain rounded-lg" 
                  />
                </SplideSlide>
              )}
            </Splide>
            <Splide
              options={options2}
              id="thumbnail-slider"
              ref={thumbSliderRef}
              onMounted={() => {
                if (mainSliderRef.current && thumbSliderRef.current) {
                  mainSliderRef.current.sync(thumbSliderRef.current.splide)
                }
              }}
            >
              {profile.documents?.length > 0 ? (
                profile.documents.map((doc, index) => (
                  <SplideSlide key={index}>
                    <img 
                      src={doc} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  </SplideSlide>
                ))
              ) : (
                <SplideSlide>
                  <img 
                    src="/images/female-avatar.jpg" 
                    alt="Default thumbnail" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                </SplideSlide>
              )}
            </Splide>
          </div>
          <div className="space-y-2 lg:p-5 md:p-5 p-2">
            <p className="text-sm text-gray-500">
              Profile Id: <span className="font-semibold">{profile._id}</span>
            </p>
            <h1 className="text-xl font-semibold">
              {profile.firstName} {profile.lastName}
            </h1>
            <ul className="list-disc list-outside grid grid-cols-2 pl-4 place-content-center">
              <li>
                <p className="text-xs font-medium text-gray-500">Age</p>
                <p>{profile.age} years</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">Religion</p>
                <p className="capitalize">{profile.religion?.replace(/-/g, ' ')}</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">Caste</p>
                <p>{profile.caste || 'Not specified'}</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">Marital Status</p>
                <p className="capitalize">{profile.maritalStatus?.replace(/-/g, ' ')}</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">Height</p>
                <p>{profile.height}</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">Weight</p>
                <p>{profile.weight} kg</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">Occupation</p>
                <p className="capitalize">{profile.occupation?.replace(/-/g, ' ')}</p>
              </li>
              <li>
                <p className="text-xs font-medium text-gray-500">Income range</p>
                <p className="capitalize">{profile.incomeRange?.replace(/-/g, ' ')}</p>
              </li>
            </ul>
            <div>
              <button
                className={`w-full py-2 ${
                  hasShownInterest ? 'bg-gray-400 cursor-not-allowed' : 'bg-lightOrange hover:bg-orange'
                } text-white rounded-lg transition-colors duration-200`}
                onClick={() => !hasShownInterest && setShowInterestModal(true)}
                disabled={hasShownInterest}
              >
                {hasShownInterest ? "Interest Shown ✓" : "Show Interest"}
              </button>

              {hasShownInterest && (
                <p className="text-xs text-green-600 mt-1 text-center">
                  You've already shown interest in this profile
                </p>
              )}

              {showInterestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Are you sure?</h3>
                      <button 
                        className="btn btn-sm btn-circle btn-ghost" 
                        onClick={() => setShowInterestModal(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <p className="py-4">You want to show interest in this profile</p>
                    <div className="flex justify-end gap-2">
                      <button 
                        className="btn" 
                        onClick={() => setShowInterestModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn bg-lightOrange text-white hover:bg-orange"
                        onClick={handleShowInterest}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <span className="loading loading-spinner loading-xs mr-2"></span>
                            Processing...
                          </span>
                        ) : "Show Interest"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default MatrimonyProfile