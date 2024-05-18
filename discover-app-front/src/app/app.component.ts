import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit{

  isIframe = false;
  currentDate = moment().year();

  constructor(
    public translate: TranslateService,
  ) {
    translate.use('es').subscribe(() => {
      this.applyLanguageToResponsiveTable();
    });
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {
    console.log('termine de iniciar: ',this.isIframe);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.applyLanguageToResponsiveTable();
    });
  }

  applyLanguageToResponsiveTable(): void {
    const cells = document.querySelectorAll('.mat-table .mat-cell');
    if (cells != null && cells.length > 0) {
      cells.forEach(node => {
        if (node.getAttribute('data-label-key') !== null && node.getAttribute('data-label-key') !== '') {
          const key = node.getAttribute('data-label-key') ? '' : String(node.getAttribute('data-label-key'));
          node.setAttribute('data-label', this.translate.instant(key));
        }
      });
    }
  }
}
