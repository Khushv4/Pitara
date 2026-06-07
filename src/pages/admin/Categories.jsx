import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

function Categories() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const addCategory = async () => {
    if (!name || !imageFile) {
      alert("Please provide both a name and an image for the category.");
      return;
    }

    try {
      setLoading(true);

      // 1. Upload the image to the 'categories' bucket
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage
        .from("categories")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: urlData } = supabase.storage
        .from("categories")
        .getPublicUrl(fileName);

      // 3. Save to the database
      const { error: dbError } = await supabase.from("categories").insert([
        {
          name,
          slug: name.toLowerCase().replaceAll(" ", "-"),
          image_url: urlData.publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      // Reset form
      setName("");
      setImageFile(null);
      setPreview(null);
      loadCategories();
      
    } catch (error) {
      console.error(error);
      alert("Error adding category: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id, imageUrl) => {
    const confirmDelete = window.confirm("Delete this category?");
    if (!confirmDelete) return;

    // Delete from DB
    await supabase.from("categories").delete().eq("id", id);
    
    // Optional: You can also add logic here to delete the image from storage 
    // to save space, using supabase.storage.from("categories").remove([fileName])

    loadCategories();
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8 text-[#1A531A]">Categories</h1>

      <div className="bg-white p-8 rounded-3xl shadow-sm mb-10">
        <h2 className="text-xl font-semibold mb-6">Add New Category</h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Inputs */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Category Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Anime Merch"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#1A531A] transition-colors"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-200 p-2 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1A531A]/10 file:text-[#1A531A] hover:file:bg-[#1A531A]/20 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Image Preview & Submit Button */}
          <div className="flex flex-col gap-4 min-w-[150px]">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-gray-100 shadow-sm" />
            ) : (
              <div className="w-full h-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
            
            <button
              onClick={addCategory}
              disabled={loading}
              className="bg-[#1A531A] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Category"}
            </button>
          </div>

        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-100 rounded-2xl overflow-hidden group">
              <div className="aspect-[2/1] w-full bg-gray-50 overflow-hidden relative">
                {category.image_url ? (
                  <img src={category.image_url} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-4 flex justify-between items-center bg-white">
                <span className="font-semibold text-lg text-gray-800">{category.name}</span>
                <button 
                  onClick={() => deleteCategory(category.id, category.image_url)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Categories;