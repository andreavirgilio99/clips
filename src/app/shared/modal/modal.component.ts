import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']/*,
  providers: [ModalService]*/ //provided at component scope
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() modalID = ''

  constructor(public modal : ModalService, public el : ElementRef) {
    //el = this component as DOM element
   }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement) //to make it CSS safe
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement)
  }

  closeModal(){
    this.modal.toggleModal(this.modalID)
  }
}
