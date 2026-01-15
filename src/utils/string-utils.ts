/**
 * Normalizes a string by:
 * 1. Converting to lowercase
 * 2. Removing diacritics (accents)
 * 3. Trimming whitespace
 * 
 * @param text The string to normalize
 * @returns The normalized string
 */
export function normalizeString(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}
