const categories = [
  "All",
  "Gift Hampers",
  "Anime Merch",
  "Candles",
  "Crochet",
  "Plants",
  "Accessories",
];

function ProductFilters({
  activeCategory,
  setActiveCategory,
}) {
  return (
    <nav
      className="
      sticky
      top-20
      z-40
      bg-[#F9F8F6]/90
      backdrop-blur-md
      py-4
      mb-10
    "
    >
      <div className="flex gap-3 overflow-x-auto px-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setActiveCategory(category)
            }
            className={`
              px-5 py-2 rounded-full whitespace-nowrap transition
              ${
                activeCategory === category
                  ? "bg-[#1A531A] text-white"
                  : "bg-white text-[#1A531A] border"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default ProductFilters;