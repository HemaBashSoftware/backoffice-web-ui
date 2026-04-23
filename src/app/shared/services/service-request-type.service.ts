import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceRequestType } from '../models/service-request-type';
import { CreateServiceRequestType } from '../models/service-request-type-create';

@Injectable({
  providedIn: 'root'
})

export class ServiceRequestTypeService {

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<ServiceRequestType[]> {
    return this.httpClient.get<ServiceRequestType[]>(environment.getApiUrl + "/ServiceRequestTypes/getall");
  }

  getById(id: number): Observable<ServiceRequestType> {
    return this.httpClient.get<ServiceRequestType>(environment.getApiUrl + `/ServiceRequestTypes/getbyid?id=${id}`);
  }

  add(data: CreateServiceRequestType): Observable<any> {
    var result = this.httpClient.post(environment.getApiUrl + "/ServiceRequestTypes", data, { responseType: 'text' });
    return result;
  }

  update(data: CreateServiceRequestType): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + "/ServiceRequestTypes", data, { responseType: 'text' });
    return result;
  }

  delete(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + "/ServiceRequestTypes", {
      body: { id: id },
      responseType: 'text'
    });
  }

}