import { AfterContentInit, Component, QueryList } from '@angular/core';
import { ContentChildren } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent)
  tabs: QueryList<TabComponent> = new QueryList(); //will have a list of the elements projected

  constructor() { }

  ngAfterContentInit(): void {
    if (this.tabs.length != 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent, e? : Event) {
    if(e){
      e.preventDefault();
      /*
      in alternative per prevenire default si poteva mettere return false e angular capiva per magia
      di prevenire default, si risparmiava un parametro, però secondo me non è leggibile non si capisce
      chi schifo la sa sta cosa io boh eccetera quindi fanculo ho messo il parametro opzionale che non
      da fastidio zio pera
      */
    }

    this.tabs.forEach(element =>{
      element.isActive = false; //first we set all to inactive
    })

    tab.isActive = true; //then we active the desired one
  }

}
