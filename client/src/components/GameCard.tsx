import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Share2, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Game } from '@shared/schema';

interface GameCardProps {
    game: Game;
    isActive: boolean;
}

export function GameCard({ game, isActive }: GameCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black snap-start shrink-0 overflow-hidden">
            {/* Background / thumbnail when not playing */}
            {!isPlaying && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={game.thumbnail || `https://placehold.co/600x800/1a1a1a/FFF?text=${encodeURIComponent(game.title)}`}
                        alt={game.title}
                        className="w-full h-full object-cover opacity-60 blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
                </div>
            )}

            {/* Game Iframe */}
            {isPlaying && (
                <iframe
                    src={game.url}
                    className="w-full h-full border-0 z-10"
                    title={game.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
            )}

            {/* Overlay UI (Visible when not playing or optionally overlaying) */}
            {!isPlaying && (
                <div className="relative z-20 flex flex-col items-center text-center p-8 space-y-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-serif font-bold text-white mb-2">{game.title}</h2>
                        <p className="text-white/80 max-w-xs mx-auto text-lg">{game.description}</p>

                        <div className="flex justify-center gap-2 mt-4">
                            {game.moods.map(m => (
                                <span key={m} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs text-white uppercase tracking-wider">
                                    {m}
                                </span>
                            ))}
                            <span className="px-3 py-1 bg-primary/20 backdrop-blur rounded-full text-xs text-primary-foreground uppercase tracking-wider border border-primary/50">
                                {game.energy} Energy
                            </span>
                        </div>
                    </motion.div>

                    <Button
                        size="lg"
                        className="rounded-full w-20 h-20 p-0 bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse"
                        onClick={() => setIsPlaying(true)}
                    >
                        <Play className="w-8 h-8 fill-current ml-1" />
                    </Button>
                </div>
            )}

            {/* Sidebar Actions */}
            <div className="absolute right-4 bottom-24 z-30 flex flex-col gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full w-12 h-12 bg-black/40 backdrop-blur text-white hover:bg-black/60 ${isSaved ? 'text-red-500' : ''}`}
                    onClick={() => setIsSaved(!isSaved)}
                >
                    <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 bg-black/40 backdrop-blur text-white hover:bg-black/60">
                    <Share2 className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 bg-black/40 backdrop-blur text-white hover:bg-black/60">
                    <Info className="w-6 h-6" />
                </Button>
            </div>

            {/* Back Button (if needed, or user swipes) */}
            {isPlaying && (
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4 z-30 text-white bg-black/50 hover:bg-black/70 backdrop-blur rounded-full px-4"
                    onClick={() => setIsPlaying(false)}
                >
                    Stop Playing
                </Button>
            )}
        </div>
    );
}
