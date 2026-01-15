import { motion } from 'framer-motion';
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
            <div className="flex items-start justify-between w-full relative z-20">
                <a
                    href="https://dopartis.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-105 transition-transform rotate-[-8deg] mt-2"
                >
                    <img
                        src="/hecho por dopartis - white.png"
                        alt="Hecho por dopartis"
                        className="h-8 md:h-10 w-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    />
                </a>

                <div className="flex flex-col items-center space-y-2">
                    <img
                        src="/escudle-logo.png"
                        alt="ESCUDLE"
                        className="h-14 md:h-20 w-auto drop-shadow-[4px_4px_0px_#000]"
                    />
                    <h1 className="text-5xl md:text-6xl font-['Permanent_Marker'] text-white uppercase tracking-wider drop-shadow-[4px_4px_0px_#000] rotate-[-2deg]">
                        ESCUDLE
                    </h1>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: 2, y: 2 }}
                    onClick={() => setShowHelp(true)}
                    className="bg-white text-neo-black rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-neo-yellow transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center font-['Permanent_Marker'] text-2xl rotate-[10deg] mt-2"
                >
                    ?
                </motion.button>
            </div>

            <div className="flex bg-neo-white p-1.5 rounded-xl border-[3px] border-neo-black shadow-neo w-full max-w-md mx-auto !mt-12">
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
