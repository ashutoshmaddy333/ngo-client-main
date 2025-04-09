import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, CircleX, Home } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import SignupBanner from "../components/SignupBanner/SignupBanner";
import Footer from "../components/Footer/Footer";
import AgeFilterSlider from "../components/AgeFilterSlider/AgeFilterSlider";

function Matrimony() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({
    ageRange: [18, 60],
    religion: [],
    height: [150, 190],
    weight: [45, 100],
    caste: [],
    maritalStatus: [],
  });

  // Fetch profiles when filters or page changes
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Convert filters to API query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage);
        queryParams.append('limit', 12); // 12 items per page
        
        // Add filter parameters
        if (filters.ageRange) {
          queryParams.append('minAge', filters.ageRange[0]);
          queryParams.append('maxAge', filters.ageRange[1]);
        }
        if (filters.religion.length > 0) {
          queryParams.append('religion', filters.religion.join(','));
        }
        if (filters.height) {
          queryParams.append('minHeight', filters.height[0]);
          queryParams.append('maxHeight', filters.height[1]);
        }
        if (filters.weight) {
          queryParams.append('minWeight', filters.weight[0]);
          queryParams.append('maxWeight', filters.weight[1]);
        }
        if (filters.caste.length > 0) {
          queryParams.append('caste', filters.caste.join(','));
        }
        if (filters.maritalStatus.length > 0) {
          queryParams.append('maritalStatus', filters.maritalStatus.join(','));
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/listings/matrimony?${queryParams.toString()}`
        );

        setProfiles(response.data.data);
        console.log("a",response.data.data);
        setTotalPages(response.data.totalPages);
        console.log("b",response.data.totalPages);
        setTotalResults(response.data.totalListings);
        console.log( "c",response.data.totalListings);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [currentPage, filters]);

  const clearFilters = () => {
    setFilters({
      ageRange: [18, 60],
      religion: [],
      height: [150, 190],
      weight: [45, 100],
      caste: [],
      maritalStatus: [],
    });
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handlePageChange = (e) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value)) {
      setCurrentPage(Math.max(1, Math.min(value, totalPages)));
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleCheckboxChange = (filterType, value) => {
    setFilters(prev => {
      const updated = [...prev[filterType]];
      if (updated.includes(value)) {
        return {
          ...prev,
          [filterType]: updated.filter(item => item !== value),
        };
      } else {
        return {
          ...prev,
          [filterType]: [...updated, value],
        };
      }
    });
    setCurrentPage(1); // Reset to first page when changing filters
  };

  return (
    <>
      <Navbar />
      <main className="pt-[80px]">
        {/* ... (keep your existing header/banner code) ... */}
        
        <div className="customContainer my-10">
          <div className="flex lg:flex-row md:flex-row flex-col justify-between lg:items-center md:items-center items-start mb-4">
            <h2 className="text-xl font-semibold">Profiles near you</h2>
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, totalResults)} of {totalResults} results
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {/* Filters sidebar (keep your existing filter UI code) */}
            
            {/* Profile cards grid */}
            <div className="lg:col-span-3 md:col-span-2 sm:col-span-3 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-2 place-items-center gap-2 mb-8">
              {loading ? (
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white border border-lightOrange rounded-lg overflow-hidden w-full animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-10 bg-gray-200"></div>
                  </div>
                ))
              ) : profiles.length > 0 ? (
                profiles.map(profile => (
                  <Link
                    to={`/matrimonyProfile/${profile._id}`}
                    key={profile._id}
                    className="bg-white inline-block border border-lightOrange rounded-lg overflow-hidden w-full hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={profile.documents?.[0] || "/images/female-avatar.jpg"} 
                      className="w-full h-48 object-cover" 
                      alt="Profile" 
                    />
                    <div className="p-3">
                      <h4 className="text-lg font-semibold mb-1">
                        {profile.firstName} {profile.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {profile.age}, {profile.religion}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {profile.maritalStatus?.replace(/-/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: <span className="text-green-500">Active</span>
                      </p>
                    </div>
                    <button className="bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2 w-full">
                      View Profile
                    </button>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No profiles found matching your criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="inline-flex justify-center gap-1">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="inline-flex size-8 items-center justify-center rounded border bg-white hover:bg-lightOrange hover:text-white text-gray-900 rtl:rotate-180 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Prev Page</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div>
                  <label htmlFor="PaginationPage" className="sr-only">
                    Page
                  </label>
                  <input
                    type="number"
                    className="h-8 w-12 rounded border bg-white p-0 text-center text-xs font-medium text-gray-900 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={handlePageChange}
                    id="PaginationPage"
                  />
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex size-8 items-center justify-center rounded border bg-white hover:bg-lightOrange hover:text-white text-gray-900 rtl:rotate-180 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next Page</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        <SignupBanner />
      </main>
      <Footer />
    </>
  );
}

export default Matrimony;