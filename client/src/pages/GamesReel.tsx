import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Game, MoodResult } from '@shared/schema';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; // Using for potential future fetching

export default function GamesReel() {
    const [location, setLocation] = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Get state passed from navigation (wouter doesn't verify type safe location state easily, 
    // ensuring we handle missing state gracefully)
    const historyState = window.history.state as { result?: MoodResult } | null;
    let moodResult = historyState?.result;

    // Fallback to sessionStorage if history state is lost (common with wouter setLocation)
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

    const games = moodResult?.games || [];

    // Scroll snap detection
    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, clientHeight } = containerRef.current;
        const index = Math.round(scrollTop / clientHeight);
        setActiveIndex(index);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    if (!moodResult || games.length === 0) {
        return (
            <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
                <h2 className="text-2xl font-serif mb-4">No games found for this mood.</h2>
                <Button variant="outline" className="text-black border-white bg-white hover:bg-gray-200" onClick={() => setLocation('/')}>
                    Try another check-in
                </Button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden font-sans">

            {/* Top Navigation Overlay */}
            <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 pointer-events-auto"
                    onClick={() => setLocation('/')}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Check In
                </Button>
                <div className="flex flex-col items-end pointer-events-auto">
                    <span className="text-xs font-medium text-white/60 uppercase tracking-widest">{moodResult.mood} • {moodResult.energy} Energy</span>
                    <h1 className="text-white font-serif text-lg">Your Mix</h1>
                </div>
            </div>

            {/* Vertical Reel Container */}
            <div
                ref={containerRef}
                className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {games.map((game, index) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        isActive={index === activeIndex}
                    />
                ))}

                {/* End of Feed */}
                <div className="w-full h-full flex flex-col items-center justify-center snap-start bg-zinc-900 text-white p-8 text-center space-y-6">
                    <h2 className="text-3xl font-serif">That's the mix!</h2>
                    <p className="text-zinc-400 max-w-md">We've curated these based on your current vibe. Ready to shuffle or check in again?</p>
                    <Button
                        size="lg"
                        className="bg-white text-black hover:bg-gray-200 rounded-full px-8"
                        onClick={() => setLocation('/')} // Ideally would reshuffle, but simple nav back for now
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Check In
                    </Button>
                </div>
            </div>
        </div>
    );
}
