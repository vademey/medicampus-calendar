import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter, TemplateRef, } from '@angular/core';
import { trigger, style, state, transition, animate, } from '@angular/animations';
import { isWithinThreshold, trackByEventId } from '../common/util';
export const collapseAnimation = trigger('collapse', [
    state('void', style({
        height: 0,
        overflow: 'hidden',
        'padding-top': 0,
        'padding-bottom': 0,
    })),
    state('*', style({
        height: '*',
        overflow: 'hidden',
        'padding-top': '*',
        'padding-bottom': '*',
    })),
    transition('* => void', animate('150ms ease-out')),
    transition('void => *', animate('150ms ease-in')),
]);
let CalendarOpenDayEventsComponent = class CalendarOpenDayEventsComponent {
    constructor() {
        this.isOpen = false;
        this.eventClicked = new EventEmitter();
        this.trackByEventId = trackByEventId;
        this.validateDrag = isWithinThreshold;
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarOpenDayEventsComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarOpenDayEventsComponent.prototype, "isOpen", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarOpenDayEventsComponent.prototype, "events", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarOpenDayEventsComponent.prototype, "customTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarOpenDayEventsComponent.prototype, "eventTitleTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarOpenDayEventsComponent.prototype, "eventActionsTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarOpenDayEventsComponent.prototype, "date", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarOpenDayEventsComponent.prototype, "eventClicked", void 0);
CalendarOpenDayEventsComponent = __decorate([
    Component({
        selector: 'mwl-calendar-open-day-events',
        template: `
    <ng-template
      #defaultTemplate
      let-events="events"
      let-eventClicked="eventClicked"
      let-isOpen="isOpen"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-open-day-events"
        [@collapse]
        *ngIf="isOpen"
        role="application"
      >
        <span
          tabindex="-1"
          role="alert"
          [attr.aria-label]="
            { date: date, locale: locale } | calendarA11y: 'openDayEventsAlert'
          "
        ></span>
        <span
          tabindex="0"
          role="landmark"
          [attr.aria-label]="
            { date: date, locale: locale }
              | calendarA11y: 'openDayEventsLandmark'
          "
        ></span>
        <div
          *ngFor="let event of events; trackBy: trackByEventId"
          [ngClass]="event?.cssClass"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
        >
          <span
            class="cal-event"
            [ngStyle]="{ backgroundColor: event.color?.primary }"
          >
          </span>
          &ngsp;
          <mwl-calendar-event-title
            [event]="event"
            [customTemplate]="eventTitleTemplate"
            view="month"
            (mwlClick)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            (mwlKeydownEnter)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            tabindex="0"
            [attr.aria-label]="
              { event: event, locale: locale }
                | calendarA11y: 'eventDescription'
            "
          >
          </mwl-calendar-event-title>
          &ngsp;
          <mwl-calendar-event-actions
            [event]="event"
            [customTemplate]="eventActionsTemplate"
          >
          </mwl-calendar-event-actions>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        events: events,
        eventClicked: eventClicked,
        isOpen: isOpen,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
        animations: [collapseAnimation]
    })
], CalendarOpenDayEventsComponent);
export { CalendarOpenDayEventsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItb3Blbi1kYXktZXZlbnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXIvIiwic291cmNlcyI6WyJtb2R1bGVzL21vbnRoL2NhbGVuZGFyLW9wZW4tZGF5LWV2ZW50cy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR25FLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUE2QixPQUFPLENBQUMsVUFBVSxFQUFFO0lBQzdFLEtBQUssQ0FDSCxNQUFNLEVBQ04sS0FBSyxDQUFDO1FBQ0osTUFBTSxFQUFFLENBQUM7UUFDVCxRQUFRLEVBQUUsUUFBUTtRQUNsQixhQUFhLEVBQUUsQ0FBQztRQUNoQixnQkFBZ0IsRUFBRSxDQUFDO0tBQ3BCLENBQUMsQ0FDSDtJQUNELEtBQUssQ0FDSCxHQUFHLEVBQ0gsS0FBSyxDQUFDO1FBQ0osTUFBTSxFQUFFLEdBQUc7UUFDWCxRQUFRLEVBQUUsUUFBUTtRQUNsQixhQUFhLEVBQUUsR0FBRztRQUNsQixnQkFBZ0IsRUFBRSxHQUFHO0tBQ3RCLENBQUMsQ0FDSDtJQUNELFVBQVUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEQsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7Q0FDbEQsQ0FBQyxDQUFDO0FBMkZILElBQWEsOEJBQThCLEdBQTNDLE1BQWEsOEJBQThCO0lBQTNDO1FBR1csV0FBTSxHQUFZLEtBQUssQ0FBQztRQVl2QixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUdyQyxDQUFDO1FBRUwsbUJBQWMsR0FBRyxjQUFjLENBQUM7UUFFaEMsaUJBQVksR0FBRyxpQkFBaUIsQ0FBQztJQUNuQyxDQUFDO0NBQUEsQ0FBQTtBQXRCVTtJQUFSLEtBQUssRUFBRTs7OERBQWdCO0FBRWY7SUFBUixLQUFLLEVBQUU7OzhEQUF5QjtBQUV4QjtJQUFSLEtBQUssRUFBRTs7OERBQW1CO0FBRWxCO0lBQVIsS0FBSyxFQUFFOzhCQUFpQixXQUFXO3NFQUFNO0FBRWpDO0lBQVIsS0FBSyxFQUFFOzhCQUFxQixXQUFXOzBFQUFNO0FBRXJDO0lBQVIsS0FBSyxFQUFFOzhCQUF1QixXQUFXOzRFQUFNO0FBRXZDO0lBQVIsS0FBSyxFQUFFOzhCQUFPLElBQUk7NERBQUM7QUFFVjtJQUFULE1BQU0sRUFBRTs7b0VBR0o7QUFsQk0sOEJBQThCO0lBekYxQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsOEJBQThCO1FBQ3hDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0ZUO1FBQ0QsVUFBVSxFQUFFLENBQUMsaUJBQWlCLENBQUM7S0FDaEMsQ0FBQztHQUNXLDhCQUE4QixDQXVCMUM7U0F2QlksOEJBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIHRyaWdnZXIsXG4gIHN0eWxlLFxuICBzdGF0ZSxcbiAgdHJhbnNpdGlvbixcbiAgYW5pbWF0ZSxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IGlzV2l0aGluVGhyZXNob2xkLCB0cmFja0J5RXZlbnRJZCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7IE1DRXZlbnQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgY29sbGFwc2VBbmltYXRpb246IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSA9IHRyaWdnZXIoJ2NvbGxhcHNlJywgW1xuICBzdGF0ZShcbiAgICAndm9pZCcsXG4gICAgc3R5bGUoe1xuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgJ3BhZGRpbmctdG9wJzogMCxcbiAgICAgICdwYWRkaW5nLWJvdHRvbSc6IDAsXG4gICAgfSlcbiAgKSxcbiAgc3RhdGUoXG4gICAgJyonLFxuICAgIHN0eWxlKHtcbiAgICAgIGhlaWdodDogJyonLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgJ3BhZGRpbmctdG9wJzogJyonLFxuICAgICAgJ3BhZGRpbmctYm90dG9tJzogJyonLFxuICAgIH0pXG4gICksXG4gIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIGFuaW1hdGUoJzE1MG1zIGVhc2Utb3V0JykpLFxuICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBhbmltYXRlKCcxNTBtcyBlYXNlLWluJykpLFxuXSk7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci1vcGVuLWRheS1ldmVudHMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWV2ZW50cz1cImV2ZW50c1wiXG4gICAgICBsZXQtZXZlbnRDbGlja2VkPVwiZXZlbnRDbGlja2VkXCJcbiAgICAgIGxldC1pc09wZW49XCJpc09wZW5cIlxuICAgICAgbGV0LXRyYWNrQnlFdmVudElkPVwidHJhY2tCeUV2ZW50SWRcIlxuICAgICAgbGV0LXZhbGlkYXRlRHJhZz1cInZhbGlkYXRlRHJhZ1wiXG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImNhbC1vcGVuLWRheS1ldmVudHNcIlxuICAgICAgICBbQGNvbGxhcHNlXVxuICAgICAgICAqbmdJZj1cImlzT3BlblwiXG4gICAgICAgIHJvbGU9XCJhcHBsaWNhdGlvblwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgcm9sZT1cImFsZXJ0XCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIlxuICAgICAgICAgICAgeyBkYXRlOiBkYXRlLCBsb2NhbGU6IGxvY2FsZSB9IHwgY2FsZW5kYXJBMTF5OiAnb3BlbkRheUV2ZW50c0FsZXJ0J1xuICAgICAgICAgIFwiXG4gICAgICAgID48L3NwYW4+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICByb2xlPVwibGFuZG1hcmtcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiXG4gICAgICAgICAgICB7IGRhdGU6IGRhdGUsIGxvY2FsZTogbG9jYWxlIH1cbiAgICAgICAgICAgICAgfCBjYWxlbmRhckExMXk6ICdvcGVuRGF5RXZlbnRzTGFuZG1hcmsnXG4gICAgICAgICAgXCJcbiAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgICpuZ0Zvcj1cImxldCBldmVudCBvZiBldmVudHM7IHRyYWNrQnk6IHRyYWNrQnlFdmVudElkXCJcbiAgICAgICAgICBbbmdDbGFzc109XCJldmVudD8uY3NzQ2xhc3NcIlxuICAgICAgICAgIG13bERyYWdnYWJsZVxuICAgICAgICAgIFtjbGFzcy5jYWwtZHJhZ2dhYmxlXT1cImV2ZW50LmRyYWdnYWJsZVwiXG4gICAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgICBbZHJvcERhdGFdPVwieyBldmVudDogZXZlbnQgfVwiXG4gICAgICAgICAgW2RyYWdBeGlzXT1cInsgeDogZXZlbnQuZHJhZ2dhYmxlLCB5OiBldmVudC5kcmFnZ2FibGUgfVwiXG4gICAgICAgICAgW3ZhbGlkYXRlRHJhZ109XCJ2YWxpZGF0ZURyYWdcIlxuICAgICAgICAgIFt0b3VjaFN0YXJ0TG9uZ1ByZXNzXT1cInsgZGVsYXk6IDMwMCwgZGVsdGE6IDMwIH1cIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50XCJcbiAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsgYmFja2dyb3VuZENvbG9yOiBldmVudC5jb2xvcj8ucHJpbWFyeSB9XCJcbiAgICAgICAgICA+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICZuZ3NwO1xuICAgICAgICAgIDxtd2wtY2FsZW5kYXItZXZlbnQtdGl0bGVcbiAgICAgICAgICAgIFtldmVudF09XCJldmVudFwiXG4gICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUaXRsZVRlbXBsYXRlXCJcbiAgICAgICAgICAgIHZpZXc9XCJtb250aFwiXG4gICAgICAgICAgICAobXdsQ2xpY2spPVwiXG4gICAgICAgICAgICAgIGV2ZW50Q2xpY2tlZC5lbWl0KHsgZXZlbnQ6IGV2ZW50LCBzb3VyY2VFdmVudDogJGV2ZW50IH0pXG4gICAgICAgICAgICBcIlxuICAgICAgICAgICAgKG13bEtleWRvd25FbnRlcik9XCJcbiAgICAgICAgICAgICAgZXZlbnRDbGlja2VkLmVtaXQoeyBldmVudDogZXZlbnQsIHNvdXJjZUV2ZW50OiAkZXZlbnQgfSlcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJcbiAgICAgICAgICAgICAgeyBldmVudDogZXZlbnQsIGxvY2FsZTogbG9jYWxlIH1cbiAgICAgICAgICAgICAgICB8IGNhbGVuZGFyQTExeTogJ2V2ZW50RGVzY3JpcHRpb24nXG4gICAgICAgICAgICBcIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L213bC1jYWxlbmRhci1ldmVudC10aXRsZT5cbiAgICAgICAgICAmbmdzcDtcbiAgICAgICAgICA8bXdsLWNhbGVuZGFyLWV2ZW50LWFjdGlvbnNcbiAgICAgICAgICAgIFtldmVudF09XCJldmVudFwiXG4gICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRBY3Rpb25zVGVtcGxhdGVcIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L213bC1jYWxlbmRhci1ldmVudC1hY3Rpb25zPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgZXZlbnRzOiBldmVudHMsXG4gICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkLFxuICAgICAgICBpc09wZW46IGlzT3BlbixcbiAgICAgICAgdHJhY2tCeUV2ZW50SWQ6IHRyYWNrQnlFdmVudElkLFxuICAgICAgICB2YWxpZGF0ZURyYWc6IHZhbGlkYXRlRHJhZ1xuICAgICAgfVwiXG4gICAgPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIGFuaW1hdGlvbnM6IFtjb2xsYXBzZUFuaW1hdGlvbl0sXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyT3BlbkRheUV2ZW50c0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIGV2ZW50czogTUNFdmVudFtdO1xuXG4gIEBJbnB1dCgpIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpIGV2ZW50VGl0bGVUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKSBldmVudEFjdGlvbnNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKSBkYXRlOiBEYXRlO1xuXG4gIEBPdXRwdXQoKSBldmVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBldmVudDogTUNFdmVudDtcbiAgICBzb3VyY2VFdmVudDogTW91c2VFdmVudCB8IGFueTtcbiAgfT4oKTtcblxuICB0cmFja0J5RXZlbnRJZCA9IHRyYWNrQnlFdmVudElkO1xuXG4gIHZhbGlkYXRlRHJhZyA9IGlzV2l0aGluVGhyZXNob2xkO1xufVxuIl19