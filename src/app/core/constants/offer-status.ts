export class OfferStatus {
  // Sabit Değerler (Enum gibi kullanım için)
  static readonly TASLAK = 'TASLAK';
  static readonly ONAYLANDI = 'ONAYLANDI';
  static readonly REDDEDILDI = 'REDDEDILDI';
  static readonly IPTAL = 'IPTAL';
  static readonly FATURALANDI = 'FATURALANDI';

  // Liste Olarak Dönüş (Dropdownlar için)
  static getAll() {
    return [
      { value: this.TASLAK, label: 'TASLAK' },
      { value: this.ONAYLANDI, label: 'ONAYLANDI' },
      { value: this.REDDEDILDI, label: 'REDDEDILDI' },
      { value: this.IPTAL, label: 'IPTAL' },
      { value: this.FATURALANDI, label: 'FATURALANDI' }
    ];
  }

  // ID'ye göre isim getiren yardımcı metod (Opsiyonel)
  static getName(value: string): string {
    const methods = this.getAll();
    return methods.find(m => m.value === value)?.label || 'Bilinmiyor';
  }

  static getSeverity(status: string): any {

    const severities: { [key: string]: string } = {
      [OfferStatus.TASLAK]: 'secondary' as any,
      [OfferStatus.ONAYLANDI]: 'success' as any,
      [OfferStatus.REDDEDILDI]: 'danger' as any,
      [OfferStatus.IPTAL]: 'warn' as any,
      [OfferStatus.FATURALANDI]: 'success' as any
    };

    return severities[status] || 'info' as any;
  }

}