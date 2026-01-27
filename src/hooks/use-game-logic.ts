import { useCallback, useEffect, useMemo, useState } from 'react';
import { cleanLogoName } from '../utils/string-utils';
import { useDailyState } from './use-daily-state';
import { useInfiniteState } from './use-infinite-state';
import { Logo } from './use-logo-search';

export type GameState = 'not_started' | 'playing' | 'won' | 'lost';
export type GameMode = 'daily' | 'infinite' | 'practice';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Dataset = 'all' | 'current' | 'historic';

export const MAX_ATTEMPTS = 6;

export function useGameLogic() {
    const [gameMode, setGameMode] = useState<GameMode>('daily');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [dataset, setDataset] = useState<Dataset>('current');

    const [targetLogo, setTargetLogo] = useState<Logo | null>(null);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [gameState, setGameState] = useState<GameState>('not_started');
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [showCountrySelector, setShowCountrySelector] = useState(false);

    const [allLogos, setAllLogos] = useState<Logo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showInfiniteStats, setShowInfiniteStats] = useState(false);
    const [showDailyStats, setShowDailyStats] = useState(false);

    const {
        stats: dailyStats,
        timeUntilNext,
        initDailyGame,
        recordGuess,
        completeGame,
        isTodayDone
    } = useDailyState(difficulty);

    const {
        infiniteStats,
        currentSession: infiniteSession,
        resetSession: resetInfiniteSession,
        incrementScore: incrementInfiniteScore,
        addPlayedLogo,
        endSession: endInfiniteSession,
        isNewHighScore: infiniteNewHighScore
    } = useInfiniteState(difficulty);

    const availableCountries = useMemo<{ name: string, count: number }[]>(() => {
        const counts: Record<string, number> = {};
        allLogos.forEach(l => {
            counts[l.country] = (counts[l.country] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allLogos]);

    const filteredLogos = useMemo(() => {
        let logos = allLogos;

        if (gameMode === 'daily') {
            return logos.filter(l => l.type !== 'tournament');
        }

        if (dataset === 'current') {
            logos = logos.filter(l => !l.isHistorical);
        } else if (dataset === 'historic') {
            logos = logos.filter(l => l.isHistorical);
        }
        if (selectedCountries.length > 0) {
            logos = logos.filter(l => selectedCountries.includes(l.country));
        }
        return logos;
    }, [allLogos, gameMode, dataset, selectedCountries]);

    const [nextLogo, setNextLogo] = useState<Logo | null>(null);

    // Helper to pick a random logo from a pool
    const pickRandomLogo = useCallback((pool: Logo[]) => {
        return pool[Math.floor(Math.random() * pool.length)];
    }, []);

    // Preload next image when target changes to improve UX transitions
    useEffect(() => {
        // Preloading logic is handled within startNewGame for better sync with state
    }, [targetLogo]);

    const startNewGame = useCallback((newGameMode?: GameMode, newDifficulty?: Difficulty, newDataset?: Dataset) => {
        const activeGameMode = newGameMode || gameMode;
        const activeDifficulty = newDifficulty || difficulty;
        const activeDataset = newDataset || dataset;

        if (newGameMode) setGameMode(newGameMode);
        if (newDifficulty) setDifficulty(newDifficulty);
        if (newDataset) setDataset(newDataset);

        let pool = allLogos;
        if (activeGameMode === 'daily') {
            pool = allLogos.filter(l => l.type !== 'tournament');
        } else {
            if (activeDataset === 'current') pool = pool.filter(l => !l.isHistorical);
            if (activeDataset === 'historic') pool = pool.filter(l => l.isHistorical);
            if (selectedCountries.length > 0) {
                pool = pool.filter(l => selectedCountries.includes(l.country));
            }
        }

        if (pool.length === 0) {
            console.warn(`No logos for current configuration`);
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        let seededTarget: Logo | null = null;

        if (activeGameMode === 'daily') {
            const seedString = `${today}-${activeDifficulty}`;
            let hash = 0;
            for (let i = 0; i < seedString.length; i++) {
                hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
                hash |= 0;
            }
            const seed = Math.abs(hash);
            const index = seed % pool.length;
            seededTarget = pool[index];
        }

        // Common Resets
        setInputValue('');
        setShowSuggestions(false);

        if (activeGameMode === 'daily') {
            const stateKey = `escudle_daily_state_${activeDifficulty}`;
            const savedStateStr = localStorage.getItem(stateKey);
            let restored = false;

            if (savedStateStr) {
                try {
                    const savedState = JSON.parse(savedStateStr);
                    if (savedState.date === today) {
                        // Restore saved game
                        const savedTarget = allLogos.find(l => l.id.toString() === savedState.logoId);
                        setTargetLogo(savedTarget || seededTarget);
                        setGuesses(savedState.guesses);
                        setGameState(savedState.gameState);
                        setDifficulty(savedState.difficulty);
                        setDataset(savedState.dataset);
                        restored = true;
                    }
                } catch (e) {
                    console.error("Error parsing daily state", e);
                }
            }

            if (!restored) {
                // Start fresh daily game
                setTargetLogo(seededTarget);
                setGuesses([]);
                setGameState('playing');
                initDailyGame(seededTarget!, activeDifficulty, activeDataset);
            }
        } else {
            // Infinite / Practice
            let gamePool = pool;
            if (activeGameMode === 'infinite') {
                const playedIds = infiniteSession.playedLogos;
                const availableLogos = pool.filter(l => !playedIds.includes(l.id.toString()));

                if (availableLogos.length > 0) {
                    gamePool = availableLogos;
                } else {
                    resetInfiniteSession();
                    gamePool = pool;
                }
            }

            // SELECTION LOGIC WITH PRELOADING
            let newTarget: Logo;

            // If we have a nextLogo ready and valid for current pool, use it
            // We check if nextLogo is in gamePool just to be safe (e.g. if filters changed)
            if (nextLogo && gamePool.some(l => l.id === nextLogo.id)) {
                newTarget = nextLogo;
            } else {
                newTarget = gamePool[Math.floor(Math.random() * gamePool.length)];
            }

            setTargetLogo(newTarget);
            setGuesses([]);
            setGameState('playing');

            if (activeGameMode === 'infinite') {
                const isManualRestart = newGameMode !== undefined;
                const isRetryAfterLoss = gameState === 'lost';

                if (isManualRestart || isRetryAfterLoss) {
                    resetInfiniteSession();
                }
            }

            // PICK AND PRELOAD NEXT
            // We need to pick a potential next logo from the pool (excluding the one we just picked)
            const remainingPool = gamePool.filter(l => l.id !== newTarget.id);
            if (remainingPool.length > 0) {
                const next = remainingPool[Math.floor(Math.random() * remainingPool.length)];
                setNextLogo(next);

                // Preload Image
                const img = new Image();
                img.src = next.localPath || next.svgUrl || next.pngUrl || '';
            }
        }
    }, [allLogos, gameMode, difficulty, dataset, selectedCountries, initDailyGame, gameState, infiniteSession, resetInfiniteSession, nextLogo]); // Added nextLogo dependency

    useEffect(() => {
        fetch('/data/logos.json')
            .then(res => res.json())
            .then(data => {
                setAllLogos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading logos:", err);
                setLoading(false);
            });
    }, []);

    const handleGuess = useCallback((name: string) => {
        if (gameState !== 'playing' || guesses.length >= MAX_ATTEMPTS || !targetLogo) return;

        const cleanedName = cleanLogoName(name);
        const newGuesses = [...guesses, cleanedName];
        setGuesses(newGuesses);
        setInputValue('');
        setShowSuggestions(false);

        const isWin = cleanedName.toLowerCase() === cleanLogoName(targetLogo.name).toLowerCase();

        if (gameMode === 'daily') {
            recordGuess(cleanedName);
        }

        if (isWin) {
            setGameState('won');
            if (gameMode === 'daily') {
                completeGame(true, newGuesses);
                setTimeout(() => setShowDailyStats(true), 1500); // Small delay for user to see result
            }
            if (gameMode === 'infinite') {
                incrementInfiniteScore();
                addPlayedLogo(targetLogo.id.toString());
            }
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setGameState('lost');
            if (gameMode === 'daily') {
                completeGame(false, newGuesses);
                setTimeout(() => setShowDailyStats(true), 1500);
            }
            if (gameMode === 'infinite') {
                endInfiniteSession(infiniteSession.score);
                setShowInfiniteStats(true);
            }
        }
    }, [gameState, guesses, targetLogo, gameMode, recordGuess, completeGame, infiniteSession, incrementInfiniteScore, endInfiniteSession, addPlayedLogo, setShowDailyStats, setShowInfiniteStats]);

    const exitGame = useCallback(() => {
        setGameState('not_started');
        setGuesses([]);
        setInputValue('');
        setTargetLogo(null);
    }, []);

    return {
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
        infiniteStats,
        infiniteSession,
        showInfiniteStats,
        setShowInfiniteStats,
        infiniteNewHighScore,
        showDailyStats,
        setShowDailyStats
    };
}
