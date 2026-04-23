# BPM Web UI — Developer Skills Reference

> Angular 20 standalone, PrimeNG v20, Tailwind CSS v4, TypeScript 5.8 strict mode

---

## 1. DataGrid (p-table)

**Library:** PrimeNG `p-table` (v20)

**Column Definition:**
```typescript
this.cols = [
  { field: 'id', header: 'ID' },
  { field: 'fullName', header: 'Ad Soyad' },
];
```

**Template Pattern:**
```html
<p-table [value]="list" [columns]="cols"
  [paginator]="true" [rows]="15"
  [rowsPerPageOptions]="[10, 15, 25, 50]"
  [globalFilterFields]="['fullName','phoneNumber']"
  currentPageReportTemplate="{first} - {last} / {totalRecords}">

  <ng-template #header let-columns>
    <tr>
      <th *ngFor="let col of columns" pSortableColumn="{{ col.field }}">
        {{ col.header }} <p-sortIcon field="{{ col.field }}" />
      </th>
      <th>İşlem</th>
    </tr>
  </ng-template>

  <ng-template #body let-row let-columns="columns">
    <tr>
      <td *ngFor="let col of columns">{{ row[col.field] }}</td>
      <td>
        <p-button icon="pi pi-eye" (onClick)="view(row)" severity="info" />
        <p-button icon="pi pi-pencil" (onClick)="edit(row)" severity="warning" />
        <p-button icon="pi pi-trash" (onClick)="delete(row.id)" severity="danger" />
      </td>
    </tr>
  </ng-template>
</p-table>
```

**Global Filter:**
```typescript
onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}
```

**Row Expansion:** `[expandedRowKeys]` + `#expandedrow` template + `pRowToggler` button.

**Status Badges:** Use `<p-tag [value]="row.status" [severity]="getSeverity(row.status)" />`.

---

## 2. Sayfa Yapısı

```
src/app/
  core/
    guards/          # LoginGuard (CanActivate)
    interceptors/    # auth, loading, error
    services/        # toast, confirm-dialog, loading-spinner
    constants/       # CustomerType, OrderStatus gibi static class'lar
    directives/      # phoneMask, mustMatch
    models/          # core-level shared types
  layout/            # AppLayout, AppTopbar, AppSidebar, AppFooter
  pages/
    [feature]/
      models/        # Feature model class'ları
      services/      # Feature service
      [feature].component.ts / .html / .scss
      [feature].routes.ts
  shared/
    components/      # Yeniden kullanılabilir dialog bileşenleri
    models/          # Domain DTO'ları (CreateX, UpdateX)
    services/        # Paylaşılan servisler
```

**Component Şablonu:**
```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, ReactiveFormsModule, ...],
  providers: [MessageService],
  templateUrl: './feature.component.html',
})
export class FeatureComponent implements OnInit {
  list: Feature[] = [];
  loading = false;

  ngOnInit() { this.loadList(); }

  loadList() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (res) => { this.list = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
```

**Route Kaydı** (`app.routes.ts`):
```typescript
{ path: 'feature', loadChildren: () => import('./pages/feature/feature.routes') }
```

**Feature Routes** (`feature.routes.ts`):
```typescript
export default [
  { path: '', component: FeatureComponent },
  { path: ':id', component: FeatureDetailComponent }
] as Routes;
```

---

## 3. Form & Input Kullanımı

**Library:** Angular Reactive Forms (`FormBuilder`)

**Form Oluşturma:**
```typescript
form = this.fb.group({
  id: [0],
  fullName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: [''],
  type: ['', Validators.required],
});
```

**PrimeNG Input Bileşenleri:**

| Bileşen | Direktif | Kullanım |
|---------|----------|---------|
| Text | `pInputText` | `formControlName="name"` |
| Number | `p-inputnumber` | `formControlName="amount"` |
| Textarea | `p-textarea` | `formControlName="notes"` |
| Dropdown | `p-select` | `[options]="list" formControlName="type"` |
| Date | `p-datepicker` | `formControlName="date" dateFormat="dd.mm.yy"` |
| Checkbox | `p-checkbox` | `formControlName="active" [binary]="true"` |
| Toggle | `p-toggleswitch` | `formControlName="enabled"` |

