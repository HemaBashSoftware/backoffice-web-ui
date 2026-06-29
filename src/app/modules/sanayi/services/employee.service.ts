import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee.model';
import { ICrudService } from '../../../../shared/models/crud-service.interface';

@Injectable({ providedIn: 'root' })
export class SanayiEmployeeService implements ICrudService<Employee> {
    private base = `${environment.sanayiApiUrl}/employees`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.base}/getall`);
    }

    getById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.base}/getbyid?id=${id}`);
    }

    add(employee: Employee): Observable<string> {
        return this.http.post<string>(this.base, employee, { responseType: 'text' as 'json' });
    }

    update(employee: Employee): Observable<string> {
        return this.http.put<string>(this.base, employee, { responseType: 'text' as 'json' });
    }

    delete(id: number): Observable<string> {
        // ⚠️ API route is /employees/delete
        return this.http.delete<string>(`${this.base}/delete`, { body: { id }, responseType: 'text' as 'json' });
    }

    updateStatus(id: number, status: string): Observable<string> {
        return this.http.post<string>(`${this.base}/updatestatus`, { id, status }, { responseType: 'text' as 'json' });
    }
}
