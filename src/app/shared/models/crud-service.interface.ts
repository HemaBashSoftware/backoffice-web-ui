import { Observable } from 'rxjs';

export interface ICrudService<T> {
    getAll(): Observable<any>;
    getById(id: number | string): Observable<T>;
    add(data: T): Observable<any>;
    update(data: T): Observable<any>;
    delete(idOrEntity: number | string | T): Observable<any>;
}
