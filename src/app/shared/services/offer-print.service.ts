import { Injectable } from '@angular/core';
import { OfferDetail } from '@/pages/offer/models/offer';
import { DocumentTemplateService, DocumentOptions } from './document-template.service';

/**
 * Backward-compatible wrapper around DocumentTemplateService.
 * Kept so that existing callers (offer.component.ts) don't break.
 * Pass options to use tenant logo, customer detail, etc.
 */
@Injectable({ providedIn: 'root' })
export class OfferPrintService {

  constructor(private docTemplate: DocumentTemplateService) { }

  print(offer: OfferDetail, options?: DocumentOptions): void {
    this.docTemplate.print(offer, { documentType: 'TEKLIF', ...options });
  }
}
