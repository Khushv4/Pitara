import { supabase } from "../lib/supabase";

export const getDashboardStats =
  async () => {
    const [
      products,
      categories,
      featured,
    ] = await Promise.all([
      supabase
        .from("products")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("categories")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("products")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("featured", true),
    ]);

    return {
      products:
        products.count || 0,

      categories:
        categories.count || 0,

      featured:
        featured.count || 0,
    };
  };