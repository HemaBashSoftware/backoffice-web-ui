import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceRequest } from '../models/entities.model';
import { CreateServiceRequest } from '../models/service-request-create';

@Injectable({
  providedIn: 'root'
})

export class ServiceRequestService {

  constructor(private httpClient: HttpClient) { }

  getList(params?: any): Observable<ServiceRequest[]> {
    const cleanParams: any = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          if (params[key] instanceof Date) {
            const d = params[key] as Date;
            cleanParams[key] = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString();
          } else {
            cleanParams[key] = params[key];
          }
        }
      });
    }
    return this.httpClient.get<ServiceRequest[]>(environment.getApiUrl + "/ServiceRequests/getall", { params: cleanParams });
  }

  getById(id: number): Observable<ServiceRequest> {
    return this.httpClient.get<ServiceRequest>(environment.getApiUrl + `/ServiceRequests/getbyid?id=${id}`);
  }

  add(data: CreateServiceRequest): Observable<any> {
    var result = this.httpClient.post(environment.getApiUrl + "/ServiceRequests", data, { responseType: 'text' });
    return result;
  }

  update(data: CreateServiceRequest): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + "/ServiceRequests", data, { responseType: 'text' });
    return result;
  }

  delete(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + "/ServiceRequests", {
      body: { id: id },
      responseType: 'text'
    });
  }

  complete(data: { id: number, completedDate: Date, resultNotes?: string }): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + "/ServiceRequests/complete", data, { responseType: 'text' });
  }

}