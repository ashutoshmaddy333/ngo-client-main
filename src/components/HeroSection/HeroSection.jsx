"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import Aos from "aos"
import "aos/dist/aos.css"

function HeroSection() {
  useEffect(() => {
    Aos.init()
  })

  return (
    <>
      <section className="bg-white">
        <div className="customContainer flex flex-col justify-center mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
          <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
            <h1 className="text-5xl font-bold flex flex-col">
              <span
                className="inline-block"
                data-aos="fade-right"
                data-aos-delay="200"
                data-aos-duration="1000"
                data-aos-once
              >
                Give unused{" "}
              </span>
              <span
                className="inline-block"
                data-aos="fade-right"
                data-aos-delay="500"
                data-aos-duration="1000"
                data-aos-once
              >
                items a
              </span>
              <span
                className="inline-block text-lightOrange"
                data-aos="fade-right"
                data-aos-delay="800"
                data-aos-duration="800"
                data-aos-once
              >
                Second life!
              </span>
            </h1>
            <p
              className="mt-4 mb-8 text-sm text-gray-500 sm:mb-12"
              data-aos="fade-right"
              data-aos-delay="1400"
              data-aos-duration="1000"
              data-aos-once
            >
              Help those in need by donating items you no longer use.
            </p>
            <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
              <Link
                to="/postAd"
                className="px-8 py-3 text-lg font-semibold rounded bg-lightOrange text-white"
                data-aos="fade-up"
                data-aos-delay="1600"
                data-aos-duration="1000"
                data-aos-once
              >
                Post Ad
              </Link>
              <Link
                to="/post-ad"
                className="px-8 py-3 text-lg font-semibold border rounded border-gray-300"
                data-aos="fade-up"
                data-aos-delay="2000"
                data-aos-duration="1000"
                data-aos-once
              >
                Contact us
              </Link>
            </div>
          </div>
          <div
            className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-40 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
            data-aos="zoom-in"
            data-aos-delay="200"
            data-aos-duration="1000"
            data-aos-once
          >
            <img src="/images/hero-img.svg" alt="" className="object-contain h-40 sm:h-80 lg:h-96 xl:h-112 2xl:h-128" />
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection

