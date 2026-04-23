import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        // ❗ 401'i asla burada yakalama
        if (error.status === 401) {
          return throwError(() => error); // AuthInterceptor handle edecek
        }

        if (error.statusText === "OK") {

          this.messageService.add({
            severity: "error",
            summary: "Hata",
            detail: error.error
          });

          return throwError(() => error);
        }


        let errorMessage = "";

        if (error.error instanceof ErrorEvent) {
          errorMessage = "İnternet bağlantısı yok veya istek gönderilemedi.";
        } else {
          errorMessage = this.getServerErrorMessage(error);
        }

        this.messageService.add({
          severity: "error",
          summary: "Hata",
          detail: errorMessage
        });

        return throwError(() => error);
      })
    );
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    
    switch (error.status) {
      case 400:
        return "Geçersiz istek (INTCode : 400)";
      case 403:
        return "Bu işlem için yetkiniz yok (INTCode : 403)";
      case 404:
        return "Kayıt bulunamadı (INTCode : 404)";
      case 500:
        return "Sunucu hatası (INTCode : 500)";
      default:
        return "Beklenmeyen bir hata oluştu. (INTCode : Unknown)";
    }

  }
}
