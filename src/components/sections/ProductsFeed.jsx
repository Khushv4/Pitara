import { useEffect, useState, useRef } from "react";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton"; // IMPORTED THE SKELETON
import SearchBar from "../product/SearchBar";
import CategoryFilter from "../product/CategoryFilter";
import { supabase } from "../../lib/supabase";

const ITEMS_PER_PAGE = 8; // Restricts load to 8 items at a time

function ProductsFeed() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const feedTopRef = useRef(null); 

  // SCROLL LOCK EFFECT
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [loading]);

  useEffect(() => {
    loadData();
  }, []);

  // Reset to Page 1 if they search or change categories
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        supabase
          .from("products")
          .select("*, product_images(image_url)")
          .eq("active", true)
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);

      const formattedProducts = productsData?.map((product) => ({
        ...product,
        images: product.product_images?.map((img) => img.image_url) || [],
      }));

      setProducts(formattedProducts || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category_slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // PAGINATION MATH
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // PAGE CHANGE HANDLER
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Smoothly scroll back to the top of the feed section
    if (feedTopRef.current) {
      feedTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="browse" className="py-20 bg-[#FAF8F5]" ref={feedTopRef}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER & SEARCH ROW */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 border-b-2 border-[#3E2723] pb-4">
          <div>
            <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter text-[#3E2723] uppercase leading-none">
              The Catalog
            </h2>
          </div>
          <div className="w-full md:w-72">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="mb-12">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* GRID */}
        {loading ? (
          
          /* THE SKELETON GRID: Shows 8 pulsing dummy cards while Supabase fetches */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 w-full">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>

        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 border border-[#EAE3D5] rounded-none">
            <h3 className="text-lg font-sans uppercase tracking-widest text-[#3E2723]">Coming Soon!</h3>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            
            {/* Display ONLY the 8 real items for the current page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 w-full">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center gap-6 mt-20 border-t border-[#EAE3D5] pt-8 w-full justify-center">
                
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="uppercase tracking-[0.2em] text-xs font-bold text-[#3E2723] disabled:opacity-30 transition-opacity hover:opacity-100 opacity-70"
                >
                  Previous
                </button>

                <span className="font-serif italic text-[#3E2723]/80">
                  {currentPage} <span className="font-sans not-italic text-xs mx-1 opacity-50">/</span> {totalPages}
                </span>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="uppercase tracking-[0.2em] text-xs font-bold text-[#3E2723] disabled:opacity-30 transition-opacity hover:opacity-100 opacity-70"
                >
                  Next
                </button>

              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsFeed;