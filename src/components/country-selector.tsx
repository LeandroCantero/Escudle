import { AnimatePresence, motion } from 'framer-motion';
import { Check, Globe, Search, XCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';

interface CountrySelectorProps {
    isOpen: boolean;
    onClose: () => void;
    availableCountries: { name: string; count: number }[];
    selectedCountries: string[];
    onApply: (countries: string[]) => void;
}

export const CountrySelector = ({
    isOpen,
    onClose,
    availableCountries,
    selectedCountries,
    onApply
}: CountrySelectorProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSelected, setTempSelected] = useState<string[]>(selectedCountries);

    // Sync draft state when modal opens or selectedCountries changes (React 19 pattern)
    const [prevOpen, setPrevOpen] = useState(isOpen);
    const [prevSelected, setPrevSelected] = useState(selectedCountries);

    if (isOpen !== prevOpen || selectedCountries !== prevSelected) {
        setPrevOpen(isOpen);
        setPrevSelected(selectedCountries);
        if (isOpen && !prevOpen) {
            setSearchTerm('');
            setTempSelected(selectedCountries);
        }
    }

    const filteredCountries = availableCountries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleCountry = (country: string) => {
        setTempSelected(prev =>
            prev.includes(country)
                ? prev.filter(c => c !== country)
                : [...prev, country]
        );
    };

    const handleApply = () => {
        onApply(tempSelected);
        onClose();
    };

    const toggleAll = () => {
        if (tempSelected.length === availableCountries.length) {
            setTempSelected([]);
        } else {
            setTempSelected(availableCountries.map(c => c.name));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white border-4 border-neo-black rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-neo relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-neo-black hover:scale-110 transition-transform z-10"
                        >
                            <XCircle className="w-8 h-8" />
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-neo-black uppercase inline-block border-b-4 border-neo-yellow px-4 -rotate-1">
                                Filtrar por País
                            </h2>
                            <p className="text-sm font-bold text-gray-500 mt-2">
                                {tempSelected.length === 0 ? 'Mundo' : `${tempSelected.length} países seleccionados`}
                            </p>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar país..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-2 border-transparent focus:border-neo-black rounded-xl font-bold uppercase transition-all"
                            />
                        </div>

                        <div className="flex justify-between mb-4 text-xs font-bold uppercase">
                            <button onClick={toggleAll} className="text-neo-blue hover:underline">
                                {tempSelected.length === availableCountries.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                            </button>
                            <button onClick={() => setTempSelected([])} className="text-red-500 hover:underline">
                                Limpiar Filtros
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0 grid grid-cols-2 md:grid-cols-3 gap-2 pr-2 custom-scrollbar">
                            {filteredCountries.map(country => {
                                const isSelected = tempSelected.includes(country.name);
                                return (
                                    <button
                                        key={country.name}
                                        onClick={() => toggleCountry(country.name)}
                                        className={cn(
                                            "flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all",
                                            isSelected
                                                ? "bg-neo-black text-white border-neo-black"
                                                : "bg-white text-neo-black border-gray-200 hover:border-neo-black"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0",
                                            isSelected ? "border-white bg-neo-green" : "border-gray-300"
                                        )}>
                                            {isSelected && <Check className="w-3 h-3 text-neo-black" />}
                                        </div>
                                        <div className="flex flex-col overflow-hidden w-full">
                                            <span className="font-bold text-xs uppercase truncate w-full leading-tight">
                                                {country.name}
                                            </span>
                                            <span className={cn(
                                                "text-xs font-bold",
                                                isSelected ? "text-neo-green" : "text-gray-400"
                                            )}>
                                                {country.count} ESCUDOS
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t-2 border-gray-100">
                            <button
                                onClick={handleApply}
                                className="w-full py-4 bg-neo-green text-neo-black font-black text-xl uppercase rounded-xl border-2 border-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <Globe className="w-6 h-6" />
                                Aplicar Filtros
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
