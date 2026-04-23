import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Offer } from '../models/offer';
import { CreateOffer } from '../models/offer-create';
import { OfferStatus } from '@/core/constants/offer-status';

@Injectable({
  providedIn: 'root'
})

export class OfferService {

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<Offer[]> {
    return this.httpClient.get<Offer[]>(environment.getApiUrl + "/Offers/getall");
  }

  getById(id: number): Observable<Offer> {
    return this.httpClient.get<Offer>(environment.getApiUrl + `/Offers/getbyid?id=${id}`);
  }

  add(data: CreateOffer): Observable<any> {
    var result = this.httpClient.post(environment.getApiUrl + "/Offers", data, { responseType: 'text' });
    return result;
  }

  update(data: CreateOffer): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + "/Offers", data, { responseType: 'text' });
    return result;
  }

  delete(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + "/Offers", {
      body: { id: id },
      responseType: 'text'
    });
  }

}