**Validasyon Gösterimi:**
```html
@if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
  <small class="text-red-500">{{ 'FORM.REQUIRED_MESSAGE' | translate }}</small>
}
```

**Submit:**
```typescript
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  const data = this.form.value as Feature;
  // save...
}
```

**Custom Direktifler:**
- `phoneMask` — `XXX XXX XX XX` formatı, max 10 rakam
- `mustMatch` — Parola onay validasyonu

---

## 4. Search & Filter

**Filter State:**
```typescript
filters = { search: '', type: '', startDate: null as Date | null, endDate: null as Date | null };
```

**Template:**
```html
<div class="cust-filter-panel flex gap-2 mb-3">
  <input pInputText [(ngModel)]="filters.search" placeholder="Ara..." (keyup.enter)="applyFilters()" />
  <p-select [(ngModel)]="filters.type" [options]="typeOptions" placeholder="Tümü" />
  <p-button label="Ara" (onClick)="applyFilters()" />
  <p-button label="Temizle" severity="secondary" (onClick)="clearFilters()" />
</div>
<span class="text-sm text-gray-500">{{ list.length }} / {{ total }} kayıt</span>
```

**Servis Çağrısı:**
```typescript
applyFilters() {
  const params: any = {};
  if (this.filters.search) params.search = this.filters.search;
  if (this.filters.type) params.type = this.filters.type;
  if (this.filters.startDate) params.startDate = this.filters.startDate.toISOString();
  this.service.getFiltered(params).subscribe(res => this.list = res);
}

clearFilters() {
  this.filters = { search: '', type: '', startDate: null, endDate: null };
  this.applyFilters();
}
```

**Tarih Aralığı Shortcut'ları:**
```typescript
setDateRange(range: 'today' | 'week' | 'month' | 'year') {
  const now = new Date();
  this.filters.endDate = now;
  if (range === 'today') this.filters.startDate = now;
  else if (range === 'week') this.filters.startDate = new Date(now.setDate(now.getDate() - 7));
  // ...
  this.applyFilters();
}
```

---

## 5. HTTP Requests

**Base URL:** `environment.getApiUrl` → `https://localhost:5001/api/v1`

**Generic Repository Pattern** (`HttpEntityRepositoryService<T>`):
```typescript
getAll(url: string): Observable<T[]>
get(url: string, id?: number): Observable<T>
add(url: string, content: any): Observable<T>
update(url: string, content: any): Observable<T>
delete(url: string, id: number): Observable<any>
```

**Feature Service Örneği:**
```typescript
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private endpoint = 'Customer';

  constructor(private http: HttpEntityRepositoryService<Customer>) {}

  getAll = () => this.http.getAll(this.endpoint);
  getById = (id: number) => this.http.get(this.endpoint, id);
  add = (data: Customer) => this.http.add(this.endpoint, data);
  update = (data: Customer) => this.http.update(this.endpoint, data);
  delete = (id: number) => this.http.delete(this.endpoint, id);

  getFiltered(params: Record<string, any>): Observable<Customer[]> {
    return this.http.getAll(`${this.endpoint}/filter?${new URLSearchParams(params)}`);
  }
}
```

**HTTP Interceptor Sırası:**
1. **AuthInterceptor** — JWT Bearer token ekler, 401'de refresh token ile yeniler
2. **LoadingInterceptor** — `LoadingSpinnerService` ile global loading yönetir
3. **ErrorInterceptor** — HTTP hatalarını yakalar, Türkçe toast gösterir

**Subscribe Pattern:**
```typescript
this.service.getAll().subscribe({
  next: (res) => { this.list = res; },
  error: (err) => { this.toastService.error('Veriler yüklenemedi!'); }
});
```

**DELETE için:** `responseType: 'text'` (backend text döner)

---

## 6. Mevcut Sayfalar & Rotalar

