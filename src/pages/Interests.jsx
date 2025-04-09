"use client"

import { useAuth } from "../contexts/authContext"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"

function Interests() {
  const { userInterests } = useAuth()

  return (
    <>
      <Navbar />
      <main>
        <div className="customContainer my-2">
          <h1 className="text-lg font-semibold">Your Interests</h1>
        </div>
        <div className="customContainer bg-white p-3 mb-5 rounded-lg shadow-md grid grid-cols-3 gap-4">
          {userInterests?.map((interest) => {
            return (
              <>
                <div key={interest._id} className="border border-lightOrange rounded-lg overflow-hidden">
                  <div className="h-[160px]">
                    <img src={interest.listing.files[0]} alt="" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold truncate">{interest.listing.title}</p>
                    <p className="text-sm mb-1">
                      Status: <span className="font-medium capitalize">{interest.status}</span>
                    </p>
                    <p className="text-xs">Your Intests has not been accepted yet.</p>
                  </div>
                  <Link
                    to={`/productDetail/${interest.listing._id}`}
                    className="bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2 block text-center"
                  >
                    Read more
                  </Link>
                </div>
              </>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Interests

