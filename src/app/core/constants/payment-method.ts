export class PaymentMethods {
  // Sabit Değerler (Enum gibi kullanım için)
  static readonly TRANSFER = 'Havale/EFT';
  static readonly CREDIT_CARD = 'Kredi Kartı';
  static readonly CASH = 'Nakit';
  static readonly PROMISSORY_NOTE = 'Çek/Senet';
  static readonly OTHER = 'Diğer';

  // Liste Olarak Dönüş (Dropdownlar için)
  static getAll() {
    return [
      { value: this.TRANSFER, label: 'Havale/EFT' },
      { value: this.CREDIT_CARD, label: 'Kredi Kartı' },
      { value: this.CASH, label: 'Nakit' },
      { value: this.PROMISSORY_NOTE, label: 'Çek/Senet' },
      { value: this.OTHER, label: 'Diğer' }
    ];
  }

  // ID'ye göre isim getiren yardımcı metod (Opsiyonel)
  static getName(value: string): string {
    const methods = this.getAll();
    return methods.find(m => m.value === value)?.label || 'Bilinmiyor';
  }
}