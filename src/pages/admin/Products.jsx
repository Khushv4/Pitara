import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import ProductTable from "../../components/admin/ProductTable";

import { supabase } from "../../lib/supabase";

function Products() {
  const [products, setProducts] =
    useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select('*, product_images(image_url)') // <-- Added relation
      .order("created_at", { ascending: false });

    // Format the data so the table can read it
    const formattedData = data?.map((product) => ({
      ...product,
      images: product.product_images?.map((img) => img.image_url) || [],
    }));

    setProducts(formattedData || []);
  };

  const deleteProduct =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete Product?"
        );

      if (!confirmDelete)
        return;

      await supabase
        .from("products")
        .delete()
        .eq("id", id);

      loadProducts();
    };

  return (
    <AdminLayout>
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">
          Products
        </h1>

        <button
          onClick={() =>
            navigate(
              "/admin/products/new"
            )
          }
          className="
          bg-[#1A531A]
          text-white
          px-6
          py-3
          rounded-xl
        "
        >
          Add Product
        </button>
      </div>

      <ProductTable
        products={products}
        onDelete={deleteProduct}
        onEdit={(product) =>
          navigate(
            `/admin/products/edit/${product.id}`
          )
        }
      />
    </AdminLayout>
  );
}

export default Products;