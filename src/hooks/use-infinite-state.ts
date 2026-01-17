import { useCallback, useEffect, useState } from 'react';

export interface InfiniteStats {
    highScore: number;
    totalSessions: number;
    totalCorrect: number;
    lastSessionScore: number;
    lastPlayedAt: string;
}

export interface InfiniteSession {
    score: number;
    startedAt: number;
}

const INFINITE_STATS_KEY = 'escudle_infinite_stats';

const defaultStats: InfiniteStats = {
    highScore: 0,
    totalSessions: 0,
    totalCorrect: 0,
    lastSessionScore: 0,
    lastPlayedAt: ''
};

export function useInfiniteState() {
    const [infiniteStats, setInfiniteStats] = useState<InfiniteStats>(defaultStats);
    const [currentSession, setCurrentSession] = useState<InfiniteSession>({ score: 0, startedAt: Date.now() });
    const [isNewHighScore, setIsNewHighScore] = useState(false);

    // Load stats on mount
    useEffect(() => {
        const savedStats = localStorage.getItem(INFINITE_STATS_KEY);
        if (savedStats) {
            try {
                setInfiniteStats(JSON.parse(savedStats));
            } catch (e) {
                console.error("Error parsing infinite stats", e);
            }
        }
    }, []);

    const saveStats = useCallback((stats: InfiniteStats) => {
        setInfiniteStats(stats);
        localStorage.setItem(INFINITE_STATS_KEY, JSON.stringify(stats));
    }, []);

    const resetSession = useCallback(() => {
        setCurrentSession({
            score: 0,
            startedAt: Date.now()
        });
        setIsNewHighScore(false);
    }, []);

    const incrementScore = useCallback(() => {
        setCurrentSession(prev => ({
            ...prev,
            score: prev.score + 1
        }));
    }, []);

    const endSession = useCallback((finalScore: number) => {
        const now = new Date().toISOString();

        // Update stats
        setInfiniteStats(prev => {
            const newStats = { ...prev };
            newStats.totalSessions += 1;
            newStats.totalCorrect += finalScore;
            newStats.lastSessionScore = finalScore;
            newStats.lastPlayedAt = now;

            if (finalScore > newStats.highScore) {
                newStats.highScore = finalScore;
                setIsNewHighScore(true);
            } else {
                setIsNewHighScore(false);
            }

            localStorage.setItem(INFINITE_STATS_KEY, JSON.stringify(newStats));
            return newStats;
        });
    }, []);

    return {
        infiniteStats,
        currentSession,
        resetSession,
        incrementScore,
        endSession,
        isNewHighScore
    };
}
