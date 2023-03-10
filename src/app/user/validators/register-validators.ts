import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class RegisterValidators {

    static match(controlName: string, matchingControlName: string): ValidatorFn {
        return (group: AbstractControl) : ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);
            if (!control || !matchingControl) {
                return { controlNotFound: false }
            }

            if (control.value === matchingControl.value) {
                return null;
            }
            else {
                matchingControl.setErrors({ noMatch: true })
                return { noMatch: true }
            }
        }
    }
}
