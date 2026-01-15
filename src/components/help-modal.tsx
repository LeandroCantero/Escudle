import { AnimatePresence, motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

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
                                <h2 className="text-3xl font-black text-neo-black mb-4 uppercase text-center border-b-4 border-neo-yellow inline-block px-4 -rotate-2">
                                    Guía de Juego
                                </h2>

                                <div className="space-y-4 text-neo-black font-medium">
                                    <div className="bg-neo-blue/10 p-4 rounded-xl border-2 border-neo-blue">
                                        <h3 className="font-black uppercase text-sm mb-2">🎮 Modos de Juego</h3>
                                        <ul className="text-sm space-y-1">
                                            <li><strong>Diario:</strong> Mismo escudo para todos cada día</li>
                                            <li><strong>Infinito:</strong> Jugás hasta errar, ¡cuidá tu racha!</li>
                                            <li><strong>Práctica:</strong> Juego libre sin límites</li>
                                        </ul>
                                    </div>

                                    <div className="bg-neo-orange/10 p-4 rounded-xl border-2 border-neo-orange">
                                        <h3 className="font-black uppercase text-sm mb-2">⚡ Dificultad</h3>
                                        <ul className="text-sm space-y-1">
                                            <li><strong>Fácil:</strong> Escudo visible completo</li>
                                            <li><strong>Medio:</strong> Silueta que se revela con errores</li>
                                            <li><strong>Difícil:</strong> Solo silueta, sin ayuda</li>
                                        </ul>
                                    </div>

                                    <div className="bg-neo-green/10 p-4 rounded-xl border-2 border-neo-green">
                                        <h3 className="font-black uppercase text-sm mb-2">🏆 Colección</h3>
                                        <ul className="text-sm space-y-1">
                                            <li><strong>Todos:</strong> Actuales + Retros</li>
                                            <li><strong>Actuales:</strong> Escudos vigentes</li>
                                            <li><strong>Retros:</strong> Escudos históricos</li>
                                        </ul>
                                    </div>

                                    <p className="text-center text-sm font-bold bg-neo-yellow/30 p-2 rounded border-2 border-neo-yellow">
                                        💡 Podés filtrar por países para jugar solo con tus ligas favoritas
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
