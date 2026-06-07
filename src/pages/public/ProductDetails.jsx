import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaWhatsapp } from 'react-icons/fa6';
import SEO from "../../components/common/SEO";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { supabase } from "../../lib/supabase";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const { data: productData } = await supabase.from("products").select("*").eq("id", id).single();
      const { data: imageData } = await supabase.from("product_images").select("*").eq("product_id", id).order("display_order");

      const formattedProduct = {
        ...productData,
        images: imageData?.map((img) => img.image_url) || [],
      };

      setProduct(formattedProduct);
      if (formattedProduct.images.length > 0) setActiveImage(formattedProduct.images[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    const message = `Hi! I'm interested in buying: ${product.title}%0APrice: ₹${product.price}%0A---%0AView product: ${window.location.href}`;
    window.open(`https://wa.me/919999999999?text=${message}`, "_blank");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <SEO title={`${product.title} | Pitara`} description={product.description} />
      <main className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />
        <section className="flex-grow pt-12 pb-24">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-20">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              
              {/* IMAGE GALLERY */}
              <div className="flex flex-col gap-4 sticky top-24 w-full max-w-lg mx-auto lg:mx-0">
                <div className="aspect-square bg-[#EFEBE4] w-full flex items-center justify-center p-8">
                  <img src={activeImage} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-darken" />
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(img)} className="w-20 h-20 border-2 border-transparent hover:border-[#3E2723]/30">
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* PRODUCT INFO */}
              <div className="flex flex-col pt-4">
                <h1 className="text-4xl font-sans font-medium text-[#3E2723] mb-4">{product.title}</h1>
                <p className="text-2xl font-bold text-[#3E2723] mb-8">₹{product.price}</p>
                
                {/* Updated Button Color to match ProductCard */}
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-[#3E2723] text-[#FAF8F5] py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#2C2C2C] transition-colors flex items-center justify-center gap-2 mb-8"
                >
                  <FaWhatsapp size={20} /> BUY NOW
                </button>

                <div className="prose prose-sm text-[#3E2723]/80 pt-8 border-t border-[#3E2723]/20">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

export default ProductDetails;  