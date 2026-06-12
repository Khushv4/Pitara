import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDownloadSheet = async (order) => {
    try {
      setGeneratingId(order.id);
      
      const element = document.getElementById(`sheet-${order.id}`);
      element.style.display = "block";

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Pitara_Order_${order.id.slice(0, 8)}.pdf`);

    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      const element = document.getElementById(`sheet-${order.id}`);
      if (element) element.style.display = "none";
      setGeneratingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#3E2723]">Order Management</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-[#3E2723] font-bold">Loading Orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#EAE3D5] text-center text-gray-500 font-sans">
          No orders placed yet.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE3D5] flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#EAE3D5] pb-4 gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#3E2723] uppercase tracking-wide">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 font-sans mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg border outline-none cursor-pointer transition-colors ${
                      order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}
                  >
                    <option value="Pending">Pending Payment</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <button 
                    onClick={() => handleDownloadSheet(order)}
                    disabled={generatingId === order.id}
                    className="bg-[#3E2723] text-[#FAF8F5] px-6 py-2 rounded-lg uppercase tracking-[0.1em] text-xs font-bold hover:bg-[#2C2C2C] transition-colors shadow-sm disabled:opacity-50"
                  >
                    {generatingId === order.id ? "Generating..." : "⬇ Download A4 Order Sheet"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Details</p>
                  <p className="font-semibold text-[#3E2723]">{order.customer_name}</p>
                  <p className="text-gray-600 font-sans text-sm mt-1">Ph: {order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Address</p>
                  <p className="text-gray-600 font-sans text-sm whitespace-pre-wrap leading-relaxed">{order.shipping_address}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- HIDDEN 2-IN-1 A4 TEMPLATE --- */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        {orders.map((order) => (
          <div 
            key={`sheet-${order.id}`} 
            id={`sheet-${order.id}`}
            style={{ 
              width: "794px", 
              height: "1123px", 
              display: "none", 
              backgroundColor: "#FFFFFF", 
              color: "#000000", 
              boxSizing: "border-box" 
            }} 
            className="p-8 font-sans flex flex-col"
          >
            
            {/* ========================================== */}
            {/* TOP HALF: SHIPPING LABEL                   */}
            {/* ========================================== */}
            <div className="h-[45%] border-[4px] border-[#000000] p-6 flex flex-col box-border">
              <div className="flex justify-between items-start border-b-[3px] border-[#000000] pb-4 mb-4">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-[#000000] m-0">PITARA</h1>
                  <p className="text-xs font-bold mt-1 tracking-widest uppercase text-[#000000] m-0">Standard Shipping</p>
                </div>
                <div className="bg-[#000000] text-[#FFFFFF] px-4 py-2">
                  <h2 className="text-2xl font-black leading-tight m-0 tracking-widest uppercase">Pre-Paid</h2>
                </div>
              </div>

              <div className="border-b-[3px] border-[#000000] pb-4 mb-4 flex">
                <div className="w-2/3 border-r-[3px] border-[#000000] pr-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#000000] m-0">AWB Number / Tracking</p>
                  <p className="text-2xl font-black tracking-widest mt-1 text-[#000000] m-0">PTR-{order.id.slice(0, 8).toUpperCase()}</p>
                  <div className="w-full h-12 flex gap-[3px] mt-3 overflow-hidden opacity-80">
                    {Array.from({length: 40}).map((_, i) => (
                      <div key={i} className="h-full bg-[#000000]" style={{ width: `${Math.random() * 5 + 1}px` }}></div>
                    ))}
                  </div>
                </div>
                <div className="w-1/3 pl-4 flex flex-col justify-center items-center text-[#000000]">
                  <p className="text-xs font-bold text-[#000000] m-0">DATE</p>
                  <p className="text-lg font-black text-[#000000] m-0 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-xs font-bold mt-4 text-[#000000] m-0">WEIGHT</p>
                  <p className="text-lg font-black text-[#000000] m-0 mt-1">0.5 KG</p>
                </div>
              </div>

              <div className="flex-grow flex border-b-[3px] border-[#000000] mb-4 pb-4">
                <div className="w-1/2 pr-4 border-r-[3px] border-[#000000]">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#000000] m-0">Return Address (FROM):</p>
                  <p className="text-sm font-bold text-[#000000] m-0 mt-1">Pitara </p>
                  
                  {/* 👇 UPDATE THIS WITH YOUR REAL INDORE DETAILS */}
                  <p className="text-xs leading-tight text-[#000000] m-0 mt-1">Nanda Nagar,<br/>Indore, MP 452011</p>
                  <p className="text-xs leading-tight text-[#000000] m-0 mt-2 font-bold">Ph: +91 7000241288</p>

                </div>
                <div className="w-1/2 pl-4">
                  <div className="bg-[#000000] text-[#FFFFFF] px-2 py-1 inline-block mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest m-0 leading-tight">DELIVER TO:</p>
                  </div>
                  <p className="text-2xl font-black uppercase text-[#000000] m-0 mb-2 leading-snug">{order.customer_name}</p>
                  <p className="text-base font-bold whitespace-pre-wrap leading-snug text-[#000000] m-0">{order.shipping_address}</p>
                  <p className="text-base font-black mt-3 text-[#000000] m-0">Ph: {order.customer_phone}</p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* SCISSOR CUT LINE                           */}
            {/* ========================================== */}
            <div className="h-[10%] flex items-center justify-center opacity-50">
              <span className="text-2xl mr-4">✂️</span>
              <div className="w-full border-t-[3px] border-dashed border-[#000000]"></div>
              <span className="ml-4 text-xs font-bold tracking-widest uppercase whitespace-nowrap">Cut Here</span>
            </div>

            {/* ========================================== */}
            {/* BOTTOM HALF: TAX INVOICE                   */}
            {/* ========================================== */}
            <div className="h-[45%] flex flex-col box-border">
              <div className="flex justify-between items-start border-b-[3px] border-[#000000] pb-6 mb-6 text-[#000000]">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter text-[#000000] m-0">PITARA</h1>
                  
                  {/* 👇 UPDATE THIS WITH YOUR REAL INDORE DETAILS */}
                  <p className="text-xs mt-2 font-medium text-[#000000] m-0">123 Nanda Nagar, Indore, 452011</p>
                

                </div>
                <div className="text-right text-[#000000]">
                  <h2 className="text-2xl font-black uppercase tracking-widest text-[#000000] m-0">Tax Invoice</h2>
                  <div className="mt-3 text-left text-[#000000]">
                    <p className="text-sm m-0 mb-1"><span className="font-bold w-20 inline-block">INV No:</span> #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm m-0"><span className="font-bold w-20 inline-block">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 text-[#000000]">
                <h3 className="text-xs font-bold uppercase tracking-widest border-b-[2px] border-[#000000] pb-2 mb-2 text-[#000000] m-0">Billed / Shipped To</h3>
                <p className="font-bold text-base text-[#000000] m-0 mt-2">{order.customer_name}</p>
                <p className="text-sm mt-1 whitespace-pre-wrap leading-relaxed text-[#000000] m-0">{order.shipping_address}</p>
                <p className="text-sm mt-1 text-[#000000] m-0 font-bold">Ph: {order.customer_phone}</p>
              </div>

              {/* PERFECTLY ALIGNED TABLE */}
              <div className="flex-grow">
                <table className="w-full text-left mb-6 border-collapse text-[#000000]">
                  <thead>
                    <tr className="border-b-[3px] border-[#000000]">
                      <th className="py-2 px-2 text-xs font-bold uppercase tracking-widest text-[#000000] w-[70%]">Item Description</th>
                      <th className="py-2 px-2 text-xs font-bold uppercase tracking-widest text-center text-[#000000] w-[15%]">Qty</th>
                      <th className="py-2 px-2 text-xs font-bold uppercase tracking-widest text-right text-[#000000] w-[15%]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#9CA3AF] last:border-0 text-[#000000]">
                        <td className="py-3 px-2 text-sm font-medium text-[#000000] break-words pr-4">{item.title}</td>
                        <td className="py-3 px-2 text-sm text-center font-bold text-[#000000]">{item.quantity}</td>
                        <td className="py-3 px-2 text-sm text-right font-bold text-[#000000]">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PERFECTLY ALIGNED TOTALS BOX */}
              <div className="flex justify-end text-[#000000] mt-auto">
                <div className="w-[300px]">
                  <div className="flex justify-between py-2 border-b border-[#D1D5DB] text-[#000000]">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#000000]">Subtotal</span>
                    <span className="text-sm font-bold text-[#000000]">₹{order.total_price}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#D1D5DB] text-[#000000] mb-3">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#000000]">Shipping</span>
                    <span className="text-sm font-bold text-[#000000]">₹0.00</span>
                  </div>
                  <div className="flex justify-between py-3 px-4 bg-[#000000] text-[#FFFFFF] box-border">
                    <span className="text-base font-black uppercase tracking-wider m-0">Grand Total</span>
                    <span className="text-base font-black m-0">₹{order.total_price}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;