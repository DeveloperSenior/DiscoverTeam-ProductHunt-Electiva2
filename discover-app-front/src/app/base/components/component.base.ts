
import { TranslateService } from '@ngx-translate/core';
import Swal, { SweetAlertIcon } from 'sweetalert2'

export class ComponentBase {

  constructor(public translateService: TranslateService) { }

  /**
   * showAlert
   * @param message
   * @param title
   * @param type
   * @param callback
   */
  showAlert(message: string = this.getMessageFromKey('generic.messages.process_success'), title: string = this.getMessageFromKey('generic.titles.information'), type: SweetAlertIcon = 'success', callback?: () => void) {
    Swal.fire(title, message, type).then(() => { if (callback) callback(); });
  }
  /**
   * showAlertComfirmDialog
   * @param message
   * @param title
   * @param type
   * @param cancelButton
   * @param callback
   */
  showAlertComfirmDialog(message: string = this.getMessageFromKey('generic.messages.process_success'), title: string = this.getMessageFromKey('generic.titles.information'), type: SweetAlertIcon = 'success', cancelButton: boolean = true, callback?: () => void) {
    Swal.fire({ title: title, text: message, icon: type, showCancelButton: cancelButton }).then((result) => { if (result.isConfirmed) if (callback) callback(); });
  }

  /**
   * Get value message from key defined at i18n folder languages
   * @param key
   * @returns
   */
  getMessageFromKey(key: string) {
    if ((key != null && key !== '') || this.translateService != null) {
      return this.translateService.instant(key);
    }
    console.log('Invalid key or translate service.', key, this.translateService);
    return '';
  }

}
