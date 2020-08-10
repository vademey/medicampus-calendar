import {
  Component,


  EventEmitter, Input,



  OnChanges, Output,

  TemplateRef
} from '@angular/core';
import { PlacementArray } from 'positioning';
import { MCWeekViewAllDayEvent, MCWeekViewHourColumn, MCWeekViewTimeEvent } from '../../utilities/mc-calendar-utils';

@Component({
  selector: 'mwl-calendar-week-view-event',
  template: `
    <ng-template
      #defaultTemplate
      let-weekEvent="weekEvent"
      let-tooltipPlacement="tooltipPlacement"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDisabled="tooltipDisabled"
      let-tooltipDelay="tooltipDelay"
      let-column="column"
      let-daysInWeek="daysInWeek"
    >
      <div
        class="cal-event"
        [mwlCalendarTooltip]="
          !tooltipDisabled
            ? (weekEvent.event.title
              | calendarEventTitle
                : (daysInWeek === 1 ? 'dayTooltip' : 'weekTooltip')
                : weekEvent.tempEvent || weekEvent.event)
            : ''
        "
        [tooltipPlacement]="tooltipPlacement"
        [tooltipEvent]="weekEvent.tempEvent || weekEvent.event"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipAppendToBody]="tooltipAppendToBody"
        [tooltipDelay]="tooltipDelay"
        (mwlClick)="eventClicked.emit({ sourceEvent: $event })"
        (mwlKeydownEnter)="eventClicked.emit({ sourceEvent: $event })"
        tabindex="0"
        role="application"
        [attr.aria-label]="
          { event: weekEvent.tempEvent || weekEvent.event, locale: locale }
            | calendarA11y: 'eventDescription'
        "
      >
        <mwl-calendar-event-actions
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventActionsTemplate"
        >
        </mwl-calendar-event-actions>
        &ngsp;
        <div class="cal-event-top-bar" *ngIf="!(weekEvent.tempEvent || weekEvent.event).allDay">

          <span style="min-width: 110px;"
            class="cal-event-date-title cal-event-room-group"
            [attr.aria-hidden]="{} | calendarA11y: 'hideEventTitle'">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" style="transform: translateY(2px);margin-right: 1px;" height="12">
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
            </svg>
            {{ weekEvent.event.start | calendarDate:'eventStartTimeTitle':'de' }} - {{ weekEvent.event.end | calendarDate:'eventEndTimeTitle':'de' }} Uhr
          </span>  

          <span style="padding-left: 5px; width: 100%;" *ngIf="weekEvent.event.room" class="cal-event-room-group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" style="transform: translateY(2px);margin-right: 1px;">
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"></path>
              <circle cx="12" cy="9" r="2.5"></circle>
            </svg>
          {{ weekEvent.event.room?.shortName || '' }}
          </span>

          <div class="cal-event-color"
            [ngStyle]="{ backgroundColor: weekEvent.event.color?.primary }">
          </div>
        </div>

        <mwl-calendar-event-title
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventTitleTemplate"
          [view]="daysInWeek === 1 ? 'day' : 'week'"
        >
        </mwl-calendar-event-title>

        <mwl-mc-quicklinks *ngIf="duration >= 45" (quicklinkClick)="eventClicked.emit({ sourceEvent: $event, isQuicklink: true })" [event]="weekEvent.event"></mwl-mc-quicklinks>
      </div>
    </ng-template>

    <ng-template
    #allDayTemplate
    let-weekEvent="weekEvent"
    let-tooltipPlacement="tooltipPlacement"
    let-eventClicked="eventClicked"
    let-tooltipTemplate="tooltipTemplate"
    let-tooltipAppendToBody="tooltipAppendToBody"
    let-tooltipDisabled="tooltipDisabled"
    let-tooltipDelay="tooltipDelay"
    let-column="column"
    let-daysInWeek="daysInWeek"
  >
    <div
      class="cal-event cal-event-all-day"
      [mwlCalendarTooltip]="
        !tooltipDisabled
          ? (weekEvent.event.title
            | calendarEventTitle
              : (daysInWeek === 1 ? 'dayTooltip' : 'weekTooltip')
              : weekEvent.tempEvent || weekEvent.event)
          : ''
      "
      [tooltipPlacement]="tooltipPlacement"
      [tooltipEvent]="weekEvent.tempEvent || weekEvent.event"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipAppendToBody]="tooltipAppendToBody"
      [tooltipDelay]="tooltipDelay"
      (mwlClick)="eventClicked.emit({ sourceEvent: $event })"
      (mwlKeydownEnter)="eventClicked.emit({ sourceEvent: $event })"
      tabindex="0"
      role="application"
      [attr.aria-label]="
        { event: weekEvent.tempEvent || weekEvent.event, locale: locale }
          | calendarA11y: 'eventDescription'
      "
      [style.background]="weekEvent.event.color.primary || 'red'"
    >
      <mwl-calendar-event-actions
        [event]="weekEvent.tempEvent || weekEvent.event"
        [customTemplate]="eventActionsTemplate"
      >
      </mwl-calendar-event-actions>
      &ngsp;
      <div class="cal-event-top-bar" *ngIf="!(weekEvent.tempEvent || weekEvent.event).allDay">
        <span class="cal-event-room-group">Raum L30 / Gr. H1 - H24</span>
        <div class="cal-event-color"
        [ngStyle]="{ backgroundColor: weekEvent.event.color?.primary }"></div>
      </div>
      <svg class="all-day-event-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"/>
      </svg>
      <mwl-calendar-event-title
        [event]="weekEvent.tempEvent || weekEvent.event"
        [customTemplate]="eventTitleTemplate"
        [view]="daysInWeek === 1 ? 'day' : 'week'"
      >
      </mwl-calendar-event-title>
    </div>
  </ng-template>

    <ng-template
      [ngTemplateOutlet]="customTemplate || ((weekEvent.event && weekEvent.event.allDay) ? allDayTemplate : defaultTemplate)"
      [ngTemplateOutletContext]="{
        weekEvent: weekEvent,
        tooltipPlacement: tooltipPlacement,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDisabled: tooltipDisabled,
        tooltipDelay: tooltipDelay,
        column: column,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `,
})
export class CalendarWeekViewEventComponent implements OnChanges {
  @Input() locale: string;

  @Input() weekEvent: MCWeekViewAllDayEvent | MCWeekViewTimeEvent;

  @Input() tooltipPlacement: PlacementArray;

  @Input() tooltipAppendToBody: boolean;

  @Input() tooltipDisabled: boolean = true;

  @Input() tooltipDelay: number | null;

  @Input() customTemplate: TemplateRef<any>;

  @Input() eventTitleTemplate: TemplateRef<any>;

  @Input() eventActionsTemplate: TemplateRef<any>;

  @Input() tooltipTemplate: TemplateRef<any>;

  @Input() column: MCWeekViewHourColumn;

  @Input() daysInWeek: number;

  @Output() eventClicked = new EventEmitter<{
    sourceEvent: MouseEvent | any,
    isQuicklink?: boolean
  }>();

  duration = 0;

  isLive = false;

  ngOnChanges() {
    const diff = (this.weekEvent.event.end.getTime() - this.weekEvent.event.start.getTime());
    this.duration = Math.round(diff / 60000);
    this.isLive = this.weekEvent.event.videoURL && new Date() >= this.weekEvent.event.start && new Date() < this.weekEvent.event.end;
  }
}
