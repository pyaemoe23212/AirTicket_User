import { FaFacebookF, FaFacebookMessenger, FaViber } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-400">
          {/* Contact Us */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <p className="text-sm">Email: support@flights.com</p>
            <p className="text-sm mt-2">Phone: 1-800-FLIGHTS</p>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h4 className="text-white font-semibold mb-4">Social Media</h4>
            <div className="flex justify-center gap-6">
              <a
                href="#"
                className="text-2xl text-gray-300 hover:text-blue-600 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-2xl text-gray-300 hover:text-blue-500 transition"
              >
                <FaFacebookMessenger />
              </a>
              <a
                href="#"
                className="text-2xl text-gray-300 hover:text-purple-500 transition"
              >
                <FaViber />
              </a>
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="flex flex-col justify-center pl-13">
              <h4 className="text-white font-semibold mb-4">Address</h4>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-sm">
                JOHN SMITH, 123 MAIN STREET, SUITE 678,
                <br />
                OTTAWA, ON K1A 0B1, CANADA
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm">
          <p>&copy; 2026 Flight Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
