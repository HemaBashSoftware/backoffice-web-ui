import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TenantModel } from '../models/customer.model';
import { ICrudService } from '../../../shared/models/crud-service.interface';

@Injectable({ providedIn: 'root' })
export class BpmCustomerService implements ICrudService<TenantModel> {
    private base = environment.bpmApiUrl;

    constructor(private http: HttpClient) {}

    getAll(): Observable<TenantModel[]> {
        return this.http.get<TenantModel[]>(`${this.base}/tenants/getall`);
    }

    getById(id: number): Observable<TenantModel> {
        return this.http.get<TenantModel>(`${this.base}/tenants/getbyid?id=${id}`);
    }

    add(tenant: TenantModel): Observable<string> {
        return this.http.post<string>(`${this.base}/tenants`, tenant, { responseType: 'text' as 'json' });
    }

    update(tenant: TenantModel): Observable<string> {
        return this.http.put<string>(`${this.base}/tenants`, tenant, { responseType: 'text' as 'json' });
    }

    /**
     * Soft-delete: DELETE /tenants/{id}
     * API tarafında IsDeleted=true yaparak kaydı pasife alır, fiziksel silme yapmaz.
     */
    delete(id: number): Observable<string> {
        return this.http.delete<string>(`${this.base}/tenants/${id}`);
    }

    /**
     * Durum güncellemesi (Sanayi modülüyle aynı)
     * Backend desteği geldiğinde kullanılmak üzere eklendi
     */
    updateStatus(tenant: TenantModel, status: number): Observable<any> {
        const isDeleted = (status === 2 || status === 3);
        const payload = { ...tenant, recordStatus: status, isDeleted: isDeleted };
        return this.http.put(`${this.base}/tenants`, payload, { responseType: 'text' as 'json' });
    }
}
