import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, XCircle } from 'lucide-react';
import { Difficulty, GameState } from '../hooks/use-game-logic';
import { Logo } from '../hooks/use-logo-search';
import { cn } from '../utils/cn';

interface LogoDisplayProps {
    targetLogo: Logo;
    difficulty: Difficulty;
    gameState: GameState;
    guesses?: string[];
}

export const LogoDisplay = ({ targetLogo, difficulty, gameState, guesses = [] }: LogoDisplayProps) => {
    // Determine how many tiles to reveal for Medium mode
    // guesses.length = number of wrong attempts (usually).
    // We want to reveal 1 tile per wrong guess?
    // Max attempts = 6. 2x3 grid = 6 tiles.
    // If guesses.length = 0, 0 tiles revealed.
    // If guesses.length = 1, 1 tile revealed.
    // ...
    // Note: We need a deterministic but "random-looking" way to reveal tiles so they don't always open in order 1,2,3...
    // We can use a seeded shuffle based on targetLogo.id to keep it consistent for that logo?
    // Or just simple index mapping since the grid is abstract.
    // Let's just reveal in order 0-5 for simplicity first, or shuffle indices.

    // Simple shuffle based on logo name length to be pseudo-random but consistent per logo
    const getRevealOrder = (id: string) => {
        const order = [0, 1, 2, 3, 4, 5];
        const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        // Simple distinct shuffle
        return order.sort((a, b) => ((seed * (a + 1)) % 7) - ((seed * (b + 1)) % 7));
    };

    const revealOrder = getRevealOrder(targetLogo.name); // Using name as ID proxy
    const tilesToReveal = revealOrder.slice(0, guesses.length);

    return (
        <div
            className="neo-card rounded-3xl p-6 flex flex-col items-center justify-center relative aspect-square overflow-hidden bg-white max-w-xs mx-auto select-none"
            onContextMenu={(e) => e.preventDefault()}
        >
            {targetLogo.isHistorical && (
                <div className="absolute top-4 right-4 z-20">
                    <span className="bg-neo-orange text-neo-black text-xs font-black px-3 py-1 rounded-md border-2 border-neo-black shadow-neo-sm">
                        {targetLogo.period || 'RETRO'}
                    </span>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${targetLogo.id}-${difficulty}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    className="relative z-10 w-full h-full flex items-center justify-center p-4"
                >
                    {/* EASY MODE: Just the color logo */}
                    {difficulty === 'easy' && (
                        <img
                            src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                            alt="Escudo a adivinar"
                            className="w-48 h-48 object-contain filter drop-shadow-lg pointer-events-none select-none"
                            draggable={false}
                        />
                    )}

                    {/* HARD MODE: Perfect Silhouette using Filters */}
                    {difficulty === 'hard' && (
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {/* The Silhouette Layer */}
                            <img
                                src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                                alt="Silhouette"
                                className={cn(
                                    "absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-700",
                                    (gameState === 'won' || gameState === 'lost') ? "opacity-0" : "opacity-100 blur-sm"
                                )}
                                style={{
                                    filter: 'brightness(0) drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000)'
                                }}
                                draggable={false}
                            />
                            {/* The Result Layer (Colors) */}
                            <img
                                src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                                alt="Resultado"
                                className={cn(
                                    "w-full h-full object-contain pointer-events-none select-none transition-opacity duration-700",
                                    (gameState === 'won' || gameState === 'lost') ? "opacity-100" : "opacity-0"
                                )}
                                draggable={false}
                            />
                        </div>
                    )}

                    {/* MEDIUM MODE: Silhouette Base + Grid Reveal */}
                    {difficulty === 'medium' && (
                        <div className="relative w-48 h-48">
                            {/* Base Layer: Perfect Silhouette using Filters */}
                            <img
                                src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                                alt="Silhouette Base"
                                className={cn(
                                    "absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-700",
                                    (gameState === 'won' || gameState === 'lost') ? "opacity-0" : "opacity-100"
                                )}
                                style={{
                                    filter: 'brightness(0) drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000)'
                                }}
                                draggable={false}
                            />

                            {/* Reveal Layer: Grid of Color segments */}
                            {(gameState === 'playing') && (
                                <div className="absolute inset-0 w-full h-full grid grid-cols-2 grid-rows-3">
                                    {[0, 1, 2, 3, 4, 5].map((index) => {
                                        const isRevealed = tilesToReveal.includes(index);
                                        // Calculate position for the inner image to align strictly
                                        // Grid: 2 cols (50% w), 3 rows (33.33% h)
                                        // Index 0: Row 0, Col 0 -> top: 0, left: 0
                                        // Index 1: Row 0, Col 1 -> top: 0, left: -100%
                                        // Index 2: Row 1, Col 0 -> top: -100%, left: 0
                                        // ...
                                        const row = Math.floor(index / 2); // 0, 1, 2
                                        const col = index % 2; // 0, 1

                                        return (
                                            <div key={index} className="relative overflow-hidden w-full h-full">
                                                {isRevealed && (
                                                    <img
                                                        src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                                                        alt={`Segment ${index}`}
                                                        style={{
                                                            width: '200%', // Relative to Cell Width (50% of parent) -> 200% = Parent Width
                                                            height: '300%', // Relative to Cell Height (33% of parent) -> 300% = Parent Height
                                                            top: `${-row * 100}%`,
                                                            left: `${-col * 100}%`
                                                        }}
                                                        className="absolute max-w-none w-[200%] h-[300%] object-contain pointer-events-none select-none"
                                                        draggable={false}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Full Reveal on End Game */}
                            {(gameState === 'won' || gameState === 'lost') && (
                                <motion.img
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                                    alt="Resultado"
                                    className="absolute inset-0 w-full h-full object-contain z-30 pointer-events-none select-none"
                                    draggable={false}
                                />
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {gameState === 'won' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-4 bottom-4 bg-[#4ade80] border-2 border-neo-black p-4 rounded-xl shadow-neo text-center z-20"
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
    );
};
