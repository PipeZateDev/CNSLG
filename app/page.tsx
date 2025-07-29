'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Banner y noticias desde la API
  const [bannerImages, setBannerImages] = useState<{ link: string; Titulo?: string; Descripción?: string }[]>([]);
  const [news, setNews] = useState<{ link: string; Titulo: string; Descripción: string; fecha: string }[]>([]);

  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => setBannerImages(Array.isArray(data) ? data : []));
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (bannerImages.length === 0) return;
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [bannerImages.length, isPaused]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1);
  };

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
                src="https://i.ibb.co/spn4L9WW/LOGO-NSLG-2-Mini.png" 
                alt="Logo Colegio Nuevo San Luis Gonzaga"
                className="h-12 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/"
                className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Inicio
              </Link>
              <Link 
                href="/nosotros"
                className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer"
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
                  PSE - Pagos en Línea
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
                    PSE - Pagos en Línea
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
      className={`w-12 h-12 ${item.color} text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg opacity-70 hover:opacity-100`}
    >
      <i className={`${item.icon} text-xl`}></i>
    </a>
  ))}
</div>


      {/* Banner Section */}
      <section className="pt-20 relative">
        <div
          className="relative h-[600px] md:h-[600px] overflow-hidden w-full md:w-[80%] mx-auto"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ userSelect: 'none' }}
        >
          {bannerImages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No hay imágenes de banner disponibles.
            </div>
          ) : (
            bannerImages.map((image, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-600 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                <img src={image.link} alt={image.Titulo} className="w-full h-full object-cover object-center" />
                {/* Botón solo en la primera imagen */}
                {index === 0 && (
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeORCc-ICVrWFFREQ_THIBY5lPYKMXKB1WLAqobKrfWScRqSg/viewform?usp=sharing&ouid=114310616812674125470"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute left-1/2 transform -translate-x-1/2"
                    style={{
                      top: '10%',
                      zIndex: 30,
                    }}
                  >
                    <span className="px-8 py-4 rounded-full font-bold text-blue-900 text-lg"
                      style={{
                        background: 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(2px)',
                        border: '2px solid #1e3a8a',
                        boxShadow: '0 2px 8px rgba(30,58,138,0.10)',
                        display: 'inline-block',
                      }}
                    >
                      Aparta tu cupo ahora
                    </span>
                  </a>
                )}
              </div>
            ))
          )}
          <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
            <div className="max-w-4xl px-6">
              <h1 className="text-3xl md:text-6xl font-bold mb-4">{bannerImages[currentImageIndex]?.Titulo || ''}</h1>
              <p className="text-lg md:text-2xl mb-8">{bannerImages[currentImageIndex]?.Descripción || ''}</p>
            </div>
          </div>
          {bannerImages.length > 0 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-20">
                <i className="ri-arrow-left-line text-white text-xl"></i>
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors z-20">
                <i className="ri-arrow-right-line text-white text-xl"></i>
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {bannerImages.map((_, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>


      {/* Hero Section */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
      99 años de Excelencia Educativa
    </h2>
    <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
      Desde 1926, el Colegio Nuevo San Luis Gonzaga ha sido pionero en la formación integral 
      de estudiantes con valores católicos, excelencia académica y compromiso social.
    </p>
    <div className="grid md:grid-cols-5 gap-8 mb-16">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-graduation-cap-line text-3xl text-blue-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">+2850</h3>
        <p className="text-gray-600">Graduados Exitosos</p>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-award-line text-3xl text-green-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">99</h3>
        <p className="text-gray-600">Años de Tradición</p>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-english-input text-3xl text-yellow-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">Inglés Intensivo</h3>
        <p className="text-gray-600">con certificación TOEFL</p>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-star-line text-3xl text-purple-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">100%</h3>
        <p className="text-gray-600">Compromiso con la Calidad</p>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-group-line text-3xl text-pink-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">99%</h3>
        <p className="text-gray-600">Familias Satisfechas</p>
      </div>
    </div>
    <div className="flex flex-col md:flex-row justify-center gap-4">
      <Link 
        href="/admisiones"
        className="px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-full font-semibold text-lg transition-colors whitespace-nowrap cursor-pointer"
      >
        Conoce Nuestras Admisiones
      </Link>
      <Link 
        href="/nosotros"
        className="px-8 py-4 border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white rounded-full font-semibold text-lg transition-colors whitespace-nowrap cursor-pointer"
      >
        Nuestra Historia
      </Link>
    </div>
  </div>
</section>


            {/* News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
            Noticias y Eventos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={item.link}
                  alt={item.Titulo}
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-6">
                  <span className="text-sm text-blue-600 font-semibold">{item.fecha}</span>
                  <h3 className="text-lg font-bold text-blue-900 mb-2 mt-1">{item.Titulo}</h3>
                  <p className="text-gray-600 text-sm">{item.Descripción}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src="https://static.readdy.ai/image/b422d9997318ba9404c133396eb0082a/f0b6df53262c2786638b3d4d8768e052.png" 
                alt="Logo Colegio Nuevo San Luis Gonzaga" 
                className="h-16 w-auto mb-4"
              />
              <p className="text-gray-400 text-sm">
                Formando líderes del futuro desde 1926 con excelencia académica y valores católicos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors cursor-pointer">Inicio</Link></li>
                <li><Link href="/admisiones" className="hover:text-white transition-colors cursor-pointer">Admisiones</Link></li>
                <li><Link href="/nosotros" className="hover:text-white transition-colors cursor-pointer">Nosotros</Link></li>
                <li><Link href="/contacto" className="hover:text-white transition-colors cursor-pointer">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Preescolar</li>
                <li>Educación Primaria</li>
                <li>Educación Secundaria</li>
                <li>Educación Bilingüe</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataformas</h4>
              <div className="space-y-2">
                <a 
                  href="https://lms30.uno-internacional.com/login/access" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  UNOi Santillana
                </a>
                <a 
                  href="https://www.cibercolegios.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cibercolegios
                </a>
                <a 
                  href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  PSE - Pagos en Línea
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
            © 2025 Colegio Nuevo San Luis Gonzaga. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}