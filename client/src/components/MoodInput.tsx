import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Type, Mic, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface MoodInputProps {
  onAnalyze: (method: 'face' | 'self', data?: string) => void;
  isAnalyzing: boolean;
}

export function MoodInput({ onAnalyze, isAnalyzing }: MoodInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'select' | 'text' | 'camera'>('select');
  const [text, setText] = useState('');

  const handleTextSubmit = () => {
    if (!text.trim()) return;
    onAnalyze('self', text);
    setIsOpen(false);
    setMode('select');
    setText('');
  };

  const handleCameraMock = () => {
    // In a real app, this would capture a frame from <video>
    // Here we simulate a face scan trigger
    onAnalyze('face');
    setIsOpen(false);
    setMode('select');
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-12 left-0 right-0 flex justify-center z-50 pointer-events-none"
      >
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          disabled={isAnalyzing}
          className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/20 pointer-events-auto transition-transform hover:scale-105"
        >
          {isAnalyzing ? "Analyzing..." : "How are you feeling?"}
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 relative overflow-hidden"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full hover:bg-black/5"
            onClick={() => {
              setIsOpen(false);
              setMode('select');
            }}
          >
            <X className="w-5 h-5" />
          </Button>

          {mode === 'select' && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-serif">Check In</h3>
                <p className="text-muted-foreground">Choose how you'd like to reflect today.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('text')}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Type className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Write it out</span>
                </button>

                <button
                  onClick={handleCameraMock}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Face Scan</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'text' && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <h3 className="text-xl font-serif">What's on your mind?</h3>
              </div>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="I'm feeling..."
                className="min-h-[120px] bg-white/50 border-gray-200 focus:border-primary/50 text-lg resize-none rounded-xl"
                autoFocus
              />
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setMode('select')}>Back</Button>
                <Button className="flex-1" onClick={handleTextSubmit} disabled={!text.trim()}>Analyze</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
