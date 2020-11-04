import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
} from '@angular/core';
import { MCEvent } from '../../utilities/mc-calendar-utils';

@Component({
  selector: 'mwl-calendar-event-title',
  template: `
    <ng-template #defaultTemplate let-event="event" let-view="view">
      <div class="cal-event-arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </div>
      <span
        class="cal-event-title"
        [innerHTML]="event.title | calendarEventTitle: view:event"
        [attr.aria-hidden]="{} | calendarA11y: 'hideEventTitle'"
      >
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        view: view
      }"
    >
    </ng-template>
  `,
})
export class CalendarEventTitleComponent implements OnChanges {
  @Input() event: MCEvent;

  @Input() customTemplate: TemplateRef<any>;

  @Input() view: string;

  @Output()
  quicklinkClick: EventEmitter<string> = new EventEmitter<string>();

  isLive = false;

  ngOnChanges() {
    setInterval(() => {
      this.isLive =
        this.event.videoURL &&
        new Date() >= this.event.start &&
        new Date() < this.event.end;
    }, 60);
  }

  navigateToLiveStream() {
    this.quicklinkClick.emit(this.event.videoURL);
  }
}
