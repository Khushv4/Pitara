function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
      <button
        onClick={() => onSelect("all")}
        className={`
          whitespace-nowrap px-6 py-2 font-sans text-xs uppercase tracking-widest transition-colors border
          ${
            selected === "all"
              ? "bg-[#3E2723] text-[#FAF8F5] border-[#3E2723]"
              : "bg-transparent text-[#3E2723] border-[#3E2723]/30 hover:border-[#3E2723]"
          }
        `}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.slug}
          onClick={() => onSelect(category.slug)}
          className={`
            whitespace-nowrap px-6 py-2 font-sans text-xs uppercase tracking-widest transition-colors border
            ${
              selected === category.slug
                ? "bg-[#3E2723] text-[#FAF8F5] border-[#3E2723]"
                : "bg-transparent text-[#3E2723] border-[#3E2723]/30 hover:border-[#3E2723]"
            }
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;