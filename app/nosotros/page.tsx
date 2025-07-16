'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Nosotros() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://static.readdy.ai/image/b422d9997318ba9404c133396eb0082a/f0b6df53262c2786638b3d4d8768e052.png"
                alt="Logo Colegio Nuevo San Luis Gonzaga"
                className="h-12 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors whitespace-nowrap cursor-pointer">
                Inicio
              </Link>
              <Link href="/nosotros" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">
                Nosotros
              </Link>
              <Link href="/admisiones" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">
                Admisiones
              </Link>
              <Link href="/contacto" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer">
                Contacto
              </Link>
              <div className="flex space-x-2 ml-8">
                <a href="https://lms30.uno-internacional.com/login/access" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
                  UNOi Santillana
                </a>
                <a href="https://www.cibercolegios.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors whitespace-nowrap cursor-pointer">
                  Cibercolegios
                </a>
                <a href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                  PSE
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="lg:hidden w-10 h-10 flex items-center justify-center text-blue-900 cursor-pointer">
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors text-center cursor-pointer">
                  Inicio
                </Link>
                <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">
                  Nosotros
                </Link>
                <Link href="/admisiones" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">
                  Admisiones
                </Link>
                <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">
                  Contacto
                </Link>
                <div className="flex flex-col space-y-2 pt-2">
                  <a href="https://lms30.uno-internacional.com/login/access" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-center cursor-pointer">
                    UNOi Santillana
                  </a>
                  <a href="https://www.cibercolegios.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors text-center cursor-pointer">
                    Cibercolegios
                  </a>
                  <a href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-center cursor-pointer">
                    PSE
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
          <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 ${item.color} text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg opacity-80 hover:opacity-100`}>
            <i className={`${item.icon} text-xl`}></i>
          </a>
        ))}
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nosotros</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Conoce la rica historia y tradición educativa del Colegio Nuevo San Luis Gonzaga
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Nuestra Historia Centenaria</h2>
              <p className="text-gray-600 mb-4">
                Fundado en 1926, el Colegio Nuevo San Luis Gonzaga ha sido un pilar fundamental 
                en la educación colombiana durante casi un siglo. Iniciamos como una pequeña 
                institución educativa con el sueño de formar integralmente a los jóvenes de nuestra comunidad.
              </p>
              <p className="text-gray-600 mb-4">
                A lo largo de estos 98 años, hemos mantenido nuestro compromiso con la excelencia 
                académica, los valores católicos y la formación de líderes comprometidos con la sociedad.
              </p>
              <p className="text-gray-600">
                Hoy, nos enorgullecemos de ser una institución reconocida por su calidad educativa, 
                sus instalaciones modernas y su comunidad educativa comprometida con el futuro de Colombia.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://readdy.ai/api/search-image?query=Historic%20Colombian%20school%20building%20from%201926%2C%20vintage%20architecture%2C%20educational%20institution%2C%20traditional%20brick%20building%2C%20students%20in%20historic%20uniforms%2C%20sepia%20tones%2C%20heritage%20photography%2C%20Catholic%20school%20history%2C%20Colombian%20education%20legacy&width=600&height=400&seq=history1&orientation=landscape"
                alt="Historia del Colegio"
                className="rounded-lg shadow-lg w-full h-80 object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-target-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Misión</h3>
              <p className="text-gray-700">
                Formar integralmente a niños y jóvenes con excelencia académica, fundamentados 
                en valores católicos, desarrollando competencias que les permitan ser líderes 
                transformadores de la sociedad, comprometidos con la justicia, la paz y el bien común.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-eye-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Visión</h3>
              <p className="text-gray-700">
                Ser reconocidos como la institución educativa líder en la región, distinguida 
                por la excelencia académica, la formación en valores y la innovación pedagógica, 
                contribuyendo al desarrollo integral de nuestros estudiantes y al progreso de la sociedad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galería de Imágenes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Galería de Imágenes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://readdy.ai/api/search-image?query=Modern%20school%20classroom%20with%20students%20studying%2C%20Colombian%20students%20in%20uniforms%2C%20contemporary%20educational%20environment%2C%20natural%20lighting%2C%20academic%20atmosphere%2C%20engaged%20learning%2C%20blue%20and%20white%20uniforms&width=400&height=300&seq=gallery1&orientation=landscape"
                alt="Estudiantes en clase"
                className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://readdy.ai/api/search-image?query=School%20sports%20activities%2C%20students%20playing%20soccer%2C%20Colombian%20school%20sports%2C%20outdoor%20activities%2C%20teamwork%2C%20athletic%20field%2C%20healthy%20lifestyle%2C%20school%20sports%20uniform&width=400&height=300&seq=gallery2&orientation=landscape"
                alt="Actividades deportivas"
                className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://readdy.ai/api/search-image?query=School%20science%20laboratory%2C%20students%20conducting%20experiments%2C%20modern%20lab%20equipment%2C%20STEM%20education%2C%20Colombian%20school%20facilities%2C%20laboratory%20safety%2C%20educational%20technology%2C%20scientific%20learning&width=400&height=300&seq=gallery3&orientation=landscape"
                alt="Laboratorio de ciencias"
                className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://readdy.ai/api/search-image?query=School%20library%20with%20students%20reading%2C%20modern%20educational%20library%2C%20quiet%20study%20space%2C%20book%20shelves%2C%20academic%20research%2C%20Colombian%20school%20interior%2C%20reading%20culture%2C%20educational%20resources&width=400&height=300&seq=gallery4&orientation=landscape"
                alt="Biblioteca escolar"
                className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://readdy.ai/api/search-image?query=School%20cultural%20activities%2C%20students%20performing%20arts%2C%20music%20and%20theater%2C%20school%20auditorium%2C%20cultural%20expression%2C%20artistic%20education%2C%20Colombian%20school%20events%2C%20creative%20learning&width=400&height=300&seq=gallery5&orientation=landscape"
                alt="Actividades culturales"
                className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://readdy.ai/api/search-image?query=School%20graduation%20ceremony%2C%20students%20in%20caps%20and%20gowns%2C%20proud%20families%2C%20academic%20achievement%2C%20Colombian%20graduation%20tradition%2C%20celebration%20of%20success%2C%20educational%20milestone&width=400&height=300&seq=gallery6&orientation=landscape"
                alt="Ceremonia de graduación"
                className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-heart-line text-2xl text-blue-600"></i>
              </div>
              <h4 className="font-bold text-blue-900 mb-2">Amor</h4>
              <p className="text-sm text-gray-600">Base de todas nuestras relaciones y acciones educativas</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-2xl text-green-600"></i>
              </div>
              <h4 className="font-bold text-blue-900 mb-2">Respeto</h4>
              <p className="text-sm text-gray-600">Valoramos la dignidad de cada persona en nuestra comunidad</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-hand-heart-line text-2xl text-purple-600"></i>
              </div>
              <h4 className="font-bold text-blue-900 mb-2">Responsabilidad</h4>
              <p className="text-sm text-gray-600">Compromiso con nuestros deberes y la sociedad</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-star-line text-2xl text-orange-600"></i>
              </div>
              <h4 className="font-bold text-blue-900 mb-2">Excelencia</h4>
              <p className="text-sm text-gray-600">Búsqueda constante de la calidad en todo lo que hacemos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
              © 2024 Colegio Nuevo San Luis Gonzaga. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
