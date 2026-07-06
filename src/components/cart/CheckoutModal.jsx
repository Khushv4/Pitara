import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabase";

function CheckoutModal({ isOpen, onClose, buyNowItem = null }) {
  const { cartItems, getCartTotal, clearCart, setIsCartOpen } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  if (!isOpen) return null;

  // SMART LOGIC: Decide if we are checking out the cart OR a single item
  const checkoutItems = buyNowItem ? [{ ...buyNowItem, quantity: 1 }] : cartItems;
  const checkoutTotal = buyNowItem ? (buyNowItem.price || buyNowItem.starting_price) : getCartTotal();

  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-[#FAF8F5] p-8 rounded-2xl relative shadow-2xl border border-[#EAE3D5] text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-[#3E2723]">✕</button>
          <h2 className="text-xl font-black text-[#3E2723] uppercase tracking-widest mb-2">Oops!</h2>
          <p className="text-sm text-gray-500 font-sans">You don't have any items to checkout.</p>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Format the items for the database
      const formattedOrderItems = checkoutItems.map(item => ({
        product_id: item.id,
        title: item.title,
        price: item.price || item.starting_price,
        quantity: item.quantity
      }));

      // 2. Save Order to Database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_name: formData.name,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          total_price: checkoutTotal, 
          status: "Pending",
          order_items: formattedOrderItems 
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Deduct Inventory
      for (const item of checkoutItems) {
        const { data: productData } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", item.id)
          .single();

        if (productData) {
          const newStock = Math.max(0, productData.stock_quantity - item.quantity); 
          await supabase
            .from("products")
            .update({ stock_quantity: newStock })
            .eq("id", item.id);
        }
      }

      // 4. GENERATE THE NEW WHATSAPP MESSAGE (No Links)
      const itemsList = checkoutItems.map(item => 
        `▪ ${item.quantity}x ${item.title}`
      ).join('\n');

      let message = `Hello Pitara! I would like to place an order.\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\n\n*Order Items:*\n${itemsList}\n\n*Grand Total:* ₹${checkoutTotal}`;
      
      window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");

      // 5. Clean up UI
      if (!buyNowItem) {
        clearCart(); 
      }
      setIsCartOpen(false); 
      onClose(); 

    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl p-8 relative shadow-2xl border border-[#EAE3D5]">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-[#3E2723] transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-black text-[#3E2723] uppercase tracking-tighter mb-2">Checkout</h2>
        <p className="text-sm text-gray-500 mb-8 font-sans">
          {buyNowItem ? `Direct Purchase: ${buyNowItem.title}` : "Enter your details to generate your order."}
        </p>

        <form onSubmit={handleCheckout} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white border border-[#EAE3D5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3E2723] transition-colors text-[#3E2723] font-bold"
              placeholder="e.g. Khushal"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp Number</label>
            <input 
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-white border border-[#EAE3D5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3E2723] transition-colors text-[#3E2723] font-bold"
              placeholder="+91 00000 00000"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Complete Shipping Address</label>
            <textarea 
              required
              rows="3"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full bg-white border border-[#EAE3D5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3E2723] transition-colors text-[#3E2723] font-medium resize-none"
              placeholder="House/Flat No, Street, City, State, PIN Code"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-[#EAE3D5] flex justify-between items-center mb-6">
            <span className="text-sm font-bold uppercase tracking-widest text-[#3E2723]">Grand Total</span>
            <span className="text-2xl font-black text-[#3E2723]">₹{checkoutTotal}</span>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#3E2723] text-[#FAF8F5] py-4 rounded-xl uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#2C2C2C] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order via WhatsApp"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;