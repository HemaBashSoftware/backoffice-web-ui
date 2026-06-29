import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vehicle } from '../models/vehicle.model';
import { ICrudService } from '../../../../shared/models/crud-service.interface';

@Injectable({ providedIn: 'root' })
export class SanayiVehicleService implements ICrudService<Vehicle> {
    private base = `${environment.sanayiApiUrl}/vehicles`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${this.base}/getall`);
    }

    getById(id: number): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.base}/getbyid?id=${id}`);
    }

    add(vehicle: Vehicle): Observable<string> {
        return this.http.post<string>(`${this.base}`, vehicle, { responseType: 'text' as 'json' });
    }

    update(vehicle: Vehicle): Observable<string> {
        return this.http.put<string>(`${this.base}`, vehicle, { responseType: 'text' as 'json' });
    }

    delete(id: number): Observable<string> {
        return this.http.delete<string>(`${this.base}`, { body: { id }, responseType: 'text' as 'json' });
    }
}
