import { AnimatePresence, motion } from 'framer-motion';
import { Gamepad2, Lightbulb, Trophy, XCircle, Zap } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    isInGame?: boolean;
}

export const HelpModal = ({ isOpen, onClose, isInGame = false }: HelpModalProps) => {
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
                        className="bg-white border-4 border-neo-black rounded-3xl p-6 md:p-8 max-w-md w-full shadow-neo relative max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-neo-black hover:scale-110 transition-transform z-10"
                        >
                            <XCircle className="w-8 h-8" />
                        </button>

                        {isInGame ? (
                            // Content during gameplay
                            <>
                                <h2 className="text-3xl font-black text-neo-black mb-4 uppercase text-center border-b-4 border-neo-yellow inline-block px-4 -rotate-2">
                                    Cómo Jugar
                                </h2>

                                <div className="space-y-4 text-neo-black font-medium text-lg text-center">
                                    <p>
                                        ¡Adiviná el equipo de fútbol oculto detrás de la silueta!
                                    </p>
                                    <ul className="text-left space-y-2 bg-gray-100 p-4 rounded-xl border-2 border-neo-black/10">
                                        <li className="flex items-start gap-2">
                                            <span className="bg-neo-green text-neo-black w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border border-neo-black shrink-0">1</span>
                                            <span>Tenés <strong>6 intentos</strong> para adivinar el escudo.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="bg-neo-yellow text-neo-black w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border border-neo-black shrink-0">2</span>
                                            <span>En <strong>Modo Fácil</strong> el escudo se ve normal.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="bg-neo-orange text-neo-black w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border border-neo-black shrink-0">3</span>
                                            <span>En <strong>Modo Medio</strong> se revela progresivamente.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="bg-neo-purple text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border border-neo-black shrink-0">4</span>
                                            <span>En <strong>Modo Difícil</strong> solo ves la silueta.</span>
                                        </li>
                                    </ul>
                                    <p className="text-sm opacity-75">
                                        ¡Demostrá cuánto sabés de fútbol!
                                    </p>
                                </div>
                            </>
                        ) : (
                            // Content on start screen
                            <>
                                <h2 className="text-4xl font-black text-neo-black mb-6 uppercase text-center border-b-[6px] border-neo-yellow inline-block px-4 -rotate-3 bg-neo-yellow/10">
                                    Guía de Juego
                                </h2>

                                <div className="space-y-6 text-neo-black font-bold">
                                    <div className="bg-neo-blue p-4 rounded-none border-4 border-neo-black shadow-neo-sm">
                                        <h3 className="font-black uppercase text-base mb-2 px-2 bg-neo-black text-white inline-flex items-center gap-2">
                                            <Gamepad2 size={16} /> Modos de Juego
                                        </h3>
                                        <ul className="text-sm space-y-1">
                                            <li><span className="bg-white px-1">Diario:</span> Mismo escudo para todos cada día</li>
                                            <li><span className="bg-white px-1">Infinito:</span> Jugás hasta errar, ¡cuidá tu racha!</li>
                                            <li><span className="bg-white px-1">Práctica:</span> Juego libre sin límites</li>
                                        </ul>
                                    </div>

                                    <div className="bg-neo-orange p-4 rounded-none border-4 border-neo-black shadow-neo-sm">
                                        <h3 className="font-black uppercase text-base mb-2 px-2 bg-neo-black text-white inline-flex items-center gap-2">
                                            <Zap size={16} /> Dificultad
                                        </h3>
                                        <ul className="text-sm space-y-1">
                                            <li><span className="bg-white px-1">Fácil:</span> Escudo visible completo</li>
                                            <li><span className="bg-white px-1">Medio:</span> Silueta que se revela con errores</li>
                                            <li><span className="bg-white px-1">Difícil:</span> Solo silueta, sin ayuda</li>
                                        </ul>
                                    </div>

                                    <div className="bg-neo-green p-4 rounded-none border-4 border-neo-black shadow-neo-sm">
                                        <h3 className="font-black uppercase text-base mb-2 px-2 bg-neo-black text-white inline-flex items-center gap-2">
                                            <Trophy size={16} /> Colección
                                        </h3>
                                        <ul className="text-sm space-y-1">
                                            <li><span className="bg-white px-1">Todos:</span> Actuales + Retros</li>
                                            <li><span className="bg-white px-1">Actuales:</span> Escudos vigentes</li>
                                            <li><span className="bg-white px-1">Retros:</span> Escudos históricos</li>
                                        </ul>
                                    </div>

                                    <p className="text-center text-sm font-black bg-neo-yellow p-3 rounded-none border-4 border-neo-black shadow-neo-sm rotate-1 flex items-center justify-center gap-2">
                                        <Lightbulb size={18} className="shrink-0" />
                                        <span>Podés filtrar por países para jugar solo con tus ligas favoritas</span>
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
