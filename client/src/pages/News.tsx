import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Star, Zap, TrendingUp } from "lucide-react";

const YOUTUBE_VIDEOS = [
  {
    id: "Q5x5d8YVURo",
    title: "Big Update Dropped Today! | Brawlentines Season",
    author: "Rey - Brawl Stars",
    thumbnail: "https://img.youtube.com/vi/Q5x5d8YVURo/mqdefault.jpg"
  },
  {
    id: "c-AubqGiBts",
    title: "Trophy System is Getting REWORKED",
    author: "KairosTime Gaming",
    thumbnail: "https://img.youtube.com/vi/c-AubqGiBts/mqdefault.jpg"
  },
  {
    id: "zORczereG9M",
    title: "The BEST & WORST Brawlers in 2026! | Pro Tier List!",
    author: "SpenLC - Brawl Stars",
    thumbnail: "https://img.youtube.com/vi/zORczereG9M/mqdefault.jpg"
  },
  {
    id: "U2PA1A2NWwM",
    title: "NEW Brawler Meta Tier List - 2026",
    author: "AshBS",
    thumbnail: "https://img.youtube.com/vi/U2PA1A2NWwM/mqdefault.jpg"
  }
];

export default function News() {
  const eventsQuery = trpc.brawl.events.useQuery();

  return (
    <div className="container py-6">
      <h1 className="font-display text-2xl md:text-3xl tracking-wide brawl-text-gradient mb-6">
        NOVIDADES DO GAME
      </h1>

      {/* YouTube Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Play className="h-5 w-5 text-red-500" />
          <h2 className="font-display text-lg tracking-wide">VÍDEOS E GUIAS</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {YOUTUBE_VIDEOS.map((video) => (
            <a 
              key={video.id} 
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="brawl-card overflow-hidden group hover:border-primary/50 transition-all"
            >
              <div className="relative aspect-video">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                    <Play className="h-5 w-5 text-white fill-white" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-[10px] text-muted-foreground">{video.author}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Meta & Updates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-brawl-green" />
            <h2 className="font-display text-lg tracking-wide">META ATUAL</h2>
          </div>
          <div className="space-y-3">
            <Card className="brawl-card p-4">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Nova Temporada: Brawlentines 2026</h3>
                  <p className="text-sm text-muted-foreground">
                    A nova temporada chegou com novos brawlers e balanceamentos importantes. Confira os melhores brawlers para subir troféus este mês.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="brawl-card p-4">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-brawl-yellow/10 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6 text-brawl-yellow" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Rework no Sistema de Troféus</h3>
                  <p className="text-sm text-muted-foreground">
                    A Supercell anunciou mudanças drásticas no ganho e perda de troféus para tornar o jogo mais competitivo e justo.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-brawl-blue" />
            <h2 className="font-display text-lg tracking-wide">EVENTOS ATIVOS</h2>
          </div>
          <div className="space-y-2">
            {eventsQuery.isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)
            ) : (
              eventsQuery.data?.active?.slice(0, 4).map((event: any, i: number) => (
                <div key={i} className="brawl-card p-3 flex items-center gap-3">
                  <img 
                    src={event.mode?.imageUrl} 
                    alt="" 
                    className="h-8 w-8 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{event.map?.name}</p>
                    <p className="text-[10px] text-muted-foreground">{event.mode?.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
