import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Player from "./pages/Player";
import Club from "./pages/Club";
import PlayerBattles from "./pages/PlayerBattles";
import Rankings from "./pages/Rankings";
import Events from "./pages/Events";
import News from "./pages/News";
import Seasons from "./pages/Seasons";
import Favorites from "./pages/Favorites";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/player/:tag" component={Player} />
        <Route path="/player/:tag/battles" component={PlayerBattles} />
        <Route path="/club/:tag" component={Club} />
        <Route path="/rankings" component={Rankings} />
        <Route path="/events" component={Events} />
        <Route path="/news" component={News} />
        <Route path="/seasons" component={Seasons} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
