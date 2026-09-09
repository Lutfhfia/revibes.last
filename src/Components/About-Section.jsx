import React from 'react'

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
              Selamat datang di <strong>TokoHoodie</strong> — destinasi
              utama Anda untuk fashion hoodie yang nyaman, stylish, dan
              ramah lingkungan. Kami berdedikasi menyediakan produk
              berkualitas tinggi dengan desain yang unik dan bahan pilihan
              terbaik.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-950 text-xl">💎</div>
                <div>
                  <h4 className="font-semibold text-blue-950">
                    Kualitas Premium
                  </h4>
                  <p className="text-gray-600">
                    Kami hanya menggunakan bahan terbaik seperti katun
                    organik dan poliester daur ulang.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-blue-950 text-xl">🌱</div>
                <div>
                  <h4 className="font-semibold text-blue-950">
                    Ramah Lingkungan
                  </h4>
                  <p className="text-gray-600">
                    Proses produksi kami minim limbah dan mendukung
                    keberlanjutan bumi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-blue-950 text-xl">🧵</div>
                <div>
                  <h4 className="font-semibold text-blue-950">
                    Desain Eksklusif
                  </h4>
                  <p className="text-gray-600">
                    Setiap hoodie dirancang dengan detail unik, cocok untuk
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