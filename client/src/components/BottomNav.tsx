import { Link, useLocation } from "wouter";
import { Gamepad2, Shirt, Music, Book } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const [location] = useLocation();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none flex justify-center">
            <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 pointer-events-auto border border-white/10 shadow-lg">
                <Link href="/games">
                    <a className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300",
                        location === "/games"
                            ? "bg-white text-black font-medium"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                    )}>
                        <Gamepad2 className="w-4 h-4" />
                        <span>Games</span>
                    </a>
                </Link>
                <Link href="/outfits">
                    <a className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300",
                        location === "/outfits"
                            ? "bg-white text-black font-medium"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                    )}>
                        <Shirt className="w-4 h-4" />
                        <span>Lookbook</span>
                    </a>
                </Link>
                <Link href="/music">
                    <a className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300",
                        location === "/music"
                            ? "bg-white text-black font-medium"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                    )}>
                        <Music className="w-4 h-4" />
                        <span>Music</span>
                    </a>
                </Link>
                <Link href="/journal">
                    <a className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300",
                        location === "/journal"
                            ? "bg-white text-black font-medium"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                    )}>
                        <Book className="w-4 h-4" />
                        <span>Journal</span>
                    </a>
                </Link>
            </div>
        </div>
    );
}
