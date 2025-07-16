'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Nosotros() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://static.readdy.ai/image/b422d9997318ba9404c133396eb0082a/f0b6df53262c2786638b3d4d8768e052.png"
                alt="Logo Colegio Nuevo San Luis Gonzaga"
                className="h-12 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Inicio
              </Link>
              <Link
                href="/nosotros"
                className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Nosotros
              </Link>
              <Link
                href="/admisiones"
                className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Admisiones
              </Link>
              <Link
                href="/contacto"
                className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Contacto
              </Link>
              <div className="flex space-x-2 ml-8">
                <a
                  href="https://lms30.uno-internacional.com/login/access"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  UNOi Santillana
                </a>
                <a
                  href="https://www.cibercolegios.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cibercolegios
                </a>
                <a
                  href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  PSE
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-blue-900 cursor-pointer"
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors text-center cursor-pointer"
                >
                  Inicio
                </Link>
                <Link
                  href="/nosotros"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer"
                >
                  Nosotros
                </Link>
                <Link
                  href="/admisiones"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer"
                >
                  Admisiones
                </Link>
                <Link
                  href="/contacto"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer"
                >
                  Contacto
                </Link>
                <div className="flex flex-col space-y-2 pt-2">
                  <a
                    href="https://lms30.uno-internacional.com/login/access"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-center cursor-pointer"
                  >
                    UNOi Santillana
                  </a>
                  <a
                    href="https://www.cibercolegios.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors text-center cursor-pointer"
                  >
                    Cibercolegios
                  </a>
                  <a
                    href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-center cursor-pointer"
                  >
                    PSE
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Floating Social Media Buttons */}
<div className="fixed right-6 bottom-6 z-40 space-y-3">
  {[
    { href: "https://wa.me/573183365700", color: "bg-green-500 hover:bg-green-600", icon: "ri-whatsapp-line" },
    { href: "https://www.instagram.com/colegionuevosanluisgonzaga/?hl=es", color: "bg-pink-500 hover:bg-pink-600", icon: "ri-instagram-line" },
    { href: "https://www.facebook.com/colegionuevosanluisgonzaga", color: "bg-blue-600 hover:bg-blue-700", icon: "ri-facebook-line" },
    { href: "https://www.tiktok.com/@nuevosanluisgonzaga", color: "bg-black hover:bg-gray-800", icon: "ri-tiktok-line" },
    { href: "https://www.youtube.com/@colegionuevosanluisgonzaga5795", color: "bg-red-600 hover:bg-red-700", icon: "ri-youtube-line" },
  ].map((item, idx) => (
    <a
      key={idx}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-12 h-12 ${item.color} text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg opacity-80 hover:opacity-100`}
    >
      <i className={`${item.icon} text-xl`}></i>
    </a>
  ))}
</div>

      {/* Hero Section */}
      {/* ... Mantienes el resto de tu código de secciones aquí sin cambios ... */}
      {/* Por motivos de espacio no lo repito, pero no omitas ninguna sección del código que ya tienes */}

    </div>
  );
}
