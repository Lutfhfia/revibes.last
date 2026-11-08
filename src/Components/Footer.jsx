import React from "react";

function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-300 text-base-content p-10">
      <nav>
        <h6 className="footer-title">Layanan</h6>
        <a className="link link-hover" href="#">
          Branding
        </a>
        <a className="link link-hover" href="#">
          Design
        </a>
        <a className="link link-hover" href="#">
          Marketing
        </a>
        <a className="link link-hover" href="#">
          Advertisement
        </a>
      </nav>

      <nav>
        <h6 className="footer-title">Perusahaan</h6>
        <a className="link link-hover" href="/about">
          Tentang Kami
        </a>
        <a className="link link-hover" href="/kontak">
          Kontak
        </a>
        <a className="link link-hover" href="#">
          Karir
        </a>
        <a className="link link-hover" href="#">
          Press Kit
        </a>
      </nav>

      <nav>
        <h6 className="footer-title">Sosial Media</h6>
        <div className="grid grid-flow-row gap-2 text-sm">
          <a
            className="link link-hover text-blue-600"
            href="https://wa.me/6285768111508"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a
            className="link link-hover text-pink-500"
            href="https://www.instagram.com/revibes.co_/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            className="link link-hover text-black"
            href="https://www.tiktok.com/@revibes.thrift"
            target="_blank"
            rel="noopener noreferrer"
          >
            TikTok
          </a>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
