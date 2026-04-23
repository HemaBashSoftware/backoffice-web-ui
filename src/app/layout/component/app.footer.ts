import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [TranslateModule],
    template: `<div class="layout-footer">
        Copyright © 2023-2025 
        <a href="https://www.hemabash.com/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Hemabash</a>
        Tüm Hakları Saklıdır. kopyalanması, çoğaltılması ve dağıtılması halinde yasal haklarımız işletilecektir.
    </div>`
})
export class AppFooter {}
