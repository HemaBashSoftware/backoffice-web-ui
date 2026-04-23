import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { LoginUser } from './model/login-user';
import { LookUp } from '@/core/models/look-up';
import { AuthService } from './Services/auth.service';
import { LocalStorageService } from '@/core/services/local-storage.service';
import { LookUpService } from '@/core/services/look-up.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { ToastService } from '@/core/services/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    imports: [TranslateModule, MessageModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator]
})

export class LoginComponent {
    
    username: string = "";
    loginUser: LoginUser = new LoginUser();
    langugelookUp: LookUp[] | undefined;
    submitted: boolean = false;

    constructor(
        private toastService: ToastService,
        private auth: AuthService,
        private storageService: LocalStorageService,
        public translateService: TranslateService,
        private httpClient: HttpClient,
    ) { }

    ngOnInit() {

        this.username = this.auth.userName;

        // Dil Paketlerini backendten çekiyoruz
        // this.httpClient.get<LookUp[]>(environment.getApiUrl + "/languages/codes").subscribe(data => {
        //     this.langugelookUp = data;
        //     console.log("langugelookUp", data);

        // })

    }

    login(form: any) {

        if (!form.valid) {
            this.submitted = true;
            this.toastService.error("FORM.CHECK_REQUIRED_FIELDS");
            return;
        }

        this.auth.login(this.loginUser);

    }

    logOut() {
        this.storageService.removeToken();
        this.storageService.removeItem("lang");
    }

    // Gelen dillerden seçilen dili localstorage'a atıyoruz ve translateService ile dili değiştiriyoruz
    // changeLang(lang: string) {
    //     localStorage.setItem("lang", lang);
    //     this.translateService.use(lang);
    // }

    // getUserName() {
    //     return this.username;
    // }

}
