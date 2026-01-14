import { useCallback, useEffect, useMemo, useState } from 'react';
import { Logo } from './use-logo-search';

export type GameState = 'playing' | 'won' | 'lost';
export type GameMode = 'easy' | 'hard';

export const MAX_ATTEMPTS = 6;

export function useGameLogic() {
    const [mode, setMode] = useState<GameMode>('easy');
    const [targetLogo, setTargetLogo] = useState<Logo | null>(null);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [gameState, setGameState] = useState<GameState>('playing');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [allLogos, setAllLogos] = useState<Logo[]>([]);
    const [loading, setLoading] = useState(true);

    const filteredLogos = useMemo(() => {
        return allLogos.filter(l => mode === 'easy' ? !l.isHistorical : l.isHistorical);
    }, [allLogos, mode]);

    const startNewGame = useCallback((newMode?: GameMode, logosPool?: Logo[]) => {
        const activeMode = newMode || mode;
        const pool = logosPool || allLogos.filter(l => activeMode === 'easy' ? !l.isHistorical : l.isHistorical);

        if (pool.length === 0) {
            if (allLogos.length > 0) console.warn(`No hay logos para el modo ${activeMode}`);
            return;
        }

        const random = pool[Math.floor(Math.random() * pool.length)];
        setTargetLogo(random);
        setGuesses([]);
        setInputValue('');
        setGameState('playing');
        setShowSuggestions(false);
        if (newMode) setMode(newMode);
    }, [allLogos, mode]);

    useEffect(() => {
        fetch('/data/logos.json')
            .then(res => res.json())
            .then(data => {
                setAllLogos(data);
                setLoading(false);
                const initialPool = data.filter((l: Logo) => mode === 'easy' ? !l.isHistorical : l.isHistorical);
                if (initialPool.length > 0) {
                    const random = initialPool[Math.floor(Math.random() * initialPool.length)];
                    setTargetLogo(random);
                }
            })
            .catch(err => {
                console.error("Error loading logos:", err);
                setLoading(false);
            });
    }, []);

    const handleGuess = useCallback((name: string) => {
        if (gameState !== 'playing' || guesses.length >= MAX_ATTEMPTS || !targetLogo) return;

        const newGuesses = [...guesses, name];
        setGuesses(newGuesses);
        setInputValue('');
        setShowSuggestions(false);

        if (name.toLowerCase() === targetLogo.name.toLowerCase()) {
            setGameState('won');
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setGameState('lost');
        }
    }, [gameState, guesses, targetLogo]);

    return {
        mode,
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
        handleGuess
    };
}
