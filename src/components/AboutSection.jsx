const AboutSection = () => {
  return (
    <section className="bg-[#f5f7fb] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 md:p-12">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-10 h-[2px] bg-blue-500"></span>
            <h2 className="text-[20px] md:text-[22px] font-semibold text-slate-800">
              About Us
            </h2>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          <div className="space-y-6 text-slate-600 leading-9 text-[15px] md:text-[16px] max-w-6xl">
            <p>
              We are a leading airline booking platform dedicated to transforming the
              way travelers discover and book flights worldwide. Our platform connects
              millions of passengers with thousands of airlines, offering comprehensive
              flight options, competitive pricing, and real-time availability.
            </p>

            <p>
              Whether you&apos;re planning a business trip, family vacation, or spontaneous
              getaway, our platform offers intuitive search tools, flexible booking
              options, and 24/7 customer support. We&apos;re committed to making air travel
              accessible, affordable, and stress-free for everyone.
            </p>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-blue-600">500+</h3>
                <p className="text-gray-500 mt-3 text-lg">Airlines</p>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-blue-600">200+</h3>
                <p className="text-gray-500 mt-3 text-lg">Countries</p>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-blue-600">5M+</h3>
                <p className="text-gray-500 mt-3 text-lg">Bookings</p>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-blue-600">24/7</h3>
                <p className="text-gray-500 mt-3 text-lg">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;