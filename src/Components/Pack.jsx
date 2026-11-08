import React from "react";
import { Mail, Package, Sprout } from "lucide-react";

function Pack() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-lg mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Packaging Alvi Thrift Shop
      </h1>
      <p className="text-center text-base sm:text-lg text-gray-600">
        Apa saja yang kamu dapatkan saat membeli produk dari kami?
      </p>

      <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-green-800 text-sm sm:text-base text-center">
        <p>
          Alvi Thrift Shop adalah brand <strong>rework handmade</strong> dengan
          teknik <strong>jahit dan lukis tangan</strong>. Kami percaya bahwa
          fashion bisa tetap stylish sambil peduli bumi. Dengan memilih produk
          kami, kamu sudah ikut mengurangi <strong>limbah tekstil</strong> dan
          mendukung bumi yang lebih sehat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hang Tag */}
        <div className="space-y-3">
          <img
            src="./hangtaq.png"
            alt="Hang Tag"
            className="rounded-xl shadow-md w-full"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            <span className="flex items-center gap-2">
              <Sprout size={20} aria-hidden="true" />
              Hang Tag Ramah Lingkungan
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Hang tag ini dibuat dari <strong>kertas daur ulang</strong> dan
            mengandung benih tanaman. Setelah dipakai, kamu bisa menanamnya dan
            lihat ia tumbuh menjadi tanaman baru.
          </p>
        </div>

        {/* Box Packaging */}
        <div className="space-y-3">
          <img
            src="./box.png"
            alt="Box Packaging"
            className="rounded-xl shadow-md w-full"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            <span className="flex items-center gap-2">
              <Package size={20} aria-hidden="true" />
              Box dari Kertas Daur Ulang
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Setiap produk kamu akan dibungkus dalam box eksklusif berbahan dasar{" "}
            <strong>kertas daur ulang</strong> — bukan hanya unik, tapi juga
            ramah lingkungan.
          </p>
        </div>

        {/* Thank You Card */}
        <div className="space-y-3 md:col-span-2">
          <img
            src="./thankyoucard.png"
            alt="Thank You Card"
            className="rounded-xl shadow-md w-full"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            <span className="flex items-center gap-2">
              <Mail size={20} aria-hidden="true" />
              Thank You Card Spesial
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Kartu ucapan ini terbuat dari <strong>kertas daur ulang</strong>, dan
            mengandung benih tanaman. Berisi pesan tulus untukmu yang telah ikut
            berkontribusi pada gerakan fashion berkelanjutan bersama kami.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-700 text-sm sm:text-base">
          Dengan setiap pembelian, kamu bukan hanya mendapatkan produk fashion
          rework yang unik dan artistik, tapi juga turut menjaga bumi tetap
          bersih dari limbah tekstil. Terima kasih telah memilih{" "}
          <strong>Alvi Thrift Shop</strong>!
        </p>
      </div>
    </div>
  );
}

export default Pack;
