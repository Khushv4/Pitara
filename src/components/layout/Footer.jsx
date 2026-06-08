import { Link } from "react-router-dom";
import { FiInstagram, FiMail } from "react-icons/fi"; 

function Footer() {
  return (
    <footer className="bg-[#3E2723] text-[#FAF8F5] py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12 text-center md:text-left">

        {/* Brand Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-5">
          {/* CHANGED: Replaced the text heading with your fpitara.png logo */}
          {/* Brand Logo & Tagline - Nudged up with -mt-4 md:-mt-6 */}
<Link to="/" className="h-16 md:h-20 flex items-center transition-transform hover:scale-105 -mt-24 md:-mt-4">
  <img 
    src="/fpitara.png" 
    alt="Pitara Logo" 
    className="h-full w-auto object-contain" 
  />
</Link>
          <p className="font-serif italic text-[#FAF8F5]/80 text-lg md:text-xl mt-[-10px]">
            Unbox Something Special.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-xs uppercase tracking-[0.2em] font-medium opacity-80 pt-2">
          <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
          <a href="/#browse" className="hover:opacity-100 transition-opacity">Catalog</a>
          <Link to="/about" className="hover:opacity-100 transition-opacity">About</Link>
        </div>

        {/* Social / Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 md:gap-6 w-full md:w-auto pt-2">
          
          <a
            href="https://instagram.com/pitara___official/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border border-[#FAF8F5]/30 px-6 py-3 hover:bg-[#FAF8F5] hover:text-[#3E2723] transition-colors group w-full sm:w-auto justify-center"
          >
            <FiInstagram size={18} />
            <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Follow Us</span>
          </a>

          <a
            href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
            className="flex items-center gap-3 border border-[#FAF8F5]/30 px-6 py-3 hover:bg-[#FAF8F5] hover:text-[#3E2723] transition-colors group w-full sm:w-auto justify-center"
          >
            <FiMail size={18} />
            <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Email Us</span>
          </a>

        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#FAF8F5]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-widest uppercase opacity-50">
        <p>&copy; {new Date().getFullYear()} Pitara. All rights reserved.</p>
        <p>Curated in India</p>
      </div>
    </footer>
  );
}

export default Footer;