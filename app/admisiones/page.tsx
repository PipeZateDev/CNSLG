'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Admisiones() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              <Link href="/" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors">
                Inicio
              </Link>
              <Link href="/nosotros" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors">
                Nosotros
              </Link>
              <Link href="/admisiones" className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors">
                Admisiones
              </Link>
              <Link href="/contacto" className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors">
                Contacto
              </Link>
              <div className="flex space-x-2 ml-8">
                <a href="https://lms30.uno-internacional.com/login/access" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                  UNOi Santillana
                </a>
                <a href="https://www.cibercolegios.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors">
                  Cibercolegios
                </a>
                <a href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  PSE - Pagos en Línea
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="lg:hidden w-10 h-10 flex items-center justify-center text-blue-900">
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Inicio</Link>
                <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Nosotros</Link>
                <Link href="/admisiones" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors text-center cursor-pointer">Admisiones</Link>
                <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors text-center cursor-pointer">Contacto</Link>
                <div className="flex flex-col space-y-2">
                  <a href="https://lms30.uno-internacional.com/login/access" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-center">
                    UNOi Santillana
                  </a>
                  <a href="https://www.cibercolegios.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors text-center">
                    Cibercolegios
                  </a>
                  <a href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-center">
                    PSE - Pagos en Línea
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-900 mb-8">
          Admisiones
        </h1>
        <div className="max-w-3xl mx-auto text-lg text-gray-700 space-y-4">
          <p>
            Bienvenido a la sección de admisiones del Colegio Nuevo San Luis Gonzaga. Aquí encontrarás toda la información necesaria sobre nuestro proceso de admisión, requisitos y fechas importantes.
          </p>
          <p>
            Nuestro colegio ofrece una educación de alta calidad, con un enfoque en el desarrollo integral de nuestros estudiantes. Contamos con un equipo de docentes altamente capacitados y comprometidos con la formación académica y personal de cada niño.
          </p>
          <p>
            Si estás interesado en que tu hijo forme parte de nuestra comunidad educativa, te invitamos a seguir leyendo para conocer más sobre el proceso de admisión.
          </p>
        </div>

        {/* Admission Process Section */}
        <div className="mt-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-6">
            Proceso de Admisión
          </h2>
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>
                <span className="font-semibold text-blue-900">Solicitud de Inscripción:</span> Completa el formulario de solicitud de inscripción en línea a través de nuestro sitio web.
              </li>
              <li>
                <span className="font-semibold text-blue-900">Documentación Requerida:</span> Adjunta los documentos solicitados, como copia del documento de identidad, fotos recientes y certificados académicos anteriores.
              </li>
              <li>
                <span className="font-semibold text-blue-900">Entrevista Personal:</span> Programa una entrevista personal con el equipo de admisiones del colegio.
              </li>
              <li>
                <span className="font-semibold text-blue-900">Evaluación Académica:</span> Dependiendo del grado al que desees postular, se realizará una evaluación académica.
              </li>
              <li>
                <span className="font-semibold text-blue-900">Notificación de Aceptación:</span> Recibirás una notificación por correo electrónico sobre la decisión de admisión.
              </li>
              <li>
                <span className="font-semibold text-blue-900">Matrícula:</span> Realiza el pago de la matrícula y completa el proceso de inscripción.
              </li>
            </ol>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mt-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-6">
            Requisitos de Admisión
          </h2>
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>Copia del documento de identidad del estudiante.</li>
              <li>Fotos recientes del estudiante.</li>
              <li>Certificados académicos anteriores (si aplica).</li>
              <li>Informe de comportamiento y recomendaciones de la institución educativa anterior.</li>
              <li>Realizar el pago de la tarifa de inscripción.</li>
            </ul>
          </div>
        </div>

        {/* Important Dates Section */}
        <div className="mt-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-6">
            Fechas Importantes
          </h2>
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              A continuación, algunas fechas importantes que debes tener en cuenta:
            </p>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>
                <span className="font-semibold text-blue-900">Apertura de Inscripciones:</span> 1 de octubre de 2025
              </li>
              <li>
                <span className="font-semibold text-blue-900">Cierre de Inscripciones:</span> 15 de noviembre de 2025
              </li>
              <li>
                <span className="font-semibold text-blue-900">Entrevistas:</span> Del 20 al 30 de noviembre de 2025
              </li>
              <li>
                <span className="font-semibold text-blue-900">Publicación de Resultados:</span> 5 de diciembre de 2025
              </li>
              <li>
                <span className="font-semibold text-blue-900">Matrícula Abierta:</span> Del 6 al 20 de diciembre de 2025
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/nosotros" className="text-gray-400 hover:text-white transition-colors">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/admisiones" className="text-gray-400 hover:text-white transition-colors">
                    Admisiones
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  <i className="ri-map-pin-line"></i> Calle Falsa 123, Bogotá, Colombia
                </li>
                <li className="text-gray-400">
                  <i className="ri-mail-line"></i> info@colegionuevosanluisgonzaga.edu.co
                </li>
                <li className="text-gray-400">
                  <i className="ri-phone-line"></i> +57 1 2345678
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="ri-facebook-line"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="ri-instagram-line"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="ri-twitter-line"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="ri-youtube-line"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
              <p className="text-gray-400 text-sm">
                © 2025 Colegio Nuevo San Luis Gonzaga. Todos los derechos reservados.
              </p>
              <div className="mt-2">
                <Link href="/admin" className="underline hover:text-blue-300">
                  Ingresar al panel de administración
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}