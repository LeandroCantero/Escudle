import { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    header?: ReactNode;
    footer: ReactNode;
}

export const MainLayout = ({ children, header, footer }: MainLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 space-y-4 max-w-lg mx-auto">
            {header}
            <main className="w-full flex-1 flex flex-col justify-start space-y-4 relative">
                {children}
            </main>
            {footer}
        </div>
    );
};
