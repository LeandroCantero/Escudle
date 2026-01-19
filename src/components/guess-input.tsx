import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Search } from 'lucide-react';
import { GameState } from '../hooks/use-game-logic';
import { Logo } from '../hooks/use-logo-search';

interface GuessInputProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    showSuggestions: boolean;
    setShowSuggestions: (show: boolean) => void;
    suggestions: Logo[];
    gameState: GameState;
    handleGuess: (name: string) => void;
}

export const GuessInput = ({
    inputValue,
    setInputValue,
    showSuggestions,
    setShowSuggestions,
    suggestions,
    gameState,
    handleGuess
}: GuessInputProps) => {
    return (
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
                    className="w-full h-16 pl-14 pr-4 neo-input text-xl font-bold placeholder:text-gray-400 placeholder:font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && inputValue.trim()) {
                            handleGuess(inputValue);
                        }
                    }}
                />
            </div>

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
    );
};
