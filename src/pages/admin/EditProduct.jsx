import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";
import imageCompression from 'browser-image-compression';

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  
  // Image States
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch main product data (Guarantees text fields load)
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (productError) {
        console.error("Error loading product text fields:", productError);
        alert("Could not find this product in the database.");
        return;
      }

      // 2. Fetch connected images sorted by display_order
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("display_order", { ascending: true });

      if (imageError) {
        console.error("Error loading product images:", imageError);
      }

      // 3. Set states explicitly
      if (productData) {
        setProduct(productData);
        setExistingImages(imageData || []);
      }
    } catch (err) {
      console.error("Critical error in loadProduct pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Sequence Shift Handlers ---
  const moveExistingImage = (index, direction) => {
    const updated = [...existingImages];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setExistingImages(updated);
  };

  const moveNewImage = (index, direction) => {
    const updated = [...newImages];
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setNewImages(updated);
  };

  // --- Image Input Handlers ---
  const handleRemoveExistingImage = (imageId) => {
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
    setImagesToDelete([...imagesToDelete, imageId]);
  };

  const handleAddNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith("image/")
      );
      setNewImages([...newImages, ...files]);
      e.dataTransfer.clearData();
    }
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // --- The Main Update Function ---
  const updateProduct = async () => {
    try {
      setLoading(true);

      // 1. Delete removed images from database
      if (imagesToDelete.length > 0) {
        await supabase
          .from("product_images")
          .delete()
          .in("id", imagesToDelete);
      }

      // 2. Update existing images using 'display_order' field
      for (let i = 0; i < existingImages.length; i++) {
        await supabase
          .from("product_images")
          .update({ display_order: i + 1 }) 
          .eq("id", existingImages[i].id);
      }

      // 3. Upload new images, convert to WebP, and sequence
      let nextDisplayOrder = existingImages.length + 1;
      const newUploadedUrls = [];

      const compressionOptions = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/webp' // Forces WebP format
      };

      for (let originalFile of newImages) {
        let file = originalFile;

        console.log(`Converting ${file.name} to WebP...`);
        try {
          file = await imageCompression(file, compressionOptions);
        } catch (compError) {
          console.error("Compression failed:", compError);
        }

        // Sanitize and force .webp extension
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const safeName = baseName.replace(/[^a-zA-Z0-9]/g, '-');
        const fileName = `${Date.now()}-${safeName}.webp`;
        
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
          display_order: nextDisplayOrder
        });
        
        nextDisplayOrder++;
      }

      // 4. Insert new image records with synchronized ordering
      if (newUploadedUrls.length > 0) {
        const { error: imageDbError } = await supabase
          .from("product_images")
          .insert(newUploadedUrls);
          
        if (imageDbError) throw imageDbError;
      }

      // 5. Update main product info
      const { id: ignoreId, created_at, product_images, ...safeUpdateData } = product;
      const payload = {
        ...safeUpdateData,
        price: product.price ? Number(product.price) : null,
        discount: product.discount ? Number(product.discount) : 0,
      };

      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);

      if (updateError) throw updateError;

      alert("Product details and image sequence updated successfully!");
      
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

  // Prevents inputs from rendering completely until product state is fully populated from Supabase
  if (!product)
    return (
      <AdminLayout>
        <div className="text-[#1A531A] font-bold text-xl">Loading Product Details...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Edit Product</h1>

      <div className="bg-white p-8 rounded-3xl flex flex-col gap-8 shadow-sm border border-gray-100">
        
        {/* --- PRODUCT DATA FIELDS --- */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Product Title</label>
            <input
              value={product?.title ?? ""}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#1A531A] transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-700">Final Sale Price (₹)</label>
              <input
                type="number"
                value={product?.price ?? ""}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#1A531A] transition-all"
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-700">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="99"
                value={product?.discount ?? ""}
                onChange={(e) => setProduct({ ...product, discount: e.target.value })}
                className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:border-[#1A531A] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={product?.description ?? ""}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              rows="5"
              className="border border-gray-300 p-3 rounded-xl w-full resize-y focus:outline-none focus:border-[#1A531A] transition-all"
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* --- CURRENT IMAGES SEQUENCE UI --- */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-700">
            Current Images <span className="text-xs text-gray-400 font-normal">(First image acts as display cover)</span>
          </label>
          {existingImages.length === 0 ? (
            <p className="text-sm text-gray-400">No images saved for this product.</p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {existingImages.map((img, index) => (
                <div key={img.id} className="flex flex-col items-center gap-1">
                  <div className="relative w-28 h-28 border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50">
                    <img src={img.image_url} alt="Product" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => handleRemoveExistingImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full z-10 hover:bg-red-600 shadow-md transition-colors"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#1A531A] text-white text-[8px] font-bold text-center py-0.5 tracking-wider uppercase opacity-90">
                        Cover
                      </span>
                    )}
                  </div>
                  
                  {/* Sequence Step Shifters */}
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveExistingImage(index, "left")}
                      className="text-xs font-bold bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <button 
                      type="button"
                      disabled={index === existingImages.length - 1}
                      onClick={() => moveExistingImage(index, "right")}
                      className="text-xs font-bold bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- DRAG & DROP NEW IMAGES ZONE --- */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-700">Add New Images</label>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 relative cursor-pointer ${
              isDragging 
                ? "border-[#1A531A] bg-[#1A531A]/5 scale-[0.99]" 
                : "border-gray-300 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <input 
              type="file" 
              id="file-upload"
              multiple 
              accept="image/*" 
              onChange={handleAddNewImages} 
              className="hidden" 
            />
            <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
              <svg className={`mx-auto h-12 w-12 mb-3 transition-colors ${isDragging ? "text-[#1A531A]" : "text-gray-400"}`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium text-gray-600">
                <span className="text-[#1A531A] font-semibold underline decoration-2">Click to upload</span> or drag and drop
              </p>
            </label>
          </div>
          
          {/* NEW QUEUED IMAGES PREVIEW */}
          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-2 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              {newImages.map((file, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="relative w-28 h-28 border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full z-10 hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Sorting controls for new items */}
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveNewImage(index, "left")}
                      className="text-xs font-bold bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <button 
                      type="button"
                      disabled={index === newImages.length - 1}
                      onClick={() => moveNewImage(index, "right")}
                      className="text-xs font-bold bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
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