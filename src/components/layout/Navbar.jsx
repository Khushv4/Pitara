import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MessageCircle, Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartDrawer from "../cart/CartDrawer"; // Adjust this path if your CartDrawer is located elsewhere

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse Catalog", path: "/#browse" },
    { name: "About", path: "/about" },
  ];

  // Calculate total items in cart for the badge
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3D5]">
        
        {/* Container with balanced vertical padding */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-20 py-3 md:py-4 flex items-center justify-between">
          
          {/* LOGO - Dialed down to premium proportions (h-12 mobile, up to h-20 desktop) */}
          <Link to="/" className="h-12 md:h-16 lg:h-20 flex items-center transition-transform hover:scale-105"> 
            <img src="/pitara.png" alt="Pitara" className="h-full w-auto object-contain" />
          </Link>

          {/* DESKTOP NAV - Right Aligned */}
          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name} 
                  to={link.path} 
                  className="text-[#3E2723] text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100 font-medium transition-opacity"
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
            
            <div className="flex items-center gap-6 border-l border-[#EAE3D5] pl-8">
              <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 text-[#3E2723] transition-opacity">
  <MessageCircle size={22} />
</a>
              
              {/* DESKTOP CART BUTTON */}
              <button onClick={() => setIsCartOpen(true)} className="relative opacity-80 hover:opacity-100 text-[#3E2723] transition-opacity">
                <ShoppingBag size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#3E2723] text-[#FAF8F5] text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* MOBILE ICONS (Cart + Hamburger) */}
          <div className="md:hidden flex items-center gap-5 text-[#3E2723]">
            <button onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingBag size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#3E2723] text-[#FAF8F5] text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="transition-transform active:scale-90">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        {isOpen && (
          <div className="md:hidden absolute top-[100%] left-0 w-full bg-[#FAF8F5] border-b border-[#EAE3D5] p-8 flex flex-col items-center gap-6 shadow-xl">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-xl uppercase tracking-widest text-[#3E2723]" 
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-xl uppercase tracking-widest text-[#25D366]" onClick={() => setIsOpen(false)}>
  WhatsApp Us
</a>
          </div>
        )}
      </header>

      {/* Mount Cart Drawer */}
      <CartDrawer />
    </>
  );
}

export default Navbar;