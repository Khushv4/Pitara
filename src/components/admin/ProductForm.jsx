import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Image Item Component
function SortableImage({ file, id, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
      <button 
        type="button" 
        onClick={() => onRemove(id)} 
        className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full z-10 hover:bg-red-600"
      >
        ×
      </button>
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing" title="Drag to reorder" />
    </div>
  );
}

function ProductForm({ onSubmit, categories = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [showPrice, setShowPrice] = useState(true);
  const [startingPrice, setStartingPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [images, setImages] = useState([]);
  
  // ADDED: Loading state
  const [loading, setLoading] = useState(false);

  // Handle Drag and Drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((_, i) => i === active.id);
        const newIndex = items.findIndex((_, i) => i === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const submit = async (e) => {
    e.preventDefault();
    
    // Validation runs before loading starts
    if (images.length > 5) {
      alert(" maximum 5 images");
      return;
    }
    
    const selectedCat = categories.find((c) => c.id.toString() === categoryId);
    
    try {
      // START LOADING
      setLoading(true);

      // Wait for the parent to finish saving the product
      await onSubmit({
        title, 
        description,
        category_id: selectedCat.id,
        category_name: selectedCat.name,
        category_slug: selectedCat.slug,
        price: showPrice ? Number(price) : null,
        show_price: showPrice,
        starting_price: !showPrice && startingPrice ? Number(startingPrice) : null,
        featured, 
        active, 
        images,
      });

      // CLEAR THE FORM on success
      setTitle("");
      setDescription("");
      setCategoryId("");
      setPrice("");
      setShowPrice(true);
      setStartingPrice("");
      setFeatured(false);
      setActive(true);
      setImages([]);

    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      // STOP LOADING regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
      {/* Product Name */}
      <div>
        <label className="block mb-2 font-medium">Product Name</label>
        <input type="text" placeholder="Naruto Figure" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-3 rounded-xl" required />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-2 font-medium">Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border p-3 rounded-xl bg-white" required>
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-medium">Description</label>
        <textarea rows="4" placeholder="Enter product description..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded-xl" />
      </div>

      {/* Pricing */}
      <div>
        <label className="block mb-2 font-medium">Pricing</label>
        <div className="flex gap-6 mb-2">
          <label className="flex items-center gap-2"><input type="radio" checked={showPrice} onChange={() => setShowPrice(true)} /> Fixed Price</label>
          <label className="flex items-center gap-2"><input type="radio" checked={!showPrice} onChange={() => setShowPrice(false)} /> Starting Price</label>
        </div>
        {showPrice ? (
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-3 rounded-xl" />
        ) : (
          <input type="number" placeholder="Starting Price" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} className="w-full border p-3 rounded-xl" />
        )}
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-3"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active</label>
      </div>

      {/* Drag & Drop Image Upload */}
      <div>
        <label className="block mb-3 font-medium">Product Images (Maximum 5 images. Drag to reorder)</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setImages([...e.target.files])} className="mb-4 block" />
        
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex flex-wrap gap-4 p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50">
            <SortableContext items={images.map((_, i) => i)} strategy={rectSortingStrategy}>
              {images.map((file, i) => (
                <SortableImage key={i} id={i} file={file} onRemove={removeImage} />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>

      {/* CHANGED: Button disables and changes text while loading */}
      <button 
        type="submit" 
        disabled={loading}
        className="bg-[#1A531A] text-white px-8 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}

export default ProductForm;