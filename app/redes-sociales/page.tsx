'use client';

import { useEffect, useState } from "react";

type SocialPost = {
  id: string;
  url: string;
  type: "instagram" | "tiktok" | "facebook" | "youtube";
  title?: string;
  fecha?: string;
};

const SOCIALS = [
  { type: "instagram", label: "Instagram" },
  { type: "tiktok", label: "TikTok" },
  { type: "facebook", label: "Facebook" },
  { type: "youtube", label: "YouTube" },
];

export default function RedesSociales() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetch("/api/social-posts")
      .then(res => res.json())
      .then(data => {
        // Ordenar por fecha descendente
        if (Array.isArray(data)) {
          setPosts([...data].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')));
        } else {
          setPosts([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Carrusel handlers
  const handlePrev = (type: string, count: number) => {
    setActiveIndex(idx => ({
      ...idx,
      [type]: typeof idx[type] === "number"
        ? (idx[type] - 1 + count) % count
        : 0
    }));
  };
  const handleNext = (type: string, count: number) => {
    setActiveIndex(idx => ({
      ...idx,
      [type]: typeof idx[type] === "number"
        ? (idx[type] + 1) % count
        : 0
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-900 to-blue-700 text-white text-center shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Redes Sociales</h1>
          <p className="text-lg text-blue-100 mb-6">
            Descubre nuestras publicaciones y actividades en Instagram, TikTok, Facebook y YouTube.
          </p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {SOCIALS.map(social => {
              const filtered = posts.filter(p => p.type === social.type);
              const idx = activeIndex[social.type] ?? 0;
              return (
                <div key={social.type}>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">{social.label}</h2>
                  <div className="space-y-6">
                    {loading ? (
                      <div className="text-blue-900">Cargando...</div>
                    ) : filtered.length === 0 ? (
                      <div className="text-gray-500">No hay publicaciones aún.</div>
                    ) : (
                      <div className="relative">
                        <div>
                          <div className="flex justify-center">
                            <div className="w-full">
                              <SocialEmbed url={filtered[idx].url} type={filtered[idx].type} />
                            </div>
                          </div>
                          {filtered[idx].title && (
                            <div className="font-semibold text-blue-900 mt-2 text-center">{filtered[idx].title}</div>
                          )}
                          {filtered[idx].fecha && (
                            <div className="text-xs text-gray-500 text-center">{filtered[idx].fecha}</div>
                          )}
                        </div>
                        {filtered.length > 1 && (
                          <div className="flex justify-center items-center gap-4 mt-4">
                            <button
                              className="px-3 py-1 bg-blue-900 text-white rounded-full font-bold hover:bg-blue-800 transition"
                              onClick={() => handlePrev(social.type, filtered.length)}
                              aria-label="Anterior"
                            >
                              &#8592;
                            </button>
                            <span className="text-blue-900 font-bold">{idx + 1} / {filtered.length}</span>
                            <button
                              className="px-3 py-1 bg-blue-900 text-white rounded-full font-bold hover:bg-blue-800 transition"
                              onClick={() => handleNext(social.type, filtered.length)}
                              aria-label="Siguiente"
                            >
                              &#8594;
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// Embeds para cada red social
function SocialEmbed({ url, type }: { url: string; type: string }) {
  // Si es código de inserción (contiene <blockquote ...), usar dangerouslySetInnerHTML
  if (url.trim().startsWith("<blockquote")) {
    return (
      <div
        className="w-full min-h-[360px] rounded-lg border-0"
        dangerouslySetInnerHTML={{ __html: url }}
      />
    );
  }
  // Fallback: mostrar link
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline block text-center">
      Ver publicación
    </a>
  );
}
  return match ? match[1] : "";
}
