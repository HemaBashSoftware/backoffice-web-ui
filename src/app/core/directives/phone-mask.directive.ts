import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[phoneMask]'
})

export class PhoneMaskDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value = event.target.value;

    // Sadece rakam kalsın
    value = value.replace(/\D/g, '');

    // Maksimum 11 rakam
    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    // Formatlama
    if (value.length > 0) {
      if (value.length <= 3) {
        value = value.replace(/^(\d{0,3})/, "$1");
      } else if (value.length <= 6) {
        value = value.replace(/^(\d{3})(\d{0,3})/, "$1 $2");
      } else if (value.length <= 8) {
        value = value.replace(/^(\d{3})(\d{3})(\d{0,2})/, "$1 $2 $3");
      } else {
        value = value.replace(/^(\d{3})(\d{3})(\d{2})(\d{0,2})/, "$1 $2 $3 $4");
      }
    }

    event.target.value = value;
  }
}
