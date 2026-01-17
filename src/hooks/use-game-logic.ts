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
    const [gameMode, setGameMode] = useState<GameMode>('daily'); // Set daily as default as requested
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

    const {
        dailyState,
        stats: dailyStats,
        timeUntilNext,
        initDailyGame,
        recordGuess,
        completeGame,
        isTodayDone
    } = useDailyState();

    const {
        infiniteStats,
        currentSession: infiniteSession,
        resetSession: resetInfiniteSession,
        incrementScore: incrementInfiniteScore,
        endSession: endInfiniteSession,
        isNewHighScore: infiniteNewHighScore
    } = useInfiniteState();

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
        if (dataset === 'current') {
            logos = logos.filter(l => !l.isHistorical);
        } else if (dataset === 'historic') {
            logos = logos.filter(l => l.isHistorical);
        }
        if (selectedCountries.length > 0) {
            logos = logos.filter(l => selectedCountries.includes(l.country));
        }
        return logos;
    }, [allLogos, dataset, selectedCountries]);

    const startNewGame = useCallback((newGameMode?: GameMode, newDifficulty?: Difficulty, newDataset?: Dataset) => {
        const activeGameMode = newGameMode || gameMode;
        const activeDifficulty = newDifficulty || difficulty;
        const activeDataset = newDataset || dataset;

        if (newGameMode) setGameMode(newGameMode);
        if (newDifficulty) setDifficulty(newDifficulty);
        if (newDataset) setDataset(newDataset);

        let pool = allLogos;
        if (activeDataset === 'current') pool = pool.filter(l => !l.isHistorical);
        if (activeDataset === 'historic') pool = pool.filter(l => l.isHistorical);
        if (selectedCountries.length > 0) {
            pool = pool.filter(l => selectedCountries.includes(l.country));
        }

        if (pool.length === 0) {
            console.warn(`No logos for the current configuration`);
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        // Seeded selection for daily
        let seededTarget: Logo | null = null;
        if (activeGameMode === 'daily') {
            let hash = 0;
            for (let i = 0; i < today.length; i++) {
                hash = ((hash << 5) - hash) + today.charCodeAt(i);
                hash |= 0;
            }
            const seed = Math.abs(hash);
            const index = seed % pool.length;
            seededTarget = pool[index];
        }

        if (activeGameMode === 'daily') {
            if (dailyState && dailyState.date === today) {
                // Restore saved game
                const savedTarget = allLogos.find(l => l.id.toString() === dailyState.logoId);
                setTargetLogo(savedTarget || seededTarget);
                setGuesses(dailyState.guesses);
                setGameState(dailyState.gameState);
                setDifficulty(dailyState.difficulty);
                setDataset(dailyState.dataset);
                setInputValue('');
                setShowSuggestions(false);
                return;
            }

            // Start fresh daily game
            setTargetLogo(seededTarget);
            initDailyGame(seededTarget!, activeDifficulty, activeDataset);
        } else {
            // Infinite / Practice
            setTargetLogo(pool[Math.floor(Math.random() * pool.length)]);

            // Handle Infinite Session
            if (activeGameMode === 'infinite') {
                const isManualRestart = newGameMode !== undefined;
                const isRetryAfterLoss = gameState === 'lost';

                if (isManualRestart || isRetryAfterLoss) {
                    resetInfiniteSession();
                }
            }
        }

        setGuesses([]);
        setInputValue('');
        setGameState('playing');
        setShowSuggestions(false);
    }, [allLogos, gameMode, difficulty, dataset, selectedCountries, dailyState, initDailyGame, gameState, resetInfiniteSession]);

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
            if (gameMode === 'daily') completeGame(true);
            if (gameMode === 'infinite') incrementInfiniteScore();
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setGameState('lost');
            if (gameMode === 'daily') completeGame(false);
            if (gameMode === 'infinite') {
                endInfiniteSession(infiniteSession.score);
                setShowInfiniteStats(true);
            }
        }
    }, [gameState, guesses, targetLogo, gameMode, recordGuess, completeGame, infiniteSession, incrementInfiniteScore, endInfiniteSession]);

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
        dailyState,
        infiniteStats,
        infiniteSession,
        showInfiniteStats,
        setShowInfiniteStats,
        infiniteNewHighScore
    };
}
