"use client"

import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CirclePlus,
  Gem,
  HomeIcon as House,
  LifeBuoy,
  LogIn,
  LogOut,
  Package,
  Search,
  Settings,
  User,
} from "lucide-react"
import { State } from "country-state-city"
import { useAuth } from "../../contexts/authContext"
import NotificationCenter from "../Notifications/NotificationCenter"
import { toast } from "sonner"

function Navbar() {
  const { userData, logout, api } = useAuth()
  const [states, setStates] = useState([])
  const navigate = useNavigate()

  // Add search functionality to the navbar
  const [searchState, setSearchState] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchStates = () => {
      try {
        const statesList = State.getStatesOfCountry("IN")
        setStates(statesList)
      } catch (error) {
        console.error("Error fetching states:", error)
        // Fallback to empty array if fetching fails
        setStates([])
      }
    }
    fetchStates()
  }, [])

  function handleSideBar() {
    document.getElementById("my-drawer-2").checked = false
  }

  function handleLogOut() {
    logout()
    navigate("/login")
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchState || !searchQuery) {
      toast.error("Please select a state and enter a search term")
      return
    }

    setIsSearching(true)

    try {
      const response = await api.get(`/api/listings/search?state=${searchState}&query=${searchQuery}`)

      if (response.data && response.data.data) {
        navigate(`/search-results?state=${searchState}&query=${searchQuery}`)
      } else {
        toast.error("No results found")
      }
    } catch (error) {
      console.error("Error searching:", error)

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your connection.")
      } else {
        toast.error("Failed to search. Please try again.")
      }
    } finally {
      setIsSearching(false)
    }
  }

  // Check if user is admin or moderator
  const isAdminOrModerator = userData && (userData.role === "admin" || userData.role === "moderator")

  return (
    <>
      <header className="bg-white fixed w-full z-50 shadow-md">
        <nav className="customContainer navbar px-0 bg-base-100">
          <div className="navbar-start">
            <Link to="/">
              <img src="/images/logo.svg" className="h-14" alt="" />
            </Link>
          </div>
          <div className="navbar-end w-full">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <Search className="h-5 w-5" />
              </div>
              <div
                tabIndex={0}
                className="border dropdown-content menu bg-base-100 rounded-lg z-[1] w-64 p-2 shadow-xl customSearchDropdownPosition"
              >
                <form onSubmit={handleSearch}>
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <p className="label-text flex gap-1 font-semibold">
                        <Search className="h-4 w-4 text-orange" />
                        <span>Search!</span>
                      </p>
                    </div>
                    <select
                      className="select select-bordered select-sm w-full max-w-xs focus:outline-none focus:ring-1 ring-lightOrange"
                      value={searchState}
                      onChange={(e) => setSearchState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {states.map((state, index) => (
                        <option key={index} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Search by Category"
                      className="input input-bordered input-sm w-full max-w-xs duration-200 focus:outline-none focus:ring-1 ring-lightOrange"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-block bg-lightOrange text-white rounded-lg font-semibold py-2 mt-2"
                    disabled={isSearching}
                  >
                    {isSearching ? <l-tail-chase size="16" speed="1.75" color="white"></l-tail-chase> : "Search"}
                  </button>
                </form>
              </div>
            </div>
            {userData && (
              <>
                <NotificationCenter />
              </>
            )}
            <div className="lg:hidden md:hidden sm:hidden">
              <Link to="/postAd" className="px-2">
                <CirclePlus className="h-5 inline-block" />
              </Link>
            </div>
            <span className="lg:inline-flex md:inline-flex sm:inline-flex hidden rounded-md border bg-white shadow-md ml-1">
              <Link
                to={"/postAd"}
                className="flex items-center gap-1 border-e text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
                title="Post Job"
              >
                <CirclePlus className="h-4 w-4" />
                Post Ad
              </Link>
              {userData ? (
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center gap-1 text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
                  >
                    <User className="h-4 w-4" /> {userData.firstName} <ChevronDown className="h-4 w-4" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-52 p-2 shadow-md">
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                      <Link to="/interests">Your Interests</Link>
                    </li>
                    <li>
                      <Link to="/ads">Your Ads</Link>
                    </li>
                    {userData.role === "admin" && (
                      <li>
                        <Link to="/admin">Admin Panel</Link>
                      </li>
                    )}
                    {userData.role === "moderator" && (
                      <li>
                        <Link to="/moderator">Moderator Panel</Link>
                      </li>
                    )}
                    <li>
                      <button onClick={handleLogOut}>Logout</button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-sm font-medium px-3 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
                  title="Login/Signup"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </span>
            <div className="drawer w-auto lg:hidden md:hidden sm:hidden block">
              <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle w-[2.5rem] drawer-button">
                  <img src="/images/bars.svg" className="h-6 w-6" alt="" />
                </label>
              </div>
              <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                  <li>
                    <div className="h-[80px] border border-gray-300 mb-2 flex items-center">
                      <div className="w-12 h-12 p-[2px] rounded-full overflow-hidden border-2 border-lightOrange">
                        <img src="/images/default-avatar.jpg" className="rounded-full" alt="" />
                      </div>
                      <div>
                        {userData ? (
                          <Link to={"/profile"}>
                            <p className="font-semibold text-lg">Hello, {userData?.firstName}</p>
                            <p className="text-xs text-gray-500">
                              View Profile
                              <ChevronRight className="h-4 w-4 inline-block" />
                            </p>
                          </Link>
                        ) : (
                          <>
                            <Link to={"/login"} className="font-semibold text-lg">
                              Login/Signup
                            </Link>
                            <p className="text-xs text-gray-500">
                              Get Started
                              <ChevronRight className="h-4 w-4 inline-block" />
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                  <li className="hover:translate-x-2 duration-200 ">
                    <NavLink to={"/"} onClick={handleSideBar} className="text-md">
                      <House className="w-5 h-5 text-lightOrange" />
                      Home
                    </NavLink>
                  </li>
                  <li className="hover:translate-x-2 duration-200 ">
                    <NavLink to={"/products"} onClick={handleSideBar} className="text-md">
                      <Package className="w-5 h-5 text-lightOrange" />
                      Products
                    </NavLink>
                  </li>
                  <li className="hover:translate-x-2 duration-200 ">
                    <NavLink to={"/services"} onClick={handleSideBar} className="text-md">
                      <LifeBuoy className="w-5 h-5 text-lightOrange" />
                      Services
                    </NavLink>
                  </li>
                  <li className="hover:translate-x-2 duration-200 ">
                    <NavLink to={"/jobs"} onClick={handleSideBar} className="text-md">
                      <BriefcaseBusiness className="w-5 h-5 text-lightOrange" />
                      Jobs
                    </NavLink>
                  </li>
                  <li className="hover:translate-x-2 duration-200 ">
                    <NavLink to={"/matrimony"} onClick={handleSideBar} className="text-md">
                      <Gem className="w-5 h-5 text-lightOrange" />
                      Matrimony
                    </NavLink>
                  </li>
                  {userData && (
                    <li className="hover:translate-x-2 duration-200">
                      <NavLink to={"/profile"} onClick={handleSideBar} className="text-md">
                        <User className="w-5 h-5 text-lightOrange" />
                        Profile
                      </NavLink>
                    </li>
                  )}
                  {userData && userData.role === "admin" && (
                    <li className="hover:translate-x-2 duration-200">
                      <NavLink to={"/admin"} onClick={handleSideBar} className="text-md">
                        <Settings className="w-5 h-5 text-lightOrange" />
                        Admin Panel
                      </NavLink>
                    </li>
                  )}
                  {userData && userData.role === "moderator" && (
                    <li className="hover:translate-x-2 duration-200">
                      <NavLink to={"/moderator"} onClick={handleSideBar} className="text-md">
                        <Settings className="w-5 h-5 text-lightOrange" />
                        Moderator Panel
                      </NavLink>
                    </li>
                  )}
                  <li className="hover:translate-x-2 duration-200">
                    <NavLink to={"/help"} onClick={handleSideBar} className="text-md">
                      <CircleHelp className="w-5 h-5 text-lightOrange" />
                      Help
                    </NavLink>
                  </li>
                  {userData && (
                    <li className="hover:translate-x-2 duration-200">
                      <button onClick={handleLogOut} className="text-md">
                        <LogOut className="w-5 h-5 text-lightOrange" />
                        Logout
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <div className="bg-lightOrange lg:block md:block hidden">
          <div className="customContainer flex justify-end text-white font-medium uppercase">
            <NavLink to={"/products"} className="py-1 px-2 hover:bg-white hover:text-lightOrange duration-200 navLinks">
              Products
            </NavLink>
            <NavLink to={"/services"} className="py-1 px-2 hover:bg-white hover:text-lightOrange duration-200 navLinks">
              Services
            </NavLink>
            <NavLink to={"/jobs"} className="py-1 px-2 hover:bg-white hover:text-lightOrange duration-200 navLinks">
              Jobs
            </NavLink>
            <NavLink
              to={"/matrimony"}
              className="py-1 px-2 hover:bg-white hover:text-lightOrange duration-200 navLinks"
            >
              Matrimony
            </NavLink>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar

