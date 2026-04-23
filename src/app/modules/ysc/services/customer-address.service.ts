import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomerAddressDetail } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerAddressService {
    private base = environment.yscApiUrl;

    constructor(private http: HttpClient) {}

    getByCustomer(customerId: number): Observable<CustomerAddressDetail[]> {
        return this.http.get<CustomerAddressDetail[]>(`${this.base}/customeraddresses/getall`)
            .pipe(map(list => list.filter(a => a.customerId === customerId)));
    }

    add(data: Partial<CustomerAddressDetail>): Observable<string> {
        return this.http.post<string>(`${this.base}/customeraddresses`, data);
    }

    update(data: CustomerAddressDetail): Observable<string> {
        return this.http.put<string>(`${this.base}/customeraddresses`, data);
    }

    delete(id: number): Observable<string> {
        return this.http.delete<string>(`${this.base}/customeraddresses`, { body: { id }, responseType: 'text' as 'json' });
    }
}
