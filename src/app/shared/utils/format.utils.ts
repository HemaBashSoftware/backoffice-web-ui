/**
 * Shared format utilities
 * Tüm modüllerde ortak kullanılan format fonksiyonları bu dosyada tutulur.
 */

/**
 * Türkiye telefon numarasını uluslararası formata çevirir.
 * Giriş: "5321234567", "05321234567", "+905321234567" vb.
 * Çıkış: "+90 532 123 45 67"
 */
export function formatPhoneNumber(phone: string): string {
    if (!phone) return phone;
    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
        cleaned = '90' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        cleaned = '90' + cleaned.substring(1);
    }

    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
        return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
}
