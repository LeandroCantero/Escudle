import { useCallback, useEffect, useState } from 'react';
import { Logo } from './use-logo-search';

export interface DailyState {
    date: string;              // YYYY-MM-DD
    logoId: string;            // ID of today's logo
    guesses: string[];         // Guesses for today
    gameState: 'playing' | 'won' | 'lost';
    difficulty: 'easy' | 'medium' | 'hard';
    dataset: 'all' | 'current' | 'historic';
    targetName: string;        // Store name for sharing after refresh
    completedAt?: number;      // Timestamp
}

export interface DailyStats {
    currentStreak: number;
    maxStreak: number;
    totalPlayed: number;
    totalWins: number;
    lastPlayedDate: string;    // YYYY-MM-DD
    lastGuesses: string[];     // To generate share grid
    targetName: string;        // To generate share grid
    gameState: 'won' | 'lost' | 'playing';
    guessDistribution: {
        [key: number]: number;
    };
}

const DAILY_STATE_KEY_PREFIX = 'escudle_daily_state_';
const DAILY_STATS_KEY_PREFIX = 'escudle_daily_stats_';

const defaultStats: DailyStats = {
    currentStreak: 0,
    maxStreak: 0,
    totalPlayed: 0,
    totalWins: 0,
    lastPlayedDate: '',
    guessDistribution: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    },
    lastGuesses: [],
    targetName: '',
    gameState: 'playing'
};

export function useDailyState(selectedDifficulty: 'easy' | 'medium' | 'hard' = 'easy') {
    const [dailyState, setDailyState] = useState<DailyState | null>(null);
    const [stats, setStats] = useState<DailyStats>(defaultStats);
    const [timeUntilNext, setTimeUntilNext] = useState<number>(0);

    // Get today's date string in UTC
    const getTodayStr = () => new Date().toISOString().split('T')[0];

    const getDailyStateKey = useCallback((diff: string) => `${DAILY_STATE_KEY_PREFIX}${diff}`, []);
    const getDailyStatsKey = useCallback((diff: string) => `${DAILY_STATS_KEY_PREFIX}${diff}`, []);

    // Load state when difficulty changes or on mount
    useEffect(() => {
        const today = getTodayStr();
        const savedState = localStorage.getItem(getDailyStateKey(selectedDifficulty));

        if (savedState) {
            const parsed = JSON.parse(savedState) as DailyState;
            if (parsed.date === today) {
                setDailyState(parsed);
            } else {
                setDailyState(null);
            }
        } else {
            setDailyState(null);
        }
    }, [selectedDifficulty, getDailyStateKey]);

    // Load stats when difficulty changes or on mount
    useEffect(() => {
        const savedStats = localStorage.getItem(getDailyStatsKey(selectedDifficulty));
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        } else {
            setStats(defaultStats);
        }
    }, [selectedDifficulty, getDailyStatsKey]);

    // Update countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setUTCHours(24, 0, 0, 0);
            const diff = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
            setTimeUntilNext(diff);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const saveState = useCallback((state: DailyState) => {
        setDailyState(state);
        localStorage.setItem(getDailyStateKey(state.difficulty), JSON.stringify(state));
    }, [getDailyStateKey]);

    const updateStats = useCallback((won: boolean, numGuesses: number, date: string) => {
        setStats(prev => {
            const newStats = { ...prev };
            newStats.totalPlayed += 1;

            if (won) {
                newStats.totalWins += 1;
                newStats.guessDistribution[numGuesses] = (newStats.guessDistribution[numGuesses] || 0) + 1;

                // Streak logic
                const lastDate = prev.lastPlayedDate;
                const yesterday = new Date();
                yesterday.setUTCDate(yesterday.getUTCDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastDate === yesterdayStr) {
                    newStats.currentStreak += 1;
                } else if (lastDate === date) {
                    // Already played today, don't increment streak twice
                } else {
                    newStats.currentStreak = 1;
                }

                if (newStats.currentStreak > newStats.maxStreak) {
                    newStats.maxStreak = newStats.currentStreak;
                }
            } else {
                newStats.currentStreak = 0;
            }

            newStats.lastPlayedDate = date;
            localStorage.setItem(getDailyStatsKey(selectedDifficulty), JSON.stringify(newStats));
            return newStats;
        });
    }, [selectedDifficulty, getDailyStatsKey]);

    const initDailyGame = useCallback((logo: Logo, difficulty: 'easy' | 'medium' | 'hard', dataset: any) => {
        const today = getTodayStr();
        const newState: DailyState = {
            date: today,
            logoId: logo.id.toString(),
            guesses: [],
            gameState: 'playing',
            difficulty,
            dataset,
            targetName: logo.name
        };
        saveState(newState);
    }, [saveState]);

    const recordGuess = useCallback((guess: string) => {
        if (!dailyState) return;
        const newState: DailyState = {
            ...dailyState,
            guesses: [...dailyState.guesses, guess]
        };
        saveState(newState);
    }, [dailyState, saveState]);

    const completeGame = useCallback((won: boolean, finalGuesses?: string[]) => {
        if (!dailyState) return;

        const currentGuesses = finalGuesses || dailyState.guesses;

        const newState: DailyState = {
            ...dailyState,
            guesses: currentGuesses,
            gameState: won ? 'won' : 'lost',
            completedAt: Date.now()
        };
        saveState(newState);
        updateStats(won, currentGuesses.length, dailyState.date);
    }, [dailyState, saveState, updateStats]);

    return {
        dailyState,
        stats: {
            ...stats,
            lastGuesses: dailyState?.guesses || [],
            targetName: dailyState?.targetName || '',
            gameState: dailyState?.gameState || 'playing'
        },
        timeUntilNext,
        initDailyGame,
        recordGuess,
        completeGame,
        isTodayDone: dailyState?.gameState === 'won' || dailyState?.gameState === 'lost'
    };
}
