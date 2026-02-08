import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Star, Gift, Sparkles, Clock, Info, ImageOff } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

function formatDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), "dd 'de' MMMM", { locale: ptBR });
  } catch (e) {
    return dateStr;
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function Seasons() {
  const { data: seasons, isLoading, isError } = trpc.brawl.seasons.useQuery(undefined, {
    staleTime: 300_000,
    retry: 2
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !seasons || seasons.length === 0) {
    return (
      <div className="container py-16 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="brawl-card p-12 max-w-md mx-auto bg-secondary/5 border-none"
        >
          <Calendar className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-2 uppercase">Temporadas não encontradas</h2>
          <p className="text-muted-foreground">Não foi possível carregar os dados das temporadas.</p>
        </motion.div>
      </div>
    );
  }

  // Função para obter imagem da temporada com fallback robusto
  const getSeasonImage = (id: number) => {
    // Tentando URLs oficiais da Supercell que seguem um padrão
    return `https://images.supercell.com/image/upload/q_auto,f_auto/v1/brawlstars/news/season-${id}-header.jpg`;
  };

  const currentSeason = seasons[0];
  const pastSeasons = seasons.slice(1);

  return (
    <motion.div 
      className="container py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl md:text-4xl tracking-tight brawl-text-gradient uppercase">
          Brawl Pass Seasons
        </h1>
        <Badge variant="outline" className="font-mono text-xs opacity-50 border-primary/30">v5.1 Stable</Badge>
      </motion.div>

      {/* Temporada Atual */}
      {currentSeason && (
        <motion.div variants={itemVariants} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-brawl-yellow animate-pulse" />
            <h2 className="font-display text-2xl tracking-wide uppercase">Temporada Atual</h2>
            <Badge className="bg-brawl-green text-black font-bold px-3">ATIVO</Badge>
          </div>
          
          <div className="brawl-card overflow-hidden border-none shadow-2xl bg-secondary/5">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-80 lg:h-auto overflow-hidden bg-secondary/20">
                <img 
                  src={getSeasonImage(currentSeason.id)} 
                  alt={currentSeason.name} 
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = "https://images.supercell.com/image/upload/q_auto,f_auto/v1/brawlstars/news/brawlentines-season-is-here.jpg"; 
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent lg:hidden" />
                <div className="absolute bottom-6 left-8 lg:hidden">
                  <h3 className="font-display text-4xl text-white drop-shadow-2xl uppercase">{currentSeason.name}</h3>
                </div>
              </div>
              
              <div className="p-10 flex flex-col justify-center">
                <div className="hidden lg:block mb-3">
                  <Badge variant="outline" className="text-primary border-primary/40 font-bold px-4 py-1">TEMPORADA {currentSeason.id}</Badge>
                </div>
                <h3 className="font-display text-5xl mb-8 hidden lg:block brawl-text-gradient uppercase leading-none">{currentSeason.name}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-brawl-blue/10 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-brawl-blue" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Duração</p>
                      <p className="text-sm font-bold">{formatDate(currentSeason.startDate)} - {formatDate(currentSeason.endDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-brawl-yellow/10 flex items-center justify-center shrink-0">
                      <Star className="h-6 w-6 text-brawl-yellow" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Tema</p>
                      <p className="text-sm font-bold">{currentSeason.theme}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-brawl-green/10 flex items-center justify-center shrink-0">
                      <Gift className="h-6 w-6 text-brawl-green" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Brawler do Passe</p>
                      <p className="text-sm font-bold">{currentSeason.brawler}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-4 tracking-widest">Skins em Destaque</p>
                  <div className="flex flex-wrap gap-2">
                    {currentSeason.skins.map((skin: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-white/5 hover:bg-white/10 text-[10px] py-1.5 px-4 font-bold border-none uppercase transition-colors">
                        {skin}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Temporadas Passadas */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-6 w-6 text-muted-foreground" />
          <h2 className="font-display text-2xl tracking-wide uppercase">Histórico de Temporadas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastSeasons.map((season: any) => (
            <motion.div key={season.id} whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="brawl-card overflow-hidden group border-none bg-secondary/5 h-full shadow-lg">
                <div className="relative h-52 overflow-hidden bg-secondary/20">
                  <img 
                    src={getSeasonImage(season.id)} 
                    alt={season.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = "https://images.supercell.com/image/upload/q_auto,f_auto/v1/brawlstars/news/starr-force-2-0.jpg"; 
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <Badge className="mb-2 bg-primary text-white border-none text-[10px] font-bold px-3">S{season.id}</Badge>
                    <h3 className="font-display text-2xl text-white drop-shadow-xl uppercase">{season.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Data</span>
                      <span className="text-xs font-bold">{formatDate(season.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Brawler</span>
                      <span className="text-xs font-bold text-brawl-blue uppercase">{season.brawler}</span>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex flex-wrap gap-2">
                        {season.skins.slice(0, 2).map((skin: string, i: number) => (
                          <span key={i} className="text-[9px] bg-white/5 px-3 py-1 rounded-full font-bold text-muted-foreground uppercase">
                            {skin}
                          </span>
                        ))}
                        {season.skins.length > 2 && (
                          <span className="text-[9px] text-muted-foreground font-bold uppercase">+ {season.skins.length - 2} skins</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
