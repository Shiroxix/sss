import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Users, Swords, Medal, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const COUNTRIES = [
  { value: "global", label: "Global" },
  { value: "br", label: "Brasil" },
  { value: "us", label: "EUA" },
  { value: "de", label: "Alemanha" },
  { value: "fr", label: "França" },
  { value: "es", label: "Espanha" },
  { value: "jp", label: "Japão" },
  { value: "kr", label: "Coreia do Sul" },
  { value: "cn", label: "China" },
  { value: "mx", label: "México" },
  { value: "ar", label: "Argentina" },
  { value: "gb", label: "Reino Unido" },
  { value: "ru", label: "Rússia" },
  { value: "tr", label: "Turquia" },
];

function formatNumber(n: number): string {
  return n?.toLocaleString("pt-BR") ?? "0";
}

export default function Rankings() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState("players");
  const [country, setCountry] = useState("global");
  const [selectedBrawler, setSelectedBrawler] = useState<string>("16000000"); // Shelly default

  const playersQuery = trpc.brawl.rankings.useQuery(
    { type: "players", country },
    { enabled: tab === "players", staleTime: 300_000 }
  );

  const clubsQuery = trpc.brawl.rankings.useQuery(
    { type: "clubs", country },
    { enabled: tab === "clubs", staleTime: 300_000 }
  );

  const brawlerRankQuery = trpc.brawl.brawlerRankings.useQuery(
    { brawlerId: selectedBrawler, country },
    { enabled: tab === "brawlers", staleTime: 300_000 }
  );

  const brawlersQuery = trpc.brawl.brawlers.useQuery(undefined, {
    staleTime: 3_600_000,
  });

  const brawlersList = useMemo(() => {
    const list = brawlersQuery.data?.list || [];
    return [...list].sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [brawlersQuery.data]);

  const isEmpty = useMemo(() => {
    if (tab === "players") return !playersQuery.isLoading && (!playersQuery.data?.items || playersQuery.data.items.length === 0);
    if (tab === "clubs") return !clubsQuery.isLoading && (!clubsQuery.data?.items || clubsQuery.data.items.length === 0);
    if (tab === "brawlers") return !brawlerRankQuery.isLoading && (!brawlerRankQuery.data?.items || brawlerRankQuery.data.items.length === 0);
    return false;
  }, [tab, playersQuery, clubsQuery, brawlerRankQuery]);

  return (
    <div className="container py-6">
      <h1 className="font-display text-2xl md:text-3xl tracking-wide brawl-text-gradient mb-6 uppercase">
        Rankings Mundiais
      </h1>

      {isEmpty && (
        <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aviso de API</AlertTitle>
          <AlertDescription>
            Os rankings requerem um <strong>BRAWL_TOKEN</strong> válido no arquivo .env para serem carregados da API oficial da Supercell.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList className="w-full justify-start overflow-x-auto bg-secondary/30 p-1">
            <TabsTrigger value="players" className="flex items-center gap-2 font-bold">
              <Trophy className="h-4 w-4" /> Jogadores
            </TabsTrigger>
            <TabsTrigger value="clubs" className="flex items-center gap-2 font-bold">
              <Users className="h-4 w-4" /> Clubes
            </TabsTrigger>
            <TabsTrigger value="brawlers" className="flex items-center gap-2 font-bold">
              <Swords className="h-4 w-4" /> Brawlers
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          {tab === "brawlers" && (
            <Select value={selectedBrawler} onValueChange={setSelectedBrawler}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary/30 border-none font-bold">
                <SelectValue placeholder="Brawler" />
              </SelectTrigger>
              <SelectContent>
                {brawlersList.map((b: any) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full sm:w-48 bg-secondary/30 border-none font-bold">
              <SelectValue placeholder="País" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List Display */}
      <div className="brawl-card overflow-hidden">
        {tab === "players" && (
          <RankList 
            data={playersQuery.data?.items} 
            isLoading={playersQuery.isLoading} 
            onItemClick={(tag) => navigate(`/player/${tag.replace("#", "")}`)}
            type="player"
          />
        )}

        {tab === "clubs" && (
          <RankList 
            data={clubsQuery.data?.items} 
            isLoading={clubsQuery.isLoading} 
            onItemClick={(tag) => navigate(`/club/${tag.replace("#", "")}`)}
            type="club"
          />
        )}

        {tab === "brawlers" && (
          <RankList 
            data={brawlerRankQuery.data?.items} 
            isLoading={brawlerRankQuery.isLoading} 
            onItemClick={(tag) => navigate(`/player/${tag.replace("#", "")}`)}
            type="player"
          />
        )}
      </div>
    </div>
  );
}

function RankList({ data, isLoading, onItemClick, type }: { data: any[], isLoading: boolean, onItemClick: (tag: string) => void, type: "player" | "club" }) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p className="font-bold uppercase tracking-widest">Nenhum dado disponível</p>
        <p className="text-xs mt-2">Verifique o token da API no servidor.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {data.map((item: any, i: number) => (
        <div
          key={item.tag}
          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/20 transition-colors"
          onClick={() => onItemClick(item.tag)}
        >
          <div className="w-10 text-center">
            {i < 3 ? (
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${
                i === 0 ? "bg-brawl-yellow text-black" : i === 1 ? "bg-slate-300 text-black" : "bg-brawl-orange text-white"
              }`}>
                <Medal className="h-5 w-5" />
              </div>
            ) : (
              <span className="font-display text-lg text-muted-foreground">#{i + 1}</span>
            )}
          </div>
          
          {type === "player" && (
            <div className="h-10 w-10 rounded-lg overflow-hidden bg-secondary shrink-0">
              {item.icon?.id ? (
                <img
                  src={`https://cdn.brawlify.com/profile-icons/regular/${item.icon.id}.png`}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate" style={{ color: item.nameColor ? `#${item.nameColor.slice(2)}` : 'inherit' }}>
              {item.name}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">{item.tag}</span>
              {type === "player" && item.club?.name && (
                <>
                  <span className="text-muted-foreground text-[10px]">•</span>
                  <span className="text-[10px] text-brawl-blue font-bold truncate">{item.club.name}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg">
            <Trophy className="h-4 w-4 text-brawl-yellow" />
            <span className="font-display text-sm">{formatNumber(item.trophies)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
