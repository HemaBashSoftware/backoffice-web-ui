import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { District, Neighbourhood, Province } from '../models/address-lookup.model';

@Injectable({ providedIn: 'root' })
export class AddressLookupService {
    private base = environment.yscApiUrl;

    constructor(private http: HttpClient) {}

    getProvinces(): Observable<Province[]> {
        return this.http.get<Province[]>(`${this.base}/provinces/getall`);
    }

    getDistricts(provinceId: number): Observable<District[]> {
        return this.http.get<District[]>(`${this.base}/districts/getall?provinceId=${provinceId}`);
    }

    getNeighbourhoods(districtId: number): Observable<Neighbourhood[]> {
        return this.http.get<Neighbourhood[]>(`${this.base}/neighbourhoods/getall?districtId=${districtId}`);
    }
}
