import { useState } from 'react';
import { motion } from 'framer-motion';
import { MirrorScene } from '@/components/MirrorScene';
import { MoodInput } from '@/components/MoodInput';
import { RecommendationCard } from '@/components/RecommendationCard';
import { useAnalyzeMood, MoodResponse } from '@/hooks/use-mood';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<MoodResponse | null>(null);
  const { mutate: analyze, isPending } = useAnalyzeMood();
  const { toast } = useToast();

  const handleAnalyze = (method: 'face' | 'self', data?: string) => {
    analyze(
      { method, data },
      {
        onSuccess: (data) => {
          setResult(data);
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

  const reset = () => {
    setResult(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white text-gray-900 font-sans">
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <MirrorScene mood={result?.mood} />
      </div>

      {/* Main Content Layer */}
      <main className="relative z-10 w-full h-full flex flex-col pointer-events-none">
        
        {/* Header/Nav */}
        <header className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-center pointer-events-auto">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight">MoodMirror</h1>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">AI Lifestyle Curator</span>
          </div>
          
          <div className="flex gap-4 text-sm font-medium text-gray-600">
             {/* Future: Settings or User Profile */}
             <span className="opacity-50">v1.0</span>
          </div>
        </header>

        {/* Center Prompt - only visible when no result */}
        {!result && !isPending && (
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
              <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
                Connect your inner state with your outer world. Get personalized lifestyle recommendations based on your current mood.
              </p>
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

        {/* Bottom Interaction Area */}
        <div className="pointer-events-auto">
          {!result && (
            <MoodInput onAnalyze={handleAnalyze} isAnalyzing={isPending} />
          )}
          
          {result && (
            <RecommendationCard result={result} onReset={reset} />
          )}
        </div>
      </main>
    </div>
  );
}