| Rota | Bileşen | Açıklama |
|------|---------|---------|
| `/` | DashboardComponent | Özet grafikler & sayaçlar |
| `/customer` | CustomerComponent | Müşteri listesi (CRUD) |
| `/customer/:id` | CustomerDetailComponent | Detay: siparişler, faturalar, teklifler |
| `/product` | ProductComponent | Ürün listesi & kategoriler |
| `/invoice` | InvoiceComponent | Alış/Satış fatura yönetimi |
| `/transaction` | TransactionComponent | İşlem takibi |
| `/order` | OrderComponent | Sipariş & ödeme yönetimi |
| `/offer` | OfferComponent | Teklif yönetimi |
| `/service-request` | ServiceRequestComponent | Servis talebi takibi |
| `/stock` | StockComponent | Stok yönetimi |
| `/product-incoming` | ProductIncomingComponent | Ürün girişleri |
| `/employees` | EmployeesComponent | Çalışan yönetimi |
| `/reminder` | ReminderComponent | Hatırlatıcılar |
| `/notification` | NotificationComponent | Bildirimler |
| `/activity-log` | ActivityLogComponent | Denetim logları |
| `/profile` | ProfileComponent | Kullanıcı profili |
| `/definitions/*` | Various | Tanımlama ekranları (kategoriler, durumlar vb.) |
| `/admin/user` | UserComponent | Kullanıcı yönetimi |
| `/admin/tenant` | TenantComponent | Tenant yönetimi |
| `/print/:type/:id` | PrintDocumentComponent | Belge yazdırma |
| `/auth/login` | LoginComponent | Giriş sayfası |
| `/password-change-required` | PasswordChangeRequiredComponent | Zorunlu parola değişimi |

---

## 7. TypeScript Yapısı

**Path Alias:** `@/*` → `src/app/*`

**Model Sınıfı Örneği:**
```typescript
// src/app/pages/customer/models/customer.model.ts
export class Customer {
  id: number = 0;
  tenantId: number = 0;
  fullName: string = '';
  customerType: string = '';
  phoneNumber: string = '';
  emailAddress: string = '';
}
```

**DTO Pattern:**
```typescript
// shared/models/create-customer.ts
export class CreateCustomer {
  fullName: string = '';
  customerType: string = '';
  phoneNumber: string = '';
}
```

**Constant Class Pattern** (enum alternatifi):
```typescript
export class CustomerType {
  static readonly BIREYSEL = 'Bireysel';
  static readonly KURUMSAL = 'Kurumsal';
  static getAll() { return [this.BIREYSEL, this.KURUMSAL]; }
  static getName(value: string): string { /* ... */ }
}
```

**tsconfig.json Ayarları:** `strict: true`, `noImplicitOverride`, `noImplicitReturns`

---

## 8. State Management

**Yaklaşım:** Merkezi store yok — component-local state + Angular Signals + RxJS Subjects

**Signals (yeni pattern):**
```typescript
productList = signal<Product[]>([]);
// Okuma: this.productList()
// Güncelleme: this.productList.set(data);
// Türev: computed(() => this.productList().filter(...))
```

**Cross-component İletişim:**
- Shared services içinde `Subject` / `BehaviorSubject`
- `LayoutService` ile UI state (menü açık/kapalı, tema vb.)

**LocalStorage:** Token, dil, kullanıcı tercihleri → `LocalStorageService` üzerinden

---

## 9. UI Kit & Styling

**Kütüphane:** PrimeNG v20, tema: Aura preset

**İkonlar:** `primeicons v7` — `class="pi pi-plus"`

**Tailwind CSS v4** — utility class'lar için

**Severity Seviyeleri (Button/Tag):**
- `success` → yeşil
- `info` → mavi
- `warning` → turuncu
- `danger` → kırmızı
- `secondary` → gri

**Yaygın PrimeNG Bileşenleri:**

| Bileşen | Tag |
|---------|-----|
| Tablo | `<p-table>` |
| Modal | `<p-dialog>` |
| Buton | `<p-button>` |
| Toolbar | `<p-toolbar>` |
| Toast | `<p-toast>` |
| Onay Dialog | `<p-confirmdialog>` |
| Tag/Badge | `<p-tag>`, `<p-badge>` |
| Kart | `<p-card>` |
| Sekme | `<p-tabs>` |
| Timeline | `<p-timeline>` |
| Skeleton | `<p-skeleton>` |
| Bölücü | `<p-divider>` |

---

## 10. Authentication

**Token:** JWT Bearer — localStorage'da saklanır

