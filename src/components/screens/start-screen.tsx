import { motion } from 'framer-motion';
import { useState } from 'react';
import { useDailyState } from '../../hooks/use-daily-state';
import { Dataset, Difficulty, GameMode } from '../../hooks/use-game-logic';
import { APP_LOGO_PATH } from '../../utils/constants';

interface StartScreenProps {
    onStartGame: (mode: GameMode, difficulty: Difficulty, dataset: Dataset, showStats?: boolean) => void;
    onOpenCountrySelector: () => void;
    selectedCountriesCount: number;
    setShowHelp: (show: boolean) => void;
    timeUntilNext: number;
}

export const StartScreen = ({
    onStartGame,
    onOpenCountrySelector,
    selectedCountriesCount,
    setShowHelp,
    timeUntilNext
}: StartScreenProps) => {
    const [selectedMode, setSelectedMode] = useState<GameMode>('daily');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
    const [selectedDataset, setSelectedDataset] = useState<Dataset>('all');

    const { dailyState, isTodayDone } = useDailyState(selectedDifficulty);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isDailyInProgress = selectedMode === 'daily' && dailyState && dailyState.gameState === 'playing';
    const isDailyCompleted = selectedMode === 'daily' && isTodayDone;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-8 animate-fade-in py-12 relative">
            {/* Header elements - aligned at same height */}
            <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
                <a
                    href="https://dopartis.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:scale-105 transition-transform rotate-[-8deg] block"
                >
                    <img
                        src="/hecho por dopartis - white.png"
                        alt="Hecho por dopartis"
                        className="h-12 md:h-14 w-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    />
                </a>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: 2, y: 2 }}
                    onClick={() => setShowHelp(true)}
                    className="bg-white text-neo-black rounded-full border-[3px] border-neo-black shadow-[2px_2px_0px_#000] hover:bg-neo-yellow transition-colors active:shadow-none active:translate-x-[2px] active:translate-y-[2px] w-10 h-10 flex items-center justify-center rotate-[10deg]"
                >
                    <span className="font-['Permanent_Marker'] text-2xl">?</span>
                </motion.button>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <img
                    src={APP_LOGO_PATH}
                    alt="ESCUDLE"
                    className="h-24 md:h-32 w-auto drop-shadow-[4px_4px_0px_#000]"
                />
                <h1 className="text-6xl md:text-8xl font-['Permanent_Marker'] text-white uppercase tracking-wider drop-shadow-[6px_6px_0px_#000] rotate-[-2deg]">
                    ESCUDLE
                </h1>
                <p className="text-xl font-bold text-neo-black bg-neo-white px-4 py-1 inline-block border-2 border-neo-black shadow-neo-sm -rotate-1 transform hover:scale-105 transition-transform">
                    Adivina el escudo de fútbol
                </p>
            </div>

            <div className="w-full max-w-md space-y-6 p-6 bg-neo-white border-[3px] border-neo-black shadow-neo rounded-xl">

                {/* Game Mode Selector */}
                <div className="space-y-2">
                    <label className="text-lg font-black uppercase tracking-wider block text-center">Modo de Juego</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['daily', 'infinite', 'practice'] as GameMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setSelectedMode(m)}
                                className={`p-2 text-sm font-bold border-2 border-neo-black transition-all capitalize ${selectedMode === m
                                    ? 'bg-neo-blue text-white shadow-neo-sm translate-x-[1px] translate-y-[1px]'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                {m === 'daily' ? 'Diario' : m === 'infinite' ? 'Infinito' : 'Práctica'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty Selector */}
                <div className="space-y-2">
                    <label className="text-lg font-black uppercase tracking-wider block text-center">Dificultad</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                            <button
                                key={d}
                                onClick={() => setSelectedDifficulty(d)}
                                className={`p-2 text-sm font-bold border-2 border-neo-black transition-all capitalize ${selectedDifficulty === d
                                    ? 'bg-neo-orange text-neo-black shadow-neo-sm translate-x-[1px] translate-y-[1px]'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                {d === 'easy' ? 'Fácil' : d === 'medium' ? 'Medio' : 'Difícil'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dataset Selector */}
                <div className={`space-y-2 transition-opacity ${selectedMode === 'daily' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="text-lg font-black uppercase tracking-wider block text-center">
                        Colección {selectedMode === 'daily' && <span className="text-[10px] lowercase font-normal">(desactivados en diario)</span>}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['all', 'current', 'historic'] as Dataset[]).map((ds) => (
                            <button
                                key={ds}
                                onClick={() => setSelectedDataset(ds)}
                                tabIndex={selectedMode === 'daily' ? -1 : 0}
                                className={`p-2 text-sm font-bold border-2 border-neo-black transition-all capitalize ${selectedDataset === ds
                                    ? 'bg-neo-green text-white shadow-neo-sm translate-x-[1px] translate-y-[1px]'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                {ds === 'all' ? 'Todos' : ds === 'current' ? 'Actuales' : 'Retros'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className={`space-y-2 transition-opacity ${selectedMode === 'daily' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="text-lg font-black uppercase tracking-wider block text-center">
                        Filtros {selectedMode === 'daily' && <span className="text-[10px] lowercase font-normal">(desactivados en diario)</span>}
                    </label>
                    <button
                        onClick={onOpenCountrySelector}
                        tabIndex={selectedMode === 'daily' ? -1 : 0}
                        className="w-full p-4 flex items-center justify-between border-2 border-neo-black bg-white hover:bg-gray-50 transition-all font-bold"
                    >
                        <span>
                            {selectedCountriesCount === 0
                                ? "Todo el mundo"
                                : `${selectedCountriesCount} país${selectedCountriesCount !== 1 ? 'es' : ''}`}
                        </span>
                        <span className="bg-neo-black text-white px-2 py-0.5 text-sm rounded">EDITAR</span>
                    </button>
                </div>

                <div className="pt-4">
                    {isDailyCompleted ? (
                        <div className="space-y-4">
                            <div className="bg-neo-blue/10 border-2 border-neo-blue p-4 rounded-xl text-center">
                                <p className="text-neo-blue font-black uppercase text-xl">¡Completado!</p>
                                <p className="text-neo-black font-bold">Próximo escudo en:</p>
                                <p className="text-3xl font-black font-mono text-neo-black mt-2">
                                    {formatTime(timeUntilNext)}
                                </p>
                            </div>
                            <button
                                onClick={() => onStartGame('daily', selectedDifficulty, selectedDataset, true)}
                                className="w-full py-4 bg-neo-blue text-white font-black text-2xl uppercase border-[3px] border-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                            >
                                VER RESULTADOS
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onStartGame(selectedMode, selectedDifficulty, selectedDataset)}
                            className={`w-full py-4 font-black text-2xl uppercase border-[3px] border-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all ${isDailyInProgress ? 'bg-neo-blue text-white' : 'bg-neo-green text-white'
                                }`}
                        >
                            {isDailyInProgress ? 'CONTINUAR' : 'JUGAR AHORA'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
