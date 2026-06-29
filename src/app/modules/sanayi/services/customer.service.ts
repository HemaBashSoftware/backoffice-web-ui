import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TenantModel } from '../models/customer.model';
import { ICrudService } from '../../../shared/models/crud-service.interface';

@Injectable({ providedIn: 'root' })
export class SanayiCustomerService implements ICrudService<TenantModel> {
    // Tüm işlemler Tenants endpoint'i üzerinden yapılır
    private base = environment.sanayiApiUrl;

    constructor(private http: HttpClient) {}

    getAll(): Observable<TenantModel[]> {
        return this.http.get<TenantModel[]>(`${this.base}/tenants/getall?_t=${new Date().getTime()}`);
    }

    getById(id: number): Observable<TenantModel> {
        return this.http.get<TenantModel>(`${this.base}/tenants/getbyid?id=${id}`);
    }

    add(tenant: TenantModel): Observable<any> {
        return this.http.post(`${this.base}/tenants`, tenant, { responseType: 'text' });
    }

    update(tenant: TenantModel): Observable<any> {
        return this.http.put(`${this.base}/tenants`, tenant, { responseType: 'text' });
    }

    delete(tenant: TenantModel): Observable<any> {
        // Soft delete: IsDeleted = true
        const payload = { ...tenant, isDeleted: true };
        return this.http.put(`${this.base}/tenants`, payload, { responseType: 'text' });
    }

    // Durum güncellemesi: RecordStatus (1-5) Tenants tablosuna yazılır
    updateStatus(tenant: TenantModel, status: number): Observable<any> {
        const isDeleted = (status === 2 || status === 3); // Pasif veya ödenmemiş ise isDeleted = true
        const payload = { ...tenant, recordStatus: status, isDeleted: isDeleted };
        return this.http.put(`${this.base}/tenants`, payload, { responseType: 'text' });
    }
}