**Login Akışı:**
1. `AuthService.login()` → POST `/Auth/login`
2. Yanıt: `{ token, refreshToken, claims }`
3. `LocalStorageService.setToken()` ile saklama

**Token Kontrolü:**
```typescript
loggedIn(): boolean {
  return !this.jwtHelper.isTokenExpired(token, 120); // 120s buffer
}
```

**Refresh Token:** 401 hatada `AuthInterceptor` otomatik yeniler; kuyruk mekanizması var.

**Claim Kontrolü:**
```typescript
claimGuard(claim: string): boolean { /* claims array'inde arar */ }
```

**Guard:**
```typescript
canActivate(): boolean {
  if (this.authService.loggedIn()) return true;
  this.router.navigate(['auth/login']);
  return false;
}
```

---

## 11. Yardımcı Servisler

**ToastService:**
```typescript
this.toastService.success('Kaydedildi!');
this.toastService.error('Bir hata oluştu!');
this.toastService.info('Bilgi mesajı');
this.toastService.warning('Dikkat!');
```

**ConfirmDialogService:**
```typescript
this.confirmDialog.delete(
  () => this.deleteRecord(id),  // accept
  () => {}                       // reject
);
this.confirmDialog.confirm(() => this.doAction());
```

**LoadingSpinnerService:**
```typescript
this.loadingService.showLoading();
this.loadingService.hideLoading();
// HTTP interceptor otomatik yönetir; manuel kullanım nadirdir
```

---

## 12. Route Yapısı

### Genel Ağaç

```
src/app.routes.ts           ← Kök router tanımı
│
├── ''  (AppLayout wrapper — tüm authenticated sayfalar buraya girer)
│   ├── ''                  → DashboardComponent
│   ├── 'pages'             → pages.routes.ts  (şu an sadece notfound redirect)
│   ├── 'customer'          → customer.routes.ts
│   ├── 'product'           → product.routes.ts
│   ├── 'invoice'           → invoice.routes.ts
│   ├── 'transaction'       → transaction.routes.ts
│   ├── 'order'             → order.routes.ts
│   ├── 'offer'             → offer.routes.ts
│   ├── 'service-request'   → service-request.routes.ts
│   ├── 'stock'             → stock.routes.ts
│   ├── 'product-incoming'  → product-incoming.routes.ts
│   ├── 'employees'         → employees.routes.ts
│   ├── 'reminder'          → reminder.routes.ts
│   ├── 'notifications'     → notification.routes.ts
│   ├── 'activity-log'      → activity-log.routes.ts
│   ├── 'profile'           → profile.routes.ts
│   ├── 'definitions'       → definitions.routes.ts
│   └── 'admin'             → admin.routes.ts
│
├── 'auth'                  → auth.routes.ts  (AppLayout dışı)
├── 'print/:type/:id'       → PrintDocumentComponent  (AppLayout dışı)
├── 'notfound'              → Notfound
└── '**'                    → /notfound redirect
```

### Feature Route Dosyaları

**`customer.routes.ts`**
```
/customer          → CustomerComponent
/customer/:id      → CustomerDetailComponent
```

**`order.routes.ts`** *(loadComponent ile lazy)*
```
/order             → OrderListComponent
/order/:id         → OrderDetailComponent
```

**`definitions.routes.ts`**
```
/definitions/product-categories     → ProductCategoryComponent
/definitions/vendors                → VendorComponent  (lazy)
/definitions/service-request-types  → ServiceRequestTypeComponent  (lazy)
/definitions/transaction-categories → TransactionCategoryComponent  (lazy)
```

**`admin.routes.ts`**
```
/admin/user    → UserComponent
/admin/tenant  → TenantComponent
```

**`auth.routes.ts`** *(AppLayout dışı — token gerektirmez)*
```
/auth/login    → LoginComponent
/auth/access   → AccessComponent
/auth/error    → ErrorComponent
```

### Route Ekleme Adımları

1. **Feature route dosyası oluştur:** `src/app/pages/[feature]/[feature].routes.ts`
```typescript
import { Routes } from '@angular/router';
import { FeatureComponent } from './feature.component';

export default [
  { path: '', component: FeatureComponent },
  { path: ':id', loadComponent: () => import('./feature-detail/feature-detail.component').then(m => m.FeatureDetailComponent) },
] as Routes;
```

