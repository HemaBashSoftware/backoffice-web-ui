import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tenant } from '@/shared/models/entities.model';

@Injectable({
    providedIn: 'root'
})
export class TenantService {
    private apiUrl = `${environment.sanayiApiUrl}/Tenants`;

    constructor(private httpClient: HttpClient) { }

    getList(): Observable<Tenant[]> {
        return this.httpClient.get<Tenant[]>(`${this.apiUrl}/getall`);
    }

    getById(id: number): Observable<Tenant> {
        return this.httpClient.get<Tenant>(`${this.apiUrl}/getbyid?id=${id}`);
    }

    add(tenant: Tenant): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}`, tenant, { responseType: 'text' });
    }

    update(tenant: Tenant): Observable<any> {
        return this.httpClient.put(`${this.apiUrl}`, tenant, { responseType: 'text' });
    }

    delete(tenantId: number): Observable<any> {
        return this.httpClient.delete(`${this.apiUrl}`, { body: { Id: tenantId }, responseType: 'text' });
    }
}
