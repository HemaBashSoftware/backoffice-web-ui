import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer.model';
import { ICrudService } from '../../../shared/models/crud-service.interface';

@Injectable({ providedIn: 'root' })
export class YscCustomerService implements ICrudService<Customer> {
    private base = environment.yscApiUrl;

    constructor(private http: HttpClient) {}

    getAll(): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${this.base}/customers/getall`);
    }

    getById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.base}/customers/getbyid?id=${id}`);
    }

    add(customer: Customer): Observable<string> {
        return this.http.post<string>(`${this.base}/customers`, customer, { responseType: 'text' as 'json' });
    }

    update(customer: Customer): Observable<string> {
        return this.http.put<string>(`${this.base}/customers`, customer, { responseType: 'text' as 'json' });
    }

    delete(id: number): Observable<string> {
        return this.http.put<string>(`${this.base}/tenants`, { id: id, recordStatus: 2 }, { responseType: 'text' as 'json' });
    }

    updateStatus(customer: Customer, status: number): Observable<string> {
        return this.http.put<string>(`${this.base}/tenants`, { id: customer.id, recordStatus: status }, { responseType: 'text' as 'json' });
    }
}
