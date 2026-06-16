import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  // The Quick-Update Inventory Function
  const updateStock = async (id, newStock) => {
    const stockValue = parseInt(newStock) || 0;
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: stockValue })
        .eq("id", id);

      if (error) throw error;
      
      // Update the UI instantly
      setProducts(products.map(p => p.id === id ? { ...p, stock_quantity: stockValue } : p));
    } catch (err) {
      alert("Failed to update stock.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await supabase.from("products").delete().eq("id", id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#3E2723]">Inventory & Products</h1>
        <Link 
          to="/admin/products/new"
          className="bg-[#3E2723] text-[#FAF8F5] px-6 py-3 rounded-xl uppercase tracking-[0.1em] text-sm font-bold hover:bg-[#2C2C2C] transition-colors shadow-md"
        >
          + Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="text-[#3E2723] font-bold">Loading Inventory...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#EAE3D5] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EAE3D5]">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#3E2723]">Product</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#3E2723]">Price</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#3E2723]">Stock Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#3E2723] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D5]">
              {products.map((product) => {
                const stock = product.stock_quantity || 0;
                
                // Dynamic styling based on stock levels
                const isOutOfStock = stock <= 0;
                const isLowStock = stock > 0 && stock <= 3;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-[#3E2723]">{product.title}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{product.category_name}</p>
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#3E2723]">
                      ₹{product.price || product.starting_price}
                    </td>
                    <td className="py-4 px-6 flex flex-col gap-2 items-start">
                      {/* Quick Edit Stock Input */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="0"
                          value={stock}
                          onChange={(e) => updateStock(product.id, e.target.value)}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-sm font-bold outline-none focus:border-[#3E2723]"
                        />
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Units</span>
                      </div>
                      
                      {/* Dynamic Inventory Badges */}
                      {isOutOfStock ? (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Low Stock: {stock} Left</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">In Stock</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default Products;