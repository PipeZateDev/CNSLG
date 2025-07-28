'use client';

import { useState } from 'react';
import Link from 'next/link';

function AdminAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsers = ['Admin', 'admin', 'Soporte', 'soporte'];
    if (validUsers.includes(user.trim()) && pass === 'Admin.2024') {
      setAuthenticated(true);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs flex flex-col items-center">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Acceso Administrador</h2>
          <form onSubmit={handleAccess} className="w-full flex flex-col items-center">
            <input
              type="text"
              placeholder="Usuario"
              className="mb-3 px-4 py-2 rounded border border-gray-300 w-full text-black"
              value={user}
              onChange={e => setUser(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="mb-3 px-4 py-2 rounded border border-gray-300 w-full text-black"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-full font-semibold transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Admin() {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-white">
        <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
          <div className="px-6 py-4">
            <span className="font-bold text-blue-900">Panel de Administración</span>
          </div>
        </nav>
        <main className="pt-24 max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Bienvenido al panel de administración</h1>
        </main>
      </div>
    </AdminAuth>
  );
}
