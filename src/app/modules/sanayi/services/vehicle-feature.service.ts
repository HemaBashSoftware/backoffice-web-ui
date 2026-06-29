import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VehicleFeature } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleFeatureService {
    // ⚠️ /api/vehiclefeatures — v1 prefix YOK
    private base = `${environment.sanayiApiUrl.replace('/api/v1', '/api')}/vehiclefeatures`;

    constructor(private http: HttpClient) {}

    getByVehicleId(vehicleId: number): Observable<VehicleFeature[]> {
        return this.http.get<VehicleFeature[]>(`${this.base}/getall`).pipe(
            map(list => list.filter(f => f.vehicleId === vehicleId))
        );
    }

    add(f: VehicleFeature): Observable<string> {
        return this.http.post<string>(this.base, f, { responseType: 'text' as 'json' });
    }

    update(f: VehicleFeature): Observable<string> {
        return this.http.put<string>(this.base, f, { responseType: 'text' as 'json' });
    }

    delete(id: number): Observable<string> {
        return this.http.delete<string>(this.base, { body: { id }, responseType: 'text' as 'json' });
    }
}
