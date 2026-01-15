import { useCallback, useEffect, useMemo, useState } from 'react';
import { Logo } from './use-logo-search';

export type GameState = 'not_started' | 'playing' | 'won' | 'lost';
export type GameMode = 'daily' | 'infinite' | 'practice';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Dataset = 'all' | 'current' | 'historic';

export const MAX_ATTEMPTS = 6;

export function useGameLogic() {
    const [gameMode, setGameMode] = useState<GameMode>('practice');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [dataset, setDataset] = useState<Dataset>('current');

    const [targetLogo, setTargetLogo] = useState<Logo | null>(null);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [gameState, setGameState] = useState<GameState>('not_started');
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [showCountrySelector, setShowCountrySelector] = useState(false);

    // Missing states added
    const [allLogos, setAllLogos] = useState<Logo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

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

        // Dataset Filter
        if (dataset === 'current') {
            logos = logos.filter(l => !l.isHistorical);
        } else if (dataset === 'historic') {
            logos = logos.filter(l => l.isHistorical);
        }
        // 'all' implies no filtering by historical status

        if (selectedCountries.length > 0) {
            logos = logos.filter(l => selectedCountries.includes(l.country));
        }

        return logos;
    }, [allLogos, dataset, selectedCountries]);

    const startNewGame = useCallback((newGameMode?: GameMode, newDifficulty?: Difficulty, newDataset?: Dataset) => {
        const activeGameMode = newGameMode || gameMode;
        const activeDifficulty = newDifficulty || difficulty;
        const activeDataset = newDataset || dataset; // Use undefined check if you want to allow changing one without others? 
        // Better: pass an options object or just rely on state if not passed?
        // For simplicity: if arguments are passed, update state.

        if (newGameMode) setGameMode(newGameMode);
        if (newDifficulty) setDifficulty(newDifficulty);
        if (newDataset) setDataset(newDataset);

        // Logic for pool selection
        let pool = allLogos;
        if ((newDataset || dataset) === 'current') pool = pool.filter(l => !l.isHistorical);
        if ((newDataset || dataset) === 'historic') pool = pool.filter(l => l.isHistorical);

        if (selectedCountries.length > 0) {
            pool = pool.filter(l => selectedCountries.includes(l.country));
        }

        if (pool.length === 0) {
            console.warn(`No hay logos para la configuración actual`);
            return;
        }

        // Selection Logic based on Game Mode
        let target: Logo;

        if ((newGameMode || gameMode) === 'daily') {
            // Seeded Random for Daily - same logo for everyone on the same date
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            // Simple string hash for seed
            let hash = 0;
            for (let i = 0; i < today.length; i++) {
                hash = ((hash << 5) - hash) + today.charCodeAt(i);
                hash |= 0;
            }
            const seed = Math.abs(hash);
            const index = seed % pool.length;
            target = pool[index];
        } else {
            // Random Selection for Infinite and Practice modes
            target = pool[Math.floor(Math.random() * pool.length)];
        }

        setTargetLogo(target);
        setGuesses([]);
        setInputValue('');
        setGameState('playing');
        setShowSuggestions(false);
    }, [allLogos, gameMode, difficulty, dataset, selectedCountries]);

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

    // Effect to restart game if filters change and current logo is invalid? 
    // Or just let user finish current game? Standard behavior is usually "new game applied on next turn" or "immediate reset".
    // Let's force a reset if the filter changes to avoid confusion (seeing a country that is not selected).
    // BUT, we only want to do this when `selectedCountries` changes explicitly by user action, not initial load.
    // For now, let's allow the user to trigger the new game manually or we can add an effect.
    // Given the `startNewGame` dependency on `selectedCountries`, it will use the new filter when called.
    // To properly reset when closing the modal, we can handle that in the UI component or expose a specific "applyFilters" method.
    // For simplicity, let's keep it manual or triggered by the modal "Apply".

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
        exitGame
    };
}
