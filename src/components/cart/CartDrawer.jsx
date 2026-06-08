import { X, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";

function CartDrawer() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, isCartOpen, setIsCartOpen } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    let message = "Hello Pitara! I would like to order the following items:%0A%0A";
    cartItems.forEach((item) => {
      const price = item.price || item.starting_price;
      message += `${item.quantity}x ${item.title} - ₹${price * item.quantity}%0A`;
    });
    message += `%0A*Total: ₹${getCartTotal()}*`;
    
   window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-[#3E2723]/20 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
      
      {/* Side Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FAF8F5] shadow-2xl z-50 flex flex-col border-l border-[#EAE3D5] transform transition-transform">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EAE3D5]">
          <h2 className="font-serif italic text-2xl text-[#3E2723]">Your Treasures</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-[#3E2723] hover:opacity-70 transition-opacity">
            <X size={28} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#3E2723]/50 space-y-4">
              <p className="font-sans text-lg">Your cart is empty.</p>
              <button onClick={() => setIsCartOpen(false)} className="uppercase tracking-widest text-xs font-bold underline">Continue Shopping</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-[#EAE3D5] pb-6">
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                  {item.images && item.images[0] && (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover mix-blend-darken" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-medium text-[#3E2723]">{item.title}</h3>
                    <p className="text-[#3E2723]/70 text-sm mt-1">₹{item.price || item.starting_price}</p>
                  </div>
                  
                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-[#3E2723] rounded-sm">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-[#3E2723] hover:bg-[#3E2723]/10"><Minus size={14} /></button>
                      <span className="px-4 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-[#3E2723] hover:bg-[#3E2723]/10"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 underline">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#EAE3D5] bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="font-sans text-[#3E2723]/70 uppercase tracking-widest text-xs">Subtotal</span>
              <span className="font-sans font-medium text-xl text-[#3E2723]">₹{getCartTotal()}</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-[#3E2723] text-[#FAF8F5] py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#2C2C2C] transition-colors shadow-sm">
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;