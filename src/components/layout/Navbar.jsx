import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MessageCircle, Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse Catalog", path: "/#browse" }, // Path adjusted to work as a link
    { name: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3D5] py-2">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-20 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="h-14 md:h-20 flex items-center"> 
          <img src="/pitara.png" alt="Pitara" className="h-full w-auto object-contain" />
        </Link>

        {/* DESKTOP NAV - Right Aligned */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path} 
                className="text-[#3E2723] text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100 font-medium"
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 text-[#3E2723]">
            <MessageCircle size={22} />
          </a>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button className="md:hidden text-[#3E2723]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#FAF8F5] border-b border-[#EAE3D5] p-8 flex flex-col items-center gap-6">
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
          <a href="https://wa.me/919999999999" target="_blank" className="text-xl uppercase tracking-widest text-[#25D366]" onClick={() => setIsOpen(false)}>WhatsApp Us</a>
        </div>
      )}
    </header>
  );
}

export default Navbar;