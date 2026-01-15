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

/**
 * Clean logo name by removing common suffixes like "PNG", "SVG", etc.
 */
export const cleanLogoName = (name: string): string => {
    return name
        .replace(/\s+(PNG|SVG|JPEG|JPG)$/i, '') // Remove image format suffixes
        .trim();
};
