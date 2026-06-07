import { MessageCircle } from "lucide-react"; // Using Lucide for a sleek, modern icon

function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919999999999" // Replace with actual number
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#3E2723] text-[#F5F0E6] p-4 rounded-full shadow-2xl hover:bg-[#2C2C2C] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      
      {/* Optional Hover Tooltip */}
      <span className="absolute right-16 bg-[#F5F0E6] text-[#3E2723] px-3 py-1 rounded-md text-sm font-sans font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
        Need help? Chat with us!
      </span>
    </a>
  );
}

export default FloatingWhatsApp;