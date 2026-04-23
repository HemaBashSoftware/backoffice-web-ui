import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  apiUrl = "https://localhost:5001/api/Vehicles"; 

  constructor(private httpClient: HttpClient) { }

  getList(customerId : number): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl + "/getall?customerId="+customerId);
  }

  add(vehicle: any): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl + "/add", vehicle);
  }
}