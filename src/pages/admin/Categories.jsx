import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  const addCategory = async () => {
    if (!name.trim()) {
      alert("Please provide a name for the category.");
      return;
    }

    try {
      setLoading(true);

      // Save to the database (Name and Slug only)
      const { error: dbError } = await supabase.from("categories").insert([
        {
          name: name.trim(),
          slug: name.trim().toLowerCase().replaceAll(" ", "-"),
        },
      ]);

      if (dbError) throw dbError;

      // Reset form
      setName("");
      loadCategories();
      
    } catch (error) {
      console.error(error);
      alert("Error adding category: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm("Delete this category?");
    if (!confirmDelete) return;

    // Delete from DB
    await supabase.from("categories").delete().eq("id", id);
    loadCategories();
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8 text-[#1A531A]">Categories</h1>

      <div className="bg-white p-8 rounded-3xl shadow-sm mb-10 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Add New Category</h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-end">
          
          {/* Input */}
          <div className="flex-1 w-full">
            <label className="block mb-2 font-medium text-gray-700">Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Anime Merch"
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#1A531A] focus:ring-1 focus:ring-[#1A531A] transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full md:w-auto min-w-[180px]">
            <button
              onClick={addCategory}
              disabled={loading}
              className="w-full bg-[#1A531A] text-white px-8 py-3 rounded-xl hover:bg-[#123912] transition-colors disabled:opacity-50 font-semibold"
            >
              {loading ? "Saving..." : "Add Category"}
            </button>
          </div>

        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="border border-gray-200 rounded-2xl p-6 flex justify-between items-center group hover:border-[#1A531A] hover:shadow-md transition-all duration-300"
            >
              <span className="font-semibold text-lg text-gray-800">{category.name}</span>
              <button 
                onClick={() => deleteCategory(category.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </div>
          ))}
          
          {categories.length === 0 && !loading && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No categories found. Add one above!
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Categories;