import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
let CalendarWeekViewEventComponent = class CalendarWeekViewEventComponent {
    constructor() {
        this.tooltipDisabled = true;
        this.eventClicked = new EventEmitter();
        this.duration = 0;
        this.isLive = false;
    }
    ngOnChanges() {
        const diff = this.weekEvent.event.end.getTime() - this.weekEvent.event.start.getTime();
        this.duration = Math.round(diff / 60000);
        setInterval(() => {
            this.isLive =
                this.weekEvent.event.videoURL &&
                    new Date() >= this.weekEvent.event.start &&
                    new Date() < this.weekEvent.event.end;
        }, 60);
    }
    navigateToLiveStream() {
        this.eventClicked.emit({ sourceEvent: this.weekEvent.event.videoURL, isQuicklink: true });
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarWeekViewEventComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewEventComponent.prototype, "hourSegmentHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarWeekViewEventComponent.prototype, "weekEvent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarWeekViewEventComponent.prototype, "tooltipPlacement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarWeekViewEventComponent.prototype, "tooltipAppendToBody", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarWeekViewEventComponent.prototype, "tooltipDisabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewEventComponent.prototype, "tooltipDelay", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewEventComponent.prototype, "customTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewEventComponent.prototype, "eventTitleTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewEventComponent.prototype, "eventActionsTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewEventComponent.prototype, "tooltipTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarWeekViewEventComponent.prototype, "column", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewEventComponent.prototype, "daysInWeek", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewEventComponent.prototype, "eventClicked", void 0);
CalendarWeekViewEventComponent = __decorate([
    Component({
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
        <div
          class="cal-event-top-bar"
          [ngStyle]="{ 'border-top': '2px solid ' + weekEvent.event.color?.primary }"
          *ngIf="!(weekEvent.tempEvent || weekEvent.event).allDay"
        >
          <span
            class="cal-event-date-title cal-event-room-group"
            [attr.aria-hidden]="{} | calendarA11y: 'hideEventTitle'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              style="transform: translateY(2px);margin-right: 1px;"
              height="12"
            >
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path
                d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
              ></path>
            </svg>
            {{
              weekEvent.event.start | calendarDate: 'eventStartTimeTitle':'de'
            }}
            -
            {{ weekEvent.event.end | calendarDate: 'eventEndTimeTitle':'de' }}
            Uhr
          </span>

          <span
            *ngIf="weekEvent.event.onSite && weekEvent.event.room"
            [ngStyle]="{'width': weekEvent.event.online ? '50%' : '100%'}"
            class="cal-event-room-group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              style="transform: translateY(2px);margin-right: 1px;"
            >
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"
              ></path>
              <circle cx="12" cy="9" r="2.5"></circle>
            </svg>
            {{ weekEvent.event.online ? weekEvent.event.room?.shortName : weekEvent.event.room?.name }}
          </span>

          <span
            *ngIf="weekEvent.event.online"
            [ngStyle]="{'width': weekEvent.event.onSite && weekEvent.event.room ? '50%' : '100%'}"
            class="cal-event-room-group"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="black"
              width="12"
              height="12"
              style="transform: translateY(2px);margin-right: 1px;">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z"/>
            </svg>
            Online
            <span
              *ngIf="isLive"
              style="border: 1px solid red;
              border-radius: 3px;
              padding: 0px 4px;
              margin: 0px 4px;
              color: red;
              font-size: 10px;
              font-weight: 500;"
              class="cal-event-live"
              (click)="navigateToLiveStream()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                style="transform: translateY(1px); margin-right: -1px;fill: red;"
                viewBox="0 0 24 24"
              >
                <path d="M24 24H0V0h24v24z" fill="none"></path>
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
              LIVE
            </span>
          </span>

          <div
            class="cal-event-color"
            style="pointer-events: none;"
            [ngStyle]="{ backgroundColor: weekEvent.event.color?.primary }"
          ></div>
        </div>

        <mwl-calendar-event-title
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventTitleTemplate"
          [view]="daysInWeek === 1 ? 'day' : 'week'"
          (quicklinkClick)="
            eventClicked.emit({ sourceEvent: $event, isQuicklink: true })
          "
        >
        </mwl-calendar-event-title>

        <mwl-mc-quicklinks
          *ngIf="duration >= 45 && hourSegmentHeight >= 90"
          (quicklinkClick)="
            eventClicked.emit({ sourceEvent: $event, isQuicklink: true })
          "
          [event]="weekEvent.event"
        ></mwl-mc-quicklinks>
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
        <div
          class="cal-event-top-bar"
          *ngIf="!(weekEvent.tempEvent || weekEvent.event).allDay"
        >
          <span class="cal-event-room-group">Raum L30 / Gr. H1 - H24</span>
          <div
            class="cal-event-color"
            [ngStyle]="{ backgroundColor: weekEvent.event.color?.primary }"
          ></div>
        </div>
        <svg
          class="all-day-event-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="18px"
          height="18px"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z"
          />
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
      [ngTemplateOutlet]="
        customTemplate ||
        (weekEvent.event && weekEvent.event.allDay
          ? allDayTemplate
          : defaultTemplate)
      "
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
  `
    })
], CalendarWeekViewEventComponent);
export { CalendarWeekViewEventComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXIvIiwic291cmNlcyI6WyJtb2R1bGVzL3dlZWsvY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUE0UXZCLElBQWEsOEJBQThCLEdBQTNDLE1BQWEsOEJBQThCO0lBQTNDO1FBV1csb0JBQWUsR0FBWSxJQUFJLENBQUM7UUFnQi9CLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBR3JDLENBQUM7UUFFTCxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWIsV0FBTSxHQUFHLEtBQUssQ0FBQztJQW9CakIsQ0FBQztJQWxCQyxXQUFXO1FBQ1QsTUFBTSxJQUFJLEdBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRXpDLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDZixJQUFJLENBQUMsTUFBTTtnQkFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRO29CQUM3QixJQUFJLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUs7b0JBQ3hDLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNULENBQUM7SUFJRCxvQkFBb0I7UUFDbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRyxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzNGLENBQUM7Q0FDRixDQUFBO0FBckRVO0lBQVIsS0FBSyxFQUFFOzs4REFBZ0I7QUFFZjtJQUFSLEtBQUssRUFBRTs7eUVBQTJCO0FBRTFCO0lBQVIsS0FBSyxFQUFFOztpRUFBd0Q7QUFFdkQ7SUFBUixLQUFLLEVBQUU7O3dFQUFrQztBQUVqQztJQUFSLEtBQUssRUFBRTs7MkVBQThCO0FBRTdCO0lBQVIsS0FBSyxFQUFFOzt1RUFBaUM7QUFFaEM7SUFBUixLQUFLLEVBQUU7O29FQUE2QjtBQUU1QjtJQUFSLEtBQUssRUFBRTs4QkFBaUIsV0FBVztzRUFBTTtBQUVqQztJQUFSLEtBQUssRUFBRTs4QkFBcUIsV0FBVzswRUFBTTtBQUVyQztJQUFSLEtBQUssRUFBRTs4QkFBdUIsV0FBVzs0RUFBTTtBQUV2QztJQUFSLEtBQUssRUFBRTs4QkFBa0IsV0FBVzt1RUFBTTtBQUVsQztJQUFSLEtBQUssRUFBRTs7OERBQThCO0FBRTdCO0lBQVIsS0FBSyxFQUFFOztrRUFBb0I7QUFFbEI7SUFBVCxNQUFNLEVBQUU7O29FQUdKO0FBOUJNLDhCQUE4QjtJQXBRMUMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLDhCQUE4QjtRQUN4QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnUVQ7S0FDRixDQUFDO0dBQ1csOEJBQThCLENBc0QxQztTQXREWSw4QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsYWNlbWVudEFycmF5IH0gZnJvbSAncG9zaXRpb25pbmcnO1xuaW1wb3J0IHtcbiAgTUNXZWVrVmlld0FsbERheUV2ZW50LFxuICBNQ1dlZWtWaWV3SG91ckNvbHVtbixcbiAgTUNXZWVrVmlld1RpbWVFdmVudFxufSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICNkZWZhdWx0VGVtcGxhdGVcbiAgICAgIGxldC13ZWVrRXZlbnQ9XCJ3ZWVrRXZlbnRcIlxuICAgICAgbGV0LXRvb2x0aXBQbGFjZW1lbnQ9XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgIGxldC1ldmVudENsaWNrZWQ9XCJldmVudENsaWNrZWRcIlxuICAgICAgbGV0LXRvb2x0aXBUZW1wbGF0ZT1cInRvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICBsZXQtdG9vbHRpcEFwcGVuZFRvQm9keT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgbGV0LXRvb2x0aXBEaXNhYmxlZD1cInRvb2x0aXBEaXNhYmxlZFwiXG4gICAgICBsZXQtdG9vbHRpcERlbGF5PVwidG9vbHRpcERlbGF5XCJcbiAgICAgIGxldC1jb2x1bW49XCJjb2x1bW5cIlxuICAgICAgbGV0LWRheXNJbldlZWs9XCJkYXlzSW5XZWVrXCJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50XCJcbiAgICAgICAgW213bENhbGVuZGFyVG9vbHRpcF09XCJcbiAgICAgICAgICAhdG9vbHRpcERpc2FibGVkXG4gICAgICAgICAgICA/ICh3ZWVrRXZlbnQuZXZlbnQudGl0bGVcbiAgICAgICAgICAgICAgfCBjYWxlbmRhckV2ZW50VGl0bGVcbiAgICAgICAgICAgICAgICA6IChkYXlzSW5XZWVrID09PSAxID8gJ2RheVRvb2x0aXAnIDogJ3dlZWtUb29sdGlwJylcbiAgICAgICAgICAgICAgICA6IHdlZWtFdmVudC50ZW1wRXZlbnQgfHwgd2Vla0V2ZW50LmV2ZW50KVxuICAgICAgICAgICAgOiAnJ1xuICAgICAgICBcIlxuICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgICAgW3Rvb2x0aXBFdmVudF09XCJ3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudFwiXG4gICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgW3Rvb2x0aXBBcHBlbmRUb0JvZHldPVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICAgIFt0b29sdGlwRGVsYXldPVwidG9vbHRpcERlbGF5XCJcbiAgICAgICAgKG13bENsaWNrKT1cImV2ZW50Q2xpY2tlZC5lbWl0KHsgc291cmNlRXZlbnQ6ICRldmVudCB9KVwiXG4gICAgICAgIChtd2xLZXlkb3duRW50ZXIpPVwiZXZlbnRDbGlja2VkLmVtaXQoeyBzb3VyY2VFdmVudDogJGV2ZW50IH0pXCJcbiAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgcm9sZT1cImFwcGxpY2F0aW9uXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJcbiAgICAgICAgICB7IGV2ZW50OiB3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudCwgbG9jYWxlOiBsb2NhbGUgfVxuICAgICAgICAgICAgfCBjYWxlbmRhckExMXk6ICdldmVudERlc2NyaXB0aW9uJ1xuICAgICAgICBcIlxuICAgICAgPlxuICAgICAgICA8bXdsLWNhbGVuZGFyLWV2ZW50LWFjdGlvbnNcbiAgICAgICAgICBbZXZlbnRdPVwid2Vla0V2ZW50LnRlbXBFdmVudCB8fCB3ZWVrRXZlbnQuZXZlbnRcIlxuICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiXG4gICAgICAgID5cbiAgICAgICAgPC9td2wtY2FsZW5kYXItZXZlbnQtYWN0aW9ucz5cbiAgICAgICAgJm5nc3A7XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC10b3AtYmFyXCJcbiAgICAgICAgICBbbmdTdHlsZV09XCJ7ICdib3JkZXItdG9wJzogJzJweCBzb2xpZCAnICsgd2Vla0V2ZW50LmV2ZW50LmNvbG9yPy5wcmltYXJ5IH1cIlxuICAgICAgICAgICpuZ0lmPVwiISh3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudCkuYWxsRGF5XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1kYXRlLXRpdGxlIGNhbC1ldmVudC1yb29tLWdyb3VwXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtaGlkZGVuXT1cInt9IHwgY2FsZW5kYXJBMTF5OiAnaGlkZUV2ZW50VGl0bGUnXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgd2lkdGg9XCIxMlwiXG4gICAgICAgICAgICAgIHN0eWxlPVwidHJhbnNmb3JtOiB0cmFuc2xhdGVZKDJweCk7bWFyZ2luLXJpZ2h0OiAxcHg7XCJcbiAgICAgICAgICAgICAgaGVpZ2h0PVwiMTJcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwVjB6XCIgZmlsbD1cIm5vbmVcIj48L3BhdGg+XG4gICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgZD1cIk0xMS45OSAyQzYuNDcgMiAyIDYuNDggMiAxMnM0LjQ3IDEwIDkuOTkgMTBDMTcuNTIgMjIgMjIgMTcuNTIgMjIgMTJTMTcuNTIgMiAxMS45OSAyek0xMiAyMGMtNC40MiAwLTgtMy41OC04LThzMy41OC04IDgtOCA4IDMuNTggOCA4LTMuNTggOC04IDh6bS41LTEzSDExdjZsNS4yNSAzLjE1Ljc1LTEuMjMtNC41LTIuNjd6XCJcbiAgICAgICAgICAgICAgPjwvcGF0aD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAge3tcbiAgICAgICAgICAgICAgd2Vla0V2ZW50LmV2ZW50LnN0YXJ0IHwgY2FsZW5kYXJEYXRlOiAnZXZlbnRTdGFydFRpbWVUaXRsZSc6J2RlJ1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC1cbiAgICAgICAgICAgIHt7IHdlZWtFdmVudC5ldmVudC5lbmQgfCBjYWxlbmRhckRhdGU6ICdldmVudEVuZFRpbWVUaXRsZSc6J2RlJyB9fVxuICAgICAgICAgICAgVWhyXG4gICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICpuZ0lmPVwid2Vla0V2ZW50LmV2ZW50Lm9uU2l0ZSAmJiB3ZWVrRXZlbnQuZXZlbnQucm9vbVwiXG4gICAgICAgICAgICBbbmdTdHlsZV09XCJ7J3dpZHRoJzogd2Vla0V2ZW50LmV2ZW50Lm9ubGluZSA/ICc1MCUnIDogJzEwMCUnfVwiXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1yb29tLWdyb3VwXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgd2lkdGg9XCIxMlwiXG4gICAgICAgICAgICAgIGhlaWdodD1cIjEyXCJcbiAgICAgICAgICAgICAgc3R5bGU9XCJ0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMnB4KTttYXJnaW4tcmlnaHQ6IDFweDtcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwVjB6XCIgZmlsbD1cIm5vbmVcIj48L3BhdGg+XG4gICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgZD1cIk0xMiAyQzguMTMgMiA1IDUuMTMgNSA5YzAgNS4yNSA3IDEzIDcgMTNzNy03Ljc1IDctMTNjMC0zLjg3LTMuMTMtNy03LTd6TTcgOWMwLTIuNzYgMi4yNC01IDUtNXM1IDIuMjQgNSA1YzAgMi44OC0yLjg4IDcuMTktNSA5Ljg4QzkuOTIgMTYuMjEgNyAxMS44NSA3IDl6XCJcbiAgICAgICAgICAgICAgPjwvcGF0aD5cbiAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCI5XCIgcj1cIjIuNVwiPjwvY2lyY2xlPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICB7eyB3ZWVrRXZlbnQuZXZlbnQub25saW5lID8gd2Vla0V2ZW50LmV2ZW50LnJvb20/LnNob3J0TmFtZSA6IHdlZWtFdmVudC5ldmVudC5yb29tPy5uYW1lIH19XG4gICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICpuZ0lmPVwid2Vla0V2ZW50LmV2ZW50Lm9ubGluZVwiXG4gICAgICAgICAgICBbbmdTdHlsZV09XCJ7J3dpZHRoJzogd2Vla0V2ZW50LmV2ZW50Lm9uU2l0ZSAmJiB3ZWVrRXZlbnQuZXZlbnQucm9vbSA/ICc1MCUnIDogJzEwMCUnfVwiXG4gICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1yb29tLWdyb3VwXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgZmlsbD1cImJsYWNrXCJcbiAgICAgICAgICAgICAgd2lkdGg9XCIxMlwiXG4gICAgICAgICAgICAgIGhlaWdodD1cIjEyXCJcbiAgICAgICAgICAgICAgc3R5bGU9XCJ0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMnB4KTttYXJnaW4tcmlnaHQ6IDFweDtcIj5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMFYwelwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE1IDh2OEg1VjhoMTBtMS0ySDRjLS41NSAwLTEgLjQ1LTEgMXYxMGMwIC41NS40NSAxIDEgMWgxMmMuNTUgMCAxLS40NSAxLTF2LTMuNWw0IDR2LTExbC00IDRWN2MwLS41NS0uNDUtMS0xLTF6XCIvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICBPbmxpbmVcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICpuZ0lmPVwiaXNMaXZlXCJcbiAgICAgICAgICAgICAgc3R5bGU9XCJib3JkZXI6IDFweCBzb2xpZCByZWQ7XG4gICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICAgICAgICAgICAgcGFkZGluZzogMHB4IDRweDtcbiAgICAgICAgICAgICAgbWFyZ2luOiAwcHggNHB4O1xuICAgICAgICAgICAgICBjb2xvcjogcmVkO1xuICAgICAgICAgICAgICBmb250LXNpemU6IDEwcHg7XG4gICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJjYWwtZXZlbnQtbGl2ZVwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJuYXZpZ2F0ZVRvTGl2ZVN0cmVhbSgpXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICAgIHdpZHRoPVwiMTBcIlxuICAgICAgICAgICAgICAgIGhlaWdodD1cIjEwXCJcbiAgICAgICAgICAgICAgICBzdHlsZT1cInRyYW5zZm9ybTogdHJhbnNsYXRlWSgxcHgpOyBtYXJnaW4tcmlnaHQ6IC0xcHg7ZmlsbDogcmVkO1wiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTI0IDI0SDBWMGgyNHYyNHpcIiBmaWxsPVwibm9uZVwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjhcIj48L2NpcmNsZT5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIExJVkVcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1jb2xvclwiXG4gICAgICAgICAgICBzdHlsZT1cInBvaW50ZXItZXZlbnRzOiBub25lO1wiXG4gICAgICAgICAgICBbbmdTdHlsZV09XCJ7IGJhY2tncm91bmRDb2xvcjogd2Vla0V2ZW50LmV2ZW50LmNvbG9yPy5wcmltYXJ5IH1cIlxuICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPG13bC1jYWxlbmRhci1ldmVudC10aXRsZVxuICAgICAgICAgIFtldmVudF09XCJ3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudFwiXG4gICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImV2ZW50VGl0bGVUZW1wbGF0ZVwiXG4gICAgICAgICAgW3ZpZXddPVwiZGF5c0luV2VlayA9PT0gMSA/ICdkYXknIDogJ3dlZWsnXCJcbiAgICAgICAgICAocXVpY2tsaW5rQ2xpY2spPVwiXG4gICAgICAgICAgICBldmVudENsaWNrZWQuZW1pdCh7IHNvdXJjZUV2ZW50OiAkZXZlbnQsIGlzUXVpY2tsaW5rOiB0cnVlIH0pXG4gICAgICAgICAgXCJcbiAgICAgICAgPlxuICAgICAgICA8L213bC1jYWxlbmRhci1ldmVudC10aXRsZT5cblxuICAgICAgICA8bXdsLW1jLXF1aWNrbGlua3NcbiAgICAgICAgICAqbmdJZj1cImR1cmF0aW9uID49IDQ1ICYmIGhvdXJTZWdtZW50SGVpZ2h0ID49IDkwXCJcbiAgICAgICAgICAocXVpY2tsaW5rQ2xpY2spPVwiXG4gICAgICAgICAgICBldmVudENsaWNrZWQuZW1pdCh7IHNvdXJjZUV2ZW50OiAkZXZlbnQsIGlzUXVpY2tsaW5rOiB0cnVlIH0pXG4gICAgICAgICAgXCJcbiAgICAgICAgICBbZXZlbnRdPVwid2Vla0V2ZW50LmV2ZW50XCJcbiAgICAgICAgPjwvbXdsLW1jLXF1aWNrbGlua3M+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjYWxsRGF5VGVtcGxhdGVcbiAgICAgIGxldC13ZWVrRXZlbnQ9XCJ3ZWVrRXZlbnRcIlxuICAgICAgbGV0LXRvb2x0aXBQbGFjZW1lbnQ9XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgIGxldC1ldmVudENsaWNrZWQ9XCJldmVudENsaWNrZWRcIlxuICAgICAgbGV0LXRvb2x0aXBUZW1wbGF0ZT1cInRvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICBsZXQtdG9vbHRpcEFwcGVuZFRvQm9keT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgbGV0LXRvb2x0aXBEaXNhYmxlZD1cInRvb2x0aXBEaXNhYmxlZFwiXG4gICAgICBsZXQtdG9vbHRpcERlbGF5PVwidG9vbHRpcERlbGF5XCJcbiAgICAgIGxldC1jb2x1bW49XCJjb2x1bW5cIlxuICAgICAgbGV0LWRheXNJbldlZWs9XCJkYXlzSW5XZWVrXCJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50IGNhbC1ldmVudC1hbGwtZGF5XCJcbiAgICAgICAgW213bENhbGVuZGFyVG9vbHRpcF09XCJcbiAgICAgICAgICAhdG9vbHRpcERpc2FibGVkXG4gICAgICAgICAgICA/ICh3ZWVrRXZlbnQuZXZlbnQudGl0bGVcbiAgICAgICAgICAgICAgfCBjYWxlbmRhckV2ZW50VGl0bGVcbiAgICAgICAgICAgICAgICA6IChkYXlzSW5XZWVrID09PSAxID8gJ2RheVRvb2x0aXAnIDogJ3dlZWtUb29sdGlwJylcbiAgICAgICAgICAgICAgICA6IHdlZWtFdmVudC50ZW1wRXZlbnQgfHwgd2Vla0V2ZW50LmV2ZW50KVxuICAgICAgICAgICAgOiAnJ1xuICAgICAgICBcIlxuICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgICAgW3Rvb2x0aXBFdmVudF09XCJ3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudFwiXG4gICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgW3Rvb2x0aXBBcHBlbmRUb0JvZHldPVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICAgIFt0b29sdGlwRGVsYXldPVwidG9vbHRpcERlbGF5XCJcbiAgICAgICAgKG13bENsaWNrKT1cImV2ZW50Q2xpY2tlZC5lbWl0KHsgc291cmNlRXZlbnQ6ICRldmVudCB9KVwiXG4gICAgICAgIChtd2xLZXlkb3duRW50ZXIpPVwiZXZlbnRDbGlja2VkLmVtaXQoeyBzb3VyY2VFdmVudDogJGV2ZW50IH0pXCJcbiAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgcm9sZT1cImFwcGxpY2F0aW9uXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJcbiAgICAgICAgICB7IGV2ZW50OiB3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudCwgbG9jYWxlOiBsb2NhbGUgfVxuICAgICAgICAgICAgfCBjYWxlbmRhckExMXk6ICdldmVudERlc2NyaXB0aW9uJ1xuICAgICAgICBcIlxuICAgICAgICBbc3R5bGUuYmFja2dyb3VuZF09XCJ3ZWVrRXZlbnQuZXZlbnQuY29sb3IucHJpbWFyeSB8fCAncmVkJ1wiXG4gICAgICA+XG4gICAgICAgIDxtd2wtY2FsZW5kYXItZXZlbnQtYWN0aW9uc1xuICAgICAgICAgIFtldmVudF09XCJ3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudFwiXG4gICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImV2ZW50QWN0aW9uc1RlbXBsYXRlXCJcbiAgICAgICAgPlxuICAgICAgICA8L213bC1jYWxlbmRhci1ldmVudC1hY3Rpb25zPlxuICAgICAgICAmbmdzcDtcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50LXRvcC1iYXJcIlxuICAgICAgICAgICpuZ0lmPVwiISh3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudCkuYWxsRGF5XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FsLWV2ZW50LXJvb20tZ3JvdXBcIj5SYXVtIEwzMCAvIEdyLiBIMSAtIEgyNDwvc3Bhbj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1jb2xvclwiXG4gICAgICAgICAgICBbbmdTdHlsZV09XCJ7IGJhY2tncm91bmRDb2xvcjogd2Vla0V2ZW50LmV2ZW50LmNvbG9yPy5wcmltYXJ5IH1cIlxuICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICBjbGFzcz1cImFsbC1kYXktZXZlbnQtaWNvblwiXG4gICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgZmlsbD1cIndoaXRlXCJcbiAgICAgICAgICB3aWR0aD1cIjE4cHhcIlxuICAgICAgICAgIGhlaWdodD1cIjE4cHhcIlxuICAgICAgICA+XG4gICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMFYwelwiIGZpbGw9XCJub25lXCIgLz5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZD1cIk0yMCAySDRjLTEuMSAwLTIgLjktMiAydjE4bDQtNGgxNGMxLjEgMCAyLS45IDItMlY0YzAtMS4xLS45LTItMi0yem0wIDE0SDUuMTdMNCAxNy4xN1Y0aDE2djEyem0tOS00aDJ2MmgtMnptMC02aDJ2NGgtMnpcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgICA8bXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlXG4gICAgICAgICAgW2V2ZW50XT1cIndlZWtFdmVudC50ZW1wRXZlbnQgfHwgd2Vla0V2ZW50LmV2ZW50XCJcbiAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUaXRsZVRlbXBsYXRlXCJcbiAgICAgICAgICBbdmlld109XCJkYXlzSW5XZWVrID09PSAxID8gJ2RheScgOiAnd2VlaydcIlxuICAgICAgICA+XG4gICAgICAgIDwvbXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiXG4gICAgICAgIGN1c3RvbVRlbXBsYXRlIHx8XG4gICAgICAgICh3ZWVrRXZlbnQuZXZlbnQgJiYgd2Vla0V2ZW50LmV2ZW50LmFsbERheVxuICAgICAgICAgID8gYWxsRGF5VGVtcGxhdGVcbiAgICAgICAgICA6IGRlZmF1bHRUZW1wbGF0ZSlcbiAgICAgIFwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICB3ZWVrRXZlbnQ6IHdlZWtFdmVudCxcbiAgICAgICAgdG9vbHRpcFBsYWNlbWVudDogdG9vbHRpcFBsYWNlbWVudCxcbiAgICAgICAgZXZlbnRDbGlja2VkOiBldmVudENsaWNrZWQsXG4gICAgICAgIHRvb2x0aXBUZW1wbGF0ZTogdG9vbHRpcFRlbXBsYXRlLFxuICAgICAgICB0b29sdGlwQXBwZW5kVG9Cb2R5OiB0b29sdGlwQXBwZW5kVG9Cb2R5LFxuICAgICAgICB0b29sdGlwRGlzYWJsZWQ6IHRvb2x0aXBEaXNhYmxlZCxcbiAgICAgICAgdG9vbHRpcERlbGF5OiB0b29sdGlwRGVsYXksXG4gICAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgICBkYXlzSW5XZWVrOiBkYXlzSW5XZWVrXG4gICAgICB9XCJcbiAgICA+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrVmlld0V2ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgaG91clNlZ21lbnRIZWlnaHQ6IG51bWJlcjtcblxuICBASW5wdXQoKSB3ZWVrRXZlbnQ6IE1DV2Vla1ZpZXdBbGxEYXlFdmVudCB8IE1DV2Vla1ZpZXdUaW1lRXZlbnQ7XG5cbiAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG5cbiAgQElucHV0KCkgdG9vbHRpcEFwcGVuZFRvQm9keTogYm9vbGVhbjtcblxuICBASW5wdXQoKSB0b29sdGlwRGlzYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBJbnB1dCgpIHRvb2x0aXBEZWxheTogbnVtYmVyIHwgbnVsbDtcblxuICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKSBldmVudFRpdGxlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KCkgZXZlbnRBY3Rpb25zVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KCkgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpIGNvbHVtbjogTUNXZWVrVmlld0hvdXJDb2x1bW47XG5cbiAgQElucHV0KCkgZGF5c0luV2VlazogbnVtYmVyO1xuXG4gIEBPdXRwdXQoKSBldmVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBzb3VyY2VFdmVudDogTW91c2VFdmVudCB8IGFueTtcbiAgICBpc1F1aWNrbGluaz86IGJvb2xlYW47XG4gIH0+KCk7XG5cbiAgZHVyYXRpb24gPSAwO1xuXG4gIGlzTGl2ZSA9IGZhbHNlO1xuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGNvbnN0IGRpZmYgPVxuICAgICAgdGhpcy53ZWVrRXZlbnQuZXZlbnQuZW5kLmdldFRpbWUoKSAtIHRoaXMud2Vla0V2ZW50LmV2ZW50LnN0YXJ0LmdldFRpbWUoKTtcbiAgICB0aGlzLmR1cmF0aW9uID0gTWF0aC5yb3VuZChkaWZmIC8gNjAwMDApO1xuXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5pc0xpdmUgPVxuICAgICAgICB0aGlzLndlZWtFdmVudC5ldmVudC52aWRlb1VSTCAmJlxuICAgICAgICBuZXcgRGF0ZSgpID49IHRoaXMud2Vla0V2ZW50LmV2ZW50LnN0YXJ0ICYmXG4gICAgICAgIG5ldyBEYXRlKCkgPCB0aGlzLndlZWtFdmVudC5ldmVudC5lbmQ7XG4gICAgfSwgNjApO1xuICB9XG5cblxuXG4gIG5hdmlnYXRlVG9MaXZlU3RyZWFtKCkge1xuICAgIHRoaXMuZXZlbnRDbGlja2VkLmVtaXQoe3NvdXJjZUV2ZW50OiB0aGlzLndlZWtFdmVudC5ldmVudC52aWRlb1VSTCwgaXNRdWlja2xpbmsgOiB0cnVlfSk7XG4gIH1cbn1cbiJdfQ==