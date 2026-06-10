import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductForm from "../../components/admin/ProductForm";
import { supabase } from "../../lib/supabase";
import imageCompression from 'browser-image-compression';

function AddProduct() {
  const [categories, setCategories] = useState([]);

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
      // STEP 2: Compress, Convert to WebP, & Upload
      // =========================
      const imageRecords = [];
      const compressionOptions = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/webp' // Forces WebP
      };

      for (let i = 0; i < images.length; i++) {
        let file = images[i];

        console.log(`Converting ${file.name} to WebP...`);
        try {
          file = await imageCompression(file, compressionOptions);
        } catch (compError) {
          console.error("Compression failed, uploading original:", compError);
        }

        // Strip the old extension and sanitize name
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const safeName = baseName.replace(/[^a-zA-Z0-9]/g, '-');
        const fileName = `${Date.now()}-${i}-${safeName}.webp`;

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
      <ProductForm onSubmit={saveProduct} categories={categories} />
    </AdminLayout>
  );
}

export default AddProduct;