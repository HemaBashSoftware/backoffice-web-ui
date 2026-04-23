export class ProductIncomingStatus {
  static readonly BEKLEMEDE = 'Beklemede';
  static readonly ISLEMDE = 'İşlemde';
  static readonly TAMAMLANDI = 'Tamamlandı';

  static getAll() {
    return [
      { value: this.BEKLEMEDE, label: 'Beklemede' },
      { value: this.ISLEMDE, label: 'İşlemde' },
      { value: this.TAMAMLANDI, label: 'Tamamlandı' }
    ];
  }
}

