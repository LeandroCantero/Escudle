import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

interface NotFoundScreenProps {
    onBackHome: () => void;
}

export const NotFoundScreen = ({ onBackHome }: NotFoundScreenProps) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-8">
            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                className="bg-neo-orange p-8 border-4 border-neo-black shadow-neo rotate-3"
            >
                <h1 className="text-8xl font-black text-white">404</h1>
            </motion.div>

            <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase text-neo-black tracking-tighter">
                    ¡La tiraste a la tercer bandeja!
                </h2>
                <p className="text-neo-black font-bold text-lg opacity-80">
                    La página que buscás no existe o fue transferida a otro club.
                </p>
            </div>

            <button
                onClick={onBackHome}
                className="group relative bg-neo-green text-white font-black py-4 px-8 rounded-2xl border-4 border-neo-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-3 text-xl uppercase"
            >
                <Home className="group-hover:rotate-12 transition-transform" />
                Volver al Juego
            </button>
        </div>
    );
};
