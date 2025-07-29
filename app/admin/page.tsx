'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Helper para guardar datos en Google Sheets vía Apps Script WebApp
const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwqxnP4uVQfvJhlcnqhnx-x0g_yMwt_BhK3I1GM8RHf-wkMqPvoAay_2xDS8N5FaS9Z/exec';

async function saveSheet(tab: string, data: any[]) {
  await fetch(SHEETS_WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tab, data }),
  });
}

export default function Admin() {
  const router = useRouter();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Banner images state
  const [bannerImages, setBannerImages] = useState<{ url: string; title?: string; description?: string }[]>([]);
  const [bannerForm, setBannerForm] = useState({ url: '', title: '', description: '' });
  const [editBannerIdx, setEditBannerIdx] = useState<number | null>(null);
  const [draggedBannerIdx, setDraggedBannerIdx] = useState<number | null>(null);

  // News state
  const [news, setNews] = useState<{ title: string; date: string; description: string; image: string }[]>([]);
  const [newsForm, setNewsForm] = useState({ title: '', date: '', description: '', image: '' });
  const [editNewsIdx, setEditNewsIdx] = useState<number | null>(null);
  const [draggedNewsIdx, setDraggedNewsIdx] = useState<number | null>(null);

  // Galería state y handlers (deben estar antes del return)
  const [gallery, setGallery] = useState<{ url: string; title?: string }[]>([
    { url: "https://readdy.ai/api/search-image?query=Modern%20school%20classroom%20with%20students%20studying%2C%20Colombian%20students%20in%20uniforms%2C%20contemporary%20educational%20environment%2C%20natural%20lighting%2C%20academic%20atmosphere%2C%20engaged%20learning%2C%20blue%20and%20white%20uniforms&width=400&height=300&seq=gallery1&orientation=landscape", title: "Estudiantes en clase" },
    { url: "https://readdy.ai/api/search-image?query=School%20sports%20activities%2C%20students%20playing%20soccer%2C%20Colombian%20school%20sports%2C%20outdoor%20activities%2C%20teamwork%2C%20athletic%20field%2C%20healthy%20lifestyle%2C%20school%20sports%20uniform&width=400&height=300&seq=gallery2&orientation=landscape", title: "Actividades deportivas" },
    { url: "https://readdy.ai/api/search-image?query=School%20science%20laboratory%2C%20students%20conducting%20experiments%2C%20modern%20lab%20equipment%2C%20STEM%20education%2C%20Colombian%20school%20facilities%2C%20laboratory%20safety%2C%20educational%20technology%2C%20scientific%20learning&width=400&height=300&seq=gallery3&orientation=landscape", title: "Laboratorio de ciencias" },
    { url: "https://readdy.ai/api/search-image?query=School%20library%20with%20students%20reading%2C%20modern%20educational%20library%2C%20quiet%20study%20space%2C%20book%20shelves%2C%20academic%20research%2C%20Colombian%20school%20interior%2C%20reading%20culture%2C%20educational%20resources&width=400&height=300&seq=gallery4&orientation=landscape", title: "Biblioteca escolar" },
    { url: "https://readdy.ai/api/search-image?query=School%20graduation%20ceremony%2C%20students%20in%20caps%20and%20gowns%2C%20proud%20families%2C%20academic%20achievement%2C%20Colombian%20graduation%20tradition%2C%20celebration%20of%20success%2C%20educational%20milestone&width=400&height=300&seq=gallery6&orientation=landscape", title: "Ceremonia de graduación" }
  ]);
  const [galleryForm, setGalleryForm] = useState({ url: '', title: '' });
  const [editGalleryIdx, setEditGalleryIdx] = useState<number | null>(null);
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState<number | null>(null);

  // Cargar datos publicados al iniciar
  useEffect(() => {
    const storedBanner = localStorage.getItem('bannerImages');
    const storedNews = localStorage.getItem('news');
    const storedGallery = localStorage.getItem('gallery');
    if (storedBanner) setBannerImages(JSON.parse(storedBanner));
    if (storedNews) setNews(JSON.parse(storedNews));
    if (storedGallery) setGallery(JSON.parse(storedGallery));
  }, []);

  // Guardar cambios automáticamente en localStorage (publicados)
  useEffect(() => {
    localStorage.setItem('bannerImages', JSON.stringify(bannerImages));
  }, [bannerImages]);
  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(news));
  }, [news]);
  useEffect(() => {
    localStorage.setItem('gallery', JSON.stringify(gallery));
  }, [gallery]);

  // Banner form handlers
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBannerForm({ ...bannerForm, [e.target.name]: e.target.value });
  };
  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.url) return;
    if (editBannerIdx !== null) {
      setBannerImages(bannerImages.map((img, idx) => idx === editBannerIdx ? { ...bannerForm } : img));
      setEditBannerIdx(null);
    } else {
      setBannerImages([...bannerImages, { ...bannerForm }]);
    }
    setBannerForm({ url: '', title: '', description: '' });
  };
  const handleEditBanner = (idx: number) => {
    const img = bannerImages[idx];
    setBannerForm({
      url: img?.url || '',
      title: img?.title || '',
      description: img?.description || ''
    });
    setEditBannerIdx(idx);
  };
  const handleCancelEditBanner = () => {
    setBannerForm({ url: '', title: '', description: '' });
    setEditBannerIdx(null);
  };
  const removeBannerImage = (idx: number) => {
    setBannerImages(bannerImages.filter((_, i) => i !== idx));
    if (editBannerIdx === idx) handleCancelEditBanner();
  };

  // Drag and drop for banner
  const handleBannerDragStart = (idx: number) => setDraggedBannerIdx(idx);
  const handleBannerDragOver = (idx: number) => {
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
  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.date || !newsForm.description || !newsForm.image) return;
    if (editNewsIdx !== null) {
      setNews(news.map((item, idx) => idx === editNewsIdx ? { ...newsForm } : item));
      setEditNewsIdx(null);
    } else {
      setNews([{ ...newsForm }, ...news]);
    }
    setNewsForm({ title: '', date: '', description: '', image: '' });
  };
  const handleEditNews = (idx: number) => {
    setNewsForm(news[idx]);
    setEditNewsIdx(idx);
  };
  const handleCancelEditNews = () => {
    setNewsForm({ title: '', date: '', description: '', image: '' });
    setEditNewsIdx(null);
  };
  const removeNews = (idx: number) => {
    setNews(news.filter((_, i) => i !== idx));
    if (editNewsIdx === idx) handleCancelEditNews();
  };

  // Drag and drop for news
  const handleNewsDragStart = (idx: number) => setDraggedNewsIdx(idx);
  const handleNewsDragOver = (idx: number) => {
    if (draggedNewsIdx === null || draggedNewsIdx === idx) return;
    const updated = [...news];
    const [removed] = updated.splice(draggedNewsIdx, 1);
    updated.splice(idx, 0, removed);
    setNews(updated);
    setDraggedNewsIdx(idx);
  };
  const handleNewsDragEnd = () => setDraggedNewsIdx(null);

  // Gallery form handlers
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGalleryForm({ ...galleryForm, [e.target.name]: e.target.value });
  };
  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.url) return;
    if (editGalleryIdx !== null) {
      setGallery(gallery.map((img, idx) => idx === editGalleryIdx ? { ...galleryForm } : img));
      setEditGalleryIdx(null);
    } else {
      setGallery([{ ...galleryForm }, ...gallery]);
    }
    setGalleryForm({ url: '', title: '' });
  };
  const handleEditGallery = (idx: number) => {
    const img = gallery[idx];
    setGalleryForm({
      url: img?.url || '',
      title: img?.title || ''
    });
    setEditGalleryIdx(idx);
  };
  const handleCancelEditGallery = () => {
    setGalleryForm({ url: '', title: '' });
    setEditGalleryIdx(null);
  };
  const removeGalleryImage = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
    if (editGalleryIdx === idx) handleCancelEditGallery();
  };
  const handleGalleryDragStart = (idx: number) => setDraggedGalleryIdx(idx);
  const handleGalleryDragOver = (idx: number) => {
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
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };
  const handleCancel = () => {
    router.push('/');
  };

  // Instrucción para subir imágenes a imgbb
  const imgbbUser = "PipeZate";
  const imgbbAlbum = "https://ibb.co/album/hc2G29";
  const imgbbProfile = "https://PipeZate.imgbb.com/";

  // Estado para mostrar guardado
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Guardar todos los datos manualmente
  const handleSaveAll = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      await saveSheet('BANNER', bannerImages);
      await saveSheet('NEWS', news);
      await saveSheet('GALERY', gallery);
      setSaveMsg('¡Cambios guardados en Google Sheets!');
    } catch {
      setSaveMsg('Error al guardar en Google Sheets.');
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

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
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">Inicio</Link>
              <Link href="/nosotros" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">Nosotros</Link>
              <Link href="/admisiones" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">Admisiones</Link>
              {/* Admin link hidden */}
              <Link href="/admin" className="hidden">Administración</Link>
              <Link href="/contacto" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">Contacto</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">
            Panel de Administración
          </h2>

          {/* Botón de guardar cambios manual */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className={`px-8 py-3 rounded-full font-semibold transition-colors ${
                saving
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              {saving ? 'Guardando...' : 'Guardar cambios en Google Sheets'}
            </button>
          </div>
          {saveMsg && (
            <div className="text-center mb-4 text-blue-700 font-semibold">{saveMsg}</div>
          )}

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
              href="https://imgbb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors"
            >
              Ir a imgbb.com
            </a>
          </div>

          {/* Banner Images Management */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Gestionar Imágenes del Banner</h3>
            <form onSubmit={handleBannerSubmit} className="bg-blue-50 p-6 rounded-lg shadow mb-6">
              <div className="mb-4">
                <input
                  type="text"
                  name="url"
                  value={bannerForm.url}
                  onChange={handleBannerChange}
                  placeholder="URL de la imagen"
                  className="w-full px-4 py-2 rounded border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={bannerForm.title}
                  onChange={handleBannerChange}
                  placeholder="Título (opcional)"
                  className="w-full px-4 py-2 rounded border border-gray-300"
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="description"
                  value={bannerForm.description}
                  onChange={handleBannerChange}
                  placeholder="Descripción (opcional)"
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
            <div className="grid md:grid-cols-4 gap-4">
              {bannerImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-lg shadow p-2 relative ${draggedBannerIdx === idx ? 'opacity-60' : ''}`}
                  draggable
                  onDragStart={() => handleBannerDragStart(idx)}
                  onDragOver={(e) => { e.preventDefault(); handleBannerDragOver(idx); }}
                  onDragEnd={handleBannerDragEnd}
                  onDrop={handleBannerDragEnd}
                  style={{ cursor: 'grab' }}
                >
                  <img src={img.url} alt={img.title} className="w-full h-32 object-cover rounded" />
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
                    <strong>{img.title}</strong>
                    <div>{img.description}</div>
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
                  name="title"
                  value={newsForm.title}
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
                  name="date"
                  value={newsForm.date}
                  onChange={handleNewsChange}
                  className="w-full px-4 py-2 rounded border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="description"
                  value={newsForm.description}
                  onChange={handleNewsChange}
                  placeholder="Descripción"
                  className="w-full px-4 py-2 rounded border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="image"
                  value={newsForm.image}
                  onChange={handleNewsChange}
                  placeholder="URL de la imagen"
                  className="w-full px-4 py-2 rounded border border-gray-300"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors">
                  {editNewsIdx !== null ? 'Guardar Cambios' : 'Agregar Noticia'}
                </button>
                {editNewsIdx !== null && (
                  <button type="button" onClick={handleCancelEditNews} className="px-6 py-2 bg-gray-400 text-white rounded-full font-semibold hover:bg-gray-500 transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden relative ${draggedNewsIdx === idx ? 'opacity-60' : ''}`}
                  draggable
                  onDragStart={() => handleNewsDragStart(idx)}
                  onDragOver={(e) => { e.preventDefault(); handleNewsDragOver(idx); }}
                  onDragEnd={handleNewsDragEnd}
                  onDrop={handleNewsDragEnd}
                  style={{ cursor: 'grab' }}
                >
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover object-top"
                  />
                  <button
                    onClick={() => removeNews(idx)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleEditNews(idx)}
                    className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs"
                  >
                    Editar
                  </button>
                  <div className="p-6">
                    <span className="text-sm text-blue-600 font-semibold">{item.date}</span>
                    <h3 className="text-lg font-bold text-blue-900 mb-2 mt-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
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
                  name="url"
                  value={galleryForm.url}
                  onChange={handleGalleryChange}
                  placeholder="URL de la imagen"
                  className="w-full px-4 py-2 rounded border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={galleryForm.title}
                  onChange={handleGalleryChange}
                  placeholder="Título (opcional)"
                  className="w-full px-4 py-2 rounded border border-gray-300"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors">
                  {editGalleryIdx !== null ? 'Guardar Cambios' : 'Agregar Imagen'}
                </button>
                {editGalleryIdx !== null && (
                  <button type="button" onClick={handleCancelEditGallery} className="px-6 py-2 bg-gray-400 text-white rounded-full font-semibold hover:bg-gray-500 transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
            <div className="grid md:grid-cols-5 gap-4">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-lg shadow p-2 relative ${draggedGalleryIdx === idx ? 'opacity-60' : ''}`}
                  draggable
                  onDragStart={() => handleGalleryDragStart(idx)}
                  onDragOver={(e) => { e.preventDefault(); handleGalleryDragOver(idx); }}
                  onDragEnd={handleGalleryDragEnd}
                  onDrop={handleGalleryDragEnd}
                  style={{ cursor: 'grab' }}
                >
                  <img src={img.url} alt={img.title} className="w-full h-32 object-cover rounded" />
                  <button
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleEditGallery(idx)}
                    className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs"
                  >
                    Editar
                  </button>
                  <div className="mt-2 text-sm text-center">
                    <strong>{img.title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ...existing footer... */}
    </div>
  );
}
