// Template component

import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

// Use block-ui-template class to center div if desired
@Component({
  template: `
    <div class="block-ui-template">
      <span class="logo-img"> </span>
      <p>{{ message || this.translateService.instant('generic.messages.loading') }}</p>
    </div>
  `,
})
export class BlockTemplate {
  message?: string;
  constructor(public translateService: TranslateService,){}
}
