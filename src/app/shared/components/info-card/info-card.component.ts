import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-info-card',
    standalone: true,
    template: `
        <div style="background:var(--surface-card); border:1px solid var(--surface-border); border-radius:10px; padding:1.25rem;">
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-color-secondary); margin-bottom:0.5rem; letter-spacing:0.5px;">
                {{ label }}
            </div>
            <div style="font-size:1.1rem; font-weight:600; color:var(--text-color);">
                @if(value) {
                    {{ value }}
                } @else {
                    <ng-content></ng-content>
                }
            </div>
        </div>
    `
})
export class InfoCardComponent {
    @Input() label: string = '';
    @Input() value: any = null;
}
