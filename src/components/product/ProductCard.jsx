import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  // --- INVENTORY LOGIC ---
  const stock = product.stock_quantity || 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 3;

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product);
    setIsCartOpen(true); 
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product);
  };

  const displayPrice = product.price ? `₹${product.price}` : `Starts at ₹${product.starting_price}`;
  
  const baseImageUrl = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg";
  const optimizedImage = baseImageUrl.includes("supabase.co") 
    ? `${baseImageUrl}?width=500&height=500&resize=cover&quality=80&format=webp`
    : baseImageUrl;

  const basePrice = product.price || product.starting_price;
  const hasDiscount = Number(product.discount) > 0; 
  const mrp = hasDiscount ? Math.round(basePrice / (1 - product.discount / 100)) : null;

  return (
    <div className="group flex flex-col h-full border border-[#EAE3D5] bg-white transition-all hover:border-[#3E2723] relative">
      
      {hasDiscount && !isOutOfStock && (
        <div className="absolute top-3 left-3 bg-[#8B0000] text-[#FAF8F5] text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest z-10 shadow-sm">
          {product.discount}% OFF
        </div>
      )}

      <Link to={`/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="aspect-square bg-[#EFEBE4] overflow-hidden relative">
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#EAE3D5] animate-pulse"></div>
          )}

          {/* Sold Out Center Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <span className="bg-[#3E2723] text-[#FAF8F5] px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg">
                Sold Out
              </span>
            </div>
          )}

          {/* NEW: Low Stock Bottom-Left Overlay */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#D2691E] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 z-10 shadow-sm flex items-center gap-1">
              <span className="animate-pulse">🔥</span> Only {stock} Left!
            </div>
          )}

          <img 
            ref={imgRef}
            src={optimizedImage}
            alt={product.title} 
            loading="lazy"
            onLoad={() => setIsLoaded(true)} 
            onError={() => setIsLoaded(true)} 
            className={`w-full h-full object-cover mix-blend-darken transition-all duration-700 ease-in-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            } ${isOutOfStock ? "grayscale-[50%]" : "group-hover:scale-105"}`} 
          />
        </div>

        {/* Text Section (Reverted to tight original alignment) */}
        <div className={`p-5 flex flex-col flex-grow transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <h3 className={`font-sans font-medium text-lg mb-1 truncate ${isOutOfStock ? "text-gray-400" : "text-[#3E2723]"}`}>
            {product.title}
          </h3>
          
          <div className="mt-auto">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <p className={`${isOutOfStock ? "text-gray-400" : "text-[#3E2723]"} font-serif italic text-sm`}>
                  {product.price ? `₹${product.price}` : `Starts at ₹${basePrice}`}
                </p>
                <p className="text-[#3E2723]/40 text-xs line-through font-sans">
                  ₹{mrp}
                </p>
              </div>
            ) : (
              <p className={`${isOutOfStock ? "text-gray-400" : "text-[#3E2723]/70"} font-sans text-sm`}>
                {displayPrice}
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className={`p-5 pt-0 mt-auto flex flex-col lg:flex-row gap-2 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <button 
          onClick={handleAddToCart} 
          disabled={isOutOfStock}
          className={`flex-1 py-2.5 uppercase tracking-[0.2em] text-[10px] font-bold transition-colors text-center border ${
            isOutOfStock 
              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50" 
              : "border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-[#FAF8F5]"
          }`}
        >
          Add to Cart
        </button>
        <button 
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`flex-1 py-2.5 uppercase tracking-[0.2em] text-[10px] font-bold transition-colors text-center shadow-sm ${
            isOutOfStock 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-[#3E2723] text-[#FAF8F5] hover:bg-[#2C2C2C]"
          }`}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;