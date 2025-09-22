import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @param includeCurrency - Whether to include currency symbol (default: true)
 * @returns Formatted currency string in IDR
 */
export function formatCurrency(amount: number, includeCurrency: boolean = true): string {
    if (includeCurrency) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    } else {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
        }).format(amount);
    }
}

/**
 * Format date string to Indonesian locale format
 * @param dateString - The date string to format
 * @returns Formatted date string in Indonesian format
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
