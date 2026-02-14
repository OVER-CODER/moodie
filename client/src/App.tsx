import { Switch, Route } from "wouter";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

import GamesReel from "@/pages/GamesReel";
import Outfits from "@/pages/Outfits";
import Playlists from "@/pages/Playlists";
import Journal from "@/pages/Journal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/games">
        <SignedIn>
          <GamesReel />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Route>
      <Route path="/outfits">
        <SignedIn>
          <Outfits />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Route>
      <Route path="/music">
        <SignedIn>
          <Playlists />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Route>
      <Route path="/journal">
        <SignedIn>
          <Journal />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
