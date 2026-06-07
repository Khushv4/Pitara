import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from 'react-icons/fa6'; 

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleWhatsAppClick = (e) => {
    e.stopPropagation(); 
    const message = `Hi! I'm interested in buying: ${product.title} (₹${product.price})`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <article 
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* IMAGE WRAPPER */}
      <div className="relative aspect-square overflow-hidden bg-[#EFEBE4] mb-4">
        <img
          src={product.images?.[0] || "https://placehold.co/800x800"}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-darken p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-col text-left flex-grow">
        <h3 className="text-base font-sans font-medium text-[#3E2723] truncate">
          {product.title}
        </h3>
        
        <p className="mt-1 font-sans font-bold text-sm text-[#3E2723] mb-4">
          {product.show_price ? `₹${product.price}` : `₹${product.starting_price} +`}
        </p>

        {/* BUY NOW BUTTON - Kept in brand color */}
        <button 
          onClick={handleWhatsAppClick}
          className="mt-auto w-full bg-[#3E2723] text-[#FAF8F5] font-sans text-xs tracking-widest uppercase font-semibold py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#2C2C2C] transition-colors"
        >
          <FaWhatsapp size={16} /> BUY NOW
        </button>
      </div>
    </article>
  );
}

export default ProductCard;