import { motion } from 'framer-motion';
import { Shirt, Music, Dumbbell, Utensils, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MoodResponse } from '@/hooks/use-mood';
import { getMoodColor } from '@/lib/mood-mapping';

interface RecommendationCardProps {
  result: MoodResponse;
  onReset: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function RecommendationCard({ result, onReset }: RecommendationCardProps) {
  const moodColor = getMoodColor(result.mood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-0 bottom-0 top-24 md:top-auto md:bottom-8 md:right-8 md:left-auto md:w-[450px] z-40 flex flex-col"
    >
      <div className="flex-1 md:flex-none overflow-y-auto no-scrollbar p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: moodColor }}
            >
              <Sparkles className="text-white w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl font-serif text-gray-900 capitalize mb-1">{result.mood}</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
              Confidence {result.confidence}%
            </p>
          </div>

          {/* Grid of Recs */}
          <div className="space-y-6">
            {/* Affirmation */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center"
            >
              <p className="font-serif text-xl italic text-gray-800">"{result.recommendations.affirmation}"</p>
            </motion.div>

            {/* Playlist */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <Music className="w-4 h-4" /> Playlist
              </div>
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                 <iframe 
                   style={{borderRadius: '12px'}} 
                   src={`https://open.spotify.com/embed/playlist/${result.recommendations.playlist}?utm_source=generator&theme=0`} 
                   width="100%" 
                   height="80" 
                   frameBorder="0" 
                   allowFullScreen 
                   allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                   loading="lazy"
                 ></iframe>
              </div>
            </motion.div>

            {/* Outfit */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <Shirt className="w-4 h-4" /> Style Suggestion
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {result.recommendations.outfit.map((item, i) => (
                  <span key={i} className="whitespace-nowrap px-4 py-2 bg-white rounded-full border border-gray-200 text-sm shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Activities */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <Dumbbell className="w-5 h-5 text-primary mb-2" />
                <h4 className="font-serif text-lg mb-1">Movement</h4>
                <p className="text-sm text-gray-600 leading-snug">{result.recommendations.workout}</p>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <Utensils className="w-5 h-5 text-primary mb-2" />
                <h4 className="font-serif text-lg mb-1">Nourish</h4>
                <p className="text-sm text-gray-600 leading-snug">{result.recommendations.food}</p>
              </motion.div>
            </div>
            
            {/* Productivity */}
             <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Productivity Tip</h4>
              </div>
              <p className="text-sm text-gray-700">{result.recommendations.productivity}</p>
            </motion.div>
          </div>

          <div className="mt-8">
            <Button variant="outline" className="w-full rounded-xl py-6 border-gray-200 hover:bg-gray-50" onClick={onReset}>
              Start New Scan
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
