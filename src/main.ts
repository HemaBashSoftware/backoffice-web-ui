// çoklu dil için (Translate Service) -------------- 
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslationService } from '@/core/services/translation.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';

// Türkçe Locale kaydı (NG0701 hatasını önler)
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
registerLocaleData(localeTr, 'tr');

// i18 kullanıclak ise aşağıdaki metod aktif edilecek
export function HttpLoaderFactory() {
    return new TranslateHttpLoader(); // path ve suffix ver
}
// END -------------- 

//toast için
import { MessageService } from 'primeng/api';
// END -------------- 

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { importProvidersFrom } from '@angular/core';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { environment } from './environments/environment';
import { AuthInterceptorService } from '@/core/interceptors/auth.interceptor';
import { LoginGuard } from '@/core/guards/login-guard';
import { HttpEntityRepositoryService } from '@/core/services/http-entity-repository.service';
import { ErrorInterceptor } from '@/core/interceptors/error.interceptor';
import { LoadingInterceptor } from '@/core/interceptors/loading.interceptor';

bootstrapApplication(AppComponent, {
    providers: [
        // Router
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),

        // HttpClient + Interceptor
        provideHttpClient(withInterceptorsFromDi()),

        // Animations
        provideAnimationsAsync(),

        // PrimeNG Settings
        providePrimeNG({
            // PrimeNG Theme
            theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
            // PrimeNG Çevirileri
            translation: {
                dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
                dayNamesMin: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
                monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
                today: 'Bugün',
                clear: 'Temizle',
                dateFormat: 'dd.mm.yy'
            }
        }),

        // Translate çoklu dil için (Translate Service)
        importProvidersFrom(
            TranslateModule.forRoot({
                fallbackLang: environment.defaultLang,
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory, //i18 kullanılacak ise useClass kapatılıp yukarıda bulunan HttpLoaderFactory ve bu satır aktif edilecek
                    //useClass: TranslationService, // backendden alınacaksa bu satır aktif edilecek
                    deps: [HttpClient]
                }
            })
        ),
        { provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: { prefix: 'assets/i18n/', suffix: '.json' } },// bu token’ı vermezsen hata çıkar
        TranslateService,

        // Locale
        { provide: LOCALE_ID, useValue: 'tr' },

        // Toast
        MessageService,

        // Guards & Services
        LoginGuard,
        HttpEntityRepositoryService,

        // Auth Interceptor // Interceptor sıralaması önemli bu sırayı bozma
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        // Error Interceptor
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        // Error Interceptor
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

    ]

}).catch(err => console.error(err));
