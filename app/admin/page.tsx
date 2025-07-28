'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  // News state
  const [news, setNews] = useState<{ title: string; date: string; description: string; image: string }[]>([]);
  const [newsForm, setNewsForm] = useState({ title: '', date: '', description: '', image: '' });
  const [editNewsIdx, setEditNewsIdx] = useState<number | null>(null);

  // Cargar datos publicados al iniciar
  useEffect(() => {
    const storedBanner = localStorage.getItem('bannerImages');
    const storedNews = localStorage.getItem('news');
    if (storedBanner) setBannerImages(JSON.parse(storedBanner));
    if (storedNews) setNews(JSON.parse(storedNews));
  }, []);

  // Guardar cambios automáticamente en localStorage (publicados)
  useEffect(() => {
    localStorage.setItem('bannerImages', JSON.stringify(bannerImages));
  }, [bannerImages]);
  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(news));
  }, [news]);

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
    // Validar que el índice exista y el objeto tenga las propiedades necesarias
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
                <div key={idx} className="bg-white rounded-lg shadow p-2 relative">
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
                <input
                  type="text"
                  name="date"
                  value={newsForm.date}
                  onChange={handleNewsChange}
                  placeholder="Fecha (ej: 20 Jun 2025)"
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
                <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden relative">
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
        </div>
      </section>
      {/* ...existing footer... */}
    </div>
  );
}
