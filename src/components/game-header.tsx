import { motion } from 'framer-motion';
import { BarChart2, LogOut } from 'lucide-react';
import { APP_LOGO_PATH } from '../utils/constants';

interface GameHeaderProps {
    setShowHelp: (show: boolean) => void;
    onExitGame: () => void;
    onShowStats: () => void;
}

export const GameHeader = ({
    onExitGame,
    setShowHelp,
    onShowStats
}: GameHeaderProps) => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex items-center justify-between py-2 relative z-30"
        >
            <motion.div
                className="flex items-center space-x-2 md:space-x-3 cursor-pointer select-none"
                onClick={onExitGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img
                    src={APP_LOGO_PATH}
                    alt="Logo de Escudle"
                    className="h-10 md:h-12 w-auto drop-shadow-[2px_2px_0px_#000]"
                />
                <h1 className="text-2xl md:text-3xl font-['Permanent_Marker'] text-white uppercase tracking-wider drop-shadow-[3px_3px_0px_#000] rotate-[-2deg]">
                    Escudle
                </h1>
            </motion.div>

            <div className="flex items-center space-x-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: 2, y: 2 }}
                    onClick={onShowStats}
                    className="bg-neo-blue text-white rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-neo-blue/80 transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center -rotate-2"
                    aria-label="Ver estadísticas"
                >
                    <BarChart2 className="w-5 h-5" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: 2, y: 2 }}
                    onClick={() => setShowHelp(true)}
                    className="bg-white text-neo-black rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-neo-yellow transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center"
                    aria-label="Cómo jugar"
                >
                    <span className="font-['Permanent_Marker'] text-2xl">?</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: 2, y: 2 }}
                    onClick={onExitGame}
                    className="bg-red-500 text-white rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-red-600 transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center -rotate-3"
                    title="Salir al menú"
                    aria-label="Salir al menú principal"
                >
                    <LogOut className="w-5 h-5" />
                </motion.button>
            </div>
        </motion.header>
    );
};
