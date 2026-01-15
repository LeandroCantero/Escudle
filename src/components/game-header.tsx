import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { GameMode } from '../hooks/use-game-logic';

interface GameHeaderProps {
    mode: GameMode;
    showHelp: boolean;
    setShowHelp: (show: boolean) => void;
    startNewGame: (newMode?: GameMode) => void;
    onOpenCountrySelector: () => void;
    onExitGame: () => void;
}

export const GameHeader = ({
    onExitGame,
    showHelp,
    setShowHelp
}: GameHeaderProps) => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex items-center justify-between py-2 relative z-30"
        >
            <div className="flex items-center space-x-2 md:space-x-3">
                <img
                    src="/escudle-logo.png"
                    alt="Escudle Logo"
                    className="h-10 md:h-12 w-auto drop-shadow-[2px_2px_0px_#000]"
                />
                <h1 className="text-2xl md:text-3xl font-['Permanent_Marker'] text-white uppercase tracking-wider drop-shadow-[3px_3px_0px_#000] rotate-[-2deg]">
                    Escudle
                </h1>
            </div>

            <div className="flex items-center space-x-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: 2, y: 2 }}
                    onClick={() => setShowHelp(true)}
                    className="bg-white text-neo-black rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-neo-yellow transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center font-['Permanent_Marker'] text-xl"
                >
                    ?
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: 2, y: 2 }}
                    onClick={onExitGame}
                    className="bg-red-500 text-white rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-red-600 transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center -rotate-3"
                    title="Salir al menú"
                >
                    <LogOut className="w-5 h-5" />
                </motion.button>
            </div>
        </motion.header>
    );
};
