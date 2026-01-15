import { CheckCircle2, XCircle } from 'lucide-react';
import { MAX_ATTEMPTS } from '../hooks/use-game-logic';
import { Logo } from '../hooks/use-logo-search';
import { cn } from '../utils/cn';

interface GuessListProps {
    guesses: string[];
    targetLogo: Logo;
}

export const GuessList = ({ guesses, targetLogo }: GuessListProps) => {
    return (
        <div className="w-full space-y-3">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
                const guess = guesses[i];
                const isCorrect = guess?.toLowerCase() === targetLogo.name.toLowerCase();

                return (
                    <div
                        key={i}
                        className={cn(
                            "h-12 rounded-lg flex items-center px-4 justify-between transition-all duration-300 border-2 font-bold",
                            guess
                                ? isCorrect
                                    ? "bg-[#4ade80] border-neo-black text-neo-black shadow-neo-sm"
                                    : "bg-neo-white border-neo-black text-neo-black"
                                : "bg-white/50 border-neo-black/20 text-gray-400 border-dashed"
                        )}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-black text-neo-black w-6 bg-neo-yellow rounded-full h-6 flex items-center justify-center border border-neo-black">{i + 1}</span>
                            <span className="uppercase truncate">
                                {guess || '......'}
                            </span>
                        </div>
                        {guess && (
                            isCorrect
                                ? <CheckCircle2 className="w-6 h-6 text-neo-black fill-neo-success" />
                                : <XCircle className="w-6 h-6 text-neo-black fill-neo-orange" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
