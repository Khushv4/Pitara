import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/common/SEO";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { supabase } from "../../lib/supabase";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await supabase.from("categories").select("*").order("name");
      setCategories(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Categories | Pitara" description="Browse our curated collections of artisanal gifts." />

      <main className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />

        <section className="flex-grow pt-20 pb-32">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-20">
            
            {/* HEADER */}
            <div className="border-b-2 border-[#3E2723] pb-6 mb-16 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter text-[#3E2723] uppercase">
                Collections
              </h1>
            </div>

            {/* GRID */}
            {loading ? (
              <div className="text-center py-20 text-[#3E2723]/60 font-sans tracking-widest uppercase text-sm">
                Loading Collections...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20 text-[#3E2723]/60 font-sans tracking-widest uppercase text-sm">
                No collections available yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {categories.map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/category/${category.slug}`}
                    className="group cursor-pointer flex flex-col"
                  >
                    {/* SQUARE IMAGE BLOCK - Now pulling dynamically from DB! */}
                    <div className="relative aspect-square overflow-hidden bg-[#EFEBE4] mb-6 border border-[#EAE3D5]">
                      <img
                        src={category.image_url || "https://placehold.co/800x800?text=No+Image"}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#3E2723]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* CATEGORY TITLE */}
                    <div className="flex items-center justify-between border-b border-[#3E2723]/20 pb-2 group-hover:border-[#3E2723] transition-colors">
                      <h2 className="text-2xl font-serif font-bold text-[#3E2723]">
                        {category.name}
                      </h2>
                      <span className="font-sans text-[#3E2723] text-sm tracking-widest uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Explore →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default Categories;