'use client';

import { useState } from 'react';
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
  const [bannerImages, setBannerImages] = useState([
    { url: "https://i.ibb.co/mCG7xd6C/1.jpg", title: "", description: "" },
    { url: "https://i.ibb.co/4n2KgQTP/9.jpg", title: "", description: "" },
    { url: "https://i.ibb.co/Wp5W862T/2.jpg", title: "", description: "" },
    { url: "https://i.ibb.co/1fwdk3FQ/3.jpg", title: "", description: "" },
    { url: "https://i.ibb.co/VpghYymD/6.jpg", title: "", description: "" },
    { url: "https://i.ibb.co/WWFpKXmM/4.jpg", title: "", description: "" },
    { url: "https://i.ibb.co/N2jyWxS1/7.jpg", title: "", description: "" }
  ]);
  const [bannerForm, setBannerForm] = useState({ url: '', title: '', description: '' });

  // News state
  const [news, setNews] = useState([
    {
      title: "Open House 2025",
      date: "20 Jun 2025",
      description: "Conoce nuestras instalaciones y proceso de admisión para el próximo año escolar.",
      image: "https://i.ibb.co/vCpGdgff/Open-House2025.png"
    },
    {
      title: "Feria de Ciencias 2024",
      date: "10 Oct 2024",
      description: "Nuestros estudiantes brillaron con proyectos innovadores en ciencia y tecnología.",
      image: "https://readdy.ai/api/search-image?query=School%20science%20fair%20with%20student%20projects%2C%20STEM%20exhibition%2C%20innovative%20experiments%2C%20proud%20students%20presenting%2C%20educational%20achievement%2C%20modern%20school%20facilities%2C%20scientific%20learning&width=400&height=250&seq=news2&orientation=landscape"
    },
    {
      title: "Campeones Robótica",
      date: "05 Nov 2023",
      description: "Nuestro equipo de robótica obtivo el 1er puesto en el campeonato mundial 2023.",
      image: "https://readdy.ai/api/search-image?query=School%20sports%20championship%20celebration%2C%20students%20with%20trophies%20and%20medals%2C%20athletic%20achievement%2C%20team%20spirit%2C%20Colombian%20school%20sports%2C%20victory%20celebration%2C%20proud%20athletes&width=400&height=250&seq=news3&orientation=landscape"
    }
  ]);
  const [newsForm, setNewsForm] = useState({ title: '', date: '', description: '', image: '' });

  // Banner form handlers
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBannerForm({ ...bannerForm, [e.target.name]: e.target.value });
  };
  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bannerForm.url) {
      setBannerImages([...bannerImages, { ...bannerForm }]);
      setBannerForm({ url: '', title: '', description: '' });
    }
  };

  // News form handlers
  const handleNewsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewsForm({ ...newsForm, [e.target.name]: e.target.value });
  };
  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsForm.title && newsForm.date && newsForm.description && newsForm.image) {
      setNews([{ ...newsForm }, ...news]);
      setNewsForm({ title: '', date: '', description: '', image: '' });
    }
  };

  // Remove banner image
  const removeBannerImage = (idx: number) => {
    setBannerImages(bannerImages.filter((_, i) => i !== idx));
  };

  // Remove news item
  const removeNews = (idx: number) => {
    setNews(news.filter((_, i) => i !== idx));
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

  // Handle cancel
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
              <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors">
                Agregar Imagen
              </button>
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
              <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors">
                Agregar Noticia
              </button>
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
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
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
                {/* Admin link hidden */}
                <li><Link href="/admin" className="hidden">Administración</Link></li>
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
          {/* Link for admin access */}
          <div className="flex justify-center mt-8">
            <Link
              href="/admin"
              className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              Ingreso como Administrador
            </Link>
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
