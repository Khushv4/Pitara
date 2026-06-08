import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../context/CartContext";
// 1. IMPORT CHEVRONS FOR ARROWS
import { ChevronLeft, ChevronRight } from "lucide-react"; 

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(image_url)")
        .eq("id", id)
        .single();

      if (data) {
        const formattedProduct = {
          ...data,
          images: data.product_images?.map((img) => img.image_url) || [],
        };
        setProduct(formattedProduct);
      }
    };
    loadProduct();
  }, [id]);

  if (!product) return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans tracking-widest uppercase text-[#3E2723]">Loading...</div>;

  const displayPrice = product.price ? `₹${product.price}` : `Starts at ₹${product.starting_price}`;

  const handleBuyNow = () => {
    const price = product.price || product.starting_price;
    const message = `Hello Pitara! I would like to buy: ${product.title} for ₹${price}.`;
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  // 2. ADD LOGIC FOR ARROW CLICKS
  const nextImage = () => {
    setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-grow max-w-[1200px] mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          
          {/* 3. MAKE CONTAINER RELATIVE AND ADD ARROW BUTTONS */}
          <div className="relative aspect-square bg-[#EFEBE4] border border-[#EAE3D5] overflow-hidden group">
            {product.images.length > 0 ? (
              <>
                <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover mix-blend-darken" />
                
                {/* Only show arrows if there is more than 1 image */}
                {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#3E2723] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#3E2723] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 flex-shrink-0 border transition-all ${activeImage === index ? 'border-[#3E2723]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover mix-blend-darken bg-[#EFEBE4]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#3E2723]/60 mb-4">{product.category_name}</p>
          <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tighter text-[#3E2723] uppercase mb-4 leading-tight">
            {product.title}
          </h1>
          <p className="text-2xl font-serif italic text-[#3E2723] mb-8">{displayPrice}</p>

          <div className="prose prose-sm text-[#3E2723]/80 font-light leading-relaxed mb-10">
            <p>{product.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full border-t border-[#EAE3D5] pt-10">
            <button 
              onClick={handleAddToCart} 
              className="flex-1 border border-[#3E2723] text-[#3E2723] py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#3E2723] hover:text-[#FAF8F5] transition-colors text-center"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-[#3E2723] text-[#FAF8F5] py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#2C2C2C] transition-colors text-center shadow-sm"
            >
              Buy Now
            </button>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;