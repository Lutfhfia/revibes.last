import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export default function AdminAddProduct() {
  const { currentUser } = useAuth();
  const { addProduct } = useDatabase();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Hoodie',
    sizes: 'M,L,XL',
    colors: 'Hitam,Putih',
    materials: 'Cotton',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const selectedImages = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));

    setImageFiles(prev => [...prev, ...selectedImages]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageFiles(prev => {
      const removedImage = prev[index];
      if (removedImage) URL.revokeObjectURL(removedImage.previewUrl);

      return prev.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const readImageFile = (file) => (
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        name: file.name,
        type: file.type,
        dataUrl: reader.result
      });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alert('Silakan pilih minimal satu gambar produk.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const uploadedImages = await Promise.all(imageFiles.map(image => readImageFile(image.file)));
      const newProduct = {
        ...formData,
        price: parseInt(formData.price, 10),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
        materials: formData.materials.split(',').map(s => s.trim()).filter(Boolean),
        imageFiles: uploadedImages
      };

      await addProduct(newProduct);
      navigate('/admin/products');
    } catch (error) {
      alert(error.message || 'Gagal menyimpan produk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-950 mb-8">Tambah Produk Baru</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran (pisahkan dengan koma)</label>
              <input type="text" name="sizes" required value={formData.sizes} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warna (pisahkan dengan koma)</label>
              <input type="text" name="colors" required value={formData.colors} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Produk</label>
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
              <ImagePlus className="mb-3 text-blue-950" size={32} />
              <span className="font-semibold text-gray-800">Pilih gambar dari komputer</span>
              <span className="mt-1 text-sm text-gray-500">Bisa pilih lebih dari satu gambar sekaligus</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imageFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {imageFiles.map((image, index) => (
                  <div key={`${image.file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    <img
                      src={image.previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-blue-950 px-2 py-1 text-xs font-semibold text-white">
                        Utama
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow hover:bg-red-50"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bahan (pisahkan dengan koma)</label>
            <input type="text" name="materials" required value={formData.materials} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
            <textarea name="description" rows="4" required value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-950 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
