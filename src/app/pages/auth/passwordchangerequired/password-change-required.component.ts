import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordChangeRequired } from './model/password-change-required';
import { AuthService } from '../login/Services/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { LookUpService } from '@/core/services/look-up.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-password-change-required',
    standalone: true,
    templateUrl: './password-change-required.component.html',
    styleUrls: ['./password-change-required.component.scss'],
    imports: [TranslateModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
})
export class PasswordChangeRequiredComponent implements OnInit {
    loadingVisible = false;
    username: string = "";
    passwordChangeRequired: PasswordChangeRequired = new PasswordChangeRequired();

    constructor(private auth: AuthService,
        private storageService: LocalStorageService,
        private lookupService: LookUpService,
        public translateService: TranslateService,
        private httpClient: HttpClient,
        private router: Router,) { }

    ngOnInit() {

        this.username = this.auth.userName;

    }

    getUserName() {
        return this.username;
    }

    passwordChange() {
        this.loadingVisible = true;

        this.auth.passwordChangeRequired(this.passwordChangeRequired).subscribe((data) => {

            if (data == "PasswordChanged") {
                Swal.fire({
                    title: `<strong>Ba�ar�l�</strong>`,
                    text: 'Yeni �ifreniz ba�ar�yla olu�turuldu. Yeni �ifreniz ile tekrar giri� yapmal�s�n�z!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Giri� yap',

                }).then((result: { isConfirmed: any; }) => {
                    if (result.isConfirmed) {
                        this.logOut();
                        this.router.navigateByUrl("auth/login");
                    }
                });
            }
        });

    }

    logOut() {
        this.storageService.removeToken();
        this.storageService.removeItem("lang");
    }



}
