import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Medal, RotateCcw, Trophy, X } from 'lucide-react';
import { InfiniteStats } from '../hooks/use-infinite-state';
import { Logo } from '../hooks/use-logo-search';

interface InfiniteStatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: InfiniteStats;
    currentScore: number;
    isNewHighScore: boolean;
    onPlayAgain: () => void;
    targetLogo: Logo | null;
    difficulty: string;
}

export const InfiniteStatsModal = ({
    isOpen,
    onClose,
    stats,
    currentScore,
    isNewHighScore,
    onPlayAgain,
    targetLogo,
    difficulty
}: InfiniteStatsModalProps) => {

    const getDifficultyLabel = (d: string) => {
        switch (d) {
            case 'easy': return 'Fácil';
            case 'medium': return 'Medio';
            case 'hard': return 'Difícil';
            default: return d;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neo-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white border-[4px] border-neo-black shadow-neo rounded-2xl w-full max-w-sm relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* New Record Banner */}
                        {isNewHighScore && (
                            <div className="bg-neo-yellow border-b-2 border-neo-black py-2 text-center animate-pulse">
                                <p className="font-black uppercase text-neo-black flex items-center justify-center gap-2">
                                    <Trophy size={16} /> ¡Nuevo Récord! <Trophy size={16} />
                                </p>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-neo-white border-2 border-neo-black rounded-lg hover:bg-neo-yellow transition-colors z-10"
                        >
                            <X size={20} className="text-neo-black" />
                        </button>

                        <div className="p-8 space-y-6">
                            <div className="text-center pt-4">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-neo-black mb-1">
                                    Modo Infinito <span className="text-base text-neo-blue block">({getDifficultyLabel(difficulty)})</span>
                                </h2>
                                <p className="text-neo-purple font-bold">Resumen de sesión</p>
                            </div>

                            {/* Main Score Display */}
                            <div className="bg-neo-white p-6 rounded-xl border-2 border-neo-black shadow-neo-sm text-center transform rotate-1">
                                <p className="text-[10px] font-bold uppercase opacity-60 mb-2">Puntaje</p>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-5xl font-black text-neo-black">{currentScore}</span>
                                    <Flame size={32} className="text-neo-orange animate-bounce" />
                                </div>
                                <p className="text-sm font-bold mt-2">Escudos adivinados</p>
                            </div>

                            {/* Missed Logo Preview */}
                            {targetLogo && (
                                <div className="bg-neo-blue/5 border-2 border-dashed border-neo-blue/30 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white rounded-lg border border-neo-black/10 p-2 flex items-center justify-center shrink-0">
                                        <img
                                            src={targetLogo.localPath || targetLogo.svgUrl || targetLogo.pngUrl || ''}
                                            alt={targetLogo.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase opacity-60">Era el:</p>
                                        <p className="font-black text-neo-black leading-tight">{targetLogo.name}</p>
                                        <p className="text-[10px] font-bold text-neo-blue uppercase">{targetLogo.country}</p>
                                    </div>
                                </div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 rounded-xl border border-neo-black/20 text-center">
                                    <div className="flex justify-center mb-1">
                                        <Medal size={20} className="text-neo-yellow drop-shadow-sm" />
                                    </div>
                                    <p className="text-xl font-black">{stats.highScore}</p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Mejor Racha</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl border border-neo-black/20 text-center">
                                    <div className="flex justify-center mb-1">
                                        <Trophy size={20} className="text-neo-blue drop-shadow-sm" />
                                    </div>
                                    <p className="text-xl font-black">{stats.totalCorrect}</p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Aciertos Totales</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={onPlayAgain}
                                className="w-full bg-neo-green text-white font-black py-4 rounded-xl border-2 border-neo-black shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-2 text-lg uppercase"
                            >
                                <RotateCcw size={24} />
                                Jugar de Nuevo
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
