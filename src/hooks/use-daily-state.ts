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

const DAILY_STATE_KEY = 'escudle_daily_state';
const DAILY_STATS_KEY = 'escudle_daily_stats';

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

export function useDailyState() {
    const [dailyState, setDailyState] = useState<DailyState | null>(null);
    const [stats, setStats] = useState<DailyStats>(defaultStats);
    const [timeUntilNext, setTimeUntilNext] = useState<number>(0);

    // Get today's date string in UTC
    const getTodayStr = () => new Date().toISOString().split('T')[0];

    // Load state and stats on mount
    useEffect(() => {
        const savedStats = localStorage.getItem(DAILY_STATS_KEY);
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }

        const savedState = localStorage.getItem(DAILY_STATE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState) as DailyState;
            const today = getTodayStr();

            // Only keep state if it's from today
            if (parsed.date === today) {
                setDailyState(parsed);
            } else {
                // If it's a new day and was NOT completed yesterday, streak might reset
                // But we handle streak reset only when they actually play the next game
                // or when we detect a gap in days.
            }
        }
    }, []);

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
        localStorage.setItem(DAILY_STATE_KEY, JSON.stringify(state));
    }, []);

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
            localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(newStats));
            return newStats;
        });
    }, []);

    const initDailyGame = useCallback((logo: Logo, difficulty: any, dataset: any) => {
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

    const completeGame = useCallback((won: boolean) => {
        if (!dailyState) return;
        const newState: DailyState = {
            ...dailyState,
            gameState: won ? 'won' : 'lost',
            completedAt: Date.now()
        };
        saveState(newState);
        updateStats(won, newState.guesses.length, dailyState.date);
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
