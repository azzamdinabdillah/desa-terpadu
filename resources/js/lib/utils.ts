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
 * @param includeTime - Whether to include time (default: false)
 * @param includeWeekday - Whether to include weekday (default: false)
 * @returns Formatted date string in Indonesian format
 */
export function formatDate(dateString: string, includeTime: boolean = false, includeWeekday: boolean = false): string {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };

    if (includeWeekday) {
        options.weekday = 'long';
    }

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return new Date(dateString).toLocaleDateString('id-ID', options);
}

/**
 * Format date string to Indonesian locale format with full date and time
 * @param dateString - The date string to format
 * @returns Formatted date string with weekday, date, and time in Indonesian format
 */
export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

export const getStatusLabel = (status: string) => {
    switch (status) {
        case 'head_of_household':
            return 'Kepala Keluarga';
        case 'spouse':
            return 'Istri/Suami';
        case 'child':
            return 'Anak';
        default:
            return status;
    }
};

export const getGenderLabel = (gender: string) => {
    return gender === 'male' ? 'Laki-laki' : 'Perempuan';
};

export const getMaritalStatusLabel = (status: string) => {
    switch (status) {
        case 'single':
            return 'Belum Menikah';
        case 'married':
            return 'Menikah';
        case 'widowed':
            return 'Janda/Duda';
        default:
            return status;
    }
};

export const getReligionLabel = (religion: string) => {
    switch (religion) {
        case 'islam':
            return 'Islam';
        case 'christian':
            return 'Kristen';
        case 'catholic':
            return 'Katolik';
        case 'hindu':
            return 'Hindu';
        case 'buddhist':
            return 'Buddha';
        case 'confucian':
            return 'Konghucu';
        default:
            return religion;
    }
};
