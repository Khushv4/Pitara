import { supabase } from "../lib/supabase";

export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(image_url)") // ✅ UPDATED
    .order("created_at", { ascending: false });

  if (error) throw error;

  // ✅ UPDATED: Map images
  return data?.map((product) => ({
    ...product,
    images: product.product_images?.map((img) => img.image_url) || [],
  }));
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(image_url)") // ✅ UPDATED
    .eq("id", id)
    .single();

  if (error) throw error;

  // ✅ UPDATED: Map images
  return {
    ...data,
    images: data.product_images?.map((img) => img.image_url) || [],
  };
};

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(image_url)") // ✅ UPDATED
    .eq("featured", true);

  if (error) throw error;

  // ✅ UPDATED: Map images
  return data?.map((product) => ({
    ...product,
    images: product.product_images?.map((img) => img.image_url) || [],
  }));
};