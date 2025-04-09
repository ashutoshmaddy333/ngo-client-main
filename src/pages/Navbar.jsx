"use client"

import { useState } from "react"
import { Box, Flex, Heading, Input, Select, Button, useToast, Spinner } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Navbar = () => {
  const [searchState, setSearchState] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchState || !searchQuery) {
      toast.error("Please select a state and enter a search term")
      return
    }

    setIsSearching(true)

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/listings/search?state=${searchState}&query=${searchQuery}`,
      )

      setSearchResults(response.data.data)
      navigate(`/search-results?state=${searchState}&query=${searchQuery}`)
    } catch (error) {
      console.error("Error searching:", error)
      toast.error("Failed to search. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Box bg="gray.100" py={4}>
      <Flex maxW="1200px" mx="auto" alignItems="center" justifyContent="space-between" px={4}>
        <Link to="/">
          <Heading size="lg" color="teal.500">
            Real Estate App
          </Heading>
        </Link>

        <Flex as="form" onSubmit={handleSearch} align="center">
          <Select
            placeholder="Select State"
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
            mr={2}
          >
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </Select>
          <Input
            placeholder="Enter search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mr={2}
          />
          <Button colorScheme="teal" type="submit" isLoading={isSearching}>
            {isSearching ? <Spinner size="sm" /> : "Search"}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar

