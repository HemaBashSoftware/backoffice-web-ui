import { LocalStorageService } from '@/core/services/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private httpClient: HttpClient, private storageService: LocalStorageService) { }

  refreshToken() {

    if (this.storageService.getItem("refreshToken") !== null) {
      return this.httpClient
        .post<any>(environment.getApiUrl + "/Auth/refresh-token", { refreshToken: this.storageService.getItem("refreshToken") })
        .pipe(tap(res => {
          if (res.success) {
            this.storageService.setToken(res.data.token);
            this.storageService.setItem("refreshToken", res.data.refreshToken);
          }
        }));
    }

    // refreshToken yok → boş observable döndür
  return null;
  }

}
