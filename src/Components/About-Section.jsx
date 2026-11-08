import React from 'react'
import { Gem, Leaf, Scissors } from 'lucide-react';

function AboutSection() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 lg:px-24">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gambar atau Ilustrasi */}
          <div className="p-6 flex items-center justify-center">
            <img
              src="/1.png"
              alt="Tentang Kami"
              className="rounded-xl w-full h-auto object-cover shadow-lg"
            />
          </div>

          {/* Konten */}
          <div className="p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Tentang Kami
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Selamat datang di <strong>Revibes Thrift Shop</strong> —
              destinasi fashion thrift dan rework dengan pilihan produk unik.
              Kami ingin memberi pakaian layak pakai cerita baru melalui
              sentuhan desain yang kreatif dan nyaman digunakan.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Gem className="mt-1 text-blue-950" size={20} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-blue-950">
                    Pilihan Berkualitas
                  </h4>
                  <p className="text-gray-600">
                    Setiap produk dipilih dengan cermat agar tetap nyaman,
                    menarik, dan layak digunakan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Leaf className="mt-1 text-blue-950" size={20} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-blue-950">
                    Ramah Lingkungan
                  </h4>
                  <p className="text-gray-600">
                    Memperpanjang usia pakaian membantu mengurangi limbah
                    tekstil.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Scissors className="mt-1 text-blue-950" size={20} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold text-blue-950">
                    Desain Eksklusif
                  </h4>
                  <p className="text-gray-600">
                    Setiap produk memiliki detail unik, cocok untuk
                    segala gaya dan suasana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;