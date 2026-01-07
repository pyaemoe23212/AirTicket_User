import { Link } from "react-router"

function Home(){{
    return(
        <>
            <Link to="/booking-form" className="flex items-center">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition hidden md:block"
            >
              Booking Form(Temporarily Button)
            </button>

            {/* Mobile menu button (optional - you can expand later) */}
            <button className="md:hidden text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </Link>
          
        </>
    )
}}

export default Home;