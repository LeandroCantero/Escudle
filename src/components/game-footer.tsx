interface GameFooterProps {
    logosCount: number;
    countriesCount: number;
}

export const GameFooter = ({ logosCount, countriesCount }: GameFooterProps) => {
    return (
        <footer className="w-full !mt-0 py-12 flex flex-col items-center gap-12">
            {/* Stats */}
            <div className="flex divide-x-2 divide-neo-black bg-neo-white border-[3px] border-neo-black rounded-xl shadow-neo p-2 text-neo-black">
                <div className="px-4 text-center">
                    <div className="text-xl font-black">{logosCount}</div>
                    <div className="text-xs uppercase font-bold">Escudos</div>
                </div>
                <div className="px-4 text-center">
                    <div className="text-xl font-black">{countriesCount}</div>
                    <div className="text-xs uppercase font-bold">Países</div>
                </div>
            </div>

            {/* Credits */}
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-white font-medium">
                <a
                    href="https://football-logos.cc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-bold"
                >
                    Logos de football-logos.cc
                </a>
                <p className="opacity-80">© 2026 Escudle</p>
            </div>
        </footer>
    );
};
