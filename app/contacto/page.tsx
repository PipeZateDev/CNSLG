'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Contacto() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };
  

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
              <Link 
                href="/"
                className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Inicio
              </Link>
              <Link 
                href="/nosotros"
                className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Nosotros
              </Link>
              <Link 
                href="/admisiones"
                className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Admisiones
              </Link>
              {/* Admin link hidden */}
              <Link href="/admin" className="hidden">Administración</Link>
              <Link 
                href="/contacto"
                className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Contacto
              </Link>
              <div className="flex space-x-2 ml-8">
                <a 
                  href="https://lms30.uno-internacional.com/login/access" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  UNOi Santillana
                </a>
                <a 
                  href="https://www.cibercolegios.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm hover:bg-yellow-500 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cibercolegios
                </a>
                <a 
                  href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Pagos PSE
                </a>
              </div>
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
                <Link 
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer"
                >
                  Inicio
                </Link>
                <Link 
                  href="/nosotros"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer"
                >
                  Nosotros
                </Link>
                <Link 
                  href="/admisiones"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer"
                >
                  Admisiones
                </Link>
                <Link 
                  href="/contacto"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer"
                >
                  Contacto
                </Link>
                <div className="flex flex-col space-y-2 pt-2">
                  <a 
                    href="https://lms30.uno-internacional.com/login/access" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-center cursor-pointer"
                  >
                    UNOi Santillana
                  </a>
                  <a 
                    href="https://www.cibercolegios.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors text-center cursor-pointer"
                  >
                    Cibercolegios
                  </a>
                  <a 
                    href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-center cursor-pointer"
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


      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contacto</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Estamos aquí para resolver todas tus dudas y acompañarte en el proceso educativo
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Información de Contacto */}
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-8">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-map-pin-line text-xl text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Dirección</h4>
                    <p className="text-gray-600">
                      Carrera 92 #151b 61<br />
                      Barrio Pinar de suba<br />
                      Bogotá, Colombia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-phone-line text-xl text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Teléfonos</h4>
                    <p className="text-gray-600">
                      Línea Principal: (601) 7447473<br />
                      WhatsApp: +57 318 336 5700<br />
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-mail-line text-xl text-purple-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Correos Electrónicos</h4>
                    <p className="text-gray-600">
                      nuevo@slgonzaga.edu.co<br />
                      admisiones@slgonzaga.edu.co<br />
                      soporte@slgonzaga.edu.co
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-time-line text-xl text-orange-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Horarios de Atención</h4>
                    <p className="text-gray-600">
                      Lunes a Viernes: 7:00 AM - 5:00 PM<br />
                      Sábados: Cerrado<br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="mt-8">
                <h4 className="font-semibold text-blue-900 mb-4">Síguenos en Redes Sociales</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://wa.me/573183365700" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-whatsapp-line"></i>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-instagram-line"></i>
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-facebook-line"></i>
                  </a>
                  <a 
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-tiktok-line"></i>
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <i className="ri-youtube-line"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-8">Ubicación</h3>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.1254549286673!2d-74.08652182502036!3d4.748238495226936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f845614d63d99%3A0xc6fb0207bcd2701a!2sColegio%20Nuevo%20San%20Luis%20Gonzaga!5e0!3m2!1ses!2sco!4v1752862372655!5m2!1ses!2sco"
                  width="100%" 
                  height="400" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Colegio Nuevo San Luis Gonzaga"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Departamentos de Contacto</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-add-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Admisiones</h3>
              <p className="text-gray-600 mb-4">Información sobre inscripciones y proceso de admisión</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><i className="ri-phone-line mr-2"></i>(601) 7447473</p>
                <p><i className="ri-mail-line mr-2"></i>admisiones@slgonzaga.edu.co</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-graduation-cap-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Vicerrectoria</h3>
              <p className="text-gray-600 mb-4">Dirección académica y administrativa del colegio</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><i className="ri-mail-line mr-2"></i>vicerrectoria@slgonzaga.edu.co</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-calculator-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Secretaría Académica</h3>
              <p className="text-gray-600 mb-4">Certificados, constancias y documentos académicos</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><i className="ri-phone-line mr-2"></i>(601) 7447473</p>
                <p><i className="ri-mail-line mr-2"></i>secretaria@slgonzaga.edu.co</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-heart-pulse-line text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Psicología</h3>
              <p className="text-gray-600 mb-4">Acompañamiento psicopedagógico y bienestar estudiantil</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><i className="ri-mail-line mr-2"></i>psicologia@slgonzaga.edu.co</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-coins-line text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Tesorería</h3>
              <p className="text-gray-600 mb-4">Pagos, facturación y asuntos financieros</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><i className="ri-mail-line mr-2"></i>tesoreria@slgonzaga.edu.co</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-computer-line text-2xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Sistemas</h3>
              <p className="text-gray-600 mb-4">Soporte técnico y plataformas virtuales</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><i className="ri-mail-line mr-2"></i>soportes@slgonzaga.edu.co</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">¿Cuáles son los horarios de clases?</h4>
              <p className="text-gray-600">Las clases inician a las 7:20 AM y finalizan a las 3:30 PM de lunes a viernes. Los horarios pueden variar según el nivel educativo.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">¿Ofrecen transporte escolar?</h4>
              <p className="text-gray-600">Sí, contamos con servicio de transporte escolar que cubre diferentes rutas de la ciudad. Puedes consultar disponibilidad y tarifas en secretaría.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">¿Cuándo inician las inscripciones para el próximo año?</h4>
              <p className="text-gray-600">Las inscripciones para el año 2026 están abiertas desde octubre de 2025. Te recomendamos inscribirte pronto para asegurar tu cupo.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">¿Qué actividades extracurriculares ofrecen?</h4>
              <p className="text-gray-600">Ofrecemos deportes (fútbol, baloncesto, voleibol), artes (música, teatro, danza), robótica, inglés avanzado y grupos pastorales.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">¿Cómo puedo acceder a las plataformas virtuales?</h4>
              <p className="text-gray-600">Los estudiantes y padres reciben credenciales de acceso a Cibercolegios y otras plataformas al momento de la matrícula. Para soporte técnico, contacta al área de sistemas.</p>
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
                  Pagos PSE
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
            © 2025 Colegio Nuevo San Luis Gonzaga. Todos los derechos reservados.
            </p>
          </div>
          {/* Botón de administración centrado debajo de los derechos reservados */}
          <div className="flex justify-center mt-6">
            <Link
              href="/admin"
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-full font-semibold transition-colors text-center"
            >
              Ingreso como administrador
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}