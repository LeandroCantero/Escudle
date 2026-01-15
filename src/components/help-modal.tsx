import { AnimatePresence, motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white border-4 border-neo-black rounded-3xl p-6 md:p-8 max-w-md w-full shadow-neo relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-neo-black hover:scale-110 transition-transform"
                        >
                            <XCircle className="w-8 h-8" />
                        </button>

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
                                    <span className="bg-neo-purple text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border border-neo-black shrink-0">3</span>
                                    <span>En <strong>Modo Difícil</strong> está oscuro y borroso.</span>
                                </li>
                            </ul>
                            <p className="text-sm opacity-75">
                                ¡Demostrá cuánto sabés de fútbol!
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
