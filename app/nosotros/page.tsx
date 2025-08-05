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
      Sobre Nosotros
    </h1>
    <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto mb-8 font-medium">
      Colegio Nuevo San Luis Gonzaga: 99 años formando líderes con excelencia académica y valores.
    </p>
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
      <img 
        src="https://i.ibb.co/spn4L9WW/LOGO-NSLG-2-Mini.png"
        alt="Logo Colegio Nuevo San Luis Gonzaga"
        className="h-32 w-auto mx-auto rounded-xl shadow-xl border-4 border-white"
      />
      <div className="text-left md:text-center flex-1">
        <h2 className="text-3xl font-bold text-yellow-300 mb-2">Nuestra Misión</h2>
        <p className="text-lg text-blue-100 mb-4">
          Formar estudiantes íntegros, críticos y creativos, con sólidos valores humanos y cristianos, capaces de transformar la sociedad.
        </p>
        <h2 className="text-3xl font-bold text-yellow-300 mb-2">Nuestra Visión</h2>
        <p className="text-lg text-blue-100">
          Ser reconocidos como un colegio líder en innovación educativa, excelencia académica y formación en valores.
        </p>
      </div>
    </div>
  </div>
</section>

<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-bold text-blue-900 mb-6">Historia</h2>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          Fundado en 1926, el Colegio Nuevo San Luis Gonzaga ha sido pionero en la educación integral en Bogotá. Nuestra trayectoria se destaca por la excelencia académica, el compromiso social y la formación en valores católicos.
        </p>
        <ul className="space-y-3 text-blue-900 font-semibold">
          <li className="flex items-center">
            <i className="ri-check-line text-green-600 mr-2"></i>
            Más de 2850 graduados exitosos.
          </li>
          <li className="flex items-center">
            <i className="ri-check-line text-green-600 mr-2"></i>
            Certificación ICFES Muy Superior A+.
          </li>
          <li className="flex items-center">
            <i className="ri-check-line text-green-600 mr-2"></i>
            Programas de robótica, inglés intensivo y emprendimiento.
          </li>
          <li className="flex items-center">
            <i className="ri-check-line text-green-600 mr-2"></i>
            Clubes deportivos y artísticos de alto rendimiento.
          </li>
        </ul>
      </div>
      <div className="flex justify-center">
        <img 
          src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80"
          alt="Estudiantes Colegio"
          className="rounded-2xl shadow-2xl border-4 border-blue-900 w-full max-w-md object-cover"
        />
      </div>
    </div>
  </div>
</section>

<section className="py-20 bg-blue-50">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Valores Institucionales</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-900 hover:scale-105 transition-transform duration-300">
        <i className="ri-heart-2-line text-4xl text-pink-600 mb-4 animate-bounce"></i>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Respeto</h3>
        <p className="text-gray-700 text-base">Valoramos la diversidad y promovemos la convivencia armónica.</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-900 hover:scale-105 transition-transform duration-300">
        <i className="ri-lightbulb-flash-line text-4xl text-yellow-500 mb-4 animate-bounce"></i>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Innovación</h3>
        <p className="text-gray-700 text-base">Fomentamos la creatividad y el pensamiento crítico en cada estudiante.</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-900 hover:scale-105 transition-transform duration-300">
        <i className="ri-team-line text-4xl text-green-600 mb-4 animate-bounce"></i>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Solidaridad</h3>
        <p className="text-gray-700 text-base">Impulsamos el trabajo en equipo y el compromiso social.</p>
      </div>
    </div>
  </div>
</section>

<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Equipo Directivo</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-blue-50 rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-900">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Rector" className="w-24 h-24 rounded-full mb-4 border-4 border-blue-900 object-cover shadow-lg" />
        <h3 className="text-xl font-bold text-blue-900 mb-1">Juan Pérez</h3>
        <span className="text-blue-600 font-semibold mb-2">Rector</span>
        <p className="text-gray-700 text-base">Líder académico con más de 20 años de experiencia en educación.</p>
      </div>
      <div className="bg-blue-50 rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-900">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Coordinadora Académica" className="w-24 h-24 rounded-full mb-4 border-4 border-blue-900 object-cover shadow-lg" />
        <h3 className="text-xl font-bold text-blue-900 mb-1">María Gómez</h3>
        <span className="text-blue-600 font-semibold mb-2">Coordinadora Académica</span>
        <p className="text-gray-700 text-base">Especialista en innovación pedagógica y formación docente.</p>
      </div>
      <div className="bg-blue-50 rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-blue-900">
        <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Coordinador de Bienestar" className="w-24 h-24 rounded-full mb-4 border-4 border-blue-900 object-cover shadow-lg" />
        <h3 className="text-xl font-bold text-blue-900 mb-1">Carlos Ruiz</h3>
        <span className="text-blue-600 font-semibold mb-2">Coordinador de Bienestar</span>
        <p className="text-gray-700 text-base">Promotor de actividades deportivas, culturales y de salud estudiantil.</p>
      </div>
    </div>
  </div>
</section>

      {/* Galería de Imágenes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Galería de Imágenes</h2>
          {/* Agrupa por título */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(() => {
              // Agrupa por título
              const groupedByTitle = gallery.reduce<{ [key: string]: typeof gallery }>((acc, img) => {
                const key = img.Titulo || '';
                if (!key || gallery.filter(g => g.Titulo === key).length === 1) {
                  acc[`__single_${img.link}`] = [img];
                } else {
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(img);
                }
                return acc;
              }, {});
              return Object.entries(groupedByTitle).map(([groupKey, imgs], idx) => (
                groupKey.startsWith('__single_') ? (
                  imgs.map((img, i) => (
                    <div key={img.link + i} className="col-span-1 md:col-span-1 flex flex-col h-full cursor-pointer"
                      onClick={() => openGalleryModal([img], 0)}>
                      <div className="rounded-lg shadow-lg bg-gray-50 p-2 flex flex-col h-full">
                        <div className="group relative overflow-hidden rounded-lg flex flex-col h-full">
                          <img 
                            src={img.link}
                            alt={img.Titulo || ''}
                            className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            style={{ minHeight: 256, maxHeight: 256 }}
                          />
                          <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
                          <div className="text-center py-2 font-semibold text-blue-900 bg-white/80" style={{ minHeight: 32 }}>
                            {img.Titulo ? img.Titulo : <span>&nbsp;</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div key={groupKey} className="col-span-1 md:col-span-1 flex flex-col h-full cursor-pointer"
                    onClick={() => openGalleryModal(imgs, 0)}>
                    <div className="rounded-lg shadow-lg bg-gray-50 p-2 flex flex-col h-full">
                      <div className="group relative overflow-hidden rounded-lg flex flex-col h-full">
                        <img 
                          src={imgs[0].link}
                          alt={imgs[0].Titulo || ''}
                          className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          style={{ minHeight: 256, maxHeight: 256 }}
                        />
                        <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
                        <div className="text-center py-2 font-semibold text-blue-900 bg-white/80" style={{ minHeight: 32 }}>
                          {imgs[0].Titulo ? imgs[0].Titulo : <span>&nbsp;</span>}
                        </div>
                        {imgs.length > 1 && (
                          <div className="absolute" style={{ bottom: '38%', left: '50%', transform: 'translateX(-50%)' }}>
                            <button
                              className="px-4 py-1 bg-blue-900 text-white rounded-full text-xs font-semibold shadow hover:bg-blue-800 transition"
                              onClick={e => { e.stopPropagation(); openGalleryModal(imgs, 0); }}
                            >
                              Ver más ({imgs.length})
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ));
            })()}
          </div>
        </div>
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
      </section>
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