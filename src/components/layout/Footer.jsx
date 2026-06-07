import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    // Change the opening <footer ...> tag to this:
<footer className="bg-[#3E2723] text-[#FAF8F5] pt-16 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* MAIN CONTENT BLOCK */}
        <div className="flex flex-col max-w-md">
          
          {/* Brand */}
          <Link to="/" className="text-3xl font-serif font-bold tracking-[0.2em] mb-6">
            PITARA
          </Link>
          
          {/* Contact Info */}
          <div className="space-y-2 font-sans text-sm text-[#FAF8F5]/80 tracking-wide mb-8">
            <p>Indore, Madhya Pradesh, India</p>
            <p>hello@pitara.store</p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a 
              href="#" 
              className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"
              aria-label="Facebook"
            >
               <FaFacebookF size={14} color="white" />
            </a>
            
            <a 
              href="#" 
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#833AB4] flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"
              aria-label="Instagram"
            >
               <FaInstagram size={16} color="white" />
            </a>
            
            <a 
              href="#" 
              className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"
              aria-label="YouTube"
            >
               <FaYoutube size={16} color="white" />
            </a>
            
            <a 
              href="#" 
              className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm border border-white/20"
              aria-label="X / Twitter"
            >
               <FaXTwitter size={14} color="white" />
            </a>
          </div>
        </div>

        {/* BOTTOM DIVIDER & COPYRIGHT */}
        <div className="border-t border-[#FAF8F5]/20 mt-16 pt-8">
          <p className="text-xs font-sans tracking-wide text-[#FAF8F5]/50">
            © {new Date().getFullYear()} Pitara. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
}

export default Footer;