const categories = [
  "Gift Hampers",
  "Anime Merch",
  "Candles",
  "Crochet",
  "Plants",
  "Accessories",
  "Jewelry",
  "Custom Gifts",
];

function Categories() {
  return (
    <section className="py-20 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#1A531A] mb-10">
          Browse Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category}
              className="
              bg-white
              rounded-3xl
              p-8
              border
              border-gray-100
              hover:-translate-y-2
              hover:shadow-xl
              transition-all
              duration-300
            "
            >
              <h3 className="font-semibold text-[#1A531A]">
                {category}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;