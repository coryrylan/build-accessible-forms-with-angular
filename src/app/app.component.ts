import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

export enum FormStatus {
  Initial,
  Success,
  Pending,
  Error
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  readonly FormStatus = FormStatus;
  formStatus = FormStatus.Initial;

  form = new FormGroup({
    name: new FormGroup({
      first: new FormControl(''),
      last: new FormControl('')
    }),
    contact: new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('')
    }),
    password: new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm: new FormControl('', Validators.required)
    }, matchingInputsValidator('password', 'confirm', 'mismatch'))
  });

  // Be careful when using get() properties as they are called multiple time per change detection cycle
  // Make sure whatever work is in the get() is nothing more than what you would have in the template
  // Example putting a async http call in the get() would cause several http requests in the matter of seconds hurting performance
  get emailIsInvalid() {
    return (this.form.controls.contact as FormGroup).controls.email.invalid;
  }

  get emailIsInvalidAndTouched() {
    return  this.emailIsInvalid && (this.form.controls.contact as FormGroup).controls.email.touched;
  }

  get passwordIsInvalid() {
    return (this.form.controls.password as FormGroup).controls.password.invalid;
  }

  get passwordIsInvalidAndTouched() {
    return this.passwordIsInvalid && (this.form.controls.password as FormGroup).controls.password.touched;
  }

  get passwordsDoNotMatch() {
    return this.form.controls.password.errors && this.form.controls.password.errors.mismatch;
  }

  get passwordsDoNotMatchAndTouched() {
    return this.passwordsDoNotMatch && (this.form.controls.password as FormGroup).controls.confirm.touched;
  }

  submit() {
    this.formStatus = FormStatus.Pending;

    if (this.form.valid) {
      setTimeout(() => { // simulate a async http call
        this.formStatus = FormStatus.Success;
        console.log(this.form.value);
      }, 3000);
    } else {
      this.formStatus = FormStatus.Error;
    }
  }
}

export function matchingInputsValidator(firstKey: string, secondKey: string, errorName: string) {
  return (group: FormGroup): ValidationErrors | undefined => {
    if (group.controls[firstKey].value !== group.controls[secondKey].value) {
      return {
        [errorName]: true
      };
    }
  };
}
