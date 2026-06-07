function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="SEARCH CATALOG..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b-2 border-[#3E2723] py-2 pl-0 pr-8 font-sans text-xs tracking-widest uppercase text-[#3E2723] placeholder:text-[#3E2723]/40 focus:outline-none focus:border-[#2C2C2C] transition-colors rounded-none"
      />
    </div>
  );
}

export default SearchBar;