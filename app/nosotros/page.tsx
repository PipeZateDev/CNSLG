'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Nosotros() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
    if (!group) {
      acc[`__single_${img.orden ?? 0}_${img.link}`] = [img];
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
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors text-center cursor-pointer">Inicio</Link>
                <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Nosotros</Link>
                <Link href="/admisiones" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Admisiones</Link>
                <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Contacto</Link>
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
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-12 items-start">
      {/* Columna izquierda: Historia + Misión + Visión */}
      <div>
        {/* Historia */}
        <h2> </h2>
        <h2 className="text-3xl font-bold text-blue-900 mb-6">Nuestra Historia Centenaria</h2>
        <p className="text-gray-600 mb-4">
          Fundado en 1926, el Colegio Nuevo San Luis Gonzaga ha sido un pilar fundamental 
          en la educación colombiana durante casi un siglo...
        </p>
        <p className="text-gray-600 mb-4">
          A lo largo de estos 99 años, hemos mantenido nuestro compromiso con la excelencia académica...
        </p>
        <p className="text-gray-600 mb-8">
          Hoy, nos enorgullecemos de ser una institución reconocida por su calidad educativa...
        </p>

        {/* Misión */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <i className="ri-target-line text-xl text-blue-600"></i>
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Misión</h3>
          <p className="text-gray-700 text-sm">
            El COLEGIO NUEVO SAN LUIS GONZAGA tiene el propósito de formar integralmente a nuestros estudiantes desde los valores 
            Gonzaguistas, potenciando sus dimensiones de aprendizaje, profundizando en las áreas de humanidades, ciencias, matemáticas 
            e inglés, Todo ello, con un enfoque investigativo y tecnológico.
          </p>
        </div>

        {/* Visión */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <i className="ri-eye-line text-xl text-green-600"></i>
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Visión</h3>
          <p className="text-gray-700 text-sm">
            Evolucionar y crecer como una Institución de educación formal de calidad 
            dedicada a la formación y desarrollo de seres humanos integrales, con un currículo avanzado y 
            proyectado hacia el bilingüismo, la investigación, la tecnología y el deporte. Asimismo, proyectamos 
            alcanzar altos estándares B2 en el nivel de inglés de acuerdo con el Marco Común Europeo.  
          </p>
        </div>
      </div>

      {/* Columna derecha: Canva embed */}
      <div>
        <div style={{ width: '100%', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: 0,
            paddingTop: '125.0000%',
            paddingBottom: 0,
            boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
            marginTop: '1.6em',
            marginBottom: '0.9em',
            overflow: 'hidden',
            borderRadius: '8px',
            willChange: 'transform'
          }}>
            <iframe
              loading="lazy"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                border: 'none',
                padding: 0,
                margin: 0
              }}
              src="https://www.canva.com/design/DAGt7hE4YGs/bhZrgMbKfPaECdSdwufBPw/view?embed"
              allowFullScreen
              allow="fullscreen"
              title="TimeLine-CNSLG"
            ></iframe>
          </div>
          <div className="text-center mt-4">
            <a
              href="https://www.canva.com/design/DAGt7hE4YGs/bhZrgMbKfPaECdSdwufBPw/view?utm_content=DAGt7hE4YGs&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
              target="_blank"
              rel="noopener noreferrer"
            >
              TimeLine - 
            </a>{' '}
            de Soporte CNSLG
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



{/* Sección: Valores + Decálogo */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
      
      {/* Valores Institucionales */}
      <div className="bg-yellow-50 rounded-lg p-6 flex-1">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
          <i className="ri-hand-heart-line text-xl text-yellow-600"></i>
        </div>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Valores Institucionales</h3>
        <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
          <li><strong>Principio de Identidad:</strong> sentimiento de pertenencia y rasgos distintivos de la comunidad Gonzaguista.</li>
          <li><strong>Principio de Responsabilidad:</strong> conciencia de las consecuencias y capacidad para asumir compromisos.</li>
          <li><strong>Principio de Justicia:</strong> respeto y defensa de los derechos de las personas, actuando con equidad.</li>
          <li><strong>Principio de Trascendencia:</strong> vivir con sentido de misión, responsabilidad, armonía y entusiasmo.</li>
          <li><strong>Principio de Tolerancia:</strong> respeto por los demás, aceptación de la individualidad y la diferencia.</li>
        </ul>
      </div>

      {/* Decálogo */}
      <div className="bg-purple-50 rounded-lg p-6 flex-1">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
          <i className="ri-list-check text-xl text-purple-600"></i>
        </div>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Decálogo del Nuevo San Luis Gonzaga</h3>
        <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
          <li>1. Dios siempre presente en nuestras labores educativas.</li>
          <li>2. Educamos con justicia y amor.</li>
          <li>3. Actuamos con responsabilidad y decisión.</li>
          <li>4. Prestamos un servicio de calidad con amabilidad.</li>
          <li>5. Fomentamos el espíritu investigativo y deportivo.</li>
          <li>6. Somos diligentes y creativos.</li>
          <li>7. Estamos a la vanguardia de los conocimientos científicos y tecnológicos.</li>
          <li>8. Reconocemos los derechos fundamentales de las personas.</li>
          <li>9. Somos exitosos por nuestra organización.</li>
          <li>10. Planeamos, hacemos, verificamos y actuamos.</li>
        </ul>
      </div>

    </div>
  </div>
</section>



      {/* Galería de Imágenes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Galería de Imágenes</h2>
          <div className="flex flex-col items-center">
            <div className="w-full bg-gray-100 rounded-xl shadow-lg p-8" style={{ minHeight: 400 }}>
              {/* Galería principal tipo "visor" */}
              <div className="w-full h-[400px] bg-white rounded-lg flex items-center justify-center mb-8" style={{ minHeight: 320 }}>
                {/* Imagen principal (la primera del grupo o individual) */}
                {gallery.length > 0 && (
                  <img
                    src={gallery[0].link}
                    alt={gallery[0].Titulo || ''}
                    className="object-contain h-full w-full rounded-lg"
                    style={{ maxHeight: 380, maxWidth: '100%' }}
                    onClick={() => openModal([gallery[0]], 0)}
                  />
                )}
              </div>
              {/* Miniaturas abajo, alineadas y con paginación si hay más de 4 */}
              <div className="flex gap-4 justify-center">
                {gallery.slice(0, 5).map((img, idx) => (
                  <div
                    key={img.link + idx}
                    className="w-24 h-20 bg-white rounded-lg shadow cursor-pointer flex flex-col items-center justify-center border border-gray-200 hover:border-blue-900 transition"
                    style={{ minWidth: 80, minHeight: 60 }}
                    onClick={() => openModal([img], 0)}
                  >
                    <img
                      src={img.link}
                      alt={img.Titulo || ''}
                      className="object-cover w-full h-full rounded"
                      style={{ maxHeight: 60, maxWidth: 80 }}
                    />
                    <div className="text-xs text-blue-900 mt-1 truncate w-full text-center">{img.Titulo}</div>
                  </div>
                ))}
                {/* Si hay más imágenes, muestra un botón "+" */}
                {gallery.length > 5 && (
                  <div className="w-24 h-20 flex items-center justify-center">
                    <button
                      className="w-12 h-12 rounded-lg bg-blue-900 text-white text-2xl font-bold shadow hover:bg-blue-800 transition"
                      onClick={() => openModal(gallery, 0)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Modal para visualizar imagen */}
          {modalOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
              onClick={closeModal}
              tabIndex={-1}
            >
              <div
                className="relative w-[80vw] max-w-[80vw] mx-4 bg-white rounded-lg shadow-lg flex flex-col items-center"
                style={{ maxHeight: '80vh' }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-2xl text-blue-900 bg-white rounded-full px-2 py-1 shadow hover:bg-blue-100"
                  onClick={closeModal}
                  aria-label="Cerrar"
                >
                  &times;
                </button>
                <div className="flex items-center justify-between w-full mt-8 mb-4 px-4">
                  {modalImages.length > 1 && (
                    <button
                      className="text-2xl text-blue-900 bg-white rounded-full px-2 py-1 shadow hover:bg-blue-100"
                      onClick={prevModalImage}
                      aria-label="Anterior"
                    >
                      &#8592;
                    </button>
                  )}
                  <div className="flex-1 flex justify-center">
                    <img
                      src={modalImages[modalIndex].link}
                      alt={modalImages[modalIndex].Titulo || ''}
                      className="max-h-[65vh] w-auto rounded-lg"
                      style={{ objectFit: 'contain', maxWidth: '100%' }}
                    />
                  </div>
                  {modalImages.length > 1 && (
                    <button
                      className="text-2xl text-blue-900 bg-white rounded-full px-2 py-1 shadow hover:bg-blue-100"
                      onClick={nextModalImage}
                      aria-label="Siguiente"
                    >
                      &#8594;
                    </button>
                  )}
                </div>
                <div className="text-center font-semibold text-blue-900 mb-6 px-4">
                  {modalImages[modalIndex].Titulo}
                </div>
              </div>
            </div>
          )}
        </div>
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