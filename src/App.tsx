import { useState } from 'react';
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
    const [showStats, setShowStats] = useState(false);
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
        isTodayDone,
        dailyState,
        infiniteStats,
        infiniteSession,
        showInfiniteStats,
        setShowInfiniteStats,
        infiniteNewHighScore
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
                            setShowHelp={setShowHelp}
                            mode={gameMode}
                            startNewGame={startNewGame}
                            onOpenCountrySelector={() => setShowCountrySelector(true)}
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
                        onStartGame={(m, d, ds) => {
                            if (m === 'daily' && isTodayDone) {
                                setShowStats(true);
                                return;
                            }
                            startNewGame(m, d, ds);
                        }}
                        onOpenCountrySelector={() => setShowCountrySelector(true)}
                        selectedCountriesCount={selectedCountries.length}
                        setShowHelp={setShowHelp}
                        dailyState={dailyState}
                        dailyStats={dailyStats}
                        timeUntilNext={timeUntilNext}
                        isTodayDone={isTodayDone}
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
                isOpen={showStats}
                onClose={() => setShowStats(false)}
                stats={{
                    ...dailyStats,
                    targetName: targetLogo?.name || ''
                }}
                timeUntilNext={timeUntilNext}
            />

            <InfiniteStatsModal
                isOpen={showInfiniteStats}
                onClose={() => setShowInfiniteStats(false)}
                stats={infiniteStats}
                currentScore={infiniteSession?.score || 0}
                isNewHighScore={infiniteNewHighScore}
                targetLogo={targetLogo}
                onPlayAgain={() => {
                    setShowInfiniteStats(false);
                    startNewGame();
                }}
            />
        </>
    );
};
