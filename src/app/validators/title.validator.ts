import {AbstractControl} from '@angular/forms';

export class TitleValidator {

  public static validate(c:AbstractControl) {
    let TITLE_REGEXP = /^[A-zÀ-ÖØ-öø-ÿ\s]+$/ ;

    return TITLE_REGEXP.test(c.value) ? null : {
      validateTitle: {
        valid: false
      }
    };
  }
}
