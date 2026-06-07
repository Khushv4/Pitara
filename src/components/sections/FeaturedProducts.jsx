import { useEffect, useState } from "react";
import ProductCard from "../product/ProductCard";
import { getFeaturedProducts } from "../../services/productService";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getFeaturedProducts();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 text-center text-[#3E2723]/60 font-sans tracking-widest uppercase text-sm">
          Loading curated pieces...
        </div>
      </section>
    );
  }

  // If there are no featured products, hide the section entirely so it doesn't look broken
  if (products.length === 0) {
    return null; 
  }

  return (
    <section className="py-24 bg-[#FAF8F5] border-b border-[#EAE3D5]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ELEGANT HEADER */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3E2723] mb-6">
            Curated Collections
          </h2>
          {/* Small decorative divider */}
          <div className="w-16 h-[1px] bg-[#3E2723]/30"></div>
        </div>

        {/* TIGHT CATALOG GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;