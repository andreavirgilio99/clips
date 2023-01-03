import { Component } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  readonly matchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored', 
    matrixParams: 'exact', 
    paths: 'exact', 
    fragment: 'exact',
 }
  constructor(public modal : ModalService, public auth : AuthService) { }

  openModal(e : Event){
    e.preventDefault()
    this.modal.toggleModal('auth');
  }

  async logout(e : Event){
    e.preventDefault()
    await this.auth.logout();
  }

}
