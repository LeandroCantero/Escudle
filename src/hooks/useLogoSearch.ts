import Fuse from 'fuse.js';
import { useMemo } from 'react';

export interface Logo {
    id: string;
    name: string;
    country: string;
    isHistorical: boolean;
    period: string | null;
    svgUrl?: string | null;
    pngUrl?: string | null;
    localPath?: string;
    pageUrl: string;
    // Allow for other properties if needed
    [key: string]: any;
}

interface UseLogoSearchOptions {
    threshold?: number;
    limit?: number;
}

export function useLogoSearch(
    items: Logo[],
    searchTerm: string,
    options: UseLogoSearchOptions = {}
) {
    const { threshold = 0.3, limit = 10 } = options;

    const fuse = useMemo(() => {
        return new Fuse(items, {
            keys: ['name'],
            threshold: threshold, // 0.0 requires a perfect match, 1.0 matches anything
            ignoreLocation: true, // Finds matches anywhere in the string
            includeScore: true
        });
    }, [items, threshold]);

    const results = useMemo(() => {
        if (!searchTerm || searchTerm.trim().length < 2) return [];

        const fuseResults = fuse.search(searchTerm);

        // Return just the items, sliced to limit
        return fuseResults
            .slice(0, limit)
            .map(result => result.item);
    }, [fuse, searchTerm, limit]);

    return results;
}
