import {AbstractControl} from '@angular/forms';

export class UrlValidator {

  public static validate(c:AbstractControl) {
    let URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;

    return URL_REGEXP.test(c.value) ? null : {
      validateUrl: {
        valid: false
      }
    };
  }
}