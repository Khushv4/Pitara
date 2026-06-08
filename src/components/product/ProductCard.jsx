import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  // FAILSAFE 1: If the browser already has the image cached, reveal instantly
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  const handleBuyNow = (e) => {
    e.preventDefault();
    const price = product.price || product.starting_price;
    const message = `Hello Pitara! I would like to buy: ${product.title} for ₹${price}.`;
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const displayPrice = product.price ? `₹${product.price}` : `Starts at ₹${product.starting_price}`;
  const coverImage = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg";

  return (
    <div className="group flex flex-col border border-[#EAE3D5] bg-white transition-all hover:border-[#3E2723]">
      <Link to={`/product/${product.id}`} className="block flex-grow">
        
        {/* Image Container with Skeleton */}
        <div className="aspect-square bg-[#EFEBE4] overflow-hidden relative">
          
          {/* SKELETON: Pulses while downloading */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#EAE3D5] animate-pulse"></div>
          )}

          {/* ACTUAL IMAGE */}
          <img 
            ref={imgRef}
            src={coverImage} 
            alt={product.title} 
            loading="lazy"
            onLoad={() => setIsLoaded(true)} 
            onError={() => setIsLoaded(true)} // FAILSAFE 2: If the image link is broken, still reveal the text/buttons!
            className={`w-full h-full object-cover mix-blend-darken group-hover:scale-105 transition-all duration-700 ease-in-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`} 
          />
        </div>

        {/* Content: Fades in ONLY when image is ready or failsafes trigger */}
        <div className={`p-5 flex flex-col flex-grow transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <h3 className="font-sans font-medium text-[#3E2723] text-lg mb-1 truncate">{product.title}</h3>
          <p className="text-[#3E2723]/70 font-sans text-sm">{displayPrice}</p>
        </div>
      </Link>

      {/* Action Buttons */}
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