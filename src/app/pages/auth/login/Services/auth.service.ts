import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginUser } from '../model/login-user';
import { TokenModel } from '../model/token-model';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { SharedService } from '@/core/services/shared.service';
import { PasswordChangeRequired } from '../../passwordchangerequired/model/password-change-required';
import { ToastService } from '@/core/services/toast.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    userName: string = "";
    isLoggin: boolean | undefined;
    decodedToken: any;
    userToken: string = "";
    jwtHelper: JwtHelperService = new JwtHelperService();
    claims: string[] | undefined;
    customerName: string = "";
    userType: string = "";
    isPasswordChangeRequired: string = "";

    constructor(
        private toastService: ToastService,
        private httpClient: HttpClient,
        private storageService: LocalStorageService,
        private router: Router,
        private sharedService: SharedService) {

        this.setClaims();
    }

    login(loginUser: LoginUser) {

        let headers = new HttpHeaders();
        headers = headers.append("Content-Type", "application/json")

        this.httpClient.post<TokenModel>(environment.getApiUrl + "/Auth/login", loginUser, { headers: headers }).subscribe(data => {

            if (data.success) {

                this.storageService.setToken(data?.data?.token || '');
                this.storageService.setItem("refreshToken", data?.data?.refreshToken)
                this.claims = data?.data?.claims;
                var decode = this.jwtHelper.decodeToken(this.storageService.getToken() || '');


                var propUserName = Object.keys(decode).filter(x => x.endsWith("/name"))[0];
                this.userName = decode[propUserName];


                this.userType = decode["UserType"];

                if (decode["UserType"] == 'Customer') {
                    this.customerName = decode["CustomerName"];
                } else {
                    this.customerName = "";
                }
                this.isPasswordChangeRequired = decode["isPasswordChangeRequired"];

                this.sharedService.sendChangeUserNameEvent();
                this.toastService.success("LOGIN.LOGIN_SUCCESS");
                if (this.isPasswordChangeRequired == 'True') {

                    this.router.navigate(["/password-change-required"]);
                } else {
                    this.router.navigateByUrl("/");
                }

            }
            else {
                this.toastService.warning(data.message);
            }
        }
        );
    }

    passwordChangeRequired(passwordChangeRequired: PasswordChangeRequired): Observable<any> {

        var result = this.httpClient.put(environment.getApiUrl + "/Auth/password-change-required", passwordChangeRequired, { responseType: 'text' });
        return result;
    }

    getUserName(): string {
        return this.userName;
    }

    getCustomerName(): string {
        return this.customerName;
    }

    getUserType(): string {
        return this.userType;
    }

    getIsPasswordChangeRequired(): string {
        var token = this.storageService.getToken();

        if (token == null) {
            this.isPasswordChangeRequired = 'False';
            return this.isPasswordChangeRequired;
        }

        var decode = this.jwtHelper.decodeToken(token);
        this.isPasswordChangeRequired = decode["isPasswordChangeRequired"];
        return this.isPasswordChangeRequired;
    }


    setClaims() {

        if ((this.claims == undefined || this.claims.length == 0) && this.storageService.getToken() != null && this.loggedIn()) {

            this.httpClient.get<string[]>(environment.getApiUrl + "/operation-claims/cache").subscribe(data => {
                this.claims = data;
            })

            var token = this.storageService.getToken();
            var decode = this.jwtHelper.decodeToken(token || '');

            var propUserName = Object.keys(decode).filter(x => x.endsWith("/name"))[0];
            this.userName = decode[propUserName];
            this.userType = decode["UserType"];

            if (decode["UserType"] == 'Customer') {
                this.customerName = decode["CustomerName"];
            } else {
                this.customerName = "";
            }

            this.isPasswordChangeRequired = decode["isPasswordChangeRequired"];
        }
    }

    logOut() {
        this.storageService.removeToken();
        this.storageService.removeItem("lang")
        this.storageService.removeItem("refreshToken");
        this.claims = [];
    }

    loggedIn(): boolean {

        let isExpired = this.jwtHelper.isTokenExpired(this.storageService.getToken(), -120);
        return !isExpired;
    }

    getCurrentUserId() {
        this.jwtHelper.decodeToken(this.storageService.getToken() || '').userId;
    }

    claimGuard(claim: string): boolean {

        if (!this.loggedIn()) {
            this.router.navigate(["auth/login"]);
            return false; // buraya ekledik
        }

        if (this.claims != null) {
            var check = this.claims.some(function (item) {
                return item == claim;
            })

            return check;
        }

        return false;
    }

}
