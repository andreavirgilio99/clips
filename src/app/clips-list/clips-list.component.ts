import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  scrollable = true;
  @Input()
  limit = 3

  constructor(public clipsService: ClipService) {}

  ngOnChanges(): void {
    this.clipsService.getClips(this.limit);
  }

  ngOnInit(): void {
    if(this.scrollable){
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy(): void {
    if(this.scrollable){
      window.removeEventListener('scroll', this.handleScroll);
    }

    this.clipsService.pageClips = [];
  }

  handleScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if(bottomOfWindow){
      this.clipsService.getClips(this.limit);
    }
  }
}
