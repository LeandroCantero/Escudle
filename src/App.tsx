import { CountrySelector } from './components/country-selector';
import { GameFooter } from './components/game-footer';
import { GameHeader } from './components/game-header';
import { HelpModal } from './components/help-modal';
import { MainLayout } from './components/layout/main-layout';
import { GameScreen } from './components/screens/game-screen';
import { StartScreen } from './components/screens/start-screen';
import { GameMode, useGameLogic } from './hooks/use-game-logic';

export const App = () => {
    const {
        gameMode,
        difficulty,
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
        handleGuess,
        selectedCountries,
        setSelectedCountries,
        showCountrySelector,
        setShowCountrySelector,
        availableCountries,
        exitGame
    } = useGameLogic();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neo-green text-center p-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neo-black mx-auto"></div>
            </div>
        );
    }

    const logosCount = filteredLogos.length;
    const countriesCount = new Set(filteredLogos.map(l => l.country)).size;

    return (
        <>
            <MainLayout
                header={
                    gameState !== 'not_started' ? (
                        <GameHeader
                            onExitGame={exitGame}
                            showHelp={showHelp}
                            setShowHelp={setShowHelp} mode={'daily'} startNewGame={function (_newMode?: GameMode): void {
                                throw new Error('Function not implemented.');
                            }} onOpenCountrySelector={function (): void {
                                throw new Error('Function not implemented.');
                            }} />
                    ) : null
                }
                footer={
                    <GameFooter
                        logosCount={logosCount}
                        countriesCount={countriesCount}
                    />
                }
            >
                {gameState === 'not_started' ? (
                    <StartScreen
                        onStartGame={startNewGame}
                        onOpenCountrySelector={() => setShowCountrySelector(true)}
                        selectedCountriesCount={selectedCountries.length}
                        setShowHelp={setShowHelp}
                    />
                ) : (
                    targetLogo && (
                        <GameScreen
                            targetLogo={targetLogo}
                            mode={gameMode}
                            difficulty={difficulty}
                            gameState={gameState}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            showSuggestions={showSuggestions}
                            setShowSuggestions={setShowSuggestions}
                            filteredLogos={filteredLogos}
                            handleGuess={handleGuess}
                            guesses={guesses}
                            onNextGame={() => startNewGame()}
                        />
                    )
                )}
            </MainLayout>

            <HelpModal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                isInGame={gameState !== 'not_started'}
            />

            <CountrySelector
                isOpen={showCountrySelector}
                onClose={() => setShowCountrySelector(false)}
                availableCountries={availableCountries}
                selectedCountries={selectedCountries}
                onApply={(countries) => setSelectedCountries(countries)}
            />
        </>
    );
};
