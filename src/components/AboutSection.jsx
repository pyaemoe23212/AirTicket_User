const AboutSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 sm:gap-4">
          <span className="block w-12 sm:w-16 h-0.5 bg-gray-400"></span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">About Us</h2>
          <span className="block w-12 sm:w-16 h-0.5 bg-gray-400"></span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-base sm:text-lg leading-relaxed text-gray-600">
          We are a leading airline booking platform dedicated to transforming the way travelers discover and book flights worldwide. 
          Our platform connects millions of passengers with thousands of airlines, offering comprehensive flight options, competitive pricing, and real-time.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;