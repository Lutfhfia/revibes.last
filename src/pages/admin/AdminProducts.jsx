import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";

export default function AdminProducts() {
  const { currentUser } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useDatabase();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    imageFile: null,
    imagePreview: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // =========================
  // TAMBAH PRODUK
  // =========================
  const handleAdd = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      category: "",
      price: "",
      imageFile: null,
      imagePreview: "",
    });

    setError("");
    setShowModal(true);
  };

  // =========================
  // EDIT PRODUK
  // =========================
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      imageFile: null,
      imagePreview: product.image || "",
    });

    setError("");
    setShowModal(true);
  };

  // =========================
  // TUTUP MODAL
  // =========================
  const handleCloseModal = () => {
    if (loading) return;

    setShowModal(false);
    setEditingProduct(null);
    setError("");
  };

  // =========================
  // HANDLE INPUT TEXT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE UPLOAD GAMBAR
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih harus berupa gambar.");
      return;
    }

    // Maksimal 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Kalau tambah produk, gambar wajib ada
      if (!editingProduct && !formData.imageFile) {
        throw new Error("Silakan pilih gambar produk terlebih dahulu.");
      }

      let imageFiles = [];

      // Kalau user memilih gambar baru
      if (formData.imageFile) {
        const file = formData.imageFile;

        const reader = new FileReader();

        const dataUrl = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () =>
            reject(new Error("Gagal membaca file gambar."));
          reader.readAsDataURL(file);
        });

        imageFiles = [
          {
            name: file.name,
            type: file.type,
            dataUrl,
          },
        ];
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        imageFiles,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      setShowModal(false);
      setEditingProduct(null);

      setFormData({
        name: "",
        category: "",
        price: "",
        imageFile: null,
        imagePreview: "",
      });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HAPUS PRODUK
  // =========================
  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus produk "${product.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);
    } catch (err) {
      alert(err.message || "Gagal menghapus produk.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">
            Kelola Produk
          </h1>

          <p className="text-gray-500 mt-1">
            Kelola produk yang tersedia di toko.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-950 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
        >
          + Tambah Produk
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Produk</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition"
                >
                  {/* PRODUK */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />

                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  {/* KATEGORI */}
                  <td className="px-6 py-4">
                    {product.category}
                  </td>

                  {/* HARGA */}
                  <td className="px-6 py-4 font-medium text-blue-950">
                    Rp
                    {Number(product.price).toLocaleString("id-ID")}
                  </td>

                  {/* AKSI */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="text-red-500 hover:text-red-700 font-medium transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-gray-500"
                  >
                    Belum ada produk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER MODAL */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-blue-950">
                  {editingProduct ? "Edit Produk" : "Tambah Produk"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingProduct
                    ? "Ubah informasi produk."
                    : "Tambahkan produk baru ke toko."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* ERROR */}
              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* NAMA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama produk"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                  />
                </div>

                {/* KATEGORI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Masukkan kategori produk"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                  />
                </div>

                {/* HARGA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Contoh: 50000"
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                  />
                </div>

                {/* UPLOAD GAMBAR */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gambar Produk
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-950 hover:file:bg-blue-100"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    Format JPG, JPEG, PNG, WEBP. Maksimal 5 MB.
                  </p>
                </div>

                {/* PREVIEW */}
                {formData.imagePreview && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Preview Gambar
                    </p>

                    <div className="relative w-32 h-32">
                      <img
                        src={formData.imagePreview}
                        alt="Preview produk"
                        className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-blue-950 text-white font-medium hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {loading
                    ? "Mengunggah..."
                    : editingProduct
                    ? "Simpan Perubahan"
                    : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}