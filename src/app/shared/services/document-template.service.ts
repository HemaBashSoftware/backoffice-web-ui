import { Injectable } from '@angular/core';
import { OfferDetail } from '@/pages/offer/models/offer';
import { Tenant } from '@/pages/admin/tenant/models/tenant.model';

export type DocumentType = 'TEKLIF' | 'FATURA' | 'PROFORMA';

export interface DocumentOptions {
    documentType?: DocumentType;
    title?: string;           // Override default title
    tenant?: Tenant | null;   // Sender info
    customer?: {              // Recipient info (joined from offer or passed separately)
        customerType?: string;
        fullName?: string;
        officialFirmName?: string;
        taxNumber?: string;
        taxOffice?: string;
        address?: string;
        phoneNumber?: string;
        emailAddress?: string;
        tckn?: string;
    } | null;
}

@Injectable({ providedIn: 'root' })
export class DocumentTemplateService {

    /** Open a print window with offer/invoice HTML */
    print(offer: OfferDetail, options?: DocumentOptions): void {
        const html = this.buildHtml(offer, options);
        const printWindow = window.open('', '_blank', 'width=960,height=750');
        if (!printWindow) {
            alert('Lütfen bu site için açılır pencerelere izin verin.');
            return;
        }
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.onload = () => printWindow.print();
        setTimeout(() => { try { printWindow.print(); } catch (e) { /* already printed */ } }, 700);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private fmt(value: string | Date | null | undefined): string {
        if (!value) return '-';
        const d = new Date(value as string);
        return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    private fmtDateCompact(value: string | Date | null | undefined): string {
        if (!value) return '00000000';
        const d = new Date(value as string);
        if (isNaN(d.getTime())) return '00000000';
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}${m}${day}`;
    }

    private currency(value: number | null | undefined): string {
        if (value == null) return '0,00 ₺';
        return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
    }

    private docLabel(type: DocumentType): string {
        switch (type) {
            case 'FATURA': return 'FATURA';
            case 'PROFORMA': return 'PROFORMA FATURA';
            default: return 'FİYAT TEKLİFİ';
        }
    }

    // ─── Header logo / company ──────────────────────────────────────────────────

    private buildLogoSection(tenant?: Tenant | null): string {
        if (tenant?.logo) {
            return `<img src="${tenant.logo}" alt="Logo" class="company-logo-img" />`;
        }
        return `<div class="company-name-text">${tenant?.companyName ?? 'ŞİRKET'}</div>`;
    }

    // ─── Reference number ───────────────────────────────────────────────────────

    private buildDocNo(offer: OfferDetail, type: DocumentType): string {
        const prefix = type === 'FATURA' ? 'FAT' : type === 'PROFORMA' ? 'PRF' : 'TEK';
        const dateStr = this.fmtDateCompact(offer.createdAt);
        return `${dateStr}-${offer.id}`;
    }

    // ─── Sender (Gönderen) ──────────────────────────────────────────────────────

    private buildSenderBox(tenant?: Tenant | null): string {
        if (!tenant) return `<p>-</p>`;
        let rows = `<p><strong>${tenant.companyName ?? ''}</strong></p>`;
        if (tenant.address) rows += `<p>${tenant.address}</p>`;
        if (tenant.taxNo) rows += `<p>Vergi No: ${tenant.taxNo}${tenant.taxOffice ? ` / ${tenant.taxOffice}` : ''}</p>`;
        if (tenant.phoneNumber) rows += `<p>Tel: ${tenant.phoneNumber}</p>`;
        if (tenant.email) rows += `<p>E-posta: ${tenant.email}</p>`;
        return rows;
    }

    // ─── Recipient (Alıcı) ──────────────────────────────────────────────────────

    private buildRecipientBox(offer: OfferDetail, customer?: DocumentOptions['customer']): string {
        // Use passed customer detail object if available, else fall back to offer join fields
        const isCorp = customer?.customerType === 'KURUMSAL' || !!customer?.officialFirmName || !!offer.customerOfficialFirmName;
        const displayName = isCorp
            ? (customer?.officialFirmName || offer.customerOfficialFirmName || customer?.fullName || offer.customerFullName || `Müşteri #${offer.customerId}`)
            : (customer?.fullName || offer.customerFullName || `Müşteri #${offer.customerId}`);

        let rows = `<p><strong>${displayName}</strong></p>`;

        if (isCorp) {
            if (customer?.taxNumber) rows += `<p>Vergi No: ${customer.taxNumber}${customer?.taxOffice ? ` / ${customer.taxOffice}` : ''}</p>`;
        } else {
            if (customer?.tckn) rows += `<p>TC Kimlik No: ${customer.tckn}</p>`;
        }
        if (customer?.address) rows += `<p>${customer.address}</p>`;
        if (customer?.phoneNumber) rows += `<p>Tel: ${customer.phoneNumber}</p>`;
        if (customer?.emailAddress) rows += `<p>E-posta: ${customer.emailAddress}</p>`;
        return rows;
    }

    // ─── Item rows ───────────────────────────────────────────────────────────────

    private getItemName(item: OfferDetail['offerItems'][number]): string {
        const p = item as any;
        if (p.productName) return p.productName + (p.productBrand ? ` (${p.productBrand})` : '');
        if (p.serviceName) return p.serviceName;
        if (item.details) return item.details;
        return `Kalem #${item.id}`;
    }

    private buildItemRows(offer: OfferDetail): string {
        if (!offer.offerItems?.length)
            return `<tr><td colspan="5" style="text-align:center;color:#aaa;">Kalem kaydı bulunamadı.</td></tr>`;

        return offer.offerItems.map((item) => {
            const p = item as any;
            const name = this.getItemName(item);
            const detail = item.details && p.productName ? `<br><small style="color:#888">${item.details}</small>` : '';
            return `
      <tr>
        <td>${name}${detail}</td>
        <td class="tr">${item.quantity ?? 1}</td>
        <td class="tr">${this.currency(item.unitPrice)}</td>
        <td class="tr">${item.quantity && item.unitPrice ? this.currency(item.quantity * item.unitPrice) : this.currency(item.totalAmount)}</td>
      </tr>`;
        }).join('');
    }

    // ─── Tax rows ─────────────────────────────────────────────────────────────

    private buildTaxRows(offer: OfferDetail): string {
        if (!offer.offerItemTaxes?.length) return '';
        return offer.offerItemTaxes.map(t => `
      <div class="sum-row">
        <span>${t.taxName} (%${t.taxRate}):</span>
        <span>${this.currency(t.totalAmount)}</span>
      </div>`).join('');
    }

    // ─── Notes ────────────────────────────────────────────────────────────────

    private buildNotes(offer: OfferDetail): string {
        if (!offer.notes?.trim()) return '';
        return `
      <div class="notes-box">
        <h4>Notlar</h4>
        <p>${offer.notes}</p>
      </div>`;
    }

    // ─── Main HTML builder ───────────────────────────────────────────────────────

    buildHtml(offer: OfferDetail, options?: DocumentOptions): string {
        const type: DocumentType = options?.documentType ?? 'TEKLIF';
        const title = options?.title ?? this.docLabel(type);
        const tenant = options?.tenant;
        const customer = options?.customer;

        const docNo = this.buildDocNo(offer, type);
        const discountRow = offer.discount > 0
            ? `<div class="sum-row"><span>İndirim:</span><span>- ${this.currency(offer.discount)}</span></div>` : '';

        return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} #${docNo}</title>
  <style>
    :root {
      --primary: #1a2942;
      --border: #dee2e6;
      --bg: #f8f9fa;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      background: #e9ebee;
      color: var(--primary);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 16mm 18mm;
      margin: 12mm auto;
      background: #fff;
      box-shadow: 0 2px 18px rgba(0,0,0,.18);
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid var(--primary);
      padding-bottom: 18px;
      margin-bottom: 28px;
      gap: 20px;
    }
    .company-logo-img {
      max-height: 70px;
      max-width: 200px;
      object-fit: contain;
    }
    .company-name-text {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: var(--primary);
    }
    .doc-meta { text-align: right; }
    .doc-meta h1 {
      font-size: 26px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 8px;
    }
    .doc-meta p { font-size: 13px; margin: 2px 0; }

    /* Info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }
    .info-box h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #7f8c8d;
      border-bottom: 1px solid var(--border);
      padding-bottom: 4px;
      margin-bottom: 10px;
    }
    .info-box p { font-size: 13px; line-height: 1.6; }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }
    thead tr { background: var(--primary); color: #fff; }
    thead th { padding: 9px 12px; text-align: left; }
    tbody td { padding: 9px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
    tbody tr:nth-child(even) { background: #fafbfc; }
    .tr { text-align: right !important; }

    /* Summary */
    .sum-wrap { display: flex; justify-content: flex-end; }
    .sum-box { width: 280px; }
    .sum-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
      border-bottom: 1px solid #f0f0f0;
    }
    .sum-row.grand {
      border-top: 2px solid var(--primary);
      border-bottom: none;
      margin-top: 8px;
      padding-top: 12px;
      font-weight: 700;
      font-size: 16px;
    }

