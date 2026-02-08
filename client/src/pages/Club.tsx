import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  Users,
  Heart,
  HeartOff,
  ArrowLeft,
  Shield,
  Crown,
  Star,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { getIconAsset } from "@/lib/utils";

function formatNumber(n: number): string {
  return n?.toLocaleString("pt-BR") ?? "0";
}

function roleIcon(role: string) {
  if (role === "president") return <Crown className="h-3.5 w-3.5 text-brawl-yellow" />;
  if (role === "vicePresident") return <Star className="h-3.5 w-3.5 text-brawl-orange" />;
  if (role === "senior") return <Shield className="h-3.5 w-3.5 text-brawl-blue" />;
  return null;
}

function roleLabel(role: string) {
  if (role === "president") return "Presidente";
  if (role === "vicePresident") return "Vice-Presidente";
  if (role === "senior") return "Veterano";
  return "Membro";
}

export default function Club() {
  const { tag } = useParams<{ tag: string }>();
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const clubQuery = trpc.brawl.club.useQuery(
    { tag: tag || "" },
    { enabled: Boolean(tag), retry: 1 }
  );

  const favCheck = trpc.favorites.check.useQuery(
    { type: "club", tag: tag || "" },
    { enabled: Boolean(tag) && isAuthenticated }
  );

  const addFav = trpc.favorites.add.useMutation({
    onSuccess: () => { favCheck.refetch(); toast.success("Clube adicionado aos favoritos!"); },
  });
  const removeFav = trpc.favorites.remove.useMutation({
    onSuccess: () => { favCheck.refetch(); toast.success("Clube removido dos favoritos"); },
  });

  const club = clubQuery.data;
  const isFav = favCheck.data?.isFavorite;

  const toggleFavorite = () => {
    if (!isAuthenticated) { toast.error("Faça login para salvar favoritos"); return; }
    if (isFav) {
      removeFav.mutate({ type: "club", tag: tag || "" });
    } else {
      addFav.mutate({
        type: "club",
        tag: tag || "",
        name: club?.name,
        trophies: club?.trophies,
      });
    }
  };

  if (clubQuery.isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-48 mb-4" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (clubQuery.isError || !club) {
    return (
      <div className="container py-16 text-center">
        <div className="brawl-card p-8 max-w-md mx-auto">
          <Target className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-2">CLUBE NÃO ENCONTRADO</h2>
          <p className="text-muted-foreground mb-6">
            A tag <span className="font-mono text-primary">#{tag}</span> não foi encontrada.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
      </div>
    );
  }

  const members = club.members || [];

  return (
    <div className="container py-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
      </Button>

      {/* Club Header */}
      <div className="brawl-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-brawl-blue/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-brawl-blue" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl md:text-3xl tracking-wide brawl-text-gradient">
                {club.name}
              </h1>
              <Badge variant="outline" className="font-mono text-xs">#{tag}</Badge>
            </div>
            {club.description && (
              <p className="text-sm text-muted-foreground mt-1">{club.description}</p>
            )}
          </div>
          <Button
            variant={isFav ? "destructive" : "outline"}
            size="sm"
            onClick={toggleFavorite}
            disabled={addFav.isPending || removeFav.isPending}
          >
            {isFav ? <HeartOff className="h-4 w-4 mr-2" /> : <Heart className="h-4 w-4 mr-2" />}
            {isFav ? "Remover" : "Favoritar"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="brawl-card">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-brawl-yellow" />
            <p className="text-lg font-bold">{formatNumber(club.trophies)}</p>
            <p className="text-xs text-muted-foreground">Troféus</p>
          </CardContent>
        </Card>
        <Card className="brawl-card">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-brawl-blue" />
            <p className="text-lg font-bold">{members.length}/30</p>
            <p className="text-xs text-muted-foreground">Membros</p>
          </CardContent>
        </Card>
        <Card className="brawl-card">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-brawl-green" />
            <p className="text-lg font-bold">{formatNumber(club.requiredTrophies || 0)}</p>
            <p className="text-xs text-muted-foreground">Troféus Mínimos</p>
          </CardContent>
        </Card>
        <Card className="brawl-card">
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-brawl-purple-light" />
            <p className="text-lg font-bold capitalize">{club.type || "?"}</p>
            <p className="text-xs text-muted-foreground">Tipo</p>
          </CardContent>
        </Card>
      </div>

      {/* Members */}
      <h2 className="font-display text-xl tracking-wide mb-4">
        MEMBROS ({members.length})
      </h2>
      <div className="space-y-1">
        {members.map((member: any, i: number) => (
          <div
            key={member.tag}
            className="brawl-card p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30"
            onClick={() => navigate(`/player/${member.tag.replace("#", "")}`)}
          >
            <span className="text-xs text-muted-foreground w-6 text-right font-mono">
              {i + 1}
            </span>
            <img
              src={getIconAsset(member.icon?.id || 28000000)}
              alt=""
              className="h-8 w-8 rounded-lg"
              onError={(e) => { 
                (e.target as HTMLImageElement).src = `https://cdn.brawlify.com/profile-icons/regular/${member.icon?.id || 28000000}.png`;
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {roleIcon(member.role)}
                <span className="font-bold text-sm truncate">{member.name}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{roleLabel(member.role)}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Trophy className="h-3.5 w-3.5 text-brawl-yellow" />
              <span className="text-sm font-bold">{formatNumber(member.trophies)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
