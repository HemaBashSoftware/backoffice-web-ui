import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TenantJobModel } from '../models/job-tracking.model';

@Injectable({ providedIn: 'root' })
export class JobTrackingService {
    private base = environment.sanayiApiUrl;

    constructor(private http: HttpClient) {}

    /** Tüm tenant listesini döner (backoffice tüm firmaları görebilir) */
    getAllTenants(): Observable<TenantJobModel[]> {
        return this.http.get<TenantJobModel[]>(`${this.base}/tenants/getall`);
    }

    /** ID'ye göre tek tenant döner */
    getTenantById(id: number): Observable<TenantJobModel> {
        return this.http.get<TenantJobModel>(`${this.base}/tenants/getbyid?id=${id}`);
    }

    /** Yeni firma ekle — API CreateTenant işlemi aynı zamanda Admin kullanıcısı + Employee oluşturur */
    addTenant(payload: Partial<TenantJobModel>): Observable<any> {
        return this.http.post(`${this.base}/tenants`, payload, { responseType: 'text' });
    }

    /** Firma güncelle */
    updateTenant(payload: TenantJobModel): Observable<any> {
        return this.http.put(`${this.base}/tenants`, payload, { responseType: 'text' });
    }

    /** Firma pasife al (soft-delete: IsDeleted = true) */
    deleteTenant(tenant: TenantJobModel): Observable<any> {
        const payload = { ...tenant, isDeleted: true, deletedAt: new Date().toISOString() };
        return this.http.put(`${this.base}/tenants`, payload, { responseType: 'text' });
    }
}
