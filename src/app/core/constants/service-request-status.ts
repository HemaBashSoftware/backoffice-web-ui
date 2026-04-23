export class ServiceRequestStatus {
  // Sabit Değerler (Enum gibi kullanım için)
  static readonly BEKLIYOR = 'BEKLIYOR';
  static readonly DEVAM_EDIYOR = 'DEVAM_EDIYOR';
  static readonly TAMAMLANDI = 'TAMAMLANDI';
  static readonly IPTAL = 'IPTAL';

  // Liste Olarak Dönüş (Dropdownlar için)
  static getAll() {
    return [
      { value: this.BEKLIYOR, label: 'BEKLIYOR' },
      { value: this.DEVAM_EDIYOR, label: 'DEVAM_EDIYOR' },
      { value: this.TAMAMLANDI, label: 'TAMAMLANDI' },
      { value: this.IPTAL, label: 'IPTAL' }
    ];
  }

  // ID'ye göre isim getiren yardımcı metod (Opsiyonel)
  static getName(value: string): string {
    const methods = this.getAll();
    return methods.find(m => m.value === value)?.label || 'Bilinmiyor';
  }

  static getSeverity(status: string): any {

    const severities: { [key: string]: string } = {
      [ServiceRequestStatus.BEKLIYOR]: 'warn' as any,
      [ServiceRequestStatus.DEVAM_EDIYOR]: 'info' as any,
      [ServiceRequestStatus.TAMAMLANDI]: 'success' as any,
      [ServiceRequestStatus.IPTAL]: 'danger' as any
    };

    return severities[status] || 'contrast ' as any;
  }

}