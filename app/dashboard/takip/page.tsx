"use client";
import { useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("file", image);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    alert("Fotoğraf başarıyla yüklendi!");
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        multiple
      />

      {preview && (
        <img src={preview} className="w-48 h-48 object-cover mt-4 rounded" />
      )}

      <button
        onClick={handleUpload}
        className="mt-4 p-2 bg-blue-600 text-white rounded"
      >
        Yükle
      </button>
    </div>
  );
}
