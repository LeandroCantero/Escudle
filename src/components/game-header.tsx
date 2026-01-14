import { AnimatePresence, motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { GameMode } from '../hooks/use-game-logic';
import { cn } from '../utils/cn';

interface GameHeaderProps {
    mode: GameMode;
    showHelp: boolean;
    setShowHelp: (show: boolean) => void;
    startNewGame: (newMode?: GameMode) => void;
}

export const GameHeader = ({ mode, showHelp, setShowHelp, startNewGame }: GameHeaderProps) => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full space-y-6"
        >
            <div className="flex items-center justify-between w-full relative z-20">
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

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img
                        src="/escudle-logo.png"
                        alt="ESCUDLE"
                        className="h-12 md:h-16 w-auto drop-shadow-[4px_4px_0px_#000] rotate-[-5deg]"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: 2, y: 2 }}
                    onClick={() => setShowHelp(true)}
                    className="bg-white text-neo-black rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-neo-yellow transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center font-['Permanent_Marker'] text-2xl"
                >
                    ?
                </motion.button>
            </div>

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
    );
};
