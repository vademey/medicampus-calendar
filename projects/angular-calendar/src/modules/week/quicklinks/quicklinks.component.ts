import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MCEvent } from '../../../utilities/mc-calendar-utils';

@Component({
  selector: 'mwl-mc-quicklinks',
  templateUrl: './quicklinks.component.html',
  styleUrls: ['./quicklinks.component.scss']
})
export class QuicklinksComponent implements OnInit {

  @Input()
  event: MCEvent;

  @Output()
  quicklinkClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  navigateToLink(link: string) {
    this.quicklinkClick.emit(link);
  }

}
