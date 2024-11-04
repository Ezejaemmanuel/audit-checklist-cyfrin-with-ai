// utils/id-generators.ts
import romans from "romans";

export const getAlphabetLabel = (num: number): string => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (num < 26) return alphabet[num];
    const first = Math.floor(num / 26) - 1;
    const second = num % 26;
    return `${alphabet[first]}${alphabet[second]}`;
};

export const generateItemId = (level: number, index: number, baseId: string): string => {
    const levelIndicator = getLevelIndicator(level, index);
    return `${levelIndicator}-${baseId}`;
};

export const getLevelIndicator = (level: number, index: number): string => {
    switch (level) {
        case 0:
            return romans.romanize(index + 1);
        case 1:
            return getAlphabetLabel(index);
        case 2:
            return (index + 1).toString();
        default:
            return (index + 1).toString();
    }
};