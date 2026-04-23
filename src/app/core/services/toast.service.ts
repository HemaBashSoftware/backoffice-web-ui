import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public translateService: TranslateService,
    private toastService: MessageService
  ) {

  }

  // Merhaba ben {{name}} {{surname}}
  //this.translateService.instant("KEY", { name: "erencan", surname: "gunes" })
  // Merhaba ben erencan gunes

  success(message: string, summary?: string) {

    if (summary)
      summary = this.translateService.instant(summary)
    else
      summary = this.translateService.instant("TOAST.SUCCESS")

    message = this.translateService.instant(message)

    this.toastService.add({ severity: 'success', summary: summary, detail: message });

  }

  error(message: string, summary?: string) {

    if (summary)
      summary = this.translateService.instant(summary)
    else
      summary = this.translateService.instant("TOAST.ERROR")

    message = this.translateService.instant(message)

    this.toastService.add({ severity: 'error', summary: summary, detail: message });

  }

  info(message: string, summary?: string) {

    if (summary)
      summary = this.translateService.instant(summary)
    else
      summary = this.translateService.instant("TOAST.INFO")

    message = this.translateService.instant(message)

    this.toastService.add({ severity: 'info', summary: summary, detail: message });

  }

  warning(message: string, summary?: string) {

    if (summary)
      summary = this.translateService.instant(summary)
    else
      summary = this.translateService.instant("TOAST.WARNING")

    message = this.translateService.instant(message)

    this.toastService.add({ severity: 'warn', summary: summary, detail: message });

  }

}