import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  
  // Image States
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    // We now fetch the product AND its connected images
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading product:", error);
    } else {
      setProduct(data);
      setExistingImages(data.product_images || []);
    }
  };

  // --- Handlers for Images ---
  
  const handleRemoveExistingImage = (imageId) => {
    // Move it out of the visible array and into the "to delete" queue
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
    setImagesToDelete([...imagesToDelete, imageId]);
  };

  const handleAddNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // --- The Main Update Function ---

  const updateProduct = async () => {
    try {
      setLoading(true);

      // 1. Delete removed images from the database
      if (imagesToDelete.length > 0) {
        await supabase
          .from("product_images")
          .delete()
          .in("id", imagesToDelete);
      }

      // 2. Upload new images to Supabase Storage
      const newUploadedUrls = [];
      for (const file of newImages) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        
        // Ensure you have a bucket named 'products' created and set to Public!
        const { error: uploadError } = await supabase.storage
          .from("products") 
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        newUploadedUrls.push({
          product_id: id,
          image_url: urlData.publicUrl,
        });
      }

      // 3. Insert the new image URLs into the database
      if (newUploadedUrls.length > 0) {
        const { error: imageDbError } = await supabase
          .from("product_images")
          .insert(newUploadedUrls);
          
        if (imageDbError) throw imageDbError;
      }

      // 4. Update the main Product Details (Title, Price, Description)
      const { id: ignoreId, created_at, product_images, ...safeUpdateData } = product;
      const payload = {
        ...safeUpdateData,
        price: product.price ? Number(product.price) : null,
      };

      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);

      if (updateError) throw updateError;

      alert("Product Updated Successfully!");
      
      // Reload to get fresh data and clear the new image states
      setImagesToDelete([]);
      setNewImages([]);
      loadProduct();

    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update: " + error.message);
    } finally {
      setLoading(false);
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

      <div className="bg-white p-8 rounded-3xl flex flex-col gap-8 shadow-sm border border-gray-100">
        
        {/* --- TEXT FIELDS --- */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Product Title</label>
            <input
              value={product.title || ""}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#1A531A] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
            <input
              type="number"
              value={product.price || ""}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#1A531A] transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={product.description || ""}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              rows="5"
              className="border border-gray-300 p-3 rounded-xl w-full resize-y focus:outline-none focus:border-[#1A531A] transition-all"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* --- EXISTING IMAGES --- */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-700">Current Images</label>
          {existingImages.length === 0 ? (
            <p className="text-sm text-gray-400">No images saved for this product.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <img src={img.image_url} alt="Product" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleRemoveExistingImage(img.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full z-10 hover:bg-red-600 transition-colors"
                    title="Remove Image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- ADD NEW IMAGES --- */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-700">Add New Images</label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleAddNewImages} 
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1A531A]/10 file:text-[#1A531A] hover:file:bg-[#1A531A]/20 transition-all cursor-pointer" 
          />
          
          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              {newImages.map((file, index) => (
                <div key={index} className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full z-10 hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- SUBMIT BUTTON --- */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={updateProduct}
            disabled={loading}
            className="bg-[#1A531A] text-white px-8 py-3 rounded-xl hover:bg-[#123912] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving Updates..." : "Update Product"}
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}

export default EditProduct;