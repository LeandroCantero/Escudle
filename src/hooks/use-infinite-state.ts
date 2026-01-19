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
    playedLogos: string[]; // Track IDs of logos played in this session
}



const defaultStats: InfiniteStats = {
    highScore: 0,
    totalSessions: 0,
    totalCorrect: 0,
    lastSessionScore: 0,
    lastPlayedAt: ''
};

export function useInfiniteState(difficulty: string) {
    const [infiniteStats, setInfiniteStats] = useState<InfiniteStats>(defaultStats);
    const [currentSession, setCurrentSession] = useState<InfiniteSession>({
        score: 0,
        startedAt: Date.now(),
        playedLogos: []
    });
    const [isNewHighScore, setIsNewHighScore] = useState(false);

    const statsKey = `escudle_infinite_stats_${difficulty}`;

    // Load stats on mount or when difficulty changes
    useEffect(() => {
        const savedStats = localStorage.getItem(statsKey);
        if (savedStats) {
            try {
                setInfiniteStats(JSON.parse(savedStats));
            } catch (e) {
                console.error("Error parsing infinite stats", e);
                setInfiniteStats(defaultStats);
            }
        } else {
            setInfiniteStats(defaultStats);
        }
    }, [difficulty, statsKey]);

    const saveStats = useCallback((stats: InfiniteStats) => {
        setInfiniteStats(stats);
        localStorage.setItem(statsKey, JSON.stringify(stats));
    }, [statsKey]);

    const resetSession = useCallback(() => {
        setCurrentSession({
            score: 0,
            startedAt: Date.now(),
            playedLogos: []
        });
        setIsNewHighScore(false);
    }, []);

    const incrementScore = useCallback(() => {
        setCurrentSession(prev => ({
            ...prev,
            score: prev.score + 1
        }));
    }, []);

    const addPlayedLogo = useCallback((id: string) => {
        setCurrentSession(prev => ({
            ...prev,
            playedLogos: [...prev.playedLogos, id]
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

            localStorage.setItem(statsKey, JSON.stringify(newStats));
            return newStats;
        });
    }, [statsKey]);

    return {
        infiniteStats,
        currentSession,
        resetSession,
        incrementScore,
        addPlayedLogo,
        endSession,
        isNewHighScore
    };
}
