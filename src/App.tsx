import { clsx, type ClassValue } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, RotateCcw, Search, Trophy, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import allLogos from './data/logos.json';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Types ---
interface Logo {
    id: string;
    name: string;
    country: string;
    isHistorical: boolean;
    period: string | null;
    svgUrl?: string | null;
    pngUrl?: string | null;
    localPath?: string;
    pageUrl: string;
}

const MAX_ATTEMPTS = 6;

export default function App() {
    // Game State
    const [mode, setMode] = useState<'easy' | 'hard'>('easy');
    const [targetLogo, setTargetLogo] = useState<Logo | null>(null);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Filtered logos based on mode
    const filteredLogos = useMemo(() => {
        return allLogos.filter(l => mode === 'easy' ? !l.isHistorical : l.isHistorical) as Logo[];
    }, [mode]);

    // Suggestions logic
    const suggestions = useMemo(() => {
        if (!inputValue.trim() || inputValue.length < 2) return [];
        return filteredLogos
            .filter(l => l.name.toLowerCase().includes(inputValue.toLowerCase()))
            .slice(0, 5);
    }, [inputValue, filteredLogos]);

    // Start/Restart Game
    const startNewGame = (newMode?: 'easy' | 'hard') => {
        const activeMode = newMode || mode;
        const pool = allLogos.filter(l => activeMode === 'easy' ? !l.isHistorical : l.isHistorical) as Logo[];

        if (pool.length === 0) {
            console.warn(`No hay logos para el modo ${activeMode}`);
            return;
        }

        const random = pool[Math.floor(Math.random() * pool.length)];
        setTargetLogo(random);
        setGuesses([]);
        setInputValue('');
        setGameState('playing');
        setShowSuggestions(false);
        if (newMode) setMode(newMode);
    };

    useEffect(() => {
        startNewGame();
    }, []);

    // Handle Guess
    const handleGuess = (name: string) => {
        if (gameState !== 'playing' || guesses.length >= MAX_ATTEMPTS) return;

        const newGuesses = [...guesses, name];
        setGuesses(newGuesses);
        setInputValue('');
        setShowSuggestions(false);

        if (name.toLowerCase() === targetLogo?.name.toLowerCase()) {
            setGameState('won');
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setGameState('lost');
        }
    };

    if (!targetLogo) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 space-y-8">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-emerald-400">
                    ESCUDLE
                </h1>

                {/* Mode Selector */}
                <div className="flex bg-white/5 p-1 rounded-xl glass border border-white/5">
                    <button
                        onClick={() => startNewGame('easy')}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                            mode === 'easy' ? "bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20" : "text-slate-400 hover:text-white"
                        )}
                    >
                        MODO FÁCIL
                    </button>
                    <button
                        onClick={() => startNewGame('hard')}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                            mode === 'hard' ? "bg-brand-accent text-brand-dark shadow-lg shadow-brand-accent/20" : "text-slate-400 hover:text-white"
                        )}
                    >
                        MODO DIFÍCIL
                    </button>
                </div>

                <p className="text-slate-400 font-medium">
                    {mode === 'easy' ? 'Escudos actuales' : 'Escudos históricos (Retro)'}
                </p>
            </motion.header>

            {/* Main Game Card */}
            <main className="w-full max-w-md space-y-6">
                {/* Logo Display */}
                <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center relative aspect-square overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-50" />

                    {/* Period Badge - Show always in Hard Mode, or as hint */}
                    {mode === 'hard' && (
                        <div className="absolute top-4 right-4 z-20">
                            <span className="bg-brand-gold/20 text-brand-gold text-xs font-bold px-3 py-1 rounded-full border border-brand-gold/30">
                                {targetLogo.period || 'Histórico'}
                            </span>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${targetLogo.id}-${mode}`}
                            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="relative z-10 w-full h-full flex items-center justify-center"
                        >
                            <img
                                src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                                alt="Escudo a adivinar"
                                className={cn(
                                    "w-48 h-48 object-contain transition-all duration-700",
                                    gameState === 'playing' ? "brightness-0 invert-[0.1] opacity-90" : "brightness-100 invert-0"
                                )}
                            />
                            {gameState === 'playing' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-white/10 text-9xl font-bold select-none">?</div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Winning Overlay */}
                    {gameState === 'won' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-emerald-500 p-4 rounded-full mb-4 shadow-lg shadow-emerald-500/50"
                            >
                                <Trophy className="text-white w-8 h-8" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-emerald-400">¡Victoria!</h2>
                            <p className="text-white font-medium text-center px-4">{targetLogo.name}</p>
                            {mode === 'hard' && <p className="text-brand-gold text-sm font-bold mt-1">{targetLogo.period}</p>}
                        </motion.div>
                    )}

                    {/* Losing Overlay */}
                    {gameState === 'lost' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-rose-500/10 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-rose-500 p-4 rounded-full mb-4 shadow-lg shadow-rose-500/50"
                            >
                                <XCircle className="text-white w-8 h-8" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-rose-400">Fin del juego</h2>
                            <p className="text-slate-300">Era el {targetLogo.name}</p>
                            {mode === 'hard' && <p className="text-brand-gold text-sm font-bold mt-1">{targetLogo.period}</p>}
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="relative">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Escribe el nombre del equipo..."
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowSuggestions(true);
                            }}
                            disabled={gameState !== 'playing'}
                            className="w-full h-14 pl-12 pr-4 input-glass text-lg font-medium placeholder:text-slate-600 focus:bg-white/10"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && inputValue.trim()) {
                                    handleGuess(inputValue);
                                }
                            }}
                        />
                    </div>

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden z-50 p-1 border-brand-accent/20 shadow-2xl"
                            >
                                {suggestions.map((logo) => (
                                    <button
                                        key={logo.id}
                                        onClick={() => handleGuess(logo.name)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg overflow-hidden p-1">
                                                <img src={logo.localPath || logo.pngUrl || ''} className="max-w-full max-h-full object-contain" alt="" />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium text-slate-200">{logo.name}</span>
                                                {logo.isHistorical && <span className="text-[10px] text-brand-gold font-bold uppercase">{logo.period}</span>}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-accent transition-colors" />
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Attempts List */}
                <div className="space-y-2">
                    {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
                        const guess = guesses[i];
                        const isCorrect = guess?.toLowerCase() === targetLogo.name.toLowerCase();

                        return (
                            <div
                                key={i}
                                className={cn(
                                    "h-12 rounded-xl flex items-center px-4 justify-between transition-all duration-500",
                                    guess
                                        ? isCorrect ? "bg-emerald-500/20 border border-emerald-500/30 shadow-inner shadow-emerald-500/10" : "bg-white/5 border border-white/10"
                                        : "border border-dashed border-white/5"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs font-bold text-slate-600 w-4">{i + 1}</span>
                                    <span className={cn(
                                        "font-medium",
                                        guess ? "text-slate-200" : "text-slate-700"
                                    )}>
                                        {guess || '......'}
                                    </span>
                                </div>
                                {guess && (
                                    isCorrect
                                        ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        : <XCircle className="w-5 h-5 text-rose-500" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Controls */}
                {gameState !== 'playing' && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => startNewGame()}
                        className="w-full h-14 bg-brand-accent hover:bg-brand-accent/80 text-brand-dark font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-brand-accent/20"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Siguiente Escudo</span>
                    </motion.button>
                )}
            </main>

            {/* Footer / Info */}
            <footer className="mt-auto pt-12 text-slate-600 text-sm flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-400">{filteredLogos.length}</span>
                        <span>{mode === 'easy' ? 'Escudos' : 'Históricos'}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-800" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-400 capitalize">{mode}</span>
                        <span>Modo</span>
                    </div>
                    <div className="w-px h-8 bg-slate-800" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-400">{new Set(filteredLogos.map(l => l.country)).size}</span>
                        <span>Países</span>
                    </div>
                </div>
                <p>© 2026 Escudle • Hecho con pasión</p>
            </footer>
        </div>
    );
}
