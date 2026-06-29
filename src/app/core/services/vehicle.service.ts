import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private base = `${environment.sanayiApiUrl}/vehicles`;

  constructor(private httpClient: HttpClient) { }

  getList(customerId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.base}/getall?customerId=${customerId}`);
  }

  add(vehicle: any): Observable<any> {
    return this.httpClient.post<any>(`${this.base}`, vehicle);
  }

  update(vehicle: any): Observable<any> {
    return this.httpClient.put<any>(`${this.base}`, vehicle);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.base}/${id}`);
  }
}