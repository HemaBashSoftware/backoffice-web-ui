export class CustomerType {
  // Sabit Değerler (Enum gibi kullanım için)
  static readonly BIREYSEL = 'Bireysel';
  static readonly KURUMSAL = 'Kurumsal';

  // Liste Olarak Dönüş (Dropdownlar için)
  static getAll() {
    return [
      { value: this.BIREYSEL, label: '👤 Bireysel' },
      { value: this.KURUMSAL, label: '🏢 Kurumsal' }
    ];
  }

  // ID'ye göre isim getiren yardımcı metod (Opsiyonel)
  static getName(value: string): string {
    const methods = this.getAll();
    return methods.find(m => m.value === value)?.label || 'Bilinmiyor';
  }
}