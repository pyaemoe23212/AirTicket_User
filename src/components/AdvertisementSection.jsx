function AdvertisementSection() {
  return (
    <div className="max-w-7xl mx-auto mt-20 px-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">
          Advertisement Banners
        </h2>
        <span className="text-xs text-gray-400 uppercase">
          Sponsored Content
        </span>
      </div>

      {/* LARGE TOP BANNER */}
      <div className="border border-gray-300 bg-gray-200 h-72 flex flex-col items-center justify-center mb-8">
        <p className="text-xs text-gray-500 mb-1">[ADVERTISEMENT]</p>
        <p className="text-lg font-medium text-gray-700">
          Large Banner
        </p>
        <p className="text-xs text-gray-500">1248 x 280</p>
      </div>

      {/* MAIN GRID SECTION */}
      <div className="grid grid-cols-4 gap-6">

        {/* LEFT VERTICAL */}
        <div className="col-span-1 border border-gray-300 bg-gray-200 h-[400px] flex flex-col items-center justify-center">
          <p className="text-xs text-gray-500 mb-1">[AD]</p>
          <p className="text-sm font-medium text-gray-700">
            Vertical Banner
          </p>
          <p className="text-xs text-gray-500">
            Premium Offer
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-3 flex flex-col gap-6">

          {/* WIDE BANNER */}
          <div className="border border-gray-300 bg-gray-200 h-32 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500 mb-1">[SPONSORED]</p>
            <p className="text-sm font-medium text-gray-700">
              Wide Banner Advertisement
            </p>
            <p className="text-xs text-gray-500">
              Credit Card Offer
            </p>
          </div>

          {/* 3 SMALL BOXES */}
          <div className="grid grid-cols-3 gap-6">

            <div className="border border-gray-300 bg-gray-200 h-32 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500">[AD]</p>
              <p className="text-sm text-gray-700">
                Destination
              </p>
            </div>

            <div className="border border-gray-300 bg-gray-200 h-32 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500">[AD]</p>
              <p className="text-sm text-gray-700">
                Destination
              </p>
            </div>

            <div className="border border-gray-300 bg-gray-200 h-32 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500">[PARTNER]</p>
              <p className="text-sm text-gray-700">
                Airline
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdvertisementSection;
