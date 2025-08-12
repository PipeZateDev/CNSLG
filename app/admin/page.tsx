'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Admin() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  // Banner state
  type BannerItem = { Titulo: string; Descripción: string; fecha: string; link: string; orden?: number };
  const [bannerImages, setBannerImages] = useState<BannerItem[]>([]);
  const [bannerForm, setBannerForm] = useState({ Titulo: '', Descripción: '', fecha: '', link: '' });
  const [editBannerIdx, setEditBannerIdx] = useState<number | null>(null);
  const [draggedBannerIdx, setDraggedBannerIdx] = useState<number | null>(null);

  // News state
  type NewsItem = { Titulo: string; Descripción: string; fecha: string; link: string; orden?: number };
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsForm, setNewsForm] = useState({ Titulo: '', Descripción: '', fecha: '', link: '' });
  const [editNewsIdx, setEditNewsIdx] = useState<number | null>(null);
  const [draggedNewsIdx, setDraggedNewsIdx] = useState<number | null>(null);

  // Gallery state
  type GalleryItem = { Titulo: string; Descripción: string; fecha: string; link: string; orden?: number; grupo?: string };
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryForm, setGalleryForm] = useState<{ Titulo: string; Descripción: string; fecha: string; link: string; grupo?: string }>({ Titulo: '', Descripción: '', fecha: '', link: '', grupo: '' });
  const [editGalleryIdx, setEditGalleryIdx] = useState<number | null>(null);
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState<number | null>(null);

  // Nuevo estado para subir múltiples links y grupo
  const [multiLinks, setMultiLinks] = useState<string>('');
  const [multiGroup, setMultiGroup] = useState('');

  // Nuevo estado para subir múltiples links en noticias
  const [multiNewsLinks, setMultiNewsLinks] = useState<string>('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Cargar datos desde la base de datos al montar
  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => setBannerImages(Array.isArray(data) ? [...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) : []));
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(Array.isArray(data) ? [...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) : [])); // <-- corregido: faltaba 'data =>'
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setGallery(Array.isArray(data) ? [...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) : []));
  }, []);

  // Guardar cambios en MongoDB Atlas usando endpoints internos (solo si hay datos)
  // Al guardar, asigna el campo 'orden' según el índice actual
  const saveBanner = async () => {
    if (bannerImages.length === 0) {
      alert('No puedes guardar un banner vacío.');
      return;
    }
    const items = bannerImages.map((item, idx) => ({ ...item, orden: idx }));
    const res = await fetch('/api/banner', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    if (res.ok) {
      const data = await fetch('/api/banner').then(r => r.json());
      setBannerImages(Array.isArray(data) ? [...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) : []);
      alert('Banner guardado.');
    } else {
      alert('Error al guardar el banner.');
    }
  };

  const saveNews = async () => {
    if (news.length === 0) {
      alert('No puedes guardar noticias vacías.');
      return;
    }
    const items = news.map((item, idx) => ({ ...item, orden: idx }));
    const res = await fetch('/api/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    if (res.ok) {
      const data = await fetch('/api/news').then(r => r.json());
      setNews(Array.isArray(data) ? [...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) : []);
      alert('Noticias guardadas.');
    } else {
      alert('Error al guardar las noticias.');
    }
  };

  const saveGallery = async () => {
    if (gallery.length === 0) {
      alert('No puedes guardar una galería vacía.');
      return;
    }
    const items = gallery.map((item, idx) => ({ ...item, orden: idx }));
    const res = await fetch('/api/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    if (res.ok) {
      const data = await fetch('/api/gallery').then(r => r.json());
      setGallery(Array.isArray(data) ? [...data].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) : []);
      alert('Galería guardada.');
    } else {
      alert('Error al guardar la galería.');
    }
  };

  // Banner form handlers
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBannerForm({ ...bannerForm, [e.target.name]: e.target.value });
  };
  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.link) return;
    if (editBannerIdx !== null) {
      setBannerImages(bannerImages.map((img, idx) => idx === editBannerIdx ? { ...bannerForm } : img));
      setEditBannerIdx(null);
    } else {
      setBannerImages([...bannerImages, { ...bannerForm }]);
    }
    setBannerForm({ Titulo: '', Descripción: '', fecha: '', link: '' });
  };
  const handleEditBanner = (idx: number) => {
    setBannerForm(bannerImages[idx]);
    setEditBannerIdx(idx);
  };
  const handleCancelEditBanner = () => {
    setBannerForm({ Titulo: '', Descripción: '', fecha: '', link: '' });
    setEditBannerIdx(null);
  };
  const removeBannerImage = (idx: number) => {
    setBannerImages(bannerImages.filter((_, i) => i !== idx));
    if (editBannerIdx === idx) handleCancelEditBanner();
  };
  // Banner drag and drop handlers
  const handleBannerDragStart = (idx: number) => setDraggedBannerIdx(idx);
  const handleBannerDragEnter = (idx: number) => {
    if (draggedBannerIdx === null || draggedBannerIdx === idx) return;
    const updated = [...bannerImages];
    const [removed] = updated.splice(draggedBannerIdx, 1);
    updated.splice(idx, 0, removed);
    setBannerImages(updated);
    setDraggedBannerIdx(idx);
  };
  const handleBannerDragEnd = () => setDraggedBannerIdx(null);

  // News form handlers
  const handleNewsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewsForm({ ...newsForm, [e.target.name]: e.target.value });
  };
  const handleMultiNewsLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMultiNewsLinks(e.target.value);
  };
  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Si hay links múltiples, procesar como grupo de imágenes en la noticia
    if (multiNewsLinks.trim()) {
      const linksArr = multiNewsLinks.split('\n').map(l => l.trim()).filter(Boolean);
      if (linksArr.length === 0) return;
      const newItems = linksArr.map(link => ({
        Titulo: newsForm.Titulo,
        Descripción: newsForm.Descripción,
        fecha: newsForm.fecha,
        link
      }));
      setNews([...newItems, ...news]);
      setMultiNewsLinks('');
      setNewsForm({ Titulo: '', Descripción: '', fecha: '', link: '' });
      setEditNewsIdx(null);
      return;
    }
    // Individual
    if (!newsForm.Titulo || !newsForm.fecha || !newsForm.Descripción || !newsForm.link) return;
    if (editNewsIdx !== null) {
      setNews(news.map((item, idx) => idx === editNewsIdx ? { ...newsForm } : item));
      setEditNewsIdx(null);
    } else {
      setNews([{ ...newsForm }, ...news]);
    }
    setNewsForm({ Titulo: '', Descripción: '', fecha: '', link: '' });
  };
  const handleEditNews = (idx: number) => {
    setNewsForm(news[idx]);
    setEditNewsIdx(idx);
  };
  const handleCancelEditNews = () => {
    setNewsForm({ Titulo: '', Descripción: '', fecha: '', link: '' });
    setEditNewsIdx(null);
  };
  const removeNews = (idx: number) => {
    setNews(news.filter((_, i) => i !== idx));
    if (editNewsIdx === idx) handleCancelEditNews();
  };
  // News drag and drop handlers
  const handleNewsDragStart = (idx: number) => setDraggedNewsIdx(idx);
  const handleNewsDragEnter = (idx: number) => {
    if (draggedNewsIdx === null || draggedNewsIdx === idx) return;
    const updated = [...news];
    const [removed] = updated.splice(draggedNewsIdx, 1);
    updated.splice(idx, 0, removed);
    setNews(updated);
    setDraggedNewsIdx(idx);
  };
  const handleNewsDragEnd = () => setDraggedNewsIdx(null);

  // Gallery form handlers
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGalleryForm({ ...galleryForm, [e.target.name]: e.target.value });
  };
  const handleMultiLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMultiLinks(e.target.value);
  };
  const handleMultiGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMultiGroup(e.target.value);
  };
  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Si hay links múltiples, procesar como grupo
    if (multiLinks.trim()) {
      const linksArr = multiLinks.split('\n').map(l => l.trim()).filter(Boolean);
      if (linksArr.length === 0) return;
      const newItems = linksArr.map(link => ({
        Titulo: galleryForm.Titulo,
        Descripción: galleryForm.Descripción,
        fecha: galleryForm.fecha,
        link,
        grupo: multiGroup || galleryForm.grupo
      }));
      setGallery([...newItems, ...gallery]);
      setMultiLinks('');
      setMultiGroup('');
      setGalleryForm({ Titulo: '', Descripción: '', fecha: '', link: '', grupo: '' });
      setEditGalleryIdx(null);
      return;
    }
    // Individual
    if (!galleryForm.link) return;
    if (editGalleryIdx !== null) {
      setGallery(gallery.map((img, idx) => idx === editGalleryIdx ? { ...galleryForm } : img));
      setEditGalleryIdx(null);
    } else {
      setGallery([{ ...galleryForm }, ...gallery]);
    }
    setGalleryForm({ Titulo: '', Descripción: '', fecha: '', link: '', grupo: '' });
  };
  const handleEditGallery = (idx: number) => {
    // Asegura que el objeto tenga todas las claves necesarias
    const item = gallery[idx];
    setGalleryForm({
      Titulo: item.Titulo || '',
      Descripción: item.Descripción || '',
      fecha: item.fecha || '',
      link: item.link || '',
      grupo: item.grupo || ''
    });
    setEditGalleryIdx(idx);
  };
  const handleCancelEditGallery = () => {
    setGalleryForm({ Titulo: '', Descripción: '', fecha: '', link: '', grupo: '' });
    setEditGalleryIdx(null);
  };
  const removeGalleryImage = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
    if (editGalleryIdx === idx) handleCancelEditGallery();
  };
  // Gallery drag and drop handlers
  const handleGalleryDragStart = (idx: number) => setDraggedGalleryIdx(idx);
  const handleGalleryDragEnter = (idx: number) => {
    if (draggedGalleryIdx === null || draggedGalleryIdx === idx) return;
    const updated = [...gallery];
    const [removed] = updated.splice(draggedGalleryIdx, 1);
    updated.splice(idx, 0, removed);
    setGallery(updated);
    setDraggedGalleryIdx(idx);
  };
  const handleGalleryDragEnd = () => setDraggedGalleryIdx(null);

  // Handle login
  const handleLogin = () => {
    if (username === 'admin' && password === 'Admin.2024') {
      setIsModalOpen(false);
      setError('');
      setUsername('');
      setPassword('');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUsername('');
    setPassword('');
    setError('');
    router.push('/');
  };

  // Instrucción para subir imágenes a imgbb
  const imgbbUser = "Soporte";
  const imgbbAlbum = "https://soporte-cnslg.imgbb.com/";
  const imgbbProfile = "https://PipeZate.imgbb.com/";

  // Agrupa las imágenes por grupo
  const groupedGallery = gallery.reduce<{ [key: string]: GalleryItem[] }>((acc, img) => {
    const group = img.grupo || '';
    if (!group) {
      acc[`__single_${img.orden ?? 0}_${img.link}`] = [img];
    } else {
      if (!acc[group]) acc[group] = [];
      acc[group].push(img);
    }
    return acc;
  }, {});

  // Agrupa las noticias por título
  const groupedNews = news.reduce<{ [key: string]: NewsItem[] }>((acc, item) => {
    const key = item.Titulo || '';
    if (!key || news.filter(n => n.Titulo === key).length === 1) {
      acc[`__single_${item.orden ?? 0}_${item.link}`] = [item];
    } else {
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white">
      {/* Modal de validación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Acceso a Administración</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Ingrese su usuario"
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Ingrese su contraseña"
                onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-between">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors"
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      )}

      {!isModalOpen && (
        <>
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
                    {/* Admin tab hidden but present for accessibility */}
                    <Link href="/admin" className="hidden" tabIndex={-1} aria-hidden="true">Admin</Link>
                  </div>
                </div>
                {/* Botones pequeños a la derecha */}
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
                    {/* ...existing code for plataformas... */}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <section className="pt-24 pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">
                Panel de Administración
              </h2>

              {/* Sección para subir imágenes a imgbb */}
              <div className="mb-10 bg-blue-50 rounded-lg p-6 shadow text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">¿Cómo subir imágenes?</h3>
                <p className="text-gray-700 mb-2">
                  Sube tus imágenes a <a href={imgbbProfile} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">imgbb.com</a> usando el usuario <span className="font-semibold">{imgbbUser}</span> y el álbum <a href={imgbbAlbum} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">CNSLG</a>.
                </p>
                <p className="text-gray-700 mb-2">
                  Luego, copia la URL directa de la imagen y pégala en el campo correspondiente de la sección que desees (Banner, Noticias o Galería).
                </p>
                <a
                  href="https://soporte-cnslg.imgbb.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors"
                >
                  Sube tus imágenes
                </a>
              </div>

              {/* Banner Images Management */}
              <div className="mb-16">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Gestionar Imágenes del Banner</h3>
                <form onSubmit={handleBannerSubmit} className="bg-blue-50 p-6 rounded-lg shadow mb-6">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="link"
                      value={bannerForm.link}
                      onChange={handleBannerChange}
                      placeholder="URL de la imagen"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="Titulo"
                      value={bannerForm.Titulo}
                      onChange={handleBannerChange}
                      placeholder="Título (opcional)"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      name="Descripción"
                      value={bannerForm.Descripción}
                      onChange={handleBannerChange}
                      placeholder="Descripción (opcional)"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="date"
                      name="fecha"
                      value={bannerForm.fecha}
                      onChange={handleBannerChange}
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors">
                      {editBannerIdx !== null ? 'Guardar Cambios' : 'Agregar Imagen'}
                    </button>
                    {editBannerIdx !== null && (
                      <button type="button" onClick={handleCancelEditBanner} className="px-6 py-2 bg-gray-400 text-white rounded-full font-semibold hover:bg-gray-500 transition-colors">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
                <button
                  onClick={saveBanner}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full font-semibold hover:bg-green-800 transition-colors"
                >
                  Guardar cambios
                </button>
                <div className="grid md:grid-cols-4 gap-4">
                  {bannerImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-lg shadow p-2 relative ${draggedBannerIdx === idx ? 'opacity-60' : ''} cursor-move`}
                      draggable
                      onDragStart={() => handleBannerDragStart(idx)}
                      onDragEnter={() => handleBannerDragEnter(idx)}
                      onDragEnd={handleBannerDragEnd}
                      onDrop={handleBannerDragEnd}
                      onDragOver={e => e.preventDefault()}
                      style={{ cursor: 'grab' }}
                    >
                      {/* Número de orden */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-bold z-10 shadow">
                        {idx + 1}
                      </div>
                      <img src={img.link} alt={img.Titulo} className="w-full h-32 object-cover rounded" />
                      <button
                        onClick={() => removeBannerImage(idx)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => handleEditBanner(idx)}
                        className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs"
                      >
                        Editar
                      </button>
                      <div className="mt-2 text-sm">
                        <strong>{img.Titulo}</strong>
                        <div>{img.Descripción}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* News Management */}
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Gestionar Noticias y Eventos</h3>
                <form onSubmit={handleNewsSubmit} className="bg-blue-50 p-6 rounded-lg shadow mb-6">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="Titulo"
                      value={newsForm.Titulo}
                      onChange={handleNewsChange}
                      placeholder="Título"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    {/* Campo de fecha tipo date */}
                    <input
                      type="date"
                      name="fecha"
                      value={newsForm.fecha}
                      onChange={handleNewsChange}
                      className="w-full px-4 py-2 rounded border border-gray-300"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      name="Descripción"
                      value={newsForm.Descripción}
                      onChange={handleNewsChange}
                      placeholder="Descripción"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      name="multiNewsLinks"
                      value={multiNewsLinks}
                      onChange={handleMultiNewsLinksChange}
                      placeholder="Pega aquí varios links de imágenes (uno por línea) para agregar varias fotos a la noticia"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                      rows={3}
                    />
                    <div className="text-xs text-gray-500 mt-1">Si usas este campo, se ignorará el campo de link individual.</div>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="link"
                      value={newsForm.link}
                      onChange={handleNewsChange}
                      placeholder="URL de la imagen (individual)"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors">
                      {editNewsIdx !== null ? 'Guardar Cambios' : 'Agregar Noticia(s)'}
                    </button>
                    {editNewsIdx !== null && (
                      <button type="button" onClick={handleCancelEditNews} className="px-6 py-2 bg-gray-400 text-white rounded-full font-semibold hover:bg-gray-500 transition-colors">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
                <button
                  onClick={saveNews}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full font-semibold hover:bg-green-800 transition-colors"
                >
                  Guardar cambios
                </button>
                {/* Mostrar noticias agrupadas por título */}
                <div className="space-y-8">
                  {/* Sección para noticias individuales (sin grupo) */}
                  {Object.entries(groupedNews)
                    .filter(([groupKey]) => groupKey.startsWith('__single_'))
                    .length > 0 && (
                    <div>
                      <div className="mb-2 text-blue-900 font-bold text-center">Noticias individuales</div>
                      <div className="grid md:grid-cols-3 gap-8">
                        {Object.entries(groupedNews)
                          .filter(([groupKey]) => groupKey.startsWith('__single_'))
                          .flatMap(([_, items]) => items)
                          .map((item, idx) => (
                            <div
                              key={idx}
                              className={`bg-white rounded-lg shadow-lg overflow-hidden relative cursor-move`}
                              draggable
                              onDragStart={() => handleNewsDragStart(news.indexOf(item))}
                              onDragEnter={() => handleNewsDragEnter(news.indexOf(item))}
                              onDragEnd={handleNewsDragEnd}
                              onDrop={handleNewsDragEnd}
                              onDragOver={e => e.preventDefault()}
                              style={{ cursor: 'grab' }}
                            >
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-bold z-10 shadow">
                                {news.indexOf(item) + 1}
                              </div>
                              <img 
                                src={item.link}
                                alt={item.Titulo}
                                className="w-full h-48 object-cover object-top"
                              />
                              <button
                                onClick={() => removeNews(news.indexOf(item))}
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => handleEditNews(news.indexOf(item))}
                                className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs"
                              >
                                Editar
                              </button>
                              <div className="p-6">
                                <span className="text-sm text-blue-600 font-semibold">{item.fecha}</span>
                                <h3 className="text-lg font-bold text-blue-900 mb-2 mt-1">{item.Titulo}</h3>
                                <p className="text-gray-600 text-sm">{item.Descripción}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {/* Sección para grupos de noticias con el mismo título */}
                  {Object.entries(groupedNews)
                    .filter(([groupKey]) => !groupKey.startsWith('__single_'))
                    .map(([groupKey, items], idx) => (
                      <div key={groupKey}>
                        <div className="mb-2 text-blue-900 font-bold text-center">{groupKey}</div>
                        <div className="flex overflow-x-auto gap-4 pb-2">
                          {items.map((item, i) => (
                            <div
                              key={i}
                              className={`bg-white rounded-lg shadow-lg overflow-hidden relative min-w-[220px] max-w-[260px] cursor-move`}
                              draggable
                              onDragStart={() => handleNewsDragStart(news.indexOf(item))}
                              onDragEnter={() => handleNewsDragEnter(news.indexOf(item))}
                              onDragEnd={handleNewsDragEnd}
                              onDrop={handleNewsDragEnd}
                              onDragOver={e => e.preventDefault()}
                              style={{ cursor: 'grab' }}
                            >
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-bold z-10 shadow">
                                {news.indexOf(item) + 1}
                              </div>
                              <img 
                                src={item.link}
                                alt={item.Titulo}
                                className="w-full h-48 object-cover object-top"
                              />
                              <button
                                onClick={() => removeNews(news.indexOf(item))}
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => handleEditNews(news.indexOf(item))}
                                className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs"
                              >
                                Editar
                              </button>
                              <div className="p-6">
                                <span className="text-sm text-blue-600 font-semibold">{item.fecha}</span>
                                <h3 className="text-lg font-bold text-blue-900 mb-2 mt-1">{item.Titulo}</h3>
                                <p className="text-gray-600 text-sm">{item.Descripción}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* Gallery Management */}
              <div className="mt-16">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Gestionar imágenes de la galería</h3>
                <form onSubmit={handleGallerySubmit} className="bg-blue-50 p-6 rounded-lg shadow mb-6">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="grupo"
                      value={multiGroup || galleryForm.grupo}
                      onChange={handleMultiGroupChange}
                      placeholder="Nombre del grupo (opcional)"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      name="multiLinks"
                      value={multiLinks}
                      onChange={handleMultiLinksChange}
                      placeholder="Pega aquí varios links de imágenes (uno por línea) para subir en grupo"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                      rows={4}
                    />
                    <div className="text-xs text-gray-500 mt-1">Si usas este campo, se ignorará el campo de link individual.</div>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="link"
                      value={galleryForm.link}
                      onChange={handleGalleryChange}
                      placeholder="URL de la imagen (individual)"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="Titulo"
                      value={galleryForm.Titulo}
                      onChange={handleGalleryChange}
                      placeholder="Título (opcional)"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      name="Descripción"
                      value={galleryForm.Descripción}
                      onChange={handleGalleryChange}
                      placeholder="Descripción (opcional)"
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="date"
                      name="fecha"
                      value={galleryForm.fecha}
                      onChange={handleGalleryChange}
                      className="w-full px-4 py-2 rounded border border-gray-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors">
                      {editGalleryIdx !== null ? 'Guardar Cambios' : 'Agregar Imagen(es)'}
                    </button>
                    {editGalleryIdx !== null && (
                      <button type="button" onClick={handleCancelEditGallery} className="px-6 py-2 bg-gray-400 text-white rounded-full font-semibold hover:bg-gray-500 transition-colors">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
                <button
                  onClick={saveGallery}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full font-semibold hover:bg-green-800 transition-colors"
                >
                  Guardar cambios
                </button>
                {/* Mostrar imágenes agrupadas por grupo */}
                <div className="space-y-8">
                  {/* Sección para imágenes individuales (sin grupo) */}
                  {Object.entries(groupedGallery)
                    .filter(([groupKey]) => groupKey.startsWith('__single_'))
                    .length > 0 && (
                    <div>
                      <div className="mb-2 text-blue-900 font-bold text-center">Imágenes individuales</div>
                      <div className="grid md:grid-cols-5 gap-4">
                        {Object.entries(groupedGallery)
                          .filter(([groupKey]) => groupKey.startsWith('__single_'))
                          .flatMap(([_, imgs]) => imgs)
                          .map((img, i) => (
                            <div
                              key={i}
                              className={`bg-white rounded-lg shadow p-2 relative cursor-move`}
                              draggable
                              onDragStart={() => handleGalleryDragStart(gallery.indexOf(img))}
                              onDragEnter={() => handleGalleryDragEnter(gallery.indexOf(img))}
                              onDragEnd={handleGalleryDragEnd}
                              onDrop={handleGalleryDragEnd}
                              onDragOver={e => e.preventDefault()}
                              style={{ cursor: 'grab' }}
                            >
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-bold z-10 shadow">
                                {gallery.indexOf(img) + 1}
                              </div>
                              <img src={img.link} alt={img.Titulo} className="w-full h-32 object-cover rounded" />
                              <button
                                onClick={() => removeGalleryImage(gallery.indexOf(img))}
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => handleEditGallery(gallery.indexOf(img))}
                                className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs"
                              >
                                Editar
                              </button>
                              <div className="mt-2 text-sm text-center">
                                <strong>{img.Titulo}</strong>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  {/* Sección para grupos */}
                  {Object.entries(groupedGallery)
                    .filter(([groupKey]) => !groupKey.startsWith('__single_'))
                    .map(([groupKey, imgs], idx) => (
                      <div key={groupKey}>
                        <div className="mb-2 text-blue-900 font-bold text-center">{groupKey}</div>
                        <div className="flex overflow-x-auto gap-4 pb-2">
                          {imgs.map((img, i) => (
                            <div
                              key={i}
                              className={`bg-white rounded-lg shadow p-2 relative min-w-[180px] max-w-[220px] cursor-move`}
                              draggable
                              onDragStart={() => handleGalleryDragStart(gallery.indexOf(img))}
                              onDragEnter={() => handleGalleryDragEnter(gallery.indexOf(img))}
                              onDragEnd={handleGalleryDragEnd}
                              onDrop={handleGalleryDragEnd}
                              onDragOver={e => e.preventDefault()}
                              style={{ cursor: 'grab' }}
                            >
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-900 text-white rounded-full px-3 py-1 text-xs font-bold z-10 shadow">
                                {gallery.indexOf(img) + 1}
                              </div>
                              <img src={img.link} alt={img.Titulo} className="w-full h-32 object-cover rounded" />
                              <button
                                onClick={() => removeGalleryImage(gallery.indexOf(img))}
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                              >
                                Eliminar
                              </button>
                              <button
                                onClick={() => handleEditGallery(gallery.indexOf(img))}
                                className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs"
                              >
                                Editar
                              </button>
                              <div className="mt-2 text-sm text-center">
                                <strong>{img.Titulo}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  {/* ...logo y descripción... */}
                </div>
                <div>
                  {/* ...enlaces rápidos... */}
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
        </>
      )}
    </div>
  );
}

