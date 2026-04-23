import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginUser } from '../model/login-user';
import { TokenResponse } from '../model/token-model';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { SharedService } from '@/core/services/shared.service';
import { ToastService } from '@/core/services/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    userName: string = '';
    decodedToken: any;
    jwtHelper: JwtHelperService = new JwtHelperService();
    claims: string[] = [];
    userType: string = '';

    private identityBase = environment.identityApiUrl;

    constructor(
        private toastService: ToastService,
        private httpClient: HttpClient,
        private storageService: LocalStorageService,
        private router: Router,
        private sharedService: SharedService,
    ) {
        this.setClaims();
    }

    login(loginUser: LoginUser) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.httpClient
            .post<TokenResponse>(`${this.identityBase}/auth/login`, loginUser, { headers })
            .subscribe({
                next: data => {
                    this.storageService.setToken(data.token);
                    this.storageService.setItem('refreshToken', data.refreshToken);
                    this.claims = data.claims ?? [];

                    const decode = this.jwtHelper.decodeToken(data.token);
                    const nameProp = Object.keys(decode).find(x => x.endsWith('/name'));
                    this.userName = nameProp ? decode[nameProp] : (decode['username'] ?? '');
                    this.userType = decode['type'] ?? '';

                    this.sharedService.sendChangeUserNameEvent();
                    this.toastService.success('Giriş başarılı.');
                    this.router.navigateByUrl('/');
                },
                error: (err) => {
                    const msg = err?.error?.message ?? 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.';
                    this.toastService.error(msg);
                }
            });
    }

    setClaims() {
        if (this.claims.length === 0
            && this.storageService.getToken() != null
            && this.loggedIn()) {

            const token = this.storageService.getToken()!;
            const decode = this.jwtHelper.decodeToken(token);
            const nameProp = Object.keys(decode).find(x => x.endsWith('/name'));
            this.userName = nameProp ? decode[nameProp] : (decode['username'] ?? '');
            this.userType = decode['type'] ?? '';
        }
    }

    logOut() {
        this.storageService.removeToken();
        this.storageService.removeItem('lang');
        this.storageService.removeItem('refreshToken');
        this.claims = [];
    }

    loggedIn(): boolean {
        return !this.jwtHelper.isTokenExpired(this.storageService.getToken(), -120);
    }

    getUserName()   { return this.userName; }
    getUserType()   { return this.userType; }
    getCustomerName() { return ''; }

    claimGuard(claim: string): boolean {
        if (!this.loggedIn()) {
            this.router.navigate(['auth/login']);
            return false;
        }
        return this.claims?.some(c => c === claim) ?? false;
    }
}
