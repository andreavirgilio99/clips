import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.css']
})
export class InputErrorComponent{
 
  @Input() control! : AbstractControl

  //doesn't contain all validators but only the ones I've used
  messages = new Map<string, string>([
    ['min', 'Value too low'],
    ['required', 'Please insert a value'],
    ['email', 'Please insert a valid email'],
    ['max', 'Value too high'],
    ['pattern', 'Value format rejected'],
    ['minlength', 'Value too short'],
    ['maxlength', 'value too long'],
    ['noMatch', 'The passwords do not match'],
    ['emailTaken', 'The email is already taken']
  ])
  
  getKeys(a: any):string[]{
    return Object.keys(a)
  }

  getErrorMessage(error : string): string{
    return this.messages.get(error)!
  }
}
