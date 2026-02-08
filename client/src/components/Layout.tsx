import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import {
  Search,
  Trophy,
  Swords,
  Star,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Zap,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Início", icon: Search },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/events", label: "Eventos", icon: Zap },
  { href: "/news", label: "Novidades", icon: Star },
  { href: "/seasons", label: "Temporadas", icon: Trophy },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl" translate="no">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Swords className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl tracking-wide brawl-text-gradient hidden sm:block">
              BRAWL LOOKUP
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link href="/favorites">
                <span
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location === "/favorites"
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  Favoritos
                </span>
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <span className="hidden sm:block text-sm font-semibold">
                      {user?.name || "Jogador"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Meus Favoritos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:block">Entrar</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <nav className="container py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = location === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                    <span
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link href="/favorites" onClick={() => setMobileOpen(false)}>
                  <span
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      location === "/favorites"
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    Favoritos
                  </span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="min-h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6" translate="no">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            Brawl Lookup Pro — Dados fornecidos pela{" "}
            <a
              href="https://developer.brawlstars.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              API oficial do Brawl Stars
            </a>{" "}
            e{" "}
            <a
              href="https://brawlapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              BrawlAPI
            </a>
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Este site não é afiliado, endossado ou de qualquer forma associado à Supercell.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/80 font-semibold">
            By: ShiroDev
          </p>
        </div>
      </footer>
    </div>
  );
}