2. **`app.routes.ts`'e ekle** (AppLayout children içine):
```typescript
{ path: 'feature', loadChildren: () => import('./app/pages/feature/feature.routes') },
```

3. **Sidebar menüye ekle:** `app.menu.ts` içindeki menü array'ine item ekle.

### loadComponent vs loadChildren

| Durum | Kullanım |
|-------|----------|
| Tek bileşen, route dosyası yok | `loadComponent: () => import(...)` |
| Alt rotaları olan feature | `loadChildren: () => import(...routes)` |
| Hemen yüklensin | `component: XyzComponent` (doğrudan) |

### Navigasyon Pattern'leri

```typescript
// Component içinde inject
private router = inject(Router);
private route = inject(ActivatedRoute);

// Navigasyon
this.router.navigate(['/customer', customerId]);
this.router.navigate(['..'], { relativeTo: this.route }); // bir üst
this.router.navigateByUrl('/dashboard');

// Route parametresi okuma
const id = Number(this.route.snapshot.paramMap.get('id'));

// Query param
this.router.navigate(['/customer'], { queryParams: { page: 1 } });
const page = this.route.snapshot.queryParamMap.get('page');
```

### Guard Yapısı

Şu an yalnızca `LoginGuard` var — route seviyesinde değil, component `ngOnInit` içinde çağrılıyor. Tüm `/auth` dışı rotalar AppLayout altında olduğundan token kontrolü `AuthInterceptor` üstleniyor.

```typescript
// Gerekirse route'a eklemek için:
{ path: 'admin', canActivate: [LoginGuard], loadChildren: () => import(...) }
```

---

## 13. i18n (Çeviriler)

**Kütüphane:** `@ngx-translate/core`

**Dil Dosyaları:** `assets/i18n/tr.json`, `assets/i18n/en.json`

**Kullanım:**
```html
{{ 'CUSTOMER.TITLE' | translate }}
```
```typescript
this.translateService.instant('FORM.REQUIRED_MESSAGE')
```

**Dil:** LocalStorage'dan okunur, default `tr-TR`

**PrimeNG Çevirisi:** `main.ts` içinde `providePrimeNG({ translation: { ... } })` ile Türkçe ayarlanmış.

---

## 14. Dialog & Modal Pattern

**Standart CRUD Dialog:**
```html
<p-dialog [(visible)]="showDialog" [modal]="true" [style]="{ width: '600px' }"
  header="{{ isEdit ? 'Düzenle' : 'Yeni Ekle' }}">
  <form [formGroup]="form">
    <!-- inputs -->
  </form>
  <ng-template #footer>
    <p-button label="İptal" severity="secondary" (onClick)="showDialog = false" />
    <p-button label="Kaydet" (onClick)="onSubmit()" />
  </ng-template>
</p-dialog>
```

**Dialog Açma:**
```typescript
openDialog(item?: Feature) {
  this.isEdit = !!item;
  this.form.reset({ id: 0, ...defaultValues });
  if (item) this.form.patchValue(item);
  this.showDialog = true;
}
```

---

## 15. Environment Yapısı

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  getApiUrl: 'https://localhost:5001/api/v1',
  baseUrl: 'http://localhost:4200',
  defaultLang: 'tr-TR',
};
```

Üretim için `environment.prod.ts` aynı yapıyı farklı URL'lerle içerir.

---

## 16. Genel Kurallar & Conventions

- Tüm bileşenler **standalone** — `NgModule` yok
- Import yolu: `@/` alias kullanılır (`@/shared/models/...`)
- Model class'ları `new Feature()` ile instantiate edilebilir (default değerler var)
- Silme işlemleri her zaman `ConfirmDialogService.delete()` ile onay alır
- Loading spinner HTTP interceptor üzerinden otomatik çalışır
- Hata mesajları `ErrorInterceptor` veya component'te `toastService.error()` ile gösterilir
- Tarih formatlama: `dd.MM.yyyy` (pipe veya datepicker `dateFormat="dd.mm.yy"`)
- Para birimi: Türk Lirası, `currencyPipe` veya `p-inputnumber mode="currency" currency="TRY"`
