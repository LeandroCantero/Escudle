import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Difficulty, GameMode, GameState } from '../../hooks/use-game-logic';
import { Logo, useLogoSearch } from '../../hooks/use-logo-search';
import { GuessInput } from '../guess-input';
import { GuessList } from '../guess-list';
import { LogoDisplay } from '../logo-display';

interface GameScreenProps {
    targetLogo: Logo;
    mode: GameMode;
    difficulty: Difficulty;
    gameState: GameState;
    inputValue: string;
    setInputValue: (value: string) => void;
    showSuggestions: boolean;
    setShowSuggestions: (show: boolean) => void;
    filteredLogos: Logo[];
    handleGuess: (name: string) => void;
    guesses: string[];
    onNextGame: () => void;
    // New props for Infinite Mode feedback
    infiniteModeScore?: number;
    infiniteModeHighScore?: number;
}

export const GameScreen = ({
    targetLogo,
    mode,
    difficulty,
    gameState,
    inputValue,
    setInputValue,
    showSuggestions,
    setShowSuggestions,
    filteredLogos,
    handleGuess,
    guesses,
    onNextGame,
    infiniteModeScore,
    infiniteModeHighScore
}: GameScreenProps) => {

    const suggestions = useLogoSearch(filteredLogos, inputValue, {
        limit: 10,
        threshold: 0.3
    });

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-start space-y-4">

            {/* Infinite Mode Score Indicator */}
            {mode === 'infinite' && infiniteModeScore !== undefined && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-neo-black/10"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-neo-orange font-black text-xl">{infiniteModeScore}</span>
                        <span className="text-xs font-bold uppercase opacity-60">Aciertos</span>
                    </div>
                    {infiniteModeHighScore !== undefined && infiniteModeHighScore > 0 && (
                        <div className="w-px h-6 bg-neo-black/20" />
                    )}
                    {infiniteModeHighScore !== undefined && infiniteModeHighScore > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase opacity-60">Récord:</span>
                            <span className="text-neo-black font-black">{Math.max(infiniteModeScore, infiniteModeHighScore)}</span>
                        </div>
                    )}
                </motion.div>
            )}

            <LogoDisplay
                targetLogo={targetLogo}
                difficulty={difficulty}
                gameState={gameState}
                guesses={guesses}
            />

            <GuessInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                suggestions={suggestions}
                gameState={gameState}
                handleGuess={handleGuess}
            />

            <GuessList
                guesses={guesses}
                targetLogo={targetLogo}
            />

            {gameState !== 'playing' && mode !== 'daily' && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    onClick={onNextGame}
                    className="w-full h-16 bg-neo-blue text-white font-black text-xl uppercase rounded-xl flex items-center justify-center space-x-3 neo-btn"
                >
                    <RotateCcw className="w-6 h-6" />
                    <span>{gameState === 'won' || mode === 'practice' ? 'Siguiente Escudo' : 'Reintentar'}</span>
                </motion.button>
            )}

            {gameState !== 'playing' && mode === 'daily' && (
                <div className="w-full space-y-4 pt-4">
                    <p className="text-center font-bold text-neo-black bg-neo-white border-2 border-neo-black p-4 rounded-xl shadow-neo-sm">
                        ¡Volvé mañana para el próximo escudo!
                    </p>
                </div>
            )}
        </div>
    );
};
