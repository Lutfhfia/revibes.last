import React from "react";

function KontakSection() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 lg:px-24">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Bagian Info Kontak */}
          <div className="bg-blue-950 text-white p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
            <p className="text-gray-200 mb-6">
              Kami siap membantu Anda. Jangan ragu untuk menghubungi kami
              melalui form atau informasi kontak di bawah ini.
            </p>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="font-semibold">Alamat:</span> Jl. Lunjuk
                Jaya, Lorok Pakjo, Kec. Ilir Bar. I, Kota Palembang,
                Sumatera Selatan 30152
              </li>
              <li>
                <span className="font-semibold">Email:</span>{" "}
                support@tokohoodie.com
              </li>
              <li>
                <span className="font-semibold">Telepon:</span> +62
                85768111508
              </li>
              <li>
                <span className="font-semibold">Jam Operasional:</span>{" "}
                Senin - Jumat, 09.00 - 17.00
              </li>
            </ul>
          </div>

          {/* Form Kontak */}
          <div className="p-10">
            <h3 className="text-2xl font-semibold text-blue-950 mb-6">
              Kirim Pesan
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nama Anda"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Email Anda"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Pesan
                </label>
                <textarea
                  rows="5"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tulis pesan Anda di sini..."
                />
              </div>

              <button
                type="submit"
                className="bg-blue-950 text-white px-6 py-2 rounded-md hover:bg-black transition"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KontakSection;
