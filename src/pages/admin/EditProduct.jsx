import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading product:", error);
    } else {
      setProduct(data);
    }
  };

  const updateProduct = async () => {
    // 1. Strip out the "id" and "created_at" so we don't try to overwrite read-only database columns
    const { id: ignoreId, created_at, ...safeUpdateData } = product;

    // 2. Format the data: Make sure price is an actual Number
    const payload = {
      ...safeUpdateData,
      price: product.price ? Number(product.price) : null,
    };

    // 3. Send the clean payload to Supabase
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id);

    // 4. Show the error if it fails, or success if it works
    if (error) {
      console.error("Supabase Update Error:", error);
      alert("Failed to update: " + error.message);
    } else {
      alert("Product Updated Successfully!");
    }
  };

  if (!product)
    return (
      <AdminLayout>
        <div className="text-[#1A531A] font-bold text-xl">Loading...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Edit Product
      </h1>

      <div className="bg-white p-8 rounded-3xl flex flex-col gap-6 shadow-sm border border-gray-100">
        
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Product Title</label>
          <input
            value={product.title || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                title: e.target.value,
              })
            }
            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#1A531A] focus:ring-1 focus:ring-[#1A531A] transition-all"
          />
        </div>

        {/* Price Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
          <input
            type="number"
            value={product.price || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                price: e.target.value,
              })
            }
            className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#1A531A] focus:ring-1 focus:ring-[#1A531A] transition-all"
            placeholder="e.g. 1500"
          />
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            value={product.description || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                description: e.target.value,
              })
            }
            rows="5"
            className="border border-gray-300 p-3 rounded-xl w-full resize-y focus:outline-none focus:border-[#1A531A] focus:ring-1 focus:ring-[#1A531A] transition-all"
            placeholder="Describe the product..."
          />
        </div>

        <div className="pt-4">
          <button
            onClick={updateProduct}
            className="bg-[#1A531A] text-white px-8 py-3 rounded-xl hover:bg-[#123912] transition-colors font-semibold"
          >
            Update Product
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditProduct;