import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationDto } from '../models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private httpClient: HttpClient) { }

    getNotifications(): Observable<NotificationDto[]> {
        return this.httpClient.get<NotificationDto[]>(environment.getApiUrl + "/Notifications/getall").pipe(
            tap(notes => {
                // Bu metot çağrıldığında count'u güncelliyoruz
                const count = notes.filter(x => !x.isRead).length;
                this.unreadCountSubject.next(count);
            })
        );
    }

    getUnreadCount(): Observable<number> {
        return this.httpClient.get<number>(environment.getApiUrl + "/NotificationReads/getunreadcount").pipe(
            tap(count => {
                this.unreadCountSubject.next(count);
            })
        );
    }

    markAsRead(notificationId: number): Observable<any> {
        return this.httpClient.post(environment.getApiUrl + "/NotificationReads", {
            notificationId: notificationId
        }, { responseType: 'text' }).pipe(
            tap(() => {
                this.getUnreadCount().subscribe();
            })
        );
    }

    markAllAsRead(): Observable<any> {
        return this.httpClient.post(environment.getApiUrl + "/NotificationReads/markallasread", {}, { responseType: 'text' }).pipe(
            tap(() => {
                this.unreadCountSubject.next(0);
            })
        );
    }

    deleteNotification(notificationId: number, wasUnread: boolean = false): Observable<any> {
        return this.httpClient.post(environment.getApiUrl + "/NotificationDeletes", {
            notificationId: notificationId
        }, { responseType: 'text' }).pipe(
            tap(() => {
                this.getUnreadCount().subscribe();
            })
        );
    }
}
