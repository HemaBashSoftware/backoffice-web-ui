import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerService } from '../components/loading-spinner/loading-spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // İstek başlarken loading açar
    this.loadingService.showLoading();

    return next.handle(req).pipe(
      finalize(() => {
        // İstek bitince loading kapatır (hata olsa bile)
        this.loadingService.hideLoading();
      })
    );
  }
}
