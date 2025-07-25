'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Noticias() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const [form, setForm] = useState({ title: '', date: '', description: '', image: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title && form.date && form.description && form.image) {
      setNews([{ ...form }, ...news]);
      setForm({ title: '', date: '', description: '', image: '' });
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white">
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
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">Inicio</Link>
              <Link href="/nosotros" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">Nosotros</Link>
              <Link href="/admisiones" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">Admisiones</Link>
              <Link href="/noticias" className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors whitespace-nowrap cursor-pointer">Noticias y Eventos</Link>
              <Link href="/contacto" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">Contacto</Link>
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
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Inicio</Link>
                <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Nosotros</Link>
                <Link href="/admisiones" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Admisiones</Link>
                <Link href="/noticias" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors text-center cursor-pointer">Noticias y Eventos</Link>
                <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Contacto</Link>
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

      {/* Noticias Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">
            Noticias y Eventos
          </h2>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12 bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Agregar Noticia o Evento</h3>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Título"
                className="w-full px-4 py-2 rounded border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="date"
                value={form.date}
                onChange={handleChange}
                placeholder="Fecha (ej: 20 Jun 2025)"
                className="w-full px-4 py-2 rounded border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción"
                className="w-full px-4 py-2 rounded border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="URL de la imagen"
                className="w-full px-4 py-2 rounded border border-gray-300"
                required
              />
            </div>
            <button type="submit" className="px-6 py-2 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors">
              Publicar
            </button>
          </form>
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-6">
                  <span className="text-sm text-blue-600 font-semibold">{item.date}</span>
                  <h3 className="text-lg font-bold text-blue-900 mb-2 mt-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
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
                <li><Link href="/noticias" className="hover:text-white transition-colors cursor-pointer">Noticias y Eventos</Link></li>
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
