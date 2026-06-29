import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MaintenanceJobDto } from '../models/job-tracking.model';

@Injectable({ providedIn: 'root' })
export class JobTrackingDetailService {
    private base = environment.sanayiApiUrl;

    constructor(private http: HttpClient) {}

    /**
     * Bir tenant'a ait tüm bakım/iş kayıtlarını döner.
     * API tenantId'yi JWT'den alır; backoffice admin olduğu için 
     * bu endpoint tenant bazlı çağrılır.
     * NOT: Mevcut /maintenances/getall endpoint'i JWT'deki tenantId'yi kullanır.
     * Şimdilik tüm maintenance listesi çekilip frontend'de filtreleniyor.
     */
    getMaintenancesByTenantId(tenantId: number): Observable<MaintenanceJobDto[]> {
        return this.http.get<MaintenanceJobDto[]>(`${this.base}/maintenances/getall`);
    }

    getAllMaintenances(): Observable<MaintenanceJobDto[]> {
        return this.http.get<MaintenanceJobDto[]>(`${this.base}/maintenances/getall`);
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.base}/maintenances/getbyid?id=${id}`);
    }

    add(payload: any): Observable<string> {
        return this.http.post<string>(`${this.base}/maintenances`, payload, { responseType: 'text' as 'json' });
    }

    update(payload: any): Observable<string> {
        return this.http.put<string>(`${this.base}/maintenances/update`, payload, { responseType: 'text' as 'json' });
    }

    delete(id: number): Observable<string> {
        return this.http.delete<string>(`${this.base}/maintenances`, { body: { id }, responseType: 'text' as 'json' });
    }

    // --- Sub-entities CRUD ---

    addOperation(payload: any): Observable<string> { return this.http.post<string>(`${this.base}/maintenanceoperations`, payload, { responseType: 'text' as 'json' }); }
    updateOperation(payload: any): Observable<string> { return this.http.put<string>(`${this.base}/maintenanceoperations`, payload, { responseType: 'text' as 'json' }); }
    deleteOperation(id: number): Observable<string> { return this.http.delete<string>(`${this.base}/maintenanceoperations`, { body: { id }, responseType: 'text' as 'json' }); }

    addProduct(payload: any): Observable<string> { return this.http.post<string>(`${this.base}/maintenanceproducts`, payload, { responseType: 'text' as 'json' }); }
    updateProduct(payload: any): Observable<string> { return this.http.put<string>(`${this.base}/maintenanceproducts`, payload, { responseType: 'text' as 'json' }); }
    deleteProduct(id: number): Observable<string> { return this.http.delete<string>(`${this.base}/maintenanceproducts`, { body: { id }, responseType: 'text' as 'json' }); }

    addEmployee(payload: any): Observable<string> { return this.http.post<string>(`${this.base}/maintenanceemployeeses`, payload, { responseType: 'text' as 'json' }); }
    deleteEmployee(id: number): Observable<string> { return this.http.delete<string>(`${this.base}/maintenanceemployeeses`, { body: { id }, responseType: 'text' as 'json' }); }
}