    /* Notes */
    .notes-box {
      margin-top: 28px;
      padding: 12px 16px;
      background: var(--bg);
      border-left: 3px solid var(--primary);
      border-radius: 4px;
    }
    .notes-box h4 { font-size: 12px; text-transform: uppercase; color: #7f8c8d; margin-bottom: 6px; }
    .notes-box p { font-size: 13px; line-height: 1.5; }

    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      font-size: 11px;
      color: #95a5a6;
      text-align: center;
    }

    @page { size: A4; margin: 0; }
    @media print {
      body { background: none; }
      .page { margin: 0; box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Header -->
    <div class="header">
      <div class="logo-wrap">
        ${this.buildLogoSection(tenant)}
      </div>
      <div class="doc-meta">
        <h1>${title}</h1>
        <p><strong>No:</strong> ${docNo}</p>
        <p><strong>Tarih:</strong> ${this.fmt(offer.createdAt)}</p>
        ${offer.validUntil ? `<p><strong>Geçerlilik:</strong> ${this.fmt(offer.validUntil)}</p>` : ''}
      </div>
    </div>

    <!-- Gönderen / Alıcı -->
    <div class="info-grid">
      <div class="info-box">
        <h3>Gönderen</h3>
        ${this.buildSenderBox(tenant)}
      </div>
      <div class="info-box">
        <h3>Alıcı</h3>
        ${this.buildRecipientBox(offer, customer)}
      </div>
    </div>

    <!-- Kalemler -->
    <table>
      <thead>
        <tr>
          <th>Ürün / Hizmet</th>
          <th class="tr">Miktar</th>
          <th class="tr">Birim Fiyat</th>
          <th class="tr">Toplam</th>
        </tr>
      </thead>
      <tbody>
        ${this.buildItemRows(offer)}
      </tbody>
    </table>

    <!-- Özet -->
    <div class="sum-wrap">
      <div class="sum-box">
        <div class="sum-row"><span>Ara Toplam:</span><span>${this.currency(offer.subTotal)}</span></div>
        ${discountRow}
        ${this.buildTaxRows(offer)}
        <div class="sum-row grand"><span>GENEL TOPLAM:</span><span>${this.currency(offer.totalAmount)}</span></div>
      </div>
    </div>

    <!-- Notlar -->
    ${this.buildNotes(offer)}

    <!-- Footer -->
    <div class="footer">
      <p>Bu belge dijital olarak oluşturulmuştur.</p>
      <p>Oluşturma Tarihi: ${this.fmt(offer.createdAt)}</p>
    </div>

  </div>
</body>
</html>`;
    }
}
