import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  activeClip!: IClip
  title = '';

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being updated.'

  inSubmission = false;

  constructor(private modal: ModalService, private clip: ClipService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeClip.currentValue != null) {
      this.title = changes.activeClip.currentValue.title
      this.showAlert = false;
      this.inSubmission = false;
    }
  }

  ngOnInit(): void {
    this.modal.register("editClip");
  }

  ngOnDestroy(): void {
    this.modal.unregister("editClip");
  }

  async update() {
    //ricorda di assegnare title a clip.title on success
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your clip is being updated.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.clip.updateClip(this.activeClip.docID!, this.title)
    } catch (err) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'An unexpected error occured! Please try again later.';
      return;
    }

    this.alertColor = 'limegreen';
    this.alertMsg = 'Success! Your clip has been updated.';
    this.activeClip.title = this.title;
    this.inSubmission = false;
  }
}
