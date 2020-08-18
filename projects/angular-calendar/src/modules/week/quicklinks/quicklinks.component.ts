import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from '@angular/core';
import { MCEvent } from '../../../utilities/mc-calendar-utils';

@Component({
  selector: 'mwl-mc-quicklinks',
  templateUrl: './quicklinks.component.html',
  styleUrls: ['./quicklinks.component.scss'],
})
export class QuicklinksComponent implements OnChanges {
  @Input()
  event: MCEvent;

  @Output()
  quicklinkClick: EventEmitter<string> = new EventEmitter<string>();

  isLive = false;

  constructor() {}

  ngOnChanges(): void {
    setInterval(() => {
      this.isLive =
        this.event.videoURL &&
        new Date() >= this.event.start &&
        new Date() < this.event.end;
    }, 60);
  }

  navigateToLink(link: string) {
    this.quicklinkClick.emit(link);
  }
}
