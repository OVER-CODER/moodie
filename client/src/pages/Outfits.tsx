import { useState } from 'react';
import { useLocation } from 'wouter';
import { MoodResult, Outfit } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { motion } from 'framer-motion';

export default function Outfits() {
    const [, setLocation] = useLocation();

    // Logic to share state with GamesReel (reading from sessionStorage)
    let moodResult: MoodResult | undefined;

    // Try history state first (if navigated directly)
    const historyState = window.history.state as { result?: MoodResult } | null;
    moodResult = historyState?.result;

    // Fallback to sessionStorage
    if (!moodResult) {
        const stored = sessionStorage.getItem('moodResult');
        if (stored) {
            try {
                moodResult = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse stored mood result", e);
            }
        }
    }

    const outfits = moodResult?.outfits || [];

    if (!moodResult) {
        return (
            <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
                <h2 className="text-2xl font-serif mb-4">No mood data found.</h2>
                <Button variant="outline" className="text-black border-white bg-white hover:bg-gray-200" onClick={() => setLocation('/')}>
                    Check In First
                </Button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-black text-white font-sans overflow-y-auto pb-24">

            {/* Top Header */}
            <div className="sticky top-0 z-40 p-4 flex justify-between items-start bg-black/80 backdrop-blur-md border-b border-white/10">
                <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => setLocation('/')}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </Button>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-white/60 uppercase tracking-widest">{moodResult.mood} • {moodResult.energy} Energy</span>
                    <h1 className="font-serif text-lg">Style Edit</h1>
                </div>
            </div>

            {/* Main Gallery Content */}
            <div className="p-4 space-y-8 max-w-md mx-auto">
                <div className="text-center py-4">
                    <h2 className="text-3xl font-serif mb-2">Your Lookbook</h2>
                    <p className="text-white/60">Curated styles to match your {moodResult.mood} vibe.</p>
                </div>

                {outfits.length === 0 && (
                    <div className="text-center py-20 text-white/40">
                        No specific outfits found for this mood, but feel free to wear what makes you comfortable.
                    </div>
                )}

                {outfits.map((outfit, index) => (
                    <motion.div
                        key={outfit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900"
                    >
                        <img
                            src={outfit.imageUrl}
                            alt={outfit.style}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                            <h3 className="text-2xl font-serif font-bold mb-1">{outfit.style}</h3>
                            <p className="text-sm text-white/80 line-clamp-2">{outfit.description}</p>
                        </div>
                    </motion.div>
                ))}

                {/* Helper text at bottom */}
                <div className="text-center text-xs text-white/30 pt-8 pb-12 uppercase tracking-widest">
                    AI Generated Recommendations
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
