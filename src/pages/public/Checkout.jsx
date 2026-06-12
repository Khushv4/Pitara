import { useState } from "react";
import { useCart } from "../../context/CartContext"; // Import the cart context ""; // Assuming you have a cart context!
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

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

      // 2. Clear the user's cart
      clearCart();

      // 3. Redirect to WhatsApp with the new Order ID for payment
      const message = `Hello Pitara! I just placed Order #${orderData.id.slice(0, 8).toUpperCase()}.\n\nName: ${formData.name}\nTotal: ₹${totalPrice}\n\nPlease send me the UPI details to confirm!`;
      window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
      
      // 4. Send them back to the home page
      navigate("/");

    } catch (err) {
      console.error("Order Error:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="py-20 text-center font-sans text-[#3E2723]">Your cart is empty.</div>;
  }

  return (
    <div className="py-20 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-black text-[#3E2723] uppercase mb-8 border-b-2 border-[#3E2723] pb-4">
          Secure Checkout
        </h2>

        <form onSubmit={handlePlaceOrder} className="bg-white p-8 border border-[#EAE3D5] shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#3E2723] uppercase tracking-widest">Full Name</label>
            <input required type="text" name="name" onChange={handleChange} className="border border-[#EAE3D5] p-3 focus:outline-none focus:border-[#3E2723] bg-[#FAF8F5]" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#3E2723] uppercase tracking-widest">WhatsApp Number</label>
            <input required type="tel" name="phone" onChange={handleChange} className="border border-[#EAE3D5] p-3 focus:outline-none focus:border-[#3E2723] bg-[#FAF8F5]" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#3E2723] uppercase tracking-widest">Complete Delivery Address</label>
            <textarea required name="address" rows="4" onChange={handleChange} className="border border-[#EAE3D5] p-3 focus:outline-none focus:border-[#3E2723] bg-[#FAF8F5] resize-none" />
          </div>

          <div className="border-t border-[#EAE3D5] pt-6 mt-4 flex justify-between items-center">
            <span className="font-sans text-lg text-[#3E2723]">Total to pay: <strong className="text-2xl">₹{getCartTotal()}</strong></span>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#3E2723] text-[#FAF8F5] px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#2C2C2C] transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : "Place Order & Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;