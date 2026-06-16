import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../context/CartContext";
import { ChevronLeft, ChevronRight, Share2, AlertCircle } from "lucide-react"; 

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
          stock: data.stock_quantity || 0, // <-- Pulled directly from your new DB column
        };
        setProduct(formattedProduct);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const setMetaTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    document.title = `${product.title} | Pitara`;
    setMetaTag("og:title", product.title);
    setMetaTag("og:description", product.description || "Check out this product on Pitara!");
    setMetaTag("og:url", window.location.href);
    
    if (product.images.length > 0) {
      setMetaTag("og:image", product.images[0]);
    }

    return () => {
      document.title = "Pitara";
    };
  }, [product]);

  if (!product) return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans tracking-widest uppercase text-[#3E2723]">Loading...</div>;

  const displayPrice = product.price ? `₹${product.price}` : `Starts at ₹${product.starting_price}`;
  
  // Inventory Status Variables
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const price = product.price || product.starting_price;
    const message = `Hello Pitara! I would like to buy: ${product.title} for ₹${price}.`;
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on Pitara!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const nextImage = () => setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-grow max-w-[1200px] mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square bg-[#EFEBE4] border border-[#EAE3D5] overflow-hidden group">
            {product.images.length > 0 ? (
              <>
                <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover mix-blend-darken" />
                {product.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#3E2723] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={24} /></button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#3E2723] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={24} /></button>
                  </>
                )}
                <button onClick={handleShare} className="md:hidden absolute bottom-4 right-4 bg-white text-[#3E2723] p-3 rounded-full shadow-lg z-10 active:scale-95 transition-transform">
                  <Share2 size={20} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button key={index} onClick={() => setActiveImage(index)} className={`w-20 h-20 flex-shrink-0 border transition-all ${activeImage === index ? 'border-[#3E2723]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
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
          <p className="text-2xl font-serif italic text-[#3E2723] mb-6">{displayPrice}</p>

          {/* --- NEW: DYNAMIC INVENTORY BANNER --- */}
          {isOutOfStock ? (
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 border border-red-100 w-max mb-6">
              <AlertCircle size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Currently Out of Stock</span>
            </div>
          ) : isLowStock ? (
            <div className="inline-flex items-center gap-2 bg-[#FAF0E6] text-[#D2691E] px-4 py-2 border border-[#EAE3D5] w-max mb-6">
              <span className="animate-pulse">🔥</span>
              <span className="text-xs font-black uppercase tracking-widest">Selling Fast - Only {product.stock} Left!</span>
            </div>
          ) : (
            <div className="mb-6"></div> // Spacer to keep layout balanced if in stock
          )}

          <div className="prose prose-sm text-[#3E2723]/80 font-light leading-relaxed mb-10">
            <p>{product.description}</p>
          </div>

          {/* Action Buttons with Dynamic Disabling */}
          <div className="flex flex-col sm:flex-row gap-4 w-full border-t border-[#EAE3D5] pt-10">
            <button 
              onClick={handleAddToCart} 
              disabled={isOutOfStock}
              className={`flex-1 py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all text-center border ${
                isOutOfStock 
                  ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed" 
                  : "border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-[#FAF8F5]"
              }`}
            >
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-1 py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all text-center shadow-sm ${
                isOutOfStock 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-[#3E2723] text-[#FAF8F5] hover:bg-[#2C2C2C]"
              }`}
            >
              {isOutOfStock ? "Sold Out" : "Buy Now"}
            </button>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;