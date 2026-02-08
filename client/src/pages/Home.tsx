import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Swords, Trophy, Users, Zap, ArrowRight, Hash, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getModeAsset } from "@/lib/utils";

function normalizeTag(raw: string): string {
  // Remove espaços, converte para maiúsculas, remove o # inicial e substitui O por 0
  return raw.trim().toUpperCase().replace(/^#/, "").replace(/\s+/g, "").replace(/O/g, "0");
}

export default function Home() {
  const [, navigate] = useLocation();
  const [searchTag, setSearchTag] = useState("");
  const [searchType, setSearchType] = useState<"player" | "club">("player");

  const eventsQuery = trpc.brawl.events.useQuery(undefined, { staleTime: 600_000 });

  const handleSearch = () => {
    const tag = normalizeTag(searchTag);
    if (!tag || tag.length < 3) {
      toast.error("Digite uma tag válida (mínimo 3 caracteres)");
      return;
    }
    
    // Validação básica de caracteres permitidos em tags do Brawl Stars
    if (!/^[0289PYLQGRJCUV]{3,15}$/.test(tag)) {
      toast.warning("A tag parece conter caracteres inválidos, mas tentaremos buscar mesmo assim.");
    }

    if (searchType === "player") {
      navigate(`/player/${tag}`);
    } else {
      navigate(`/club/${tag}`);
    }
  };

  const activeEvents = eventsQuery.data?.active || [];

  return (
    <div className="brawl-gradient min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              <img 
                src="/assets/colette_happy.png" 
                alt="Colette Happy" 
                className="relative h-24 w-24 md:h-32 md:w-32 object-contain drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]"
              />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-wide brawl-text-gradient mb-4 uppercase">
            BRAWL LOOKUP
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto font-medium">
            Consulte perfis de jogadores, clubes, rankings e acompanhe seus favoritos no Brawl Stars.
          </p>

          {/* Search Box */}
          <div className="brawl-card p-6 max-w-xl mx-auto border-primary/20 shadow-2xl shadow-primary/5">
            <div className="flex gap-2 mb-4">
              <Button
                variant={searchType === "player" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("player")}
                className="flex-1 font-bold uppercase tracking-wider"
              >
                <Swords className="h-4 w-4 mr-2" />
                Jogador
              </Button>
              <Button
                variant={searchType === "club" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("club")}
                className="flex-1 font-bold uppercase tracking-wider"
              >
                <Users className="h-4 w-4 mr-2" />
                Clube
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchType === "player" ? "Ex: P90RJJY0Y" : "Ex: 2LQRR9J"}
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 bg-background/50 border-border/50 h-12 text-base font-bold uppercase"
                />
              </div>
              <Button onClick={handleSearch} size="lg" className="px-6 font-bold bg-primary hover:bg-primary/90">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 font-bold uppercase tracking-widest">
              Digite a tag sem o # — exemplo: P90RJJY0Y
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Card
            className="brawl-card cursor-pointer group hover:border-brawl-yellow/50 transition-all"
            onClick={() => navigate("/rankings")}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brawl-yellow/15 flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6 text-brawl-yellow" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm uppercase">Rankings</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Top Global</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brawl-yellow transition-colors" />
            </CardContent>
          </Card>
          <Card
            className="brawl-card cursor-pointer group hover:border-brawl-purple-light/50 transition-all"
            onClick={() => navigate("/events")}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brawl-purple/15 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-brawl-purple-light" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm uppercase">Eventos</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Mapas Ativos</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brawl-purple-light transition-colors" />
            </CardContent>
          </Card>
          <Card
            className="brawl-card cursor-pointer group hover:border-brawl-blue/50 transition-all"
            onClick={() => navigate("/seasons")}
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brawl-blue/15 flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6 text-brawl-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm uppercase">Temporadas</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Brawl Pass</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brawl-blue transition-colors" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Active Events Preview */}
      {activeEvents.length > 0 && (
        <section className="container pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl tracking-wide text-foreground uppercase">
                EVENTOS ATIVOS
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/events")} className="text-primary font-bold uppercase text-xs">
                Ver todos <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {activeEvents.slice(0, 8).map((event: any, i: number) => (
                <div key={i} className="brawl-card p-3 text-center bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-pointer" onClick={() => navigate("/events")}>
                  <div
                    className="h-10 w-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: event.mode?.color || "#9ab1fd" }}
                  >
                    <img 
                      src={getModeAsset(event.mode?.id)} 
                      alt="" 
                      className="h-6 w-6 object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = event.mode?.imageUrl || "";
                      }}
                    />
                  </div>
                  <p className="text-[10px] font-bold truncate uppercase">{event.mode?.name || "Evento"}</p>
                  <p className="text-[9px] text-muted-foreground truncate uppercase font-bold">
                    {event.map?.name || "Mapa"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
