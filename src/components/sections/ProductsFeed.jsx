import { useEffect, useState, useRef } from "react";
import ProductCard from "../product/ProductCard";
import SearchBar from "../product/SearchBar";
import CategoryFilter from "../product/CategoryFilter";
import AestheticLoader from "../../components/ui/AestheticLoader";
import { supabase } from "../../lib/supabase";

function ProductsFeed() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // LAZY LOADING STATE: Start by showing 8 products
  const [visibleCount, setVisibleCount] = useState(8);
  
  const observerTarget = useRef(null);

  // 1. SCROLL LOCK EFFECT
  useEffect(() => {
    if (loading) {
      // Disable scrolling while loading
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when done
      document.body.style.overflow = "unset";
    }

    // Cleanup function in case the component unmounts mid-load
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [loading]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setVisibleCount(8);
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

  // INFINITE SCROLL LOGIC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((prev) => prev + 8);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visibleCount, filteredProducts.length]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section id="browse" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEAVY HEADER & SEARCH ROW */}
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
          // To ensure the loader stays centered on the user's screen while locked
          <div className="min-h-[60vh] flex items-center justify-center">
            <AestheticLoader message="Curating the collection..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 border border-[#EAE3D5] rounded-none">
            <h3 className="text-lg font-sans uppercase tracking-widest text-[#3E2723]">Coming Soon!</h3>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 w-full">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* THE INVISIBLE TRIPWIRE */}
            {visibleCount < filteredProducts.length && (
              <div 
                ref={observerTarget} 
                className="h-20 w-full flex items-center justify-center mt-12"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#3E2723]/50 animate-pulse">
                  Revealing more...
                </span>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsFeed;