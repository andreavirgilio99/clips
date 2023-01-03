import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { interval, last, switchMap, take } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClipService } from 'src/app/services/clip.service';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app'
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

  isDragOver = false;

  screenshots: string[] = []

  video: File | undefined = undefined;
  title = '';
  selectedScreenshot = '';

  inSubmission = false;
  percentage = 0;
  task?: AngularFireUploadTask

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being uploaded.'

  constructor(private storage: AngularFireStorage, private auth: AuthService, private clipService: ClipService, private router: Router, public ffmpeg: FfmpegService) {
    ffmpeg.init();
   }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile(e: Event) {
    this.showAlert = false;
    if(this.ffmpeg.isCommandRunning){
      return;
    }

    this.isDragOver = false;
    this.video = (e as DragEvent).dataTransfer ?
                 (e as DragEvent).dataTransfer!.files[0] : (e.target as HTMLInputElement).files![0];


    if(!this.video){
      return;
    }

    if (this.video.type !== 'video/mp4') {
      this.video = undefined;

      this.showAlert = true;
      this.alertColor = 'red';
      this.alertMsg = 'Hell naw! We only accept mp4 files here buddy, convert it and then come back.'
      return;
    }

    if(this.video.size > (10 * 1000 * 1000)){
      this.video = undefined;

      this.showAlert = true;
      this.alertColor = 'red';
      this.alertMsg = 'Hell naw! Your clip is too big buddy, we can\'t afford all that firebase storage space.'
      return;
    }

    this.screenshots = await this.ffmpeg.getScreenshots(this.video);

    let fileName = this.video.name
    this.title = fileName.substring(0, fileName.lastIndexOf('.'));
  }

  uploadFile() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded.'
    this.inSubmission = true;

    this.auth.getUser().subscribe(user => {
      const clipPath = 'clips/' + uuid() + '.mp4';
      this.task = this.storage.upload(clipPath, this.video);
      const clipRef = this.storage.ref(clipPath);

      this.task.percentageChanges().subscribe(progress => this.percentage = progress as number / 100) //the percent pipe multiplies by 100 so this fixes that
      this.task.snapshotChanges().pipe(
        last(), //block all but the last signal emitted
        switchMap(() => clipRef.getDownloadURL())
      ).subscribe({
        next: async (url) => {

          const clip : IClip= {
            uid: user!.uid,
            displayName: user!.displayName!,
            title: this.title,
            fileName: this.video!.name,
            url: url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            thumbnail: this.selectedScreenshot
          }

          const clipDocRef = await this.clipService.saveClip(clip);

          this.alertColor = 'limegreen';
          this.alertMsg = 'Success! Your clip has now been published.'

          interval(400).pipe(
            take(5),
            last()
          ).subscribe(data => this.router.navigate(['clip', clipDocRef.id]))
        },
        error: (error) => {
          this.alertColor = 'red';
          this.alertMsg = 'Upload failed! Please try again later.'
          this.inSubmission = false;
        }
      })
    })
  }

}
