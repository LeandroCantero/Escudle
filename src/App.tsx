import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useGameLogic } from './hooks/use-game-logic';
import { useLogoSearch } from './hooks/use-logo-search';

// Components
import { GameFooter } from './components/game-footer';
import { GameHeader } from './components/game-header';
import { GuessInput } from './components/guess-input';
import { GuessList } from './components/guess-list';
import { LogoDisplay } from './components/logo-display';

export const App = () => {
    const {
        mode,
        targetLogo,
        guesses,
        inputValue,
        setInputValue,
        gameState,
        showSuggestions,
        setShowSuggestions,
        showHelp,
        setShowHelp,
        filteredLogos,
        loading,
        startNewGame,
        handleGuess
    } = useGameLogic();

    const suggestions = useLogoSearch(filteredLogos, inputValue, {
        limit: 10,
        threshold: 0.3
    });

    if (loading || !targetLogo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neo-green text-center p-4">
                <div className="space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neo-black mx-auto"></div>
                    <p className="font-black text-neo-black uppercase tracking-widest animate-pulse">
                        Cargando Escuadra...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 space-y-8 max-w-lg mx-auto">
            <GameHeader
                mode={mode}
                showHelp={showHelp}
                setShowHelp={setShowHelp}
                startNewGame={startNewGame}
            />

            <main className="w-full space-y-6">
                <LogoDisplay
                    targetLogo={targetLogo}
                    mode={mode}
                    gameState={gameState}
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

                {gameState !== 'playing' && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={() => startNewGame()}
                        className="w-full h-16 bg-neo-blue text-white font-black text-xl uppercase rounded-xl flex items-center justify-center space-x-3 neo-btn"
                    >
                        <RotateCcw className="w-6 h-6" />
                        <span>Siguiente Escudo</span>
                    </motion.button>
                )}
            </main>

            <GameFooter
                logosCount={filteredLogos.length}
                countriesCount={new Set(filteredLogos.map(l => l.country)).size}
            />
        </div>
    );
};
