import { Link } from "react-router-dom"

function SignupBanner() {
  return (
    <>
      <div className="customContainer p-6 lg:py-12 md:py-10 py-8 my-10 bg-yellow rounded-lg text-gray-900">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <p className="text-left text-4xl tracking-tighter font-bold">
            Join our community of givers and <br /> make a difference today!
          </p>
          <Link
            to={"/login"}
            rel="noreferrer noopener"
            className="px-5 mt-4 lg:mt-0 py-3 rounded-md font-semibold block bg-lightOrange text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  )
}

export default SignupBanner

