'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Banner y noticias desde la API
  const [bannerImages, setBannerImages] = useState<{ link: string; Titulo?: string; Descripción?: string }[]>([]);
  const [news, setNews] = useState<{ link: string; Titulo: string; Descripción: string; fecha: string }[]>([]);

  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => {
        // Ordenar por 'orden' si existe, si no, dejar igual
        if (Array.isArray(data)) {
          setBannerImages([...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)));
        } else {
          setBannerImages([]);
        }
      });
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNews([...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)));
        } else {
          setNews([]);
        }
      });
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

  // Reinicia el intervalo al cambiar manualmente la imagen
  const resetBannerInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1);
    }, 6000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1);
    resetBannerInterval();
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1);
    resetBannerInterval();
  };

  // Agrupa las noticias por título
  const groupedNews = news.reduce<{ [key: string]: typeof news }>((acc, item) => {
    const key = item.Titulo || '';
    if (!key || news.filter(n => n.Titulo === key).length === 1) {
      acc[`__single_${item.link}`] = [item]; // <-- corregido: item.orden puede ser undefined, solo usa link para clave única
    } else {
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
    }
    return acc;
  }, {});

  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [newsModalImages, setNewsModalImages] = useState<{ link: string; Titulo: string; Descripción: string; fecha: string }[]>([]);
  const [newsModalIndex, setNewsModalIndex] = useState(0);

  const openNewsModal = (imgs: typeof news, idx: number = 0) => {
    setNewsModalImages(imgs);
    setNewsModalIndex(idx);
    setNewsModalOpen(true);
  };
  const closeNewsModal = () => setNewsModalOpen(false);
  const nextNewsModalImage = () => setNewsModalIndex((prev) => (prev + 1) % newsModalImages.length);
  const prevNewsModalImage = () => setNewsModalIndex((prev) => (prev - 1 + newsModalImages.length) % newsModalImages.length);

  // ====== NUEVO: estado y lógica de gestos/zoom para el modal de noticias ======
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
    if (!newsModalOpen) return;
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
            if (totalDx > 0) prevNewsModalImage(); else nextNewsModalImage();
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
      if (!moved && modalTransformRef.current.scale === 1 && dt < 250) nextNewsModalImage();
    }
  };

  // Bloqueo scroll del body cuando el modal está abierto
  useEffect(() => {
    if (newsModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [newsModalOpen]);

  // Atajos de teclado y reset de zoom al cambiar imagen
  useEffect(() => {
    if (!newsModalOpen) return;
    resetModalTransform(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNewsModal();
      else if (e.key === 'ArrowLeft') prevNewsModalImage();
      else if (e.key === 'ArrowRight') nextNewsModalImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [newsModalOpen, newsModalIndex]);

  // Centra la miniatura actual en la tira
  useEffect(() => {
    if (!newsModalOpen) return;
    const el = stripRef.current?.querySelector('[data-current="true"]') as HTMLElement | null;
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [newsModalOpen, newsModalIndex]);
  // ====== FIN NUEVO ======

  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);

  // Banner drag handlers
  const handleBannerDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setDragStartX(e.clientX);
    setDragging(true);
    setDragDelta(0);
    // Evita el drag nativo del navegador
    document.body.style.userSelect = 'none';
  };
  const handleBannerDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    setDragDelta(diff);
  };
  const handleBannerDragEnd = () => {
    if (!dragging) return;
    if (dragDelta > 30) {
      prevImage();
    } else if (dragDelta < -30) {
      nextImage();
    }
    setDragging(false);
    setDragStartX(null);
    setDragDelta(0);
    document.body.style.userSelect = '';
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) setDragStartX(e.touches[0].clientX);
    setDragging(true);
    setDragDelta(0);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragging || dragStartX === null || e.touches.length !== 1) return;
    const diff = e.touches[0].clientX - dragStartX;
    setDragDelta(diff);
  };
  const handleTouchEnd = () => {
    if (!dragging) return;
    if (dragDelta > 30) {
      prevImage();
    } else if (dragDelta < -30) {
      nextImage();
    }
    setDragging(false);
    setDragStartX(null);
    setDragDelta(0);
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
                <Link 
                  href="/" 
                  className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${
                    pathname === '/' 
                      ? 'bg-blue-900 text-white' 
                      : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >Inicio</Link>
                <Link 
                  href="/nosotros" 
                  className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${
                    pathname === '/nosotros' 
                      ? 'bg-blue-900 text-white' 
                      : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >Nosotros</Link>
                <Link 
                  href="/admisiones" 
                  className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${
                    pathname === '/admisiones' 
                      ? 'bg-blue-900 text-white' 
                      : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >Admisiones</Link>
                <Link 
                  href="/contacto" 
                  className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${
                    pathname === '/contacto' 
                      ? 'bg-blue-900 text-white' 
                      : 'text-blue-900 hover:bg-blue-50'
                  }`}
                >Contacto</Link>
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
          className="relative w-full mx-auto md:w-4/5 select-none"
          style={{
            height: 'min(600px, 70vw)',
            maxHeight: 600,
            minHeight: 320,
            cursor: dragging ? 'grabbing' : 'grab',
            overflow: 'hidden'
          }}
          onMouseDown={handleBannerDragStart}
          onMouseMove={handleBannerDragMove}
          onMouseUp={handleBannerDragEnd}
          onMouseLeave={handleBannerDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          // Evita el drag nativo de imágenes
          onDragStart={e => e.preventDefault()}
        >
          {bannerImages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No hay imágenes de banner disponibles.
            </div>
          ) : (
            <div className="w-full h-full relative" style={{ height: '100%' }}>
              {bannerImages.map((image, index) => {
                // Calcula desplazamiento para la animación de arrastre
                let translate = 0;
                if (index === currentImageIndex) {
                  translate = dragging ? dragDelta : 0;
                } else if (index === (currentImageIndex - 1 + bannerImages.length) % bannerImages.length) {
                  translate = dragging && dragDelta > 0 ? dragDelta - window.innerWidth : -window.innerWidth;
                } else if (index === (currentImageIndex + 1) % bannerImages.length) {
                  translate = dragging && dragDelta < 0 ? dragDelta + window.innerWidth : window.innerWidth;
                } else {
                  translate = window.innerWidth * 2; // fuera de pantalla
                }
                return (
                  <div
                    key={index}
                    className="absolute inset-0 transition-transform duration-500"
                    style={{
                      zIndex: index === currentImageIndex ? 20 : 10,
                      opacity: Math.abs(translate) < window.innerWidth ? 1 : 0,
                      transform: `translateX(${translate}px)`,
                      transitionProperty: dragging ? 'none' : 'transform, opacity'
                    }}
                  >
                    <img src={image.link} alt={image.Titulo} className="w-full h-full object-cover object-center" />
                    {/* Botón solo en la primera imagen */}
                    {index === 0 && (
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSeORCc-ICVrWFFREQ_THIBY5lPYKMXKB1WLAqobKrfWScRqSg/viewform?usp=sharing&ouid=114310616812674125470"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute left-1/2 transform -translate-x-1/2"
                        style={{
                          top: '5%',
                          zIndex: 30,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                      >
                        <span
                          className="px-8 py-3 rounded-full font-extrabold text-blue-900 text-lg md:text-2xl shadow-xl transition-all duration-200 border-4 border-blue-900 bg-white/70 hover:bg-blue-900 hover:text-white cursor-pointer flex items-center gap-3"
                          style={{
                            letterSpacing: '0.04em',
                            textShadow: '0 2px 8px rgba(30,58,138,0.10), 0 0px 1px #fff',
                            boxShadow: '0 4px 24px rgba(30,58,138,0.18)',
                          }}
                        >
                          <span className="animate-bounce">¡Regístrate ahora!</span>
                        </span>
                      </a>
                    )}
                    {/* Botón solo en la tercera imagen */}
                    {index === 2 && (
                      <a
                        href="/admisiones"
                        className="absolute left-1/2 transform -translate-x-1/2"
                        style={{
                          bottom: '5%',
                          top: 'auto',
                          zIndex: 30,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                      >
                        <span
                          className="px-8 py-3 rounded-full font-extrabold text-blue-900 text-lg md:text-2xl shadow-xl transition-all duration-200 border-4 border-blue-900 bg-white/70 hover:bg-blue-900 hover:text-white cursor-pointer flex items-center gap-3"
                          style={{
                            letterSpacing: '0.04em',
                            textShadow: '0 2px 8px rgba(30,58,138,0.10), 0 0px 1px #fff',
                            boxShadow: '0 4px 24px rgba(30,58,138,0.18)',
                          }}
                        >
                          <span className="animate-bounce">¡Inscríbete ahora!</span>
                        </span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
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
                  <button key={index} onClick={() => { setCurrentImageIndex(index); resetBannerInterval(); }} className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
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
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow hover:scale-110 transition-transform duration-300">
          <i className="ri-graduation-cap-line text-3xl text-blue-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">+2850</h3>
        <p className="text-gray-600">Graduados Exitosos</p>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow delay-100 hover:scale-110 transition-transform duration-300">
          <i className="ri-award-line text-3xl text-green-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">99</h3>
        <p className="text-gray-600">Años de Tradición</p>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow delay-200 hover:scale-110 transition-transform duration-300">
          <i className="ri-english-input text-3xl text-yellow-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">Inglés Intensivo</h3>
        <p className="text-gray-600">con certificación TOEFL</p>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow delay-300 hover:scale-110 transition-transform duration-300">
          <i className="ri-star-line text-3xl text-purple-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-2">100%</h3>
        <p className="text-gray-600">Compromiso con la Calidad</p>
      </div>
      <div className="text-center">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow delay-400 hover:scale-110 transition-transform duration-300">
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
            {Object.entries(groupedNews).map(([groupKey, items], idx) => (
              groupKey.startsWith('__single_') ? (
                items.map((item, i) => (
                  <div 
                    key={item.link + i} 
                    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => openNewsModal([item], 0)}
                  >
                    <div className="relative">
                      <img 
                        src={item.link}
                        alt={item.Titulo}
                        className="w-full h-48 object-cover object-top transition-transform duration-300 group-hover:scale-110 group-hover:brightness-95"
                      />
                      <div className="absolute top-2 right-2 bg-blue-900 text-white px-2 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ¡Ver más!
                      </div>
                    </div>
                    <div className="p-6 transition-colors duration-300 group-hover:bg-blue-50">
                      <span className="text-sm text-blue-600 font-semibold">{item.fecha}</span>
                      <h3 className="text-lg font-bold text-blue-900 mb-2 mt-1 group-hover:text-blue-700 transition-colors">{item.Titulo}</h3>
                      <p className="text-gray-600 text-sm">{item.Descripción}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  key={groupKey} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => openNewsModal(items, 0)}
                >
                  <div className="relative">
                    <img 
                      src={items[0].link}
                      alt={items[0].Titulo}
                      className="w-full h-48 object-cover object-top transition-transform duration-300 group-hover:scale-110 group-hover:brightness-95"
                    />
                    <div className="absolute top-2 right-2 bg-blue-900 text-white px-2 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ¡Ver galería!
                    </div>
                  </div>
                  <div className="p-6 transition-colors duration-300 group-hover:bg-blue-50">
                    <span className="text-sm text-blue-600 font-semibold">{items[0].fecha}</span>
                    <h3 className="text-lg font-bold text-blue-900 mb-2 mt-1 group-hover:text-blue-700 transition-colors">{items[0].Titulo}</h3>
                    <p className="text-gray-600 text-sm">{items[0].Descripción}</p>
                    {items.length > 1 && (
                      <div className="mt-2 text-blue-900 text-xs font-semibold">
                        {items.length} imágenes
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        {/* Modal para visualizar imágenes de noticia (REEMPLAZADO) */}
        {newsModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={closeNewsModal}
            tabIndex={-1}
          >
            <div
              className="relative bg-neutral-900 text-white rounded-xl shadow-2xl overflow-hidden w-[95vw] h-[95vh] md:w-[90vw] md:h-[90vh] flex"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Cerrar */}
              <button
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/40 hover:bg-white/20 transition flex items-center justify-center text-2xl"
                onClick={closeNewsModal}
                aria-label="Cerrar"
              >
                &times;
              </button>

              {/* Contenido: imagen izquierda (2) / texto derecha (1) */}
              <div className="grid grid-rows-[1fr_auto] md:grid-rows-1 md:grid-cols-3 w-full h-full">
                {/* Visual: stage + tira de miniaturas */}
                <div className="md:col-span-2 flex flex-col min-w-0 min-h-0">
                  {/* Stage */}
                  <div
                    ref={stageRef}
                    className="relative flex-1 bg-black flex items-center justify-center overflow-hidden touch-none select-none"
                    onPointerDown={onStagePointerDown}
                    onPointerMove={onStagePointerMove}
                    onPointerUp={onStagePointerUp}
                    onPointerCancel={onStagePointerUp}
                    onWheel={handleStageWheel}
                  >
                    <img
                      src={newsModalImages[newsModalIndex].link}
                      alt={newsModalImages[newsModalIndex].Titulo || ''}
                      className="max-w-full max-h-full object-contain pointer-events-none select-none"
                      style={{ transform: `translate(${modalTx}px, ${modalTy}px) scale(${modalScale})` }}
                    />
                    {/* Nav */}
                    {newsModalImages.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-16 rounded bg-black/35 hover:bg-white/20 text-white text-2xl flex items-center justify-center"
                          onClick={prevNewsModalImage}
                          aria-label="Anterior"
                        >
                          ‹
                        </button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-16 rounded bg-black/35 hover:bg-white/20 text-white text-2xl flex items-center justify-center"
                          onClick={nextNewsModalImage}
                          aria-label="Siguiente"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Miniaturas */}
                  {newsModalImages.length > 1 && (
                    <div
                      ref={stripRef}
                      className="h-24 bg-neutral-800 border-t border-neutral-700 overflow-x-auto flex items-center gap-2 px-3 py-2"
                    >
                      {newsModalImages.map((it, idx) => (
                        <button
                          key={it.link + idx}
                          type="button"
                          onClick={() => setNewsModalIndex(idx)}
                          data-current={idx === newsModalIndex ? 'true' : undefined}
                          className={`flex-none w-28 h-20 rounded overflow-hidden border-2 ${idx === newsModalIndex ? 'border-blue-400' : 'border-transparent'} bg-black`}
                          aria-label={`Ver imagen ${idx + 1}`}
                        >
                          <img src={it.link} alt={it.Titulo || ''} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info derecha */}
                <aside className="md:col-span-1 p-4 md:p-6 overflow-auto bg-neutral-900 border-t md:border-t-0 md:border-l border-neutral-800">
                  <h3 className="text-lg md:text-xl font-bold mb-2">{newsModalImages[newsModalIndex].Titulo}</h3>
                  <div className="text-sm md:text-base text-neutral-300 whitespace-pre-line">
                    {newsModalImages[newsModalIndex].Descripción}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
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
.animate-bounce-slow.delay-300 { animation-delay: .3s; }
.animate-bounce-slow.delay-400 { animation-delay: .4s; }
*/