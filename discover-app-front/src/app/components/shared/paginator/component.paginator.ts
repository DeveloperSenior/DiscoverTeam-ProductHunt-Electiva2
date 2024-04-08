import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Injectable()
export class Paginator extends MatPaginatorIntl {
  constructor(public translate: TranslateService) {
    super();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.itemsPerPageLabel = this.translate.instant('generic.paginator.itemsPerPageLabel');
      this.nextPageLabel = this.translate.instant('generic.paginator.nextPageLabel');
      this.firstPageLabel = this.translate.instant('generic.paginator.firstPageLabel');
      this.lastPageLabel = this.translate.instant('generic.paginator.lastPageLabel');
      this.previousPageLabel = this.translate.instant('generic.paginator.previousPageLabel');
    });
  }

  override getRangeLabel = (page: any, pageSize: any, length: any) => {
    if (length === 0 || pageSize === 0) {
      return '0  ' + this.translate.instant('generic.paginator.range') + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + this.translate.instant('generic.paginator.range') + ' ' + length;
  };
}
