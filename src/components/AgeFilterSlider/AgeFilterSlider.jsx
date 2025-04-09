"use client"

import { useState } from "react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import "./slider.css"

function AgeFilterSlider() {
  const [ageRange, setAgeRange] = useState([18, 60]) // Default range

  const handleChange = (value) => {
    setAgeRange(value)
  }

  return (
    <>
      <div>
        <Slider
          range
          min={20}
          max={50}
          value={ageRange}
          onChange={handleChange}
          allowCross={false}
          className="custom-slider"
        />
        <p className="mt-2 text-sm text-gray-500">
          Selected Age Range: {ageRange[0]} - {ageRange[1]}
        </p>
      </div>
    </>
  )
}

export default AgeFilterSlider

