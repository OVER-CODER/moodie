import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Send, Sparkles, Book, Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { JournalEntry } from "@shared/schema";

interface Message {
    role: "user" | "model";
    text: string;
}

export default function Journal() {
    const [, setLocation] = useLocation();
    const { user } = useUser();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [mode, setMode] = useState<"list" | "chat">("list");

    // Chat state
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch entries
    const { data: entries, isLoading: isLoadingEntries } = useQuery<JournalEntry[]>({
        queryKey: [`/api/journal/entries/${user?.id}`],
        enabled: !!user,
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const startNewEntry = () => {
        setMessages([
            { role: "model", text: `Hi ${user?.firstName || 'there'}. Ready to reflect on your day?` }
        ]);
        setMode("chat");
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setIsLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role,
                parts: m.text
            }));

            const res = await apiRequest("POST", "/api/journal/chat", {
                message: userMsg,
                history,
                userId: user?.id
            });

            const data = await res.json();

            setMessages(prev => [...prev, { role: "model", text: data.response }]);

            // Check if entry was saved (the server response usually contains this info 
            // but for now we rely on the textual cue or if we want to be robust we could return a flag)
            if (data.entry) {
                toast({
                    title: "Journal Saved",
                    description: "Your reflection has been saved.",
                });
                queryClient.invalidateQueries({ queryKey: [`/api/journal/entries/${user?.id}`] });
                setTimeout(() => setMode("list"), 2000);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not send message. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen bg-black text-white font-sans flex flex-col">
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-zinc-900 border-b border-white/10">
                {mode === "chat" ? (
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                        onClick={() => setMode("list")}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                        onClick={() => setLocation('/')}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Home
                    </Button>
                )}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-medium text-purple-400 uppercase tracking-widest flex items-center gap-1">
                        <Book className="w-3 h-3" />
                        Journal
                    </span>
                </div>
                <div className="w-10" />
            </div>

            {mode === "list" ? (
                <ScrollArea className="flex-1 p-4 pb-24">
                    <div className="max-w-xl mx-auto space-y-6">
                        <div className="text-center py-8">
                            <h1 className="text-2xl font-serif mb-2">Your Reflections</h1>
                            <p className="text-zinc-400 text-sm">Review your past entries or start a new one.</p>
                        </div>

                        <Button
                            onClick={startNewEntry}
                            className="w-full h-auto py-6 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-lg font-medium shadow-lg shadow-purple-500/20 group"
                        >
                            <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            New Entry
                        </Button>

                        <div className="space-y-4">
                            {isLoadingEntries ? (
                                <div className="text-center text-zinc-500 py-10">Loading entries...</div>
                            ) : entries?.length === 0 ? (
                                <div className="text-center text-zinc-500 py-10">No entries yet. Start your first reflection!</div>
                            ) : (
                                entries?.map(entry => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-zinc-900 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                                {new Date(entry.createdAt!).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full bg-white/5 text-white/70 capitalize`}>
                                                {entry.mood}
                                            </span>
                                        </div>
                                        {entry.summary && <h3 className="font-medium text-lg mb-2">{entry.summary}</h3>}
                                        <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                                            {entry.content}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </ScrollArea>
            ) : (
                <>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4 pb-24 max-w-2xl mx-auto">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`
                        max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
                        ${msg.role === 'user'
                                                    ? 'bg-white text-black rounded-tr-sm'
                                                    : 'bg-zinc-800 text-white rounded-tl-sm border border-white/10'}
                      `}
                                        >
                                            {msg.role === 'model' && (
                                                <Sparkles className="w-4 h-4 mb-2 text-purple-400" />
                                            )}
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-sm border border-white/10 flex gap-1 items-center">
                                            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={scrollRef} />
                            </AnimatePresence>
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-zinc-900 border-t border-white/10 pb-24">
                        <div className="max-w-2xl mx-auto flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Reflect on your day..."
                                className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500 rounded-full px-6 focus-visible:ring-purple-400"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="rounded-full bg-white text-black hover:bg-zinc-200"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}

            <BottomNav />
        </div>
    );
}
