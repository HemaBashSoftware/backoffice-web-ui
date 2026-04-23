import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, OutgoingInvoice, ServiceRequest } from '../models/entities.model';
import { CreateOutgoingInvoiceCommand, CreateServiceRequestCommand, CreatePaymentPayHistoryCommand } from '../models/commands.model';
import { CreatePaymentPayHistory } from '@/shared/models/payment-pay';
import { CreatePayment } from '@/shared/models/payment';
import { Offer } from '../models/offer';
import { CreateOffer } from '../models/offer-create';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.getApiUrl}/payments`;

    constructor(private http: HttpClient) { }

    getAll(filters?: any): Observable<Payment[]> {
        let params = new HttpParams();
        if (filters) {
            if (filters.search) params = params.set('search', filters.search);
            if (filters.customerId) params = params.set('customerId', filters.customerId.toString());
            if (filters.assignedUserId) params = params.set('assignedUserId', filters.assignedUserId.toString());
            if (filters.beginDate) {
                // Ensure date string is sent clearly
                const d = new Date(filters.beginDate);
                params = params.set('beginDate', d.toISOString());
            }
            if (filters.endDate) {
                const d = new Date(filters.endDate);
                params = params.set('endDate', d.toISOString());
            }
        }
        return this.http.get<Payment[]>(`${this.apiUrl}/getall`, { params });
    }

    getById(id: number): Observable<Payment> {
        return this.http.get<Payment>(`${this.apiUrl}/getbyid?id=${id}`);
    }

    create(command: CreatePayment): Observable<any> {
        return this.http.post(`${this.apiUrl}`, command, { responseType: 'text' });
    }

    update(command: CreatePayment): Observable<any> {
        return this.http.put(`${this.apiUrl}`, command, { responseType: 'text' });
    }
}

@Injectable({
    providedIn: 'root'
})
export class PaymentPayHistoryService {
    private apiUrl = `${environment.getApiUrl}/paymentpayhistories`;

    constructor(private http: HttpClient) { }

    create(command: CreatePaymentPayHistory): Observable<any> {
        return this.http.post(`${this.apiUrl}`, command, { responseType: 'text' });
    }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getall`);
    }
}

@Injectable({
    providedIn: 'root'
})
export class OutgoingInvoiceService {
    private apiUrl = `${environment.getApiUrl}/invoices`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<OutgoingInvoice[]> {
        return this.http.get<OutgoingInvoice[]>(`${this.apiUrl}/getall`);
    }

    getById(id: number): Observable<OutgoingInvoice> {
        return this.http.get<OutgoingInvoice>(`${this.apiUrl}/getbyid?id=${id}`);
    }

    create(command: CreateOutgoingInvoiceCommand): Observable<any> {
        return this.http.post(`${this.apiUrl}`, command, { responseType: 'text' });
    }
}
