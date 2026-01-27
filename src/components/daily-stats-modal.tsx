import { AnimatePresence, motion } from 'framer-motion';
import { Flame, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DailyStats } from '../hooks/use-daily-state';

interface DailyStatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: DailyStats;
    timeUntilNext: number;
    difficulty: string;
    onNextDifficulty?: () => void;
}

export const DailyStatsModal = ({ isOpen, onClose, stats, timeUntilNext, difficulty, onNextDifficulty }: DailyStatsModalProps) => {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const winRate = stats.totalPlayed > 0 ? Math.round((stats.totalWins / stats.totalPlayed) * 100) : 0;

    const maxDistribution = Math.max(...Object.values(stats.guessDistribution), 1);

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
                        className="bg-white border-[4px] border-neo-black shadow-neo rounded-2xl w-full max-w-md relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-neo-white border-2 border-neo-black rounded-lg hover:bg-neo-yellow transition-colors"
                        >
                            <X size={20} className="text-neo-black" />
                        </button>

                        <div className="p-8 space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-neo-black">
                                    Estadísticas <span className="text-xl block text-neo-blue">({getDifficultyLabel(difficulty)})</span>
                                </h2>
                            </div>

                            {/* Summary Stats */}
                            <div className="grid grid-cols-4 gap-2">
                                <div className="text-center">
                                    <p className="text-2xl font-black">{stats.totalPlayed}</p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Jugados</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black">{winRate}%</p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Victorias</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black flex items-center justify-center gap-1">
                                        {stats.currentStreak} <Flame size={16} className="text-neo-orange" />
                                    </p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Racha</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black">{stats.maxStreak}</p>
                                    <p className="text-[10px] font-bold uppercase opacity-60">Máxima</p>
                                </div>
                            </div>

                            {/* Guess Distribution */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-black uppercase tracking-wider text-center">Distribución de Intentos</h3>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <div key={num} className="flex items-center gap-2">
                                            <span className="text-xs font-bold w-3">{num}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                                                <div
                                                    className="bg-neo-blue h-full transition-all duration-1000 flex items-center justify-end pr-2"
                                                    style={{
                                                        width: `${Math.max((stats.guessDistribution[num] || 0) / maxDistribution * 100, 5)}%`,
                                                        minWidth: '24px'
                                                    }}
                                                >
                                                    <span className="text-[10px] font-black text-white">{stats.guessDistribution[num] || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Information */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-neo-black/10">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold uppercase opacity-60">Siguiente Escudo</p>
                                    <p className="text-xl font-black font-mono">{formatTime(timeUntilNext)}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => {
                                            // Calculate game number based on a launch date (Day 1)
                                            // You can set VITE_LAUNCH_DATE in your .env file (e.g., 2026-01-15)
                                            const launchDateStr = import.meta.env.VITE_LAUNCH_DATE || '2026-01-15';
                                            const startDate = new Date(launchDateStr).getTime();
                                            const today = new Date().setHours(0, 0, 0, 0);
                                            const gameNumber = Math.max(1, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1);

                                            const target = stats.targetName.toLowerCase();
                                            const emojiGrid = stats.lastGuesses.map(g =>
                                                g.toLowerCase() === target ? '🟩' : '⬜'
                                            ).join('\n');

                                            const result = stats.gameState === 'won' ? `${stats.lastGuesses.length}/6` : 'X/6';
                                            const text = `Escudle #${gameNumber} ${result}\n${emojiGrid}\n\nhttps://escudle.netlify.app/`;

                                            navigator.clipboard.writeText(text).then(() => {
                                                setShowToast(true);
                                            }).catch(() => {
                                                // Fallback
                                            });
                                        }}
                                        className="bg-neo-green text-white font-black py-3 rounded-xl border-2 border-neo-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                                    >
                                        COMPARTIR
                                    </button>

                                    {difficulty !== 'hard' && onNextDifficulty && (
                                        <button
                                            onClick={onNextDifficulty}
                                            className="bg-neo-yellow text-neo-black font-black py-3 rounded-xl border-2 border-neo-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                                        >
                                            SIGUIENTE NIVEL <Flame size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Custom Toast Notification - Inside modal, positioned over button */}
                            <AnimatePresence>
                                {showToast && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
                                        animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                                        exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
                                        className="absolute bottom-24 left-1/2 z-[10002] bg-neo-black text-white px-6 py-3 rounded-xl border-2 border-white shadow-neo font-black uppercase text-sm whitespace-nowrap"
                                    >
                                        ¡Copiado al portapapeles!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
