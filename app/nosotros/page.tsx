'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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

  // Estado para el modal de galería
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ link: string; Titulo?: string }[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const modalTransformRef = useRef({ scale: 1, tx: 0, ty: 0 });
  const [modalScale, setModalScale] = useState(1);
  const [modalTx, setModalTx] = useState(0);
  const [modalTy, setModalTy] = useState(0);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastDistRef = useRef(0);
  const dragRef = useRef<{ x: number; y: number; t: number; moved: boolean } | null>(null);

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const setTransform = (scale: number, tx: number, ty: number) => {
    modalTransformRef.current = { scale, tx, ty };
    setModalScale(scale);
    setModalTx(tx);
    setModalTy(ty);
  };
  const resetModalTransform = (hard = true) => {
    setTransform(1, 0, 0);
    if (hard) dragRef.current = null;
  };
  const limitPan = () => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { scale, tx, ty } = modalTransformRef.current;
    const maxX = Math.max(0, (rect.width * scale - rect.width) / 2);
    const maxY = Math.max(0, (rect.height * scale - rect.height) / 2);
    const nx = clamp(tx, -maxX, maxX);
    const ny = clamp(ty, -maxY, maxY);
    if (nx !== tx || ny !== ty) setTransform(scale, nx, ny);
  };
  const zoomAround = (clientX: number, clientY: number, factor: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = clientX - rect.left - rect.width / 2;
    const cy = clientY - rect.top - rect.height / 2;
    const { scale, tx, ty } = modalTransformRef.current;
    const newScale = clamp(scale * factor, 1, 4);
    const applied = (newScale / scale) || 1;
    const ntx = (tx + cx) * applied - cx;
    const nty = (ty + cy) * applied - cy;
    setTransform(newScale, ntx, nty);
    limitPan();
  };

  const handleStageWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!galleryModalOpen) return;
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = Math.exp(delta * 0.002);
    zoomAround(e.clientX, e.clientY, factor);
  };
  const onStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 1) {
      dragRef.current = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
    } else if (pointersRef.current.size === 2) {
      dragRef.current = null;
      const pts = Array.from(pointersRef.current.values());
      lastDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }
  };
  const onStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    const prev = pointersRef.current.get(e.pointerId)!;
    const curr = { x: e.clientX, y: e.clientY };
    pointersRef.current.set(e.pointerId, curr);

    if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (lastDistRef.current) {
        const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        zoomAround(center.x, center.y, dist / lastDistRef.current);
      }
      lastDistRef.current = dist;
    } else if (pointersRef.current.size === 1) {
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const { scale, tx, ty } = modalTransformRef.current;
      if (scale > 1) {
        setTransform(scale, tx + dx, ty + dy);
        limitPan();
        if (dragRef.current) dragRef.current.moved = true;
      } else {
        if (dragRef.current) {
          const totalDx = curr.x - dragRef.current.x;
          if (Math.abs(totalDx) > 60) {
            dragRef.current = null;
            setGalleryIndex((prev) =>
              totalDx > 0
                ? (prev - 1 + galleryImages.length) % galleryImages.length
                : (prev + 1) % galleryImages.length
            );
          }
        }
      }
    }
  };
  const onStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointersRef.current.has(e.pointerId)) pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) lastDistRef.current = 0;
    if (pointersRef.current.size === 0 && dragRef.current) {
      const dt = Date.now() - dragRef.current.t;
      const moved = dragRef.current.moved;
      dragRef.current = null;
      if (!moved && modalTransformRef.current.scale === 1 && dt < 250)
        setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }
  };

  // Bloqueo scroll del body cuando el modal está abierto
  useEffect(() => {
    if (galleryModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [galleryModalOpen]);

  // Atajos de teclado y reset de zoom al cambiar imagen
  useEffect(() => {
    if (!galleryModalOpen) return;
    resetModalTransform(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGalleryModalOpen(false);
      else if (e.key === 'ArrowLeft') setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      else if (e.key === 'ArrowRight') setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [galleryModalOpen, galleryIndex, galleryImages.length]);

  // Centra la miniatura actual en la tira
  useEffect(() => {
    if (!galleryModalOpen) return;
    const el = stripRef.current?.querySelector('[data-current="true"]') as HTMLElement | null;
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [galleryModalOpen, galleryIndex]);

  // Handler para abrir el modal desde la galería agrupada
  const handleOpenGalleryModal = (imgs: { link: string; Titulo?: string }[], idx: number = 0) => {
    setGalleryImages(imgs);
    setGalleryIndex(idx);
    setGalleryModalOpen(true);
  };

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
                href="https://slgonzaga.cibercolegios.com/authentication/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTUsInR5cGUiOiJjaWIifQ.p0pWPNHrJsYZIH0ixkXqIPmeTI8wQedPvUBQZGcaqys" 
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
                    href="https://slgonzaga.cibercolegios.com/authentication/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTUsInR5cGUiOiJjaWIifQ.p0pWPNHrJsYZIH0ixkXqIPmeTI8wQedPvUBQZGcaqys" 
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
<section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-12 items-start">
      {/* Columna izquierda: Historia + Misión + Visión */}
      <div>
        <h2 className="text-4xl font-extrabold mb-6 tracking-tight drop-shadow-lg">Nuestra Historia Centenaria</h2>
        <p className="text-lg text-blue-100 mb-4 leading-relaxed">
          Fundado en 1926, el Colegio Nuevo San Luis Gonzaga ha sido un pilar fundamental en la educación colombiana durante casi un siglo...
        </p>
        <p className="text-lg text-blue-100 mb-4">
          A lo largo de estos 99 años, hemos mantenido nuestro compromiso con la excelencia académica...
        </p>
        <p className="text-lg text-blue-100 mb-8">
          Hoy, nos enorgullecemos de ser una institución reconocida por su calidad educativa...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Misión */}
          <div className="bg-blue-50 rounded-xl shadow-lg p-6 text-center border-t-8 border-blue-900">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="ri-road-map-line text-3xl text-blue-900 animate-bounce"></i>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Misión</h3>
            <p className="text-gray-700 text-sm">
              El COLEGIO NUEVO SAN LUIS GONZAGA tiene el propósito de formar integralmente a nuestros estudiantes desde los valores Gonzaguistas, potenciando sus dimensiones de aprendizaje, profundizando en las áreas de humanidades, ciencias, matemáticas e inglés, Todo ello, con un enfoque investigativo y tecnológico.
            </p>
          </div>
          {/* Visión */}
          <div className="bg-green-50 rounded-xl shadow-lg p-6 text-center border-t-8 border-yellow-400">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="ri-eye-line text-3xl text-yellow-400 animate-bounce"></i>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Visión</h3>
            <p className="text-gray-700 text-sm">
              Evolucionar y crecer como una Institución de educación formal de calidad dedicada a la formación y desarrollo de seres humanos integrales, con un currículo avanzado y proyectado hacia el bilingüismo, la investigación, la tecnología y el deporte. Asimismo, proyectamos alcanzar altos estándares B2 en el nivel de inglés de acuerdo con el Marco Común Europeo.
            </p>
          </div>
        </div>
      </div>
      {/* Columna derecha: Canva embed */}
      <div>
        <div className="rounded-xl overflow-hidden shadow-xl border-4 border-blue-900 bg-white">
          <div style={{
            position: 'relative',
            width: '100%',
            height: 0,
            paddingTop: '125.0000%',
            paddingBottom: 0,
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
          <div className="text-center mt-4 text-blue-900 font-bold">
            <a
              href="https://www.canva.com/design/DAGt7hE4YGs/bhZrgMbKfPaECdSdwufBPw/view?utm_content=DAGt7hE4YGs&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              TimeLine
            </a>{' '}
            de Soporte CNSLG
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Sección: Valores + Decálogo */}
<section className="py-20 bg-blue-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
      {/* Valores Institucionales */}
      <div className="bg-yellow-50 rounded-xl shadow-lg p-8 flex-1 border-t-8 border-yellow-400">
        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
          <i className="ri-hand-heart-line text-2xl text-yellow-600 animate-bounce"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-3">Valores Institucionales</h3>
        <ul className="list-disc pl-5 text-gray-700 text-base space-y-2">
          <li><strong>Identidad:</strong> Pertenencia y rasgos distintivos Gonzaguistas.</li>
          <li><strong>Responsabilidad:</strong> Compromiso y conciencia de consecuencias.</li>
          <li><strong>Justicia:</strong> Respeto y defensa de derechos, equidad.</li>
          <li><strong>Trascendencia:</strong> Misión, armonía y entusiasmo.</li>
          <li><strong>Tolerancia:</strong> Respeto y aceptación de la diferencia.</li>
        </ul>
      </div>
      {/* Decálogo */}
      <div className="bg-purple-50 rounded-xl shadow-lg p-8 flex-1 border-t-8 border-purple-400">
        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
          <i className="ri-list-check text-2xl text-purple-600 animate-bounce"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-3">Decálogo CNSLG</h3>
        <ul className="list-decimal pl-5 text-gray-700 text-base space-y-1">
          <li>Dios siempre presente en nuestras labores educativas.</li>
          <li>Educamos con justicia y amor.</li>
          <li>Actuamos con responsabilidad y decisión.</li>
          <li>Prestamos un servicio de calidad con amabilidad.</li>
          <li>Fomentamos el espíritu investigativo y deportivo.</li>
          <li>Somos diligentes y creativos.</li>
          <li>Estamos a la vanguardia de los conocimientos científicos y tecnológicos.</li>
          <li>Reconocemos los derechos fundamentales de las personas.</li>
          <li>Somos exitosos por nuestra organización.</li>
          <li>Planeamos, hacemos, verificamos y actuamos.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

{/* Galería de Imágenes */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Galería de Imágenes</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Agrupa por título */}
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
              <div key={img.link + i} className="col-span-1 md:col-span-1 flex flex-col h-full cursor-pointer group"
                onClick={() => openModal([img], 0)}>
                <div className="rounded-xl shadow-lg bg-blue-50 p-2 flex flex-col h-full transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  <div className="relative overflow-hidden rounded-xl flex flex-col h-full">
                    <img 
                      src={img.link}
                      alt={img.Titulo || ''}
                      className="w-full h-64 object-cover object-top transition-transform duration-300 group-hover:scale-110 group-hover:brightness-95"
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
            <div key={groupKey} className="col-span-1 md:col-span-1 flex flex-col h-full cursor-pointer group"
              onClick={() => openModal(imgs, 0)}>
              <div className="rounded-xl shadow-lg bg-blue-50 p-2 flex flex-col h-full transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <div className="relative overflow-hidden rounded-xl flex flex-col h-full">
                  <img 
                    src={imgs[0].link}
                    alt={imgs[0].Titulo || ''}
                    className="w-full h-64 object-cover object-top transition-transform duration-300 group-hover:scale-110 group-hover:brightness-95"
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
                        onClick={e => { e.stopPropagation(); openModal(imgs, 0); }}
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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={() => setGalleryModalOpen(false)}
      tabIndex={-1}
    >
      <div
        className="relative bg-neutral-900 text-white rounded-xl shadow-2xl overflow-hidden w-[95vw] h-[95vh] md:w-[90vw] md:h-[90vh] flex"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Botón cerrar SIEMPRE visible */}
        <button
          className="absolute top-2 right-2 w-11 h-11 z-20 rounded-full bg-black/60 text-white text-3xl flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
          style={{ opacity: 0.95 }}
          onClick={() => setGalleryModalOpen(false)}
          aria-label="Cerrar"
        >
          &times;
        </button>
        {/* Stage + navegación */}
        <div className="flex items-center justify-between w-full mt-8 mb-4 px-4">
          {galleryImages.length > 1 && (
            <button
              className="text-2xl text-blue-900 bg-white rounded-full px-2 py-1 shadow hover:bg-blue-100"
              onClick={() => setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
              aria-label="Anterior"
            >
              &#8592;
            </button>
          )}
          <div className="flex-1 flex justify-center">
            <img
              src={galleryImages[galleryIndex].link}
              alt={galleryImages[galleryIndex].Titulo || ''}
              className="max-h-[65vh] w-auto rounded-lg"
              style={{ objectFit: 'contain', maxWidth: '100%' }}
            />
          </div>
          {galleryImages.length > 1 && (
            <button
              className="text-2xl text-blue-900 bg-white rounded-full px-2 py-1 shadow hover:bg-blue-100"
              onClick={() => setGalleryIndex((prev) => (prev + 1) % galleryImages.length)}
              aria-label="Siguiente"
            >
              &#8594;
            </button>
          )}
        </div>
        <div className="text-center font-semibold text-blue-900 mb-6 px-4" style={{ minHeight: 32 }}>
          {galleryImages[galleryIndex].Titulo ? galleryImages[galleryIndex].Titulo : <span>&nbsp;</span>}
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
                  href="https://slgonzaga.cibercolegios.com/authentication/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTUsInR5cGUiOiJjaWIifQ.p0pWPNHrJsYZIH0ixkXqIPmeTI8wQedPvUBQZGcaqys" 
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