import { useState } from "react";
import { useCart } from "./../../context/CartContext"; // Import the cart context
import { supabase } from "../../lib/supabase";

function CheckoutModal({ isOpen, onClose }) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // If the modal isn't supposed to be open, don't render anything
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty!");

    setLoading(true);
    const totalPrice = getCartTotal();

    try {
      // 1. Save the order to Supabase
      const { data: orderData, error } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: formData.name,
            customer_phone: formData.phone,
            shipping_address: formData.address,
            order_items: cartItems,
            total_price: totalPrice,
            status: "Pending",
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // 2. Clear the cart and close the modal
      clearCart();
      onClose();

      // 3. Redirect to WhatsApp with the new Order ID
      const message = `Hello Pitara! I just placed Order #${orderData.id.slice(0, 8).toUpperCase()}.\n\nName: ${formData.name}\nTotal: ₹${totalPrice}\n\nPlease send me the UPI details to confirm!`;
      window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");

    } catch (err) {
      console.error("Order Error:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose} // Clicking the dark background closes the modal
    >
      <div 
        className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl shadow-xl relative max-h-[90vh] flex flex-col overflow-hidden"
        onClick={handleModalClick}
      >
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#EAE3D5] bg-white">
          <h2 className="text-2xl font-black text-[#3E2723] uppercase tracking-wide">
            Secure Checkout
          </h2>
          <button 
            onClick={onClose}
            className="text-[#3E2723]/50 hover:text-[#3E2723] transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-[#3E2723] py-8">Your cart is empty.</p>
          ) : (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#3E2723] uppercase tracking-widest">Full Name</label>
                <input required type="text" name="name" onChange={handleChange} className="border border-[#EAE3D5] p-3 rounded-lg focus:outline-none focus:border-[#3E2723] bg-white" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#3E2723] uppercase tracking-widest">WhatsApp Number</label>
                <input required type="tel" name="phone" onChange={handleChange} className="border border-[#EAE3D5] p-3 rounded-lg focus:outline-none focus:border-[#3E2723] bg-white" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#3E2723] uppercase tracking-widest">Complete Delivery Address</label>
                <textarea required name="address" rows="3" onChange={handleChange} className="border border-[#EAE3D5] p-3 rounded-lg focus:outline-none focus:border-[#3E2723] bg-white resize-none" />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#EAE3D5] bg-white flex justify-between items-center">
            <span className="font-sans text-sm text-[#3E2723]">
              Total: <strong className="text-xl block">₹{getCartTotal()}</strong>
            </span>
            <button 
              form="checkout-form"
              type="submit" 
              disabled={loading}
              className="bg-[#3E2723] text-[#FAF8F5] px-6 py-3 rounded-lg uppercase tracking-[0.1em] text-xs font-bold hover:bg-[#2C2C2C] transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? "Processing..." : "Place Order & Pay"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CheckoutModal;