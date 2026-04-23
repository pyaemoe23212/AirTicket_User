const destinations = [
  {
    name: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "New York",
    image:
      "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "London",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Barcelona",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rome",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sydney",
    image:
      "https://images.unsplash.com/photo-1523428461295-92770e70d7ae?auto=format&fit=crop&w=800&q=80",
  },
];

function AdvertisementSection() {
  return (
    <section className="pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Popular Destinations
        </h2>
        <p className="mt-2 text-slate-500">
          Discover the world&apos;s most loved travel destinations
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((item) => (
            <div
              key={item.name}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1523428461295-92770e70d7ae?auto=format&fit=crop&w=800&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdvertisementSection;