import { Directive, Input }                                                         from '@angular/core';
import { AbstractControl, FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[validate][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ArrayValidator, multi: true }
  ]
})
export class ArrayValidator<T extends any[]> implements Validator {
  @Input() array: T;
  @Input() validateFn: (control: AbstractControl, array: T) => ValidationErrors | null;

  validate(c: FormControl): ValidationErrors {
    return this.validateFn(c, this.array);
  }

}
