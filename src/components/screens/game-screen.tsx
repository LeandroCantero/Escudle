import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Difficulty, GameMode, GameState } from '../../hooks/use-game-logic';
import { Logo, useLogoSearch } from '../../hooks/use-logo-search';
import { GuessInput } from '../guess-input';
import { GuessList } from '../guess-list';
import { LogoDisplay } from '../logo-display';

interface GameScreenProps {
    targetLogo: Logo;
    mode: GameMode; // Using new GameMode type, but LogoDisplay references Difficulty mainly? 
    // Wait, LogoDisplay used 'mode' which was old 'easy'/'hard'.
    // Now we have 'difficulty'. LogoDisplay needs update too.
    // For now, I'll pass difficulty as 'mode' if I haven't updated LogoDisplay yet, 
    // OR I should update LogoDisplay props to accept 'difficulty'.
    // I will update LogoDisplay in the next step.
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
    onNextGame
}: GameScreenProps) => {

    const suggestions = useLogoSearch(filteredLogos, inputValue, {
        limit: 10,
        threshold: 0.3
    });

    return (
        <div className="w-full flex-1 flex flex-col items-center justify-start space-y-4">
            {/* We need to pass difficulty to LogoDisplay. 
                 StartScreen passes difficulty. 
                 LogoDisplay currently takes 'mode' (old). 
                 I'll pass difficulty as a prop named 'difficulty' and update LogoDisplay simultaneously or after.
                 For now, I'll pass it. 
             */}
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
                        ¡Vuelve mañana para el próximo escudo!
                    </p>
                </div>
            )}
        </div>
    );
};
