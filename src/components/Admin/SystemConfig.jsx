"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Save } from "lucide-react"

function SystemConfig() {
  const [config, setConfig] = useState({
    siteName: "FreecoSystem",
    siteDescription: "A platform for free exchange of goods and services",
    contactEmail: "support@freecosystem.com",
    contactPhone: "+1234567890",
    maxImagesPerAd: 4,
    maxAdDurationDays: 30,
    requireModeration: true,
    allowUserRegistration: true,
    maintenanceMode: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSystemConfig = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/admin/system-config`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        setConfig(response.data)
      } catch (error) {
        console.error("Error fetching system config:", error)
        toast.error("Failed to fetch system configuration")
      } finally {
        setLoading(false)
      }
    }

    fetchSystemConfig()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setConfig({
      ...config,
      [name]: Number.parseInt(value, 10),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}api/admin/system-config`, config, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (response.data.success) {
        toast.success("System configuration updated successfully")
      } else {
        toast.error("Failed to update system configuration")
      }
    } catch (error) {
      console.error("Error updating system config:", error)
      toast.error("Failed to update system configuration")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <l-tail-chase size="40" speed="1.75" color="#FA812F"></l-tail-chase>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">System Configuration</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Site Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={config.siteName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightOrange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
              <textarea
                name="siteDescription"
                value={config.siteDescription}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightOrange"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={config.contactEmail}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightOrange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={config.contactPhone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightOrange"
              />
            </div>
          </div>

          {/* Ad Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ad Settings</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Images Per Ad</label>
              <input
                type="number"
                name="maxImagesPerAd"
                value={config.maxImagesPerAd}
                onChange={handleNumberChange}
                min="1"
                max="10"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightOrange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Ad Duration (Days)</label>
              <input
                type="number"
                name="maxAdDurationDays"
                value={config.maxAdDurationDays}
                onChange={handleNumberChange}
                min="1"
                max="90"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightOrange"
                required
              />
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">System Settings</h3>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireModeration"
                  name="requireModeration"
                  checked={config.requireModeration}
                  onChange={handleChange}
                  className="h-4 w-4 text-lightOrange focus:ring-lightOrange border-gray-300 rounded"
                />
                <label htmlFor="requireModeration" className="ml-2 block text-sm text-gray-700">
                  Require Moderation for New Ads
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowUserRegistration"
                  name="allowUserRegistration"
                  checked={config.allowUserRegistration}
                  onChange={handleChange}
                  className="h-4 w-4 text-lightOrange focus:ring-lightOrange border-gray-300 rounded"
                />
                <label htmlFor="allowUserRegistration" className="ml-2 block text-sm text-gray-700">
                  Allow User Registration
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={config.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-lightOrange focus:ring-lightOrange border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                  Maintenance Mode
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lightOrange hover:bg-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightOrange"
            disabled={saving}
          >
            {saving ? (
              <>
                <l-tail-chase size="16" speed="1.75" color="white" className="mr-2"></l-tail-chase>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SystemConfig

