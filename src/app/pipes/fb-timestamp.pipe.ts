import { DatePipe } from '@angular/common';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

  constructor(private datePipe: DatePipe){}

  transform(value: firebase.firestore.FieldValue){
    if(!value){
      return '';
    }

    const date = (value as firebase.firestore.Timestamp).toDate();
    return this.datePipe.transform(date, 'mediumDate');
  }

}
