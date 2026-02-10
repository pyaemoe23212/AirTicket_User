const AboutSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Card */}
        <div className="bg-white border rounded-md p-10">

          {/* Title Row */}
          <div className="flex items-center gap-4 mb-6">
            <span className="block w-12 h-[2px] bg-gray-400"></span>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-900 whitespace-nowrap">
              About Us
            </h2>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* Text */}
          <p className="max-w-5xl text-sm sm:text-base leading-7 text-gray-600">
            We are a leading airline booking platform dedicated to transforming the way travelers discover and book flights worldwide. 
            Our platform connects millions of passengers with thousands of airlines, offering comprehensive flight options, competitive pricing, and real-time availability.
          </p>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
