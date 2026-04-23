import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LookUp } from '../models/look-up';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LookUpService {

  constructor(private httpClient: HttpClient) { }

  getGroupLookUp(): Observable<LookUp[]> {

    return this.httpClient.get<LookUp[]>(environment.identityApiUrl + "/groups/lookups")
  }

  getOperationClaimLookUp(): Observable<LookUp[]> {

    return this.httpClient.get<LookUp[]>(environment.identityApiUrl + "/operation-claims/lookups")
  }

  getUserLookUp():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.identityApiUrl + "/users/lookups")
  }

  getLanguageLookup():Observable<LookUp[]>{
    return this.httpClient.get<LookUp[]>(environment.identityApiUrl + "/languages/lookups")
  }

}
