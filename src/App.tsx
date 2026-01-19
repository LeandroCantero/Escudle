import { CountrySelector } from './components/country-selector';
import { DailyStatsModal } from './components/daily-stats-modal';
import { GameFooter } from './components/game-footer';
import { GameHeader } from './components/game-header';
import { HelpModal } from './components/help-modal';
import { InfiniteStatsModal } from './components/infinite-stats-modal';
import { MainLayout } from './components/layout/main-layout';
import { GameScreen } from './components/screens/game-screen';
import { StartScreen } from './components/screens/start-screen';
import { useGameLogic } from './hooks/use-game-logic';

export const App = () => {
    const {
        gameMode,
        difficulty,
        dataset,
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
        exitGame,
        dailyStats,
        timeUntilNext,
        infiniteStats,
        infiniteSession,
        showInfiniteStats,
        setShowInfiniteStats,
        infiniteNewHighScore,
        showDailyStats,
        setShowDailyStats
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
                            setShowHelp={setShowHelp}
                            onShowStats={() => {
                                if (gameMode === 'daily') setShowDailyStats(true);
                                if (gameMode === 'infinite') setShowInfiniteStats(true);
                            }}
                        />
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
                        onStartGame={(m, d, ds, showStats) => {
                            startNewGame(m, d, ds);
                            if (showStats) {
                                setShowDailyStats(true);
                            }
                        }}
                        onOpenCountrySelector={() => setShowCountrySelector(true)}
                        selectedCountriesCount={selectedCountries.length}
                        setShowHelp={setShowHelp}
                        timeUntilNext={timeUntilNext}
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
                            infiniteModeScore={infiniteSession?.score}
                            infiniteModeHighScore={infiniteStats?.highScore}
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

            <DailyStatsModal
                isOpen={showDailyStats}
                onClose={() => setShowDailyStats(false)}
                stats={{
                    ...dailyStats,
                    targetName: targetLogo?.name || ''
                }}
                timeUntilNext={timeUntilNext}
                difficulty={difficulty}
                onNextDifficulty={() => {
                    if (difficulty === 'hard') return;
                    const nextDiff = difficulty === 'easy' ? 'medium' : 'hard';
                    setShowDailyStats(false);
                    startNewGame('daily', nextDiff, dataset);
                }}
            />

            <InfiniteStatsModal
                isOpen={showInfiniteStats}
                onClose={() => setShowInfiniteStats(false)}
                stats={infiniteStats}
                currentScore={infiniteSession?.score || 0}
                isNewHighScore={infiniteNewHighScore}
                targetLogo={targetLogo}
                difficulty={difficulty}
                onPlayAgain={() => {
                    setShowInfiniteStats(false);
                    startNewGame();
                }}
            />
        </>
    );
};
