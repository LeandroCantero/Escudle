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
import { useLogoSearch, type Logo } from './hooks/useLogoSearch';

// --- Types ---
// Re-using Logo from hook or keeping local if preferred, but let's use the imported one for consistency
// define local one to avoid major refactors if I can't import properly, but I can.
// Actually, to minimize diff, let's just comment out the local interface or remove it.
// Removing it is cleaner.


const MAX_ATTEMPTS = 6;

export default function App() {
    // Game State
    const [mode, setMode] = useState<'easy' | 'hard'>('easy');
    const [targetLogo, setTargetLogo] = useState<Logo | null>(null);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    // Filtered logos based on mode
    const filteredLogos = useMemo(() => {
        return allLogos.filter(l => mode === 'easy' ? !l.isHistorical : l.isHistorical) as Logo[];
    }, [mode]);

    // Suggestions logic
    // Suggestions logic (Fuse.js)
    const suggestions = useLogoSearch(filteredLogos, inputValue, {
        limit: 10,
        threshold: 0.3
    });

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
        <div className="min-h-screen flex items-center justify-center bg-neo-green">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-neo-black"></div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 space-y-8 max-w-lg mx-auto">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center w-full space-y-6"
            >

                {/* Header Row */}
                <div className="flex items-center justify-between w-full relative z-20">
                    {/* Left: Dopartis */}
                    <a
                        href="https://dopartis.com"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:scale-105 transition-transform"
                    >
                        <img
                            src="/hecho por dopartis - white.png"
                            alt="Hecho por dopartis"
                            className="h-8 md:h-10 w-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        />
                    </a>

                    {/* Center: Escudle Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <img
                            src="/escudle-logo.png"
                            alt="ESCUDLE"
                            className="h-12 md:h-16 w-auto drop-shadow-[4px_4px_0px_#000] rotate-[-5deg]"
                        />
                    </div>

                    {/* Right: Help Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ x: 2, y: 2 }}
                        onClick={() => setShowHelp(true)}
                        className="bg-white text-neo-black rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-neo-yellow transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center font-['Permanent_Marker'] text-2xl"
                    >
                        ?
                    </motion.button>
                </div>


                {/* Help Modal */}
                <AnimatePresence>
                    {showHelp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowHelp(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white border-4 border-neo-black rounded-3xl p-6 md:p-8 max-w-md w-full shadow-neo relative"
                            >
                                <button
                                    onClick={() => setShowHelp(false)}
                                    className="absolute top-4 right-4 text-neo-black hover:scale-110 transition-transform"
                                >
                                    <XCircle className="w-8 h-8" />
                                </button>

                                <h2 className="text-3xl font-black text-neo-black mb-4 uppercase text-center border-b-4 border-neo-yellow inline-block px-4 -rotate-2">
                                    Cómo Jugar
                                </h2>

                                <div className="space-y-4 text-neo-black font-medium text-lg text-center">
                                    <p>
                                        ¡Adiviná el equipo de fútbol oculto detrás de la silueta!
                                    </p>
                                    <ul className="text-left space-y-2 bg-gray-100 p-4 rounded-xl border-2 border-neo-black/10">
                                        <li className="flex items-start gap-2">
                                            <span className="bg-neo-green text-neo-black w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border border-neo-black shrink-0">1</span>
                                            <span>Tenés <strong>6 intentos</strong> para adivinar el escudo.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="bg-neo-yellow text-neo-black w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border border-neo-black shrink-0">2</span>
                                            <span>En <strong>Modo Fácil</strong> el escudo se ve normal.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="bg-neo-purple text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border border-neo-black shrink-0">3</span>
                                            <span>En <strong>Modo Difícil</strong> está oscuro y borroso.</span>
                                        </li>
                                    </ul>
                                    <p className="text-sm opacity-75">
                                        ¡Demostrá cuánto sabés de fútbol!
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mode Selector - Moved below header */}
                <div className="flex bg-neo-white p-1.5 rounded-xl border-[3px] border-neo-black shadow-neo w-full max-w-md mx-auto">

                    <button
                        onClick={() => startNewGame('easy')}
                        className={cn(
                            "flex-1 px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all border-2",
                            mode === 'easy'
                                ? "bg-neo-yellow border-neo-black text-neo-black shadow-neo-sm translate-x-[1px] translate-y-[1px]"
                                : "bg-transparent border-transparent text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        Modo Fácil
                    </button>
                    <button
                        onClick={() => startNewGame('hard')}
                        className={cn(
                            "flex-1 px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all border-2",
                            mode === 'hard'
                                ? "bg-neo-purple border-neo-black text-white shadow-neo-sm translate-x-[1px] translate-y-[1px]"
                                : "bg-transparent border-transparent text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        Modo Difícil
                    </button>
                </div>
            </motion.header>

            {/* Main Game Card */}
            <main className="w-full space-y-6">
                {/* Logo Display */}
                <div className="neo-card rounded-3xl p-8 flex flex-col items-center justify-center relative aspect-square overflow-hidden bg-white">
                    {/* Period Badge */}
                    {mode === 'hard' && (
                        <div className="absolute top-4 right-4 z-20">
                            <span className="bg-neo-orange text-neo-black text-xs font-black px-3 py-1 rounded-md border-2 border-neo-black shadow-neo-sm">
                                {targetLogo.period || 'RETRO'}
                            </span>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${targetLogo.id}-${mode}`}
                            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            transition={{ type: "spring", damping: 12, stiffness: 100 }}
                            className="relative z-10 w-full h-full flex items-center justify-center"
                        >
                            <img
                                src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                                alt="Escudo a adivinar"
                                className={cn(
                                    "w-48 h-48 object-contain transition-all duration-700 filter",
                                    (mode === 'easy' || gameState !== 'playing') ? "brightness-100 blur-0 grayscale-0" : "brightness-0 opacity-10 blur-md grayscale"
                                )}
                            />
                            {gameState === 'playing' && mode !== 'easy' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-neo-black/20 text-9xl font-black select-none">?</div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Winning Overlay */}
                    {gameState === 'won' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-x-4 bottom-4 bg-neo-success border-2 border-neo-black p-4 rounded-xl shadow-neo text-center z-20"
                        >
                            <div className="flex justify-center mb-2">
                                <div className="bg-white p-2 rounded-full border-2 border-neo-black">
                                    <Trophy className="text-neo-black w-6 h-6" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-neo-black uppercase">¡Correcto!</h2>
                            <p className="text-neo-black font-bold">{targetLogo.name}</p>
                        </motion.div>
                    )}

                    {/* Losing Overlay */}
                    {gameState === 'lost' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-x-4 bottom-4 bg-neo-orange border-2 border-neo-black p-4 rounded-xl shadow-neo text-center z-20"
                        >
                            <div className="flex justify-center mb-2">
                                <div className="bg-white p-2 rounded-full border-2 border-neo-black">
                                    <XCircle className="text-neo-black w-6 h-6" />
                                </div>
                            </div>
                            <h2 className="text-xl font-black text-neo-black uppercase">¡Fin del juego!</h2>
                            <p className="text-neo-black font-medium">Era: <span className="font-bold">{targetLogo.name}</span></p>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="relative">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-neo-black transition-colors" />
                        <input
                            type="text"
                            placeholder="ESCRIBÍ EL EQUIPO..."
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowSuggestions(true);
                            }}
                            disabled={gameState !== 'playing'}
                            className="w-full h-16 pl-14 pr-4 neo-input text-xl font-bold placeholder:text-gray-400 placeholder:font-medium uppercase"
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
                                className="absolute top-full left-0 right-0 mt-3 bg-white border-[3px] border-neo-black rounded-xl overflow-hidden z-50 shadow-neo max-h-[300px] overflow-y-auto"
                            >
                                {suggestions.map((logo) => (
                                    <button
                                        key={logo.id}
                                        onClick={() => handleGuess(logo.name)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-neo-yellow/20 border-b-2 border-neo-black/10 last:border-0 transition-colors group text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-neo-black overflow-hidden p-1">
                                                <img src={logo.localPath || logo.pngUrl || ''} className="max-w-full max-h-full object-contain" alt="" />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="font-bold text-neo-black uppercase">{logo.name}</span>
                                                {logo.isHistorical && <span className="text-[10px] bg-neo-purple text-white px-2 py-0.5 rounded-full font-bold uppercase">{logo.period}</span>}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-neo-black group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Attempts List */}
                <div className="space-y-3">
                    {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
                        const guess = guesses[i];
                        const isCorrect = guess?.toLowerCase() === targetLogo.name.toLowerCase();

                        return (
                            <div
                                key={i}
                                className={cn(
                                    "h-12 rounded-lg flex items-center px-4 justify-between transition-all duration-300 border-2 font-bold",
                                    guess
                                        ? isCorrect
                                            ? "bg-neo-success border-neo-black text-neo-black shadow-neo-sm"
                                            : "bg-neo-white border-neo-black text-neo-black"
                                        : "bg-white/50 border-neo-black/20 text-gray-400 border-dashed"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-black text-neo-black w-6 bg-neo-yellow rounded-full h-6 flex items-center justify-center border border-neo-black">{i + 1}</span>
                                    <span className="uppercase truncate">
                                        {guess || '......'}
                                    </span>
                                </div>
                                {guess && (
                                    isCorrect
                                        ? <CheckCircle2 className="w-6 h-6 text-neo-black fill-neo-success" />
                                        : <XCircle className="w-6 h-6 text-neo-black fill-neo-orange" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Controls */}
                {gameState !== 'playing' && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={() => startNewGame()}
                        className="w-full h-16 bg-neo-blue text-white font-black text-xl uppercase rounded-xl flex items-center justify-center space-x-3 neo-btn"
                    >
                        <RotateCcw className="w-6 h-6" />
                        <span>Siguiente Escudo</span>
                    </motion.button>
                )}
            </main>

            {/* Footer / Info */}
            <footer className="mt-auto py-8 text-neo-black text-sm font-bold flex flex-col items-center space-y-4">
                <div className="flex divide-x-2 divide-neo-black bg-neo-white border-[3px] border-neo-black rounded-xl shadow-neo p-2">
                    <div className="px-4 text-center">
                        <div className="text-xl font-black">{filteredLogos.length}</div>
                        <div className="text-xs uppercase">Escudos</div>
                    </div>
                    <div className="px-4 text-center">
                        <div className="text-xl font-black">{new Set(filteredLogos.map(l => l.country)).size}</div>
                        <div className="text-xs uppercase">Países</div>
                    </div>
                </div>
                <p className="opacity-90 text-white font-medium">© 2026 Escudle</p>
            </footer>
        </div >
    );
}
