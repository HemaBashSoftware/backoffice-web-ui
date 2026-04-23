import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { YscType, StandartNumber } from '../models/definitions.model';

@Injectable({ providedIn: 'root' })
export class YscTypeService {
    private base = `${environment.yscApiUrl}/YscTypes`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<YscType[]>          { return this.http.get<YscType[]>(`${this.base}/getall`); }
    add(data: { name: string }): Observable<string>        { return this.http.post<string>(this.base, data); }
    update(data: YscType): Observable<string>              { return this.http.put<string>(this.base, data); }
    delete(id: number): Observable<string>                 { return this.http.delete<string>(this.base, { body: { id }, responseType: 'text' as 'json' }); }
}

@Injectable({ providedIn: 'root' })
export class StandartNumberService {
    private base = `${environment.yscApiUrl}/TubeStandartNumberDefinitions`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<StandartNumber[]>                        { return this.http.get<StandartNumber[]>(this.base); }
    add(data: { standartNumber: string }): Observable<string>     { return this.http.post<string>(this.base, data); }
    update(data: StandartNumber): Observable<string>              { return this.http.put<string>(this.base, data); }
    delete(id: number): Observable<string>                        { return this.http.delete<string>(this.base, { body: { id }, responseType: 'text' as 'json' }); }
}
