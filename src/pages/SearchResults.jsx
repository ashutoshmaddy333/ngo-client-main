"use client"

import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import axios from "axios"
import { ChevronRight, Home } from "lucide-react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import ProductCard from "../components/ProductCard/ProductCard"
import ServiceCard from "../components/ServiceCard/ServiceCard"
import JobCard from "../components/JobCard/JobCard"
import { toast, Toaster } from "sonner"

function SearchResults() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const state = searchParams.get("state")
  const query = searchParams.get("query")

  const [results, setResults] = useState({
    products: [],
    services: [],
    jobs: [],
    matrimony: [],
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/listings/search?state=${state || ""}&query=${query || ""}`,
        )

        setResults(response.data.data)
      } catch (error) {
        console.error("Error fetching search results:", error)
        toast.error("Failed to fetch search results")
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [state, query])

  const getTotalCount = () => {
    return results.products.length + results.services.length + results.jobs.length + results.matrimony.length
  }

  return (
    <>
      <Navbar />
      <Toaster position="top-right" richColors />
      <main>
        <div className="relative lg:h-[180px] md:h-[160px] sm:h-[140px] h-[120px]">
          <div className="bg-[url(/images/search-cover.jpg)] bg-cover bg-center h-full"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-transparent"></div>
          <div className="absolute top-1/2 left-[10%] -translate-y-1/2">
            <h1 className="text-3xl text-white">Search Results</h1>
            <nav aria-label="Breadcrumb">
              <ol className="flex justify-start items-center gap-1 mt-1 text-sm text-gray-300">
                <li>
                  <Link to={"/"} className="block transition hover:text-lightOrange">
                    <span className="sr-only"> Home </span>
                    <Home className="h-4 w-4" />
                  </Link>
                </li>
                <li className="rtl:rotate-180">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li>
                  <p className="block transition hover:text-lightOrange"> Search Results </p>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="customContainer my-6">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-2">Search Query</h2>
            <p>
              <span className="font-medium">State:</span> {state || "All States"}
            </p>
            <p>
              <span className="font-medium">Query:</span> {query || "All Items"}
            </p>
            <p className="mt-2 text-sm text-gray-500">Found {getTotalCount()} results</p>
          </div>

          <div className="tabs tabs-boxed mb-4">
            <button
              className={`tab ${activeTab === "all" ? "tab-active bg-lightOrange text-white" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All ({getTotalCount()})
            </button>
            <button
              className={`tab ${activeTab === "products" ? "tab-active bg-lightOrange text-white" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Products ({results.products.length})
            </button>
            <button
              className={`tab ${activeTab === "services" ? "tab-active bg-lightOrange text-white" : ""}`}
              onClick={() => setActiveTab("services")}
            >
              Services ({results.services.length})
            </button>
            <button
              className={`tab ${activeTab === "jobs" ? "tab-active bg-lightOrange text-white" : ""}`}
              onClick={() => setActiveTab("jobs")}
            >
              Jobs ({results.jobs.length})
            </button>
            <button
              className={`tab ${activeTab === "matrimony" ? "tab-active bg-lightOrange text-white" : ""}`}
              onClick={() => setActiveTab("matrimony")}
            >
              Matrimony ({results.matrimony.length})
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <l-tail-chase size="40" speed="1.75" color="#FA812F"></l-tail-chase>
            </div>
          ) : getTotalCount() === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              {/* Products Section */}
              {(activeTab === "all" || activeTab === "products") && results.products.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Products</h3>
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {results.products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Services Section */}
              {(activeTab === "all" || activeTab === "services") && results.services.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Services</h3>
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {results.services.map((service) => (
                      <ServiceCard key={service._id} service={service} />
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs Section */}
              {(activeTab === "all" || activeTab === "jobs") && results.jobs.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Jobs</h3>
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {results.jobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                </div>
              )}

              {/* Matrimony Section */}
              {(activeTab === "all" || activeTab === "matrimony") && results.matrimony.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Matrimony Profiles</h3>
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {results.matrimony.map((profile) => (
                      <Link
                        key={profile._id}
                        to={`/matrimonyProfile/${profile._id}`}
                        className="bg-white inline-block border border-lightOrange rounded-lg overflow-hidden"
                      >
                        <img
                          src={profile.files?.[0] || "/images/female-avatar.jpg"}
                          className="w-full h-48 object-cover"
                          alt=""
                        />
                        <div className="p-3">
                          <h4 className="text-lg font-semibold mb-1">
                            {profile.firstName} {profile.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {profile.age}, {profile.religion},
                          </p>
                          <p className="text-sm text-gray-500">{profile.maritalStatus}</p>
                          <p className="text-sm text-gray-500">
                            Status: <span className="text-green-500">Active</span>
                          </p>
                        </div>
                        <button className="btn-block bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2">
                          View Profile
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default SearchResults

