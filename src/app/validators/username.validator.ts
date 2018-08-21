import {AbstractControl} from '@angular/forms';

export class UsernameValidator {

  public static validate(c:AbstractControl) {
    let USERNAME_REGEXP = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;

    return USERNAME_REGEXP.test(c.value) ? null : {
      validateUsername: {
        valid: false
      }
    };
  }
}