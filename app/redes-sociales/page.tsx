'use client';

import { useEffect, useState } from "react";

type SocialPost = {
  id: string;
  url: string;
  type: "instagram" | "tiktok" | "facebook" | "youtube";
  title?: string;
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

  useEffect(() => {
    fetch("/api/social-posts")
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
            {SOCIALS.map(social => (
              <div key={social.type}>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">{social.label}</h2>
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-blue-900">Cargando...</div>
                  ) : (
                    posts.filter(p => p.type === social.type).length === 0 ? (
                      <div className="text-gray-500">No hay publicaciones aún.</div>
                    ) : (
                      posts
                        .filter(p => p.type === social.type)
                        .map(post => (
                          <div key={post.id} className="rounded-lg shadow bg-gray-50 p-4">
                            {post.title && (
                              <div className="font-semibold text-blue-900 mb-2">{post.title}</div>
                            )}
                            <SocialEmbed url={post.url} type={post.type} />
                          </div>
                        ))
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SocialEmbed({ url, type }: { url: string; type: string }) {
  // Basic embed for each network
  if (type === "instagram") {
    return (
      <iframe
        src={`https://www.instagram.com/p/${extractInstagramId(url)}/embed`}
        className="w-full min-h-[480px] rounded-lg border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        loading="lazy"
      ></iframe>
    );
  }
  if (type === "tiktok") {
    return (
      <iframe
        src={`https://www.tiktok.com/embed/${extractTikTokId(url)}`}
        className="w-full min-h-[480px] rounded-lg border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        loading="lazy"
      ></iframe>
    );
  }
  if (type === "facebook") {
    return (
      <iframe
        src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`}
        className="w-full min-h-[480px] rounded-lg border-0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      ></iframe>
    );
  }
  if (type === "youtube") {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${extractYouTubeId(url)}`}
        className="w-full min-h-[360px] aspect-video rounded-lg border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        loading="lazy"
      ></iframe>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
      Ver publicación
    </a>
  );
}

// Helpers to extract IDs from URLs
function extractInstagramId(url: string) {
  const match = url.match(/instagram\.com\/p\/([^\/\?\&]+)/i);
  return match ? match[1] : "";
}
function extractTikTokId(url: string) {
  const match = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/i);
  return match ? match[1] : "";
}
function extractYouTubeId(url: string) {
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}
