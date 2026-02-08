import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import {
  Heart,
  Trophy,
  Swords,
  Shield,
  Trash2,
  LogIn,
  Star,
} from "lucide-react";
import { toast } from "sonner";

function formatNumber(n: number): string {
  return n?.toLocaleString("pt-BR") ?? "0";
}

export default function Favorites() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const favoritesQuery = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeFav = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      favoritesQuery.refetch();
      toast.success("Removido dos favoritos");
    },
  });

  if (authLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <div className="brawl-card p-8 max-w-md mx-auto">
          <Heart className="h-16 w-16 text-brawl-red mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-2">MEUS FAVORITOS</h2>
          <p className="text-muted-foreground mb-6">
            Faça login para salvar seus jogadores e clubes favoritos.
          </p>
          <Button
            className="font-bold"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            <LogIn className="h-4 w-4 mr-2" /> Entrar para continuar
          </Button>
        </div>
      </div>
    );
  }

  const favorites = favoritesQuery.data || [];
  const players = favorites.filter((f) => f.type === "player");
  const clubs = favorites.filter((f) => f.type === "club");

  return (
    <div className="container py-6">
      <h1 className="font-display text-2xl md:text-3xl tracking-wide brawl-text-gradient mb-6">
        MEUS FAVORITOS
      </h1>

      {favoritesQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="brawl-card p-8 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            Você ainda não tem favoritos. Busque um jogador ou clube e clique no coração para salvar.
          </p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Buscar jogadores
          </Button>
        </div>
      ) : (
        <>
          {/* Favorite Players */}
          {players.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Swords className="h-5 w-5 text-brawl-yellow" />
                <h2 className="font-display text-lg tracking-wide">JOGADORES ({players.length})</h2>
              </div>
              <div className="space-y-1">
                {players.map((fav) => (
                  <div
                    key={fav.id}
                    className="brawl-card p-3 flex items-center gap-3"
                  >
                    {fav.icon ? (
                      <img
                        src={fav.icon}
                        alt=""
                        className="h-10 w-10 rounded-lg cursor-pointer"
                        onClick={() => navigate(`/player/${fav.tag}`)}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div
                        className="h-10 w-10 rounded-lg bg-brawl-purple/20 flex items-center justify-center cursor-pointer"
                        onClick={() => navigate(`/player/${fav.tag}`)}
                      >
                        <Swords className="h-5 w-5 text-brawl-purple-light" />
                      </div>
                    )}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/player/${fav.tag}`)}
                    >
                      <p className="font-bold text-sm truncate">{fav.name || `#${fav.tag}`}</p>
                      <span className="text-[10px] text-muted-foreground font-mono">#{fav.tag}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Trophy className="h-3.5 w-3.5 text-brawl-yellow" />
                      <span className="text-sm font-bold">{formatNumber(fav.trophies || 0)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeFav.mutate({ type: "player", tag: fav.tag })}
                      disabled={removeFav.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Clubs */}
          {clubs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-brawl-blue" />
                <h2 className="font-display text-lg tracking-wide">CLUBES ({clubs.length})</h2>
              </div>
              <div className="space-y-1">
                {clubs.map((fav) => (
                  <div
                    key={fav.id}
                    className="brawl-card p-3 flex items-center gap-3"
                  >
                    <div
                      className="h-10 w-10 rounded-lg bg-brawl-blue/20 flex items-center justify-center cursor-pointer"
                      onClick={() => navigate(`/club/${fav.tag}`)}
                    >
                      <Shield className="h-5 w-5 text-brawl-blue" />
                    </div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/club/${fav.tag}`)}
                    >
                      <p className="font-bold text-sm truncate">{fav.name || `#${fav.tag}`}</p>
                      <span className="text-[10px] text-muted-foreground font-mono">#{fav.tag}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Trophy className="h-3.5 w-3.5 text-brawl-yellow" />
                      <span className="text-sm font-bold">{formatNumber(fav.trophies || 0)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeFav.mutate({ type: "club", tag: fav.tag })}
                      disabled={removeFav.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
