'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Mueve el componente GalleryGrid fuera del componente principal para evitar errores de declaración dentro del render.
function GalleryGrid({ gallery, openModal }: { gallery: { link: string; Titulo?: string }[], openModal: (imgs: any, idx: number) => void }) {
  const [page, setPage] = useState(0);
  const perPage = 8; // 4x2
  const totalPages = Math.ceil(gallery.length / perPage);

  const handlePrev = () => setPage(p => Math.max(0, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages - 1, p + 1));

  const imagesToShow = gallery.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {imagesToShow.map((img, idx) => (
          <div key={img.link + idx} className="flex flex-col items-center cursor-pointer" onClick={() => openModal([img], 0)}>
            <img
              src={img.link}
              alt={img.Titulo || ''}
              className="w-full h-48 object-cover rounded-lg shadow"
              style={{ minHeight: 192, maxHeight: 192 }}
            />
            <div className="text-center py-2 font-semibold text-blue-900 bg-white/80 w-full">{img.Titulo}</div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded-full font-semibold shadow hover:bg-blue-800 transition disabled:opacity-40"
            onClick={handlePrev}
            disabled={page === 0}
          >
            &#8592; Anterior
          </button>
          <span className="text-blue-900 font-bold">{page + 1} / {totalPages}</span>
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded-full font-semibold shadow hover:bg-blue-800 transition disabled:opacity-40"
            onClick={handleNext}
            disabled={page === totalPages - 1}
          >
            Siguiente &#8594;
          </button>
        </div>
      )}
    </div>
  );
}

