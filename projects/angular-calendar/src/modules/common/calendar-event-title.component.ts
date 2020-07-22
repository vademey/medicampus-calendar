import { Component, Input, TemplateRef } from '@angular/core';
import { MCCalendarEvent } from '../../utilities/mc-calendar-utils';

@Component({
  selector: 'mwl-calendar-event-title',
  template: `
    <ng-template #defaultTemplate let-event="event" let-view="view">
    <div class="cal-event-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
      </svg>
    </div>
    <span style="display: none;"
        class="cal-event-date-title"
        [attr.aria-hidden]="{} | calendarA11y: 'hideEventTitle'">
      {{event.start | calendarDate:'eventStartDateTitle':'de'}} - {{event.end | calendarDate:'eventEndTimeTitle':'de'}} Uhr
      </span>
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
export class CalendarEventTitleComponent {
  @Input() event: MCCalendarEvent;

  @Input() customTemplate: TemplateRef<any>;

  @Input() view: string;
}
