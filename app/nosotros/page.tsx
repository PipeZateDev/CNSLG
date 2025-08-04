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
  const [modalImages, setModalImages] = useState<{ link: string; Titulo?: string; grupo?: string }[]>([]);
  const [modalIndex, setModalIndex] = useState(0);

  // Modal open handler
  const openModal = (imgs: { link: string; Titulo?: string; grupo?: string }[], idx: number = 0) => {
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
                <Link href="/nosotros" onClick={() => setIsMenuOpen(false)