import {AbstractControl} from '@angular/forms';

export class LongitudeValidator {

  public static validate(c:AbstractControl) {
    let LONGITUDE_REGEXP = /^(\+|-)?(?:180(?:(?:\.0{1,20})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/;

    return LONGITUDE_REGEXP.test(c.value) ? null : {
      validateLongitude: {
        valid: false
      }
    };
  }
}
