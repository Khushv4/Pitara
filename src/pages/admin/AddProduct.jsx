import { useState, useEffect } from "react"; // ✅ UPDATED: Added imports
import AdminLayout from "../../components/admin/AdminLayout";
import ProductForm from "../../components/admin/ProductForm";
import { supabase } from "../../lib/supabase";

function AddProduct() {
  const [categories, setCategories] = useState([]); // ✅ UPDATED: Added state

  // ✅ UPDATED: Fetch categories when the page loads
  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data || []);
    };
    loadCategories();
  }, []);

  const saveProduct = async (product) => {
    try {
      const { images, ...productData } = product;

      // =========================
      // STEP 1: Insert Product
      // =========================
      const { data: createdProduct, error: productError } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (productError) {
        alert(productError.message);
        return;
      }

      // =========================
      // STEP 2: Upload Images
      // =========================
      const imageRecords = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileName = `${Date.now()}-${i}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        imageRecords.push({
          product_id: createdProduct.id,
          image_url: data.publicUrl,
          display_order: i + 1,
        });
      }

      // =========================
      // STEP 3: Save Image Records
      // =========================
      const { error: imageDbError } = await supabase
        .from("product_images")
        .insert(imageRecords);

      if (imageDbError) {
        alert(imageDbError.message);
        return;
      }

      alert("Product Created Successfully 🎉");
    } catch (err) {
      console.error("FULL CRASH LOG:", err);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8">Add Product</h1>
      {/* ✅ UPDATED: Pass categories to the form */}
      <ProductForm onSubmit={saveProduct} categories={categories} />
    </AdminLayout>
  );
}

export default AddProduct;