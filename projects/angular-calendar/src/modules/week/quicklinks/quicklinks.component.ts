import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mwl-mc-quicklinks',
  templateUrl: './quicklinks.component.html',
  styleUrls: ['./quicklinks.component.scss']
})
export class QuicklinksComponent implements OnInit {

  @Input()
  color: string;

  @Output()
  quicklinkClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  navigateToLink(link: string) {
    // this.router.navigate([link]);
    this.quicklinkClick.emit(link);
  }

}
