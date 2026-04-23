import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenService } from '@/pages/auth/login/Services/token.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private storageService: LocalStorageService,
    private router: Router,
    private messageService: MessageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = this.addToken(req);

    return next.handle(req).pipe(
      catchError((error) => {

        // Login ve Refresh isteklerini refresh token mekanizmasından muaf tut
        // if ((req.url.includes("/auth/login") || req.url.includes("/auth/refresh-token")) && error.status === 401) {
        if (req.url.toLowerCase().includes("/auth/login") && error.status === 401) {

          this.toastError(error.error);
          return throwError(() => error);
        }

        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        else {
          return throwError(() => error);
        }
      })
    )
  }
  private addToken(req: HttpRequest<any>) {
    var lang = localStorage.getItem("lang") || environment.defaultLang
    //TODO: Refactoring needed

    return req.clone({
      setHeaders: {
        'Accept-Language': lang,
        'Authorization': `Bearer ${localStorage.getItem('token')}`

      },

      responseType: req.method == "DELETE" ? "text" : req.responseType
    });


  }
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      let refresh = this.tokenService.refreshToken();

      if (refresh) {
        return refresh.pipe(
          switchMap((token: any) => {
            console.log("Token Yenilendi.")
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.data.token);
            return next.handle(this.addToken(req))
          }),
          catchError(err => {
            this.isRefreshing = false;
            this.storageService.removeToken();
            this.storageService.removeItem("lang");

            this.toastWarning("Refresh Token Not Found");
            this.toastWarning(err);
            this.router.navigate(["auth/login"]);
            return throwError(() => err);
          })
        );

      } else {
        // refresh token yoksa hata döndür
        this.isRefreshing = false;
        this.toastWarning("Refresh Token Not Found");
        this.router.navigate(["auth/login"]);
        return throwError(() => "Refresh Token Not Found");
      }
    }
    else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(req));
        })
      )
    }
  }

  private toastWarning(message: string, summary?: string) {
    
    this.messageService.add({ severity: 'warn', summary: 'Message', detail: message });
  }

  private toastError(message: string, summary?: string) {

    this.messageService.add({ severity: 'error', summary: 'Message', detail: message });
  }

}
