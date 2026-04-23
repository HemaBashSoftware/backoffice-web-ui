import { Component } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { AuthService } from '@/pages/auth/login/Services/auth.service';
import { Subscription } from 'rxjs';
import { environment } from './environments/environment';
// çoklu dil için (Translate Service)
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// toast için
import { ToastModule } from 'primeng/toast';
// loading için
import { LoadingSpinnerComponent } from '@/core/components/loading-spinner/loading-spinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

export let browserRefresh = false;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, TranslateModule, ConfirmDialogModule, LoadingSpinnerComponent],
    providers: [ConfirmationService],
    template: `
    <!-- page -->
    <router-outlet></router-outlet>
    <!-- toast -->
    <p-toast></p-toast>
    <!-- loading spinner -->
    <app-loading-spinner ></app-loading-spinner>
    <!-- Generic Silme, onaylama modalı-->
    <p-confirmdialog [style]="{ width: '450px' }" 
    />
    `
})
export class AppComponent {
    subscription: Subscription;
    isRefresh: boolean | undefined;

    constructor(
        private translate: TranslateService,
        private authService: AuthService,
        private router: Router,
    ) {
        translate.setDefaultLang(environment.defaultLang);
        translate.use(environment.defaultLang);

        if (!this.authService.loggedIn()) {
            this.authService.logOut();
            this.router.navigateByUrl("/auth/login");
        }

        this.subscription = router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                browserRefresh = !router.navigated;
            }
        });
    }

    isLoggedIn(): boolean {
        return this.authService.loggedIn();
    }
}
