import { Link } from "react-router-dom"

function Page404() {
  return (
    <>
      <div className="flex h-[100dvh] flex-col bg-white">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
          <img src="/images/icon-grid.svg" alt="" className="h-64 w-full object-cover" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="mx-auto max-w-xl px-4 py-8 text-center">
            <img src="/images/logo2.svg" className="mx-auto h-16 mb-3" alt="" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">We can't find that page.</h1>

            <p className="mt-4 text-gray-500">Try searching again, or return home to start from the beginning.</p>

            <Link
              to={"/"}
              className="mt-6 inline-block rounded bg-lightOrange px-5 py-3 text-sm font-medium text-white hover:bg-orange duration-200 focus:outline-none focus:ring"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page404

