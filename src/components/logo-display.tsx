import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, XCircle } from 'lucide-react';
import { GameMode, GameState } from '../hooks/use-game-logic';
import { Logo } from '../hooks/use-logo-search';
import { cn } from '../utils/cn';

interface LogoDisplayProps {
    targetLogo: Logo;
    mode: GameMode;
    gameState: GameState;
}

export const LogoDisplay = ({ targetLogo, mode, gameState }: LogoDisplayProps) => {
    return (
        <div className="neo-card rounded-3xl p-8 flex flex-col items-center justify-center relative aspect-square overflow-hidden bg-white">
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
