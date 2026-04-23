import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class YscCustomerService {
    private base = environment.yscApiUrl;

    constructor(private http: HttpClient) {}

    getAll(): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${this.base}/customers/getall`);
    }

    getById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.base}/customers/getbyid?id=${id}`);
    }

    add(customer: Customer): Observable<string> {
        return this.http.post<string>(`${this.base}/customers`, customer);
    }

    update(customer: Customer): Observable<string> {
        return this.http.put<string>(`${this.base}/customers`, customer);
    }

    delete(id: number): Observable<string> {
        return this.http.delete<string>(`${this.base}/customers`, { body: { id }, responseType: 'text' as 'json' });
    }

    updateStatus(customer: Customer, status: number): Observable<string> {
        return this.http.put<string>(`${this.base}/customers`, { ...customer, recordStatus: status });
    }
}
