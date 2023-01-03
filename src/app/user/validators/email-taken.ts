import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { from, map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EmailTaken implements AsyncValidator{

    constructor(private auth: AngularFireAuth){}

    validate = (control: AbstractControl): Observable<ValidationErrors | null> =>{
        return from(this.auth.fetchSignInMethodsForEmail(control.value)).pipe(
            map(val => val.length ? {emailTaken : true} : null)
        )
    }


}
