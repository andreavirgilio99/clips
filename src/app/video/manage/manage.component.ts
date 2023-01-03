import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit{

  videoOrder = '1';

  sort$ : BehaviorSubject<string>

  clips: IClip[] = [];
  clipToEdit: IClip | null = null

  constructor(private router: Router, public route: ActivatedRoute, private clipService: ClipService, private modal: ModalService){
    this.sort$ = new BehaviorSubject(this.videoOrder)
  }

  ngOnInit(){
    this.route.queryParamMap.subscribe((params: Params) =>{
      this.videoOrder = params.get('sort');
      this.sort$.next(this.videoOrder);
    })

    this.clipService.findAllByCurrentUser(this.sort$).subscribe(docs =>{
      this.clips = [];

      if(docs){
        docs.forEach(doc=>{ //the data method doesn't return the id so we'll be inserting it manually
          this.clips.push({
            docID: doc.id,
            ...doc.data()
          })
        })
      }
    })
  }

  sort(e: Event){
    const element = (e.target as HTMLSelectElement);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: element.value
      }
    })
  }

  async copyToClickboard(e : Event, clipId: string){
    e.preventDefault();

    const url = location.origin + '/clip/' + clipId;
    await navigator.clipboard.writeText(url);

    alert('Link copied!')
  }

  openModal(clip: IClip){
    this.clipToEdit = clip;
    this.modal.toggleModal('editClip')
  }

  deleteClip(clip: IClip, e: Event){
    e.preventDefault()
   if(window.confirm('You sure you want to delete this clip?')){
    this.clipService.deleteClip(clip);
    this.clips = this.clips.filter(c=> c != clip);
   }
  }
}
