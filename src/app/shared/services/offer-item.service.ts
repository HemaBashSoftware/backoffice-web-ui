import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OfferItemTaxe } from '../models/offer-item-taxe';

@Injectable({
  providedIn: 'root'
})

export class OfferItemService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<OfferItemTaxe[]> {
    
    return this.httpClient.get<OfferItemTaxe[]>(environment.getApiUrl + "/OfferItemTaxes/getall/");

  }

  

}
