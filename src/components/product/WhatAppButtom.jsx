function WhatsAppButton({ product, quantity }) {
  const phoneNumber = "919999999999"; // Your business number
  const message = `Hello! I would like to order:
  - Product: ${product.title}
  - Quantity: ${quantity}
  - Total: ₹${product.price * quantity}
  Please confirm availability.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full bg-[#25D366] text-white font-sans text-sm uppercase tracking-widest font-semibold py-4 text-center hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
    >
      {/* Add a WhatsApp Icon here using react-icons/fa6 */}
      Order on WhatsApp
    </a>
  );
}