import { motion } from 'framer-motion';
import { MirrorScene } from '@/components/MirrorScene';
import { MoodInput } from '@/components/MoodInput';
import { useAnalyzeMood } from '@/hooks/use-mood';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLocation } from "wouter";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { mutate: analyze, isPending } = useAnalyzeMood();
  const { toast } = useToast();

  const handleAnalyze = (method: 'face' | 'self', data?: string) => {
    analyze(
      { method, data },
      {
        onSuccess: (data) => {
          // Navigate to Games Reel with result state
          // Using sessionStorage to pass data reliably as wouter's setLocation overrides history.state
          sessionStorage.setItem('moodResult', JSON.stringify(data));
          setLocation("/games");
        },
        onError: (error) => {
          toast({
            title: "Analysis Failed",
            description: error.message || "Could not analyze mood. Try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white text-gray-900 font-sans">

      {/* 3D Background - Default ambient state */}
      <div className="absolute inset-0 z-0">
        <MirrorScene />
      </div>

      {/* Main Content Layer */}
      <main className="relative z-10 w-full h-full flex flex-col pointer-events-none">

        {/* Header/Nav */}
        <header className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-center pointer-events-auto">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight">MoodMirror</h1>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">AI Lifestyle Curator</span>
          </div>

          <div className="flex gap-4 items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>

        {/* Center Prompt */}
        {!isPending && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl"
            >
              <h2 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
                Your reflection tells a story.
              </h2>
              <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto leading-relaxed mb-8">
                Connect your inner state with your outer world. Get personalized games and lifestyle recommendations.
              </p>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all">
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>
            </motion.div>
          </div>
        )}

        {/* Loading State */}
        {isPending && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-md p-8 rounded-full shadow-xl"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
            <p className="mt-4 text-lg font-serif text-gray-600 animate-pulse">Reading the room...</p>
          </div>
        )}

        {/* Bottom Interaction Area - Protected */}
        <SignedIn>
          <div className="pointer-events-auto">
            <MoodInput onAnalyze={handleAnalyze} isAnalyzing={isPending} />
          </div>
        </SignedIn>
      </main>
    </div>
  );
}
