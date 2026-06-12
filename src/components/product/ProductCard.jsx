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

  const handleBuyNow = (e) => {
    e.preventDefault();
    addToCart(product);
    setIsCartOpen(true); 
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
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
    <div className="group flex flex-col border border-[#EAE3D5] bg-white transition-all hover:border-[#3E2723] relative">
      
      {hasDiscount && (
        <div className="absolute top-3 left-3 bg-[#8B0000] text-[#FAF8F5] text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest z-10 shadow-sm">
          {product.discount}% OFF
        </div>
      )}

      <Link to={`/product/${product.id}`} className="block flex-grow">
        <div className="aspect-square bg-[#EFEBE4] overflow-hidden relative">
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#EAE3D5] animate-pulse"></div>
          )}

          <img 
            ref={imgRef}
            src={optimizedImage}
            alt={product.title} 
            loading="lazy"
            onLoad={() => setIsLoaded(true)} 
            onError={() => setIsLoaded(true)} 
            className={`w-full h-full object-cover mix-blend-darken group-hover:scale-105 transition-all duration-700 ease-in-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`} 
          />
        </div>

        <div className={`p-5 flex flex-col flex-grow transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <h3 className="font-sans font-medium text-[#3E2723] text-lg mb-1 truncate">
            {product.title}
          </h3>
          
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <p className="text-[#3E2723] font-serif italic text-sm">
                {product.price ? `₹${product.price}` : `Starts at ₹${basePrice}`}
              </p>
              <p className="text-[#3E2723]/40 text-xs line-through font-sans">
                ₹{mrp}
              </p>
            </div>
          ) : (
            <p className="text-[#3E2723]/70 font-sans text-sm">
              {displayPrice}
            </p>
          )}
        </div>
      </Link>

      <div className={`p-5 pt-0 mt-auto flex flex-col lg:flex-row gap-2 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <button 
          onClick={handleAddToCart} 
          className="flex-1 border border-[#3E2723] text-[#3E2723] py-2.5 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#3E2723] hover:text-[#FAF8F5] transition-colors text-center"
        >
          Add to Cart
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-[#3E2723] text-[#FAF8F5] py-2.5 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#2C2C2C] transition-colors text-center shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;