"use client"

import { Check, CheckCheck, ChevronLeft, Square, SquareCheckBig, X } from "lucide-react"
import { Link } from "react-router-dom"
import { toast, Toaster } from "sonner"

function Users() {
  const handleApprove = () => {
    toast.success("User Activated Successfully")
  }

  const handleReject = () => {
    toast.error("User Deactivated Successfully")
  }

  return (
    <>
      <div>
        <div>
          <Toaster position="top-right" richColors />
          <div className="container mx-auto lg:p-6 md:p-6 p-2">
            <div className="join mb-3 flex overflow-scroll hideScrollbar">
              <button className="btn btn-outline border-gray-200 join-item">
                <SquareCheckBig className="w-5 h-5" /> Select All
              </button>
              <button className="btn btn-outline border-gray-200 join-item">
                <Square className="w-5 h-5" /> Unselect All
              </button>
              <button className="btn btn-outline border-gray-200 join-item">
                <CheckCheck className="w-5 h-5" />
                Activate Selected
              </button>
              <button className="btn btn-outline border-gray-200 join-item">
                <X className="w-5 h-5" />
                Deactivate Selected
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="" name="" id="" />
                    </td>
                    <td className="px-6 py-4">Mobile</td>
                    <td className="px-6 py-4">Product</td>
                    <td className="px-6 py-4 text-green-500">Active</td>
                    <td className="px-6 py-4">
                      <Link to={""} target="_blank" className="text-blue-500 underline">
                        View AD
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="join">
                        <button className="btn btn-outline btn-success join-item" onClick={handleApprove}>
                          <Check className="w-5 h-5" />
                          Approve
                        </button>
                        <button className="btn btn-outline btn-danger join-item" onClick={handleReject}>
                          <X className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ol className="flex justify-center text-xs font-medium space-x-1 mt-3">
              <li>
                <Link
                  to="/?page=1"
                  className="inline-flex items-center justify-center w-8 h-8 border border-gray-200 rounded"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Link>
              </li>

              <li>
                <Link to="/?page=1" className="block w-8 h-8 text-center border border-gray-200 rounded leading-8">
                  {" "}
                  1{" "}
                </Link>
              </li>

              <li className="block w-8 h-8 text-center text-white bg-lightOrange border-lightOrange rounded leading-8">
                2
              </li>

              <li>
                <Link to="/?page=3" className="block w-8 h-8 text-center border border-gray-200 rounded leading-8">
                  {" "}
                  3{" "}
                </Link>
              </li>

              <li>
                <Link
                  to="/?page=3"
                  className="inline-flex items-center justify-center w-8 h-8 border border-gray-200 rounded"
                >
                  <ChevronLeft className="w-3 h-3 rotate-180" />
                </Link>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}

export default Users

