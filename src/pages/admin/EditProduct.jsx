import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";

import { supabase } from "../../lib/supabase";

function EditProduct() {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct =
    async () => {
      const { data } =
        await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

      setProduct(data);
    };

  const updateProduct =
    async () => {
      await supabase
        .from("products")
        .update(product)
        .eq("id", id);

      alert(
        "Product Updated"
      );
    };

  if (!product)
    return (
      <AdminLayout>
        Loading...
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8">
        Edit Product
      </h1>

      <div className="bg-white p-8 rounded-3xl">
        <input
          value={product.title}
          onChange={(e) =>
            setProduct({
              ...product,
              title:
                e.target.value,
            })
          }
          className="
          border
          p-3
          rounded-xl
          w-full
        "
        />

        <button
          onClick={
            updateProduct
          }
          className="
          mt-6
          bg-[#1A531A]
          text-white
          px-6
          py-3
          rounded-xl
        "
        >
          Update
        </button>
      </div>
    </AdminLayout>
  );
}

export default EditProduct;