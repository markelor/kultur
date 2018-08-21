import {AbstractControl} from '@angular/forms';

export class PasswordValidator {

  public static validate(c:AbstractControl) {
    let PASSWORD_REGEXP = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/;

    return PASSWORD_REGEXP.test(c.value) ? null : {
      validatePassword: {
        valid: false
      }
    };
  }
}