import { Link } from "react-router-dom";

function EditInfo() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <p className="text-sm text-gray-500">
          Update customer information and preferences
        </p>
      </div>

      <div className="border rounded p-6 bg-white">
        <h2 className="font-medium mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              First Name
            </label>
            <input
              type="text"
              defaultValue="Sarah"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Johnson"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="sarah.johnson@airline.com"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              defaultValue="+1 (555) 123-4567"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Link
            to="/profile"
            className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            Cancel
          </Link>

          <button
            className="bg-black text-white px-5 py-2 rounded text-sm hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditInfo;
