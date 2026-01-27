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

const getDefaultStats = (): DailyStats => ({
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
});

const sanitizeStats = (stats: DailyStats): DailyStats => {
    const totalDistWins = Object.values(stats.guessDistribution).reduce((a, b) => a + b, 0);
    if (totalDistWins > stats.totalWins) {
        return {
            ...stats,
            guessDistribution: { ...getDefaultStats().guessDistribution }
        };
    }
    return stats;
};

export function useDailyState(selectedDifficulty: 'easy' | 'medium' | 'hard' = 'easy') {
    // Helper to get today string
    const getTodayStr = () => new Date().toISOString().split('T')[0];

    const [dailyState, setDailyState] = useState<DailyState | null>(() => {
        const today = new Date().toISOString().split('T')[0];
        const savedState = localStorage.getItem(`${DAILY_STATE_KEY_PREFIX}${selectedDifficulty}`);
        if (savedState) {
            const parsed = JSON.parse(savedState) as DailyState;
            return parsed.date === today ? parsed : null;
        }
        return null;
    });

    const [stats, setStats] = useState<DailyStats>(() => {
        const savedStats = localStorage.getItem(`${DAILY_STATS_KEY_PREFIX}${selectedDifficulty}`);
        return savedStats ? sanitizeStats(JSON.parse(savedStats)) : getDefaultStats();
    });

    const [timeUntilNext, setTimeUntilNext] = useState<number>(0);

    // Adjust state during render when difficulty changes (React 19 pattern)
    const [prevDifficulty, setPrevDifficulty] = useState(selectedDifficulty);
    if (selectedDifficulty !== prevDifficulty) {
        setPrevDifficulty(selectedDifficulty);
        const today = getTodayStr();
        const savedState = localStorage.getItem(`${DAILY_STATE_KEY_PREFIX}${selectedDifficulty}`);
        if (savedState) {
            const parsed = JSON.parse(savedState) as DailyState;
            setDailyState(parsed.date === today ? parsed : null);
        } else {
            setDailyState(null);
        }
        const savedStats = localStorage.getItem(`${DAILY_STATS_KEY_PREFIX}${selectedDifficulty}`);
        setStats(savedStats ? sanitizeStats(JSON.parse(savedStats)) : getDefaultStats());
    }

    const getDailyStateKey = useCallback((diff: string) => `${DAILY_STATE_KEY_PREFIX}${diff}`, []);
    const getDailyStatsKey = useCallback((diff: string) => `${DAILY_STATS_KEY_PREFIX}${diff}`, []);


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
            const newStats = {
                ...prev,
                guessDistribution: { ...prev.guessDistribution }
            };
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

    const initDailyGame = useCallback((logo: Logo, difficulty: 'easy' | 'medium' | 'hard', dataset: 'all' | 'current' | 'historic') => {
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
