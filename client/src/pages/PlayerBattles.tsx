import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Swords, Trophy, Crown, Skull, Star, Clock, User } from "lucide-react";
import { getBrawlerPin } from "@/lib/utils";
import { motion } from "framer-motion";

function timeAgo(dateStr: string | undefined | null): string {
  if (!dateStr) return "Desconhecido";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  } catch (e) {
    return "Recentemente";
  }
}

function resultColor(result: string | undefined | null): string {
  if (result === "victory") return "text-brawl-green";
  if (result === "defeat") return "text-brawl-red";
  return "text-brawl-yellow";
}

function resultBg(result: string | undefined | null): string {
  if (result === "victory") return "bg-brawl-green/10";
  if (result === "defeat") return "bg-brawl-red/10";
  return "bg-brawl-yellow/10";
}

function resultIcon(result: string | undefined | null) {
  if (result === "victory") return Crown;
  if (result === "defeat") return Skull;
  return Star;
}

function resultLabel(result: string | undefined | null): string {
  if (result === "victory") return "Vitória";
  if (result === "defeat") return "Derrota";
  return "Empate";
}

export default function PlayerBattles() {
  const { tag } = useParams<{ tag: string }>();
  const [, navigate] = useLocation();

  const battlelogQuery = trpc.brawl.battlelog.useQuery(
    { tag: tag || "" },
    { enabled: Boolean(tag), retry: 1 }
  );

  if (battlelogQuery.isLoading) {
    return (
      <div className="container py-8 space-y-4">
        <Skeleton className="h-10 w-48 mb-6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const battles = battlelogQuery.data?.items || [];

  return (
    <motion.div 
      className="container py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/player/${tag}`)} className="font-bold uppercase text-xs tracking-widest">
            <ArrowLeft className="h-4 w-4 mr-2" /> Perfil
          </Button>
          <h1 className="font-display text-2xl tracking-wide uppercase">
            Histórico de Batalhas
          </h1>
        </div>
        <Badge variant="outline" className="font-mono text-xs opacity-50 border-primary/30">#{tag}</Badge>
      </div>

      {battles.length === 0 ? (
        <div className="brawl-card p-12 text-center bg-secondary/5 border-none">
          <Swords className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest">Nenhuma batalha recente encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {battles.map((battle: any, i: number) => {
            const event = battle.event || {};
            const b = battle.battle || {};
            const result = b.result;
            const ResultIcon = resultIcon(result);
            const trophyChange = b.trophyChange;

            // Find the player's brawler
            let playerBrawler: any = null;
            const teams = b.teams || [];
            const players = b.players || [];
            const allPlayers = [...players];
            if (Array.isArray(teams)) {
              teams.forEach((team: any[]) => {
                if (Array.isArray(team)) {
                  team.forEach((p: any) => allPlayers.push(p));
                }
              });
            }
            playerBrawler = allPlayers.find(
              (p: any) => p.tag?.replace("#", "") === tag?.toUpperCase()
            )?.brawler;

            return (
              <motion.div 
                key={i} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`brawl-card p-0 overflow-hidden border-none ${resultBg(result)} group hover:bg-opacity-20 transition-all`}
              >
                <div className="flex items-stretch">
                  {/* Result Indicator Bar */}
                  <div className={`w-1.5 ${result === 'victory' ? 'bg-brawl-green' : result === 'defeat' ? 'bg-brawl-red' : 'bg-brawl-yellow'}`} />
                  
                  <div className="flex-1 p-4 flex flex-col sm:flex-row items-center gap-4">
                    {/* Left: Result & Brawler */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-background/40 ${resultColor(result)}`}>
                        <ResultIcon className="h-7 w-7" />
                      </div>
                      
                      <div className="relative shrink-0">
                        {playerBrawler ? (
                          <img
                            src={getBrawlerPin(playerBrawler.id)}
                            alt={playerBrawler.name || "Brawler"}
                            className="h-14 w-14 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://cdn.brawlify.com/brawlers/portrait/${playerBrawler.id}.png`; }}
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center">
                            <User className="h-6 w-6 opacity-20" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 sm:hidden">
                        <p className={`font-display text-lg leading-none ${resultColor(result)} uppercase`}>{resultLabel(result)}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{event.mode || "Evento"}</p>
                      </div>
                    </div>

                    {/* Middle: Mode & Map */}
                    <div className="hidden sm:flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-display text-lg ${resultColor(result)} uppercase`}>
                          {resultLabel(result)}
                        </span>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold border-muted/30">
                          {event.mode || "Modo"}
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground truncate uppercase tracking-wider mt-0.5">
                        {event.map || "Mapa Desconhecido"}
                      </p>
                    </div>

                    {/* Right: Trophies & Time */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0 mt-1 sm:mt-0">
                      <div className="flex flex-col items-end">
                        {trophyChange !== undefined ? (
                          <div className={`flex items-center gap-1.5 font-display text-xl ${trophyChange > 0 ? "text-brawl-green" : trophyChange < 0 ? "text-brawl-red" : "text-muted-foreground"}`}>
                            <Trophy className="h-4 w-4" />
                            <span>{trophyChange > 0 ? "+" : ""}{trophyChange}</span>
                          </div>
                        ) : (
                          <div className="text-xs font-bold text-muted-foreground uppercase">N/A</div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                          <Clock className="h-3 w-3" />
                          {battle.battleTime ? timeAgo(battle.battleTime) : "?"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
