// shared/confirm-dialog.service.ts
import { Injectable, NgModule } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})


export class ConfirmDialogService {

  constructor(
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) { }

delete (acceptCallback: () => void, rejectCallback: () => void) {

  let messageText = this.translateService.instant("AreYouSureYouWantToDelete");
  let headerText = this.translateService.instant("Delete");
  let rejectText = this.translateService.instant("Cancel");

  this.confirmationService.confirm({
    message: messageText,
    header: headerText,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: headerText,          // Yes yerine "Sil"
    rejectLabel: rejectText,        // No yerine "İptal"
    acceptIcon: 'pi pi-check',   // Accept ikonunu değiştir
    rejectIcon: 'pi pi-times',   // Reject ikonunu değiştir
    acceptButtonStyleClass: 'p-button-danger p-button-outlined', // CSS sınıfı
    //rejectButtonStyleClass: 'p-button-success ',
    accept: acceptCallback,
    reject: rejectCallback
    // reject: () => {
    //   // istersen iptal için de callback gönderebilirsin
    // }
  });
}

confirm(acceptCallback: () => void, rejectCallback: () => void) {

  let messageText = this.translateService.instant("DoYouConfirmTheTransaction");
  let headerText = this.translateService.instant("Confirm");
  let rejectText = this.translateService.instant("Cancel");

  this.confirmationService.confirm({
    message: messageText,
    header: headerText,
    acceptLabel: headerText,
    rejectLabel: rejectText,
    icon: 'pi pi-exclamation-triangle',
    accept: acceptCallback,
    reject: rejectCallback
    // reject: () => {
    //   // istersen iptal için de callback gönderebilirsin
    // }
  });
}

custom(message: string, header: string, acceptLabel: string, rejectLabel: string, acceptCallback: () => void, rejectCallback: () => void) {

  message = this.translateService.instant(message);
  header = this.translateService.instant(header);
  acceptLabel = this.translateService.instant(acceptLabel);
  rejectLabel = this.translateService.instant(rejectLabel);

  this.confirmationService.confirm({
    message: message,
    header: header,
    acceptLabel: acceptLabel,
    rejectLabel: rejectLabel,
    icon: 'pi pi-exclamation-triangle',
    accept: acceptCallback,
    reject: rejectCallback
    // reject: () => {
    //   // istersen iptal için de callback gönderebilirsin
    // }
  });
}
}
