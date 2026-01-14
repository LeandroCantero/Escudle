interface GameFooterProps {
    logosCount: number;
    countriesCount: number;
}

export const GameFooter = ({ logosCount, countriesCount }: GameFooterProps) => {
    return (
        <footer className="mt-auto py-8 text-neo-black text-sm font-bold flex flex-col items-center space-y-4">
            <div className="flex divide-x-2 divide-neo-black bg-neo-white border-[3px] border-neo-black rounded-xl shadow-neo p-2">
                <div className="px-4 text-center">
                    <div className="text-xl font-black">{logosCount}</div>
                    <div className="text-xs uppercase">Escudos</div>
                </div>
                <div className="px-4 text-center">
                    <div className="text-xl font-black">{countriesCount}</div>
                    <div className="text-xs uppercase">Países</div>
                </div>
            </div>
            <p className="opacity-90 text-white font-medium">© 2026 Escudle</p>
        </footer>
    );
};
