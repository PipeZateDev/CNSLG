'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SocialPost = {
  id: string;
  url: string;
  type: "instagram" | "tiktok" | "facebook" | "youtube";
  title?: string;
  fecha?: string;
};

const SOCIALS = [
  { type: "instagram", label: "Instagram" },
  { type: "tiktok", label: "TikTok" },
  { type: "facebook", label: "Facebook" },
  { type: "youtube", label: "YouTube" },
];

export default function RedesSociales() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<{ [key: string]: number }>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(open => !open);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/social-posts")
      .then(res => res.json())
      .then(data => {
        // Ordenar por fecha descendente
        if (Array.isArray(data)) {
          setPosts([...data].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')));
        } else {
          setPosts([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Carrusel handlers
  const handlePrev = (type: string, count: number) => {
    setActiveIndex(idx => ({
      ...idx,
      [type]: typeof idx[type] === "number"
        ? (idx[type] - 1 + count) % count
        : 0
    }));
  };
  const handleNext = (type: string, count: number) => {
    setActiveIndex(idx => ({
      ...idx,
      [type]: typeof idx[type] === "number"
        ? (idx[type] + 1) % count
        : 0
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
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
                <Link href="/redes-sociales" className={`px-5 py-2 rounded-full transition-colors whitespace-nowrap cursor-pointer text-[1.25rem] font-semibold ${pathname === '/redes-sociales' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Redes Sociales</Link>
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
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link href="/" onClick={() => setIsMenuOpen(false)} scroll={false} className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${pathname === '/' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Inicio</Link>
                <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} scroll={false} className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${pathname === '/nosotros' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Nosotros</Link>
                <Link href="/admisiones" onClick={() => setIsMenuOpen(false)} scroll={false} className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${pathname === '/admisiones' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Admisiones</Link>
                <Link href="/redes-sociales" onClick={() => setIsMenuOpen(false)} scroll={false} className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${pathname === '/redes-sociales' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Redes Sociales</Link>
                <Link href="/contacto" onClick={() => setIsMenuOpen(false)} scroll={false} className={`px-4 py-2 rounded-full transition-colors text-center cursor-pointer ${pathname === '/contacto' ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>Contacto</Link>
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

      {/* ...existing social posts section... */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white text-center shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Redes Sociales</h1>
          <p className="text-lg text-blue-100 mb-6">
            Descubre nuestras publicaciones y actividades en Instagram, TikTok, Facebook y YouTube.
          </p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {SOCIALS.map(social => {
              const filtered = posts.filter(p => p.type === social.type);
              const idx = activeIndex[social.type] ?? 0;
              return (
                <div key={social.type}>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">{social.label}</h2>
                  <div className="space-y-6">
                    {loading ? (
                      <div className="text-blue-900">Cargando...</div>
                    ) : filtered.length === 0 ? (
                      <div className="text-gray-500">No hay publicaciones aún.</div>
                    ) : (
                      <div className="relative">
                        <div>
                          <div className="flex justify-center">
                            <div className="w-full">
                              <SocialEmbed url={filtered[idx].url} type={filtered[idx].type} />
                            </div>
                          </div>
                          {filtered[idx].title && (
                            <div className="font-semibold text-blue-900 mt-2 text-center">{filtered[idx].title}</div>
                          )}
                          {filtered[idx].fecha && (
                            <div className="text-xs text-gray-500 text-center">{filtered[idx].fecha}</div>
                          )}
                        </div>
                        {filtered.length > 1 && (
                          <div className="flex justify-center items-center gap-4 mt-4">
                            <button
                              className="px-3 py-1 bg-blue-900 text-white rounded-full font-bold hover:bg-blue-800 transition"
                              onClick={() => handlePrev(social.type, filtered.length)}
                              aria-label="Anterior"
                            >
                              &#8592;
                            </button>
                            <span className="text-blue-900 font-bold">{idx + 1} / {filtered.length}</span>
                            <button
                              className="px-3 py-1 bg-blue-900 text-white rounded-full font-bold hover:bg-blue-800 transition"
                              onClick={() => handleNext(social.type, filtered.length)}
                              aria-label="Siguiente"
                            >
                              &#8594;
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
                <li><Link href="/redes-sociales" className="hover:text-white transition-colors cursor-pointer">Redes Sociales</Link></li>
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

// Embeds para cada red social
function SocialEmbed({ url, type }: { url: string; type: string }) {
  // Instagram
  if (type === "instagram") {
    const match = url.match(/instagram\.com\/p\/([^\/\?\&]+)/i);
    const postId = match ? match[1] : "";
    if (postId) {
      return (
        <iframe
          src={`https://www.instagram.com/p/${postId}/embed`}
          className="w-full min-h-[480px] rounded-lg border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
        ></iframe>
      );
    }
  }
  // TikTok
  if (type === "tiktok") {
    const match = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/i);
    const videoId = match ? match[1] : "";
    if (videoId) {
      return (
        <iframe
          src={`https://www.tiktok.com/embed/${videoId}`}
          className="w-full min-h-[480px] rounded-lg border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
        ></iframe>
      );
    }
  }
  // Facebook
  if (type === "facebook") {
    return (
      <iframe
        src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`}
        className="w-full min-h-[480px] rounded-lg border-0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      ></iframe>
    );
  }
  // YouTube
  if (type === "youtube") {
    // Extraer ID de YouTube
    const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = match ? match[1] : "";
    if (videoId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full min-h-[360px] aspect-video rounded-lg border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
        ></iframe>
      );
    }
  }
  // Si es código de inserción (contiene <blockquote ...), usar dangerouslySetInnerHTML
  if (url.trim().startsWith("<blockquote")) {
    return (
      <div
        className="w-full min-h-[360px] rounded-lg border-0"
        dangerouslySetInnerHTML={{ __html: url }}
      />
    );
  }
  // Fallback: mostrar link
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline block text-center">
      Ver publicación
    </a>
  );
}
