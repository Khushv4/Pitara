import { useEffect, useState, useRef } from "react";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton"; 
import SearchBar from "../product/SearchBar";
import CategoryFilter from "../product/CategoryFilter";
import { supabase } from "../../lib/supabase";

const ITEMS_PER_PAGE = 11; 

function ProductsFeed() {
  // 1. STATE INITIALIZATION: Check sessionStorage first so we remember where the user left off!
  const [search, setSearch] = useState(() => sessionStorage.getItem('pitara_search') || "");
  const [selectedCategory, setSelectedCategory] = useState(() => sessionStorage.getItem('pitara_category') || "all");
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem('pitara_page');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const feedTopRef = useRef(null); 

  // 2. STATE SAVING: Update sessionStorage anytime the user interacts with the feed
  useEffect(() => {
    sessionStorage.setItem('pitara_search', search);
    sessionStorage.setItem('pitara_category', selectedCategory);
    sessionStorage.setItem('pitara_page', currentPage);
  }, [search, selectedCategory, currentPage]);

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

  // 3. HANDLERS: Resets the page to 1 ONLY when actively searching or filtering
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setCurrentPage(1);
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (feedTopRef.current) {
      feedTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 4. GOOGLE-STYLE PAGINATION LOGIC
  const generatePageNumbers = () => {
    const maxPagesToShow = 5; // Shows up to 5 numbered buttons at a time
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
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
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="mb-12">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategoryChange}
          />
        </div>

        {/* GRID */}
        {loading ? (
          
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 w-full">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* GOOGLE-STYLE PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-20 border-t border-[#EAE3D5] pt-8 w-full">
                
                {/* Previous Button */}
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="uppercase tracking-[0.2em] text-[10px] font-bold text-[#3E2723] disabled:opacity-30 transition-all hover:opacity-100 opacity-70 px-2 py-2 sm:px-4"
                >
                  &larr; Prev
                </button>

                {/* Numbered Page Buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {generatePageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-sans text-xs sm:text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-[#3E2723] text-[#FAF8F5] rounded-full shadow-md"
                          : "text-[#3E2723]/70 hover:bg-[#EAE3D5] hover:text-[#3E2723] rounded-full"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="uppercase tracking-[0.2em] text-[10px] font-bold text-[#3E2723] disabled:opacity-30 transition-all hover:opacity-100 opacity-70 px-2 py-2 sm:px-4"
                >
                  Next &rarr;
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