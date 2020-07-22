import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { PlacementArray } from 'positioning';
import { MCWeekViewAllDayEvent, MCWeekViewTimeEvent, MCWeekViewHourColumn } from '../../utilities/mc-calendar-utils';

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
          <span class="cal-event-room-group">Raum L30 / Gr. H1 - H24</span>
          <div class="cal-event-quicklinks"
          [ngStyle]="{ backgroundColor: weekEvent.event.color?.primary }"></div>
        </div>
        <mwl-calendar-event-title
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventTitleTemplate"
          [view]="daysInWeek === 1 ? 'day' : 'week'"
        >
        </mwl-calendar-event-title>
        <mwl-mc-quicklinks (quicklinkClick)="eventClicked.emit({ sourceEvent: $event, isQuicklink: true })" [color]="weekEvent.event.color?.primary"></mwl-mc-quicklinks>
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
        <div class="cal-event-quicklinks"
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
export class CalendarWeekViewEventComponent {
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
}
