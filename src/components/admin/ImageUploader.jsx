function ImageUploader({ images, setImages }) {
  const handleChange = (e) => {
    const files = Array.from(e.target.files);

    // limit optional (you already validate in form)
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
      />

      {/* PREVIEW */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {images.map((file, i) => (
          <div key={i} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="h-32 w-full object-cover rounded-xl"
            />

            <button
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;