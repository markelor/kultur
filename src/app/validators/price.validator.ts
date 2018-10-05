import {AbstractControl} from '@angular/forms';

export class PriceValidator {

  public static validate(c:AbstractControl) {
    let PRICE_REGEXP = /^\d{0,8}(\.)?(\d{1,2})$/;

    return PRICE_REGEXP.test(c.value) ? null : {
      validatePrice: {
        valid: false
      }
    };
  }
}