'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Admisiones() {
  const [showInscriptionForm, setShowInscriptionForm] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    birthDate: '',
    grade: '',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    previousSchool: '',
    comments: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentName || !formData.birthDate || !formData.grade || !formData.parentName || !formData.phone || !formData.email) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    alert('Solicitud de inscripción enviada exitosamente. Nos pondremos en contacto pronto.');

    setFormData({
      studentName: '',
      birthDate: '',
      grade: '',
      parentName: '',
      phone: '',
      email: '',
      address: '',
      previousSchool: '',
      comments: ''
    });

    setShowInscriptionForm(false);
  };

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
              <Link 
                href="/"
                className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-full transition-colors whitespace-nowrap cursor-pointer"
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
                className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                Admisiones
              </Link>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  UNOi Santillana
                </a>
                <a 
                  href="https://www.cibercolegios.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cibercolegios
                </a>
                <a 
                  href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=12695&searchedCategoryId=&searchedAgreementName=PEDAGOGICOS%20ASOCIADOS%20SAS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  PSE - Pagos en Línea
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
                  className="px-4 py-2 bg-blue-900 text-white rounded-full transition-colors text-center cursor-pointer"
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
                    PSE - Pagos en Línea
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
      <section className="pt-24 pb-12 bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Admisiones</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Únete a nuestra comunidad educativa y forma parte de una tradición de excelencia académica
          </p>
        </div>
      </section>

      {/* Niveles Educativos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Niveles Educativos</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-bear-smile-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Preescolar</h3>
              <p className="text-gray-600 mb-4">Jardín y Transición para niños de 4 a 5 años</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Desarrollo integral</li>
                <li>• Metodología lúdica</li>
                <li>• Estimulación temprana</li>
                <li>• Adaptación escolar</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-book-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Primaria</h3>
              <p className="text-gray-600 mb-4">Grados 1° a 5° con educación personalizada</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Bilingüe (español-inglés)</li>
                <li>• Tecnología educativa</li>
                <li>• Formación en valores</li>
                <li>• Desarrollo de competencias</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-graduation-cap-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">Bachillerato</h3>
              <p className="text-gray-600 mb-4">Grados 6° a 11° con énfasis académico</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Preparación universitaria</li>
                <li>• Énfasis en ciencias</li>
                <li>• Liderazgo estudiantil</li>
                <li>• Proyectos de investigación</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Académicos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Servicios Académicos</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-global-line text-blue-600"></i>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Educación Bilingüe</h4>
              <p className="text-sm text-gray-600">Inglés intensivo desde preescolar con certificaciones internacionales</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-computer-line text-green-600"></i>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Tecnología</h4>
              <p className="text-sm text-gray-600">Laboratorios modernos, aulas digitales y plataformas virtuales</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-football-line text-purple-600"></i>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Deportes</h4>
              <p className="text-sm text-gray-600">Fútbol, voleibol, baloncesto y atletismo</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-music-line text-orange-600"></i>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Artes</h4>
              <p className="text-sm text-gray-600">Música, teatro, danza y artes plásticas</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-microscope-line text-red-600"></i>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Laboratorios</h4>
              <p className="text-sm text-gray-600">Ciencias naturales, física, química y biología</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-book-open-line text-indigo-600"></i>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Biblioteca</h4>
              <p className="text-sm text-gray-600">Amplio centro de recursos con bibliografía especializada</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-user-heart-line text-yellow-600"></i>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Psicología</h4>
              <p className="text-sm text-gray-600">Acompañamiento psicopedagógico integral</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-restaurant-line text-teal-600"></i>
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Cafetería</h4>
              <p className="text-sm text-gray-600">Alimentación saludable y balanceada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso de Admisión */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Proceso de Admisión</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Solicitud</h4>
              <p className="text-sm text-gray-600">Completa el formulario de inscripción con todos los datos solicitados</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Documentos</h4>
              <p className="text-sm text-gray-600">Entrega los documentos requeridos según el nivel educativo</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Entrevista</h4>
              <p className="text-sm text-gray-600">Entrevista con el estudiante y los padres de familia</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Matrícula</h4>
              <p className="text-sm text-gray-600">Formaliza la matrícula y bienvenida a la familia gonzaguista</p>
            </div>
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Requisitos de Admisión</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Documentos Requeridos</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <i className="ri-check-line text-green-600 mr-2 mt-1"></i>
                  Registro civil de nacimiento (original)
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-600 mr-2 mt-1"></i>
                  Fotocopia de la cédula de ciudadanía de los padres
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-600 mr-2 mt-1"></i>
                  Certificado médico actualizado
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-600 mr-2 mt-1"></i>
                  Carnet de vacunas al día
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-600 mr-2 mt-1"></i>
                  Boletín de calificaciones del último año cursado
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-600 mr-2 mt-1"></i>
                  Certificado de comportamiento del colegio anterior
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-600 mr-2 mt-1"></i>
                  3 fotos tamaño 3x4 fondo blanco
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Fechas Importantes</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center">
                  <i className="ri-calendar-line text-blue-600 mr-3"></i>
                  <div>
                    <p className="font-semibold">Inscripciones Abiertas</p>
                    <p className="text-sm text-gray-600">Julio - Diciembre 2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="ri-calendar-line text-blue-600 mr-3"></i>
                  <div>
                    <p className="font-semibold">Entrevistas</p>
                    <p className="text-sm text-gray-600">Julio - Febrero 2026</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="ri-calendar-line text-blue-600 mr-3"></i>
                  <div>
                    <p className="font-semibold">Matrículas</p>
                    <p className="text-sm text-gray-600">Agosto - Abril 2026</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="ri-calendar-line text-blue-600 mr-3"></i>
                  <div>
                    <p className="font-semibold">Inicio de Clases</p>
                    <p className="text-sm text-gray-600">Febrero 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Inscripción */}
<section className="py-20 bg-blue-900 text-white">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-6">¿Listo para unirte a nuestra familia Gonzaguista?</h2>
    <p className="text-xl text-blue-200 mb-8">
      Completa tu solicitud de inscripción y da el primer paso hacia una educación de excelencia
    </p>
    <a
      href="https://appsprod.cibercolegios.com/ciber_enroll/?institutionId=95"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 rounded-full font-semibold text-lg transition-colors whitespace-nowrap cursor-pointer"
    >
      Solicitar Inscripción Ahora
    </a>
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
