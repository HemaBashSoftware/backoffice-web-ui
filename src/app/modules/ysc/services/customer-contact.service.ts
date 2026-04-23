import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomerContactDetail } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerContactService {
    private base = environment.yscApiUrl;

    constructor(private http: HttpClient) {}

    getByCustomer(customerId: number): Observable<CustomerContactDetail[]> {
        return this.http.get<CustomerContactDetail[]>(`${this.base}/customercontacts/getall`)
            .pipe(map(list => list.filter(c => c.customerId === customerId)));
    }

    add(data: Partial<CustomerContactDetail>): Observable<string> {
        return this.http.post<string>(`${this.base}/customercontacts`, data, { responseType: 'text' as 'json' });
    }

    update(data: CustomerContactDetail): Observable<string> {
        return this.http.put<string>(`${this.base}/customercontacts`, data, { responseType: 'text' as 'json' });
    }

    delete(id: number): Observable<string> {
        return this.http.delete<string>(`${this.base}/customercontacts`, { body: { id }, responseType: 'text' as 'json' });
    }
}
