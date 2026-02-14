import { useState } from 'react';
import { useLocation } from 'wouter';
import { MoodResult, Playlist } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { motion } from 'framer-motion';

export default function Playlists() {
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

    const playlists = moodResult?.playlists || [];

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
                    <h1 className="font-serif text-lg">Soundtrack</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 space-y-6 max-w-md mx-auto">
                <div className="text-center py-4">
                    <h2 className="text-3xl font-serif mb-2">Vibe Check</h2>
                    <p className="text-white/60">Playlists curated for your {moodResult.mood} mood.</p>
                </div>

                {playlists.length === 0 && (
                    <div className="text-center py-20 text-white/40">
                        No specific playlists found, but here are some popular vibes.
                    </div>
                )}

                {playlists.map((playlist, index) => (
                    <motion.div
                        key={playlist.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-xl overflow-hidden shadow-lg border border-white/10 bg-zinc-900"
                    >
                        <div className="p-4 bg-zinc-800/50">
                            <h3 className="font-bold text-lg mb-1">{playlist.title}</h3>
                            <p className="text-sm text-zinc-400">{playlist.description}</p>
                        </div>
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src={`https://open.spotify.com/embed/playlist/${playlist.spotifyId}?utm_source=generator&theme=0`}
                            width="100%"
                            height="152"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="w-full bg-zinc-900"
                        />
                    </motion.div>
                ))}

                {/* Helper text at bottom */}
                <div className="text-center text-xs text-white/30 pt-8 pb-12 uppercase tracking-widest">
                    Powered by Spotify
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
