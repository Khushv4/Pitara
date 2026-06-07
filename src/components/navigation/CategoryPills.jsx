const categories = ["All", "Anime Merch", "Candles", "Crochet", "Gift Hampers", "Accessories"];

function CategoryPills({ activeCategory, setActiveCategory }) {
  return (
    <div className="bg-[#FAF8F5] py-8 border-b border-[#EAE3D5]">
      <div className="max-w-7xl mx-auto px-6 flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              whitespace-nowrap px-8 py-3 rounded-full font-sans transition-all duration-300
              ${
                activeCategory === category
                  ? "bg-[#3E2723] text-[#F5F0E6] shadow-md"
                  : "bg-transparent border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/10"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryPills;