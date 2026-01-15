import Fuse from 'fuse.js';
import { useMemo } from 'react';
import { normalizeString } from '../utils/string-utils';

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
            threshold: threshold,
            ignoreLocation: true,
            includeScore: true,
            // Custom get function to normalize names before searching
            getFn: (item, key) => {
                const value = item[key as keyof Logo];
                if (typeof value === 'string') {
                    return normalizeString(value);
                }
                return (value as unknown) as string;
            }
        });
    }, [items, threshold]);

    const results = useMemo(() => {
        if (!searchTerm || searchTerm.trim().length < 2) return [];

        // Normalize the search term before searching
        const normalizedSearchTerm = normalizeString(searchTerm);
        const fuseResults = fuse.search(normalizedSearchTerm);

        // Return just the items, sliced to limit
        return fuseResults
            .slice(0, limit)
            .map(result => result.item);
    }, [fuse, searchTerm, limit]);

    return results;
}
