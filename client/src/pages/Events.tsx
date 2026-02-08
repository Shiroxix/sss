import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Calendar } from "lucide-react";
import { getMapAsset, getModeAsset } from "@/lib/utils";

function formatTimeRemaining(endTime: string): string {
  const end = new Date(endTime);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return "Encerrado";
  const hours = Math.floor(diffMs / 3_600_000);
  const mins = Math.floor((diffMs % 3_600_000) / 60_000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${mins}m`;
}

function EventCard({ event, upcoming = false }: { event: any; upcoming?: boolean }) {
  const mode = event.mode || {};
  const map = event.map || {};
  const modeColor = mode.color || "#9ab1fd";

  return (
    <div className="brawl-card p-0 overflow-hidden flex flex-col sm:flex-row">
      {/* Map Image Background */}
      <div className="relative h-32 sm:h-auto sm:w-40 shrink-0 bg-muted overflow-hidden">
        <img 
          src={getMapAsset(map.id)} 
          alt={map.name}
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x200/1a1a1a/ffffff?text=Mapa";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent sm:bg-gradient-to-r" />
        <div className="absolute bottom-2 left-2 sm:top-2 sm:left-2">
          <div 
            className="h-10 w-10 rounded-lg flex items-center justify-center bg-background/80 backdrop-blur-sm border border-white/10"
          >
            <img
              src={getModeAsset(mode.id)}
              alt={mode.name}
              className="h-7 w-7 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = mode.imageUrl || "";
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: modeColor }}>
            {mode.name || "Modo"}
          </h3>
          {upcoming && (
            <Badge variant="secondary" className="text-[10px] uppercase">Em breve</Badge>
          )}
        </div>
        <p className="text-lg text-foreground font-display tracking-wide truncate">{map.name || "Mapa"}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            {upcoming
              ? `Começa em ${formatTimeRemaining(event.startTime)}`
              : `Termina em ${formatTimeRemaining(event.endTime)}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const eventsQuery = trpc.brawl.events.useQuery(undefined, { staleTime: 600_000 });

  if (eventsQuery.isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const active = eventsQuery.data?.active || [];
  const upcoming = eventsQuery.data?.upcoming || [];

  return (
    <div className="container py-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl tracking-wide brawl-text-gradient">
          EVENTOS E ROTAÇÃO
        </h1>
      </div>

      {/* Active Events */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-2 w-2 rounded-full bg-brawl-green animate-pulse" />
          <h2 className="font-display text-lg tracking-wide uppercase">ATIVOS AGORA</h2>
          <Badge variant="outline" className="ml-auto">{active.length} EVENTOS</Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {active.map((event: any, i: number) => (
            <EventCard key={i} event={event} />
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-2 w-2 rounded-full bg-brawl-blue" />
            <h2 className="font-display text-lg tracking-wide uppercase">PRÓXIMOS EVENTOS</h2>
            <Badge variant="outline" className="ml-auto">{upcoming.length} AGENDADOS</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcoming.map((event: any, i: number) => (
              <EventCard key={i} event={event} upcoming />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
