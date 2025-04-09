import { Link } from "react-router-dom"

function JobCard({ job }) {
  return (
    <>
      <div className="w-72 bg-white inline-block border border-lightOrange rounded-lg overflow-hidden">
        <div className="px-5 py-3">
          <h4 className="text-lg font-semibold mb-1 truncate capitalize">{job.jobTitle}</h4>
          <p className="text-sm text-gray-500">
            {job.city}, {job.state}, ({job.pincode})
          </p>
          <p className="text-sm text-gray-500">Positions: {job.numberOfServices}</p>
          <p className="text-md text-gray-700 font-medium mt-1">Company name</p>
          <p className="text-sm text-gray-500">
            Status: <span className="text-green-500 capitalize font-medium">{job.status}</span>
          </p>
        </div>
        <Link
          to={`/jobDetail/${job._id}`}
          className="flex justify-center items-center bg-lightOrange hover:bg-orange duration-200 text-white font-medium text-sm py-2"
        >
          Read more
        </Link>
      </div>
    </>
  )
}

export default JobCard