export default function Nosotros() {
  // Mueve el estado de isMenuOpen fuera del render para evitar problemas de re-render en mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  // Cargar galería desde la API de MongoDB y ordenar por 'orden'
  const [gallery, setGallery] = useState<{ link: string; Titulo?: string; orden?: number; grupo?: string }[]>([]);
  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGallery([...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)));
        } else {
          setGallery([]);
        }
      });
  }, []);

  // Agrupar por grupo si existe
  const groupedGallery = gallery.reduce<{ [key: string]: typeof gallery }>((acc, img) => {
    const group = img.grupo || '';
    if (!group || gallery.filter(g => g.grupo === group).length === 1) {
      acc[`__single_${img.link}`] = [img];
    } else {
      if (!acc[group]) acc[group] = [];
      acc[group].push(img);
    }
    return acc;
  }, {});

  const pathname = usePathname();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<{ link: string; Titulo?: string }[]>([]);
  const [modalIndex, setModalIndex] = useState(0);

  // Modal open handler
  const openModal = (imgs: { link: string; Titulo?: string }[], idx: number = 0) => {
    setModalImages(imgs);
    setModalIndex(idx);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const nextModalImage = () => setModalIndex((prev) => (prev + 1) % modalImages.length);
  const prevModalImage = () => setModalIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryModalImages, setGalleryModalImages] = useState<{ link: string; Titulo?: string }[]>([]);
  const [galleryModalIndex, setGalleryModalIndex] = useState(0);

  const openGalleryModal = (imgs: typeof gallery, idx: number = 0) => {
    setGalleryModalImages(imgs);
    setGalleryModalIndex(idx);
    setGalleryModalOpen(true);
  };
  const closeGalleryModal = () => setGalleryModalOpen(false);
  const nextGalleryModalImage = () => setGalleryModalIndex((prev) => (prev + 1) % galleryModalImages.length);
  const prevGalleryModalImage = () => setGalleryModalIndex((prev) => (prev - 1 + galleryModalImages.length) % galleryModalImages.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo siempre tamaño fijo */}
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="https://i.ibb.co/spn4L9WW/LOGO-NSLG-2-Mini.png" 
                alt="Logo Colegio Nuevo San Luis Gonzaga"
                className="h-12 w-auto min-w-[48px] max-w-[120px]"
              />
            </div>
            {/* Centrado absoluto de pestañas */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none">
              <div className="hidden lg:flex items-center space-x-10 pointer-events-auto">
                <Link href="/" className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${pathname === '/' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Inicio</Link>
                <Link href="/nosotros" className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${pathname === '/nosotros' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Nosotros</Link>
                <Link href="/admisiones" className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${pathname === '/admisiones' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Admisiones</Link>
                <Link href="/contacto" className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${pathname === '/contacto' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Contacto</Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-3 ml-8">
              <a 
                href="https://lms30.uno-internacional.com/login/access" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                UNOi Santillana
              </a>
              <a 
                href="https://www.cibercolegios.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-yellow-400 text-black rounded-full text-sm font-semibold hover:bg-yellow-500 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cibercolegios
              </a>
              <a 
                href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Pagos PSE
              </a>
            </div>
            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label="Abrir menú"
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
                  scroll={false}
                  className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${
                    pathname === '/' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >
                  Inicio
                </Link>
                <Link
                  href="/nosotros"
                  onClick={() => setIsMenuOpen(false)}
                  scroll={false}
                  className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${
                    pathname === '/nosotros' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >
                  Nosotros
                </Link>
                <Link
                  href="/admisiones"
                  onClick={() => setIsMenuOpen(false)}
                  scroll={false}
                  className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${
                    pathname === '/admisiones' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >
                  Admisiones
                </Link>
                <Link
                  href="/contacto"
                  onClick={() => setIsMenuOpen(false)}
                  scroll={false}
                  className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${
                    pathname === '/contacto' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >
                  Contacto
                </Link>
                <div className="flex flex-col space-y-2 pt-2">
                  <a 
                    href="https://lms30.uno-internacional.com/login/access" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-colors text-center cursor-pointer"
                  >
                    UNOi Santillana
                  </a>
                  <a 
                    href="https://www.cibercolegios.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-semibold hover:bg-yellow-500 transition-colors text-center cursor-pointer"
                  >
                    Cibercolegios
                  </a>
                  <a 
                    href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors text-center cursor-pointer"
                  >
                    Pagos PSE
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>



{/* Sección: Historia + Misión/Visión + Canva */}
<section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
      Nosotros
    </h1>
    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto font-medium">
      Colegio Nuevo San Luis Gonzaga: 99 años formando líderes con excelencia académica y valores.
    </p>
  </div>
</section>

<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
    <div className="flex flex-col items-center md:items-start">
      <img 
        src="https://i.ibb.co/spn4L9WW/LOGO-NSLG-2-Mini.png"
        alt="Logo Colegio Nuevo San Luis Gonzaga"
        className="h-32 w-auto mb-6 drop-shadow-xl"
      />
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Nuestra Historia</h2>
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Fundado en 1926, el Colegio Nuevo San Luis Gonzaga ha sido pionero en educación integral, promoviendo el desarrollo académico, deportivo y cultural de nuestros estudiantes. Nos destacamos por nuestra atención personalizada, innovación educativa y compromiso con la formación en valores.
      </p>
      <div className="flex flex-wrap gap-4">
        <span className="px-4 py-2 bg-blue-900 text-white rounded-full font-semibold shadow hover:bg-blue-800 transition-colors">Excelencia Académica</span>
        <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold shadow hover:bg-green-700 transition-colors">Bilingüismo</span>
        <span className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-full font-semibold shadow hover:bg-yellow-500 transition-colors">Innovación</span>
        <span className="px-4 py-2 bg-pink-500 text-white rounded-full font-semibold shadow hover:bg-pink-600 transition-colors">Arte y Deporte</span>
      </div>
    </div>
    <div className="flex flex-col items-center md:items-end">
      <div className="w-full bg-blue-50 rounded-xl shadow-lg p-8 mb-6">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">Misión</h3>
        <p className="text-gray-700 text-base mb-4">
          Formar estudiantes íntegros, críticos y creativos, capaces de transformar la sociedad con valores humanos y excelencia académica.
        </p>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">Visión</h3>
        <p className="text-gray-700 text-base">
          Ser reconocidos como líderes en educación integral, innovación y formación en valores, contribuyendo al desarrollo de Colombia y el mundo.
        </p>
      </div>
      <div className="w-full bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">Valores</h3>
        <ul className="grid grid-cols-2 gap-4 text-gray-700 text-base">
          <li className="flex items-center gap-2"><i className="ri-heart-line text-pink-500"></i> Respeto</li>
          <li className="flex items-center gap-2"><i className="ri-lightbulb-flash-line text-yellow-400"></i> Honestidad</li>
          <li className="flex items-center gap-2"><i className="ri-star-line text-purple-600"></i> Responsabilidad</li>
          <li className="flex items-center gap-2"><i className="ri-global-line text-green-600"></i> Solidaridad</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section className="py-20 bg-blue-50">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Nuestro Equipo Directivo</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img src="https://i.ibb.co/album-director.jpg" alt="Directora" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-900 shadow" />
        <h3 className="text-xl font-bold text-blue-900 mb-2">María González</h3>
        <p className="text-gray-700 mb-2">Directora General</p>
        <p className="text-sm text-gray-500">Liderazgo, gestión académica y visión institucional.</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img src="https://i.ibb.co/album-coordinador.jpg" alt="Coordinador Académico" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-green-600 shadow" />
        <h3 className="text-xl font-bold text-blue-900 mb-2">Carlos Ramírez</h3>
        <p className="text-gray-700 mb-2">Coordinador Académico</p>
        <p className="text-sm text-gray-500">Innovación pedagógica y acompañamiento estudiantil.</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img src="https://i.ibb.co/album-bilingue.jpg" alt="Coordinadora Bilingüe" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-yellow-400 shadow" />
        <h3 className="text-xl font-bold text-blue-900 mb-2">Laura Torres</h3>
        <p className="text-gray-700 mb-2">Coordinadora de Bilingüismo</p>
        <p className="text-sm text-gray-500">Programa de inglés y certificaciones internacionales.</p>
      </div>
    </div>
  </div>
</section>

<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Instalaciones y Recursos</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-blue-50 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <i className="ri-building-line text-5xl text-blue-900 mb-4 animate-bounce-slow"></i>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Aulas Interactivas</h3>
        <p className="text-gray-700 text-center">Salones equipados con tecnología de punta para potenciar el aprendizaje.</p>
      </div>
      <div className="bg-green-50 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <i className="ri-flask-line text-5xl text-green-600 mb-4 animate-bounce-slow delay-100"></i>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Laboratorios</h3>
        <p className="text-gray-700 text-center">Laboratorios de ciencias, matemáticas e inglés para la experimentación y el descubrimiento.</p>
      </div>
      <div className="bg-yellow-50 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <i className="ri-football-line text-5xl text-yellow-400 mb-4 animate-bounce-slow delay-200"></i>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Zonas Deportivas</h3>
        <p className="text-gray-700 text-center">Campos deportivos y espacios verdes para el desarrollo físico y la recreación.</p>
      </div>
    </div>
  </div>
</section>

<section className="py-20 bg-blue-900 text-white">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-6">¡Conoce más sobre nuestra comunidad!</h2>
    <p className="text-lg text-blue-100 mb-8">
      Descubre por qué somos la mejor opción para la formación integral de tus hijos.
    </p>
    <Link 
      href="/admisiones"
      className="inline-block px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg text-lg hover:bg-yellow-300 transition-colors"
    >
      Ver Admisiones
    </Link>
  </div>
</section>

{/* Modal para visualizar imagen */}
{galleryModalOpen && (
  <div
    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
    onClick={closeGalleryModal}
    tabIndex={-1}
  >
    <div
      className="relative w-[80vw] max-w-[80vw] mx-4 bg-white rounded-lg shadow-lg flex flex-col items-center"
      style={{ maxHeight: '80vh' }}
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-2 text-2xl text-blue-900 bg-white rounded-full px-2 py-1 shadow hover:bg-blue-100"
        onClick={closeGalleryModal}
        aria-label="Cerrar"
      >
        &times;
      </button>
      <div className="flex items-center justify-between w-full mt-8 mb-4 px-4">
        {galleryModalImages.length > 1 && (
          <button
            className="text-2xl text-blue-900 bg-white rounded-full px-2 py-1 shadow hover:bg-blue-100"
            onClick={prevGalleryModalImage}
            aria-label="Anterior"
          >
            &#8592;
          </button>
        )}
        <div className="flex-1 flex justify-center">
          <img
            src={galleryModalImages[galleryModalIndex].link}
            alt={galleryModalImages[galleryModalIndex].Titulo || ''}
            className="max-h-[65vh] w-auto rounded-lg"
            style={{ objectFit: 'contain', maxWidth: '100%' }}
          />
        </div>
        {galleryModalImages.length > 1 && (
          <button
            className="text-2xl text-blue-900 bg-white rounded-full px-2 py-1 shadow hover:bg-blue-100"
            onClick={nextGalleryModalImage}
            aria-label="Siguiente"
          >
            &#8594;
          </button>
        )}
      </div>
      <div className="text-center font-semibold text-blue-900 mb-6 px-4" style={{ minHeight: 32 }}>
        {galleryModalImages[galleryModalIndex].Titulo ? galleryModalImages[galleryModalIndex].Titulo : <span>&nbsp;</span>}
      </div>
    </div>
  </div>
)}

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


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <img 
                src="https://static.readdy.ai/image/b422d9997318ba9404c133396eb0082a/f0b6df53262c2786638b3d4d8768e052.png" 
                alt="Logo Colegio Nuevo San Luis Gonzaga" 
                className="h-16 w-auto mb-4 mx-auto"
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
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>
                  <span className="font-bold text-white">Dirección:</span><br />
                  Carrera 92 #151b 61
                </div>
                <div>
                  <span className="font-bold text-white">WhatsApp:</span><br />
                  +57 318 336 5700
                </div>
                <div>
                  <span className="font-bold text-white">Horarios de Atención:</span><br />
                  Lunes a Viernes: 7:00 AM - 5:00 PM
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Colegio Nuevo San Luis Gonzaga. Todos los derechos reservados.
            </p>
            <div className="mt-2">
              <Link href="/admin" className="text-blue-400 hover:text-white font-semibold underline text-sm transition-colors cursor-pointer">
                Ingresa como Administrador
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/*
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-12px);}
}
.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
.animate-bounce-slow.delay-100 { animation-delay: .1s; }
.animate-bounce-slow.delay-200 { animation-delay: .2s; }
*/