import { __decorate, __metadata, __param } from "tslib";
import { Component, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy, LOCALE_ID, Inject, TemplateRef, } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEventTimesChangedEventType, } from '../common/calendar-event-times-changed-event.interface';
import { CalendarUtils } from '../common/calendar-utils.provider';
import { validateEvents } from '../common/util';
import { DateAdapter } from '../../date-adapters/date-adapter';
/**
 * Shows all events on a given month. Example usage:
 *
 * ```typescript
 * <mwl-calendar-month-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-month-view>
 * ```
 */
let CalendarMonthViewComponent = class CalendarMonthViewComponent {
    /**
     * @hidden
     */
    constructor(cdr, utils, locale, dateAdapter) {
        this.cdr = cdr;
        this.utils = utils;
        this.dateAdapter = dateAdapter;
        /**
         * An array of events to display on view.
         * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
         */
        this.events = [];
        /**
         * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
         */
        this.excludeDays = [];
        /**
         * Whether the events list for the day of the `viewDate` option is visible or not
         */
        this.activeDayIsOpen = false;
        /**
         * The placement of the event tooltip
         */
        this.tooltipPlacement = 'auto';
        /**
         * Whether to append tooltips to the body or next to the trigger element
         */
        this.tooltipAppendToBody = true;
        /**
         * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
         * will be displayed immediately.
         */
        this.tooltipDelay = null;
        /**
         * An output that will be called before the view is rendered for the current month.
         * If you add the `cssClass` property to a day in the body it will add that class to the cell element in the template
         */
        this.beforeViewRender = new EventEmitter();
        /**
         * Called when the day cell is clicked
         */
        this.dayClicked = new EventEmitter();
        /**
         * Called when the event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when a header week day is clicked. Returns ISO day number.
         */
        this.columnHeaderClicked = new EventEmitter();
        /**
         * Called when an event is dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        /**
         * @hidden
         */
        this.trackByRowOffset = (index, offset) => this.view.days
            .slice(offset, this.view.totalDaysVisibleInWeek)
            .map((day) => day.date.toISOString())
            .join('-');
        /**
         * @hidden
         */
        this.trackByDate = (index, day) => day.date.toISOString();
        this.locale = locale;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        const refreshHeader = changes.viewDate || changes.excludeDays || changes.weekendDays;
        const refreshBody = changes.viewDate ||
            changes.events ||
            changes.excludeDays ||
            changes.weekendDays;
        if (refreshHeader) {
            this.refreshHeader();
        }
        if (changes.events) {
            validateEvents(this.events);
        }
        if (refreshBody) {
            this.refreshBody();
        }
        if (refreshHeader || refreshBody) {
            this.emitBeforeViewRender();
        }
        if (changes.activeDayIsOpen ||
            changes.viewDate ||
            changes.events ||
            changes.excludeDays ||
            changes.activeDay) {
            this.checkActiveDayIsOpen();
        }
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
    /**
     * @hidden
     */
    toggleDayHighlight(event, isHighlighted) {
        this.view.days.forEach((day) => {
            if (isHighlighted && day.events.indexOf(event) > -1) {
                day.backgroundColor =
                    (event.color && event.color.secondary) || '#D1E8FF';
            }
            else {
                delete day.backgroundColor;
            }
        });
    }
    /**
     * @hidden
     */
    eventDropped(droppedOn, event, draggedFrom) {
        if (droppedOn !== draggedFrom) {
            const year = this.dateAdapter.getYear(droppedOn.date);
            const month = this.dateAdapter.getMonth(droppedOn.date);
            const date = this.dateAdapter.getDate(droppedOn.date);
            const newStart = this.dateAdapter.setDate(this.dateAdapter.setMonth(this.dateAdapter.setYear(event.start, year), month), date);
            let newEnd;
            if (event.end) {
                const secondsDiff = this.dateAdapter.differenceInSeconds(newStart, event.start);
                newEnd = this.dateAdapter.addSeconds(event.end, secondsDiff);
            }
            this.eventTimesChanged.emit({
                event,
                newStart,
                newEnd,
                day: droppedOn,
                type: CalendarEventTimesChangedEventType.Drop,
            });
        }
    }
    refreshHeader() {
        this.columnHeaders = this.utils.getWeekViewHeader({
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
            weekendDays: this.weekendDays,
        });
    }
    refreshBody() {
        this.view = this.utils.getMonthView({
            events: this.events,
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
            weekendDays: this.weekendDays,
        });
    }
    checkActiveDayIsOpen() {
        if (this.activeDayIsOpen === true) {
            const activeDay = this.activeDay || this.viewDate;
            this.openDay = this.view.days.find((day) => this.dateAdapter.isSameDay(day.date, activeDay));
            const index = this.view.days.indexOf(this.openDay);
            this.openRowIndex =
                Math.floor(index / this.view.totalDaysVisibleInWeek) *
                    this.view.totalDaysVisibleInWeek;
        }
        else {
            this.openRowIndex = null;
            this.openDay = null;
        }
    }
    refreshAll() {
        this.refreshHeader();
        this.refreshBody();
        this.emitBeforeViewRender();
        this.checkActiveDayIsOpen();
    }
    emitBeforeViewRender() {
        if (this.columnHeaders && this.view) {
            this.beforeViewRender.emit({
                header: this.columnHeaders,
                body: this.view.days,
                period: this.view.period,
            });
        }
    }
};
CalendarMonthViewComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: CalendarUtils },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: DateAdapter }
];
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarMonthViewComponent.prototype, "viewDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarMonthViewComponent.prototype, "events", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarMonthViewComponent.prototype, "excludeDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarMonthViewComponent.prototype, "activeDayIsOpen", void 0);
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarMonthViewComponent.prototype, "activeDay", void 0);
__decorate([
    Input(),
    __metadata("design:type", Subject)
], CalendarMonthViewComponent.prototype, "refresh", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarMonthViewComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarMonthViewComponent.prototype, "tooltipPlacement", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthViewComponent.prototype, "tooltipTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarMonthViewComponent.prototype, "tooltipAppendToBody", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarMonthViewComponent.prototype, "tooltipDelay", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarMonthViewComponent.prototype, "weekStartsOn", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthViewComponent.prototype, "headerTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthViewComponent.prototype, "cellTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthViewComponent.prototype, "openDayEventsTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthViewComponent.prototype, "eventTitleTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthViewComponent.prototype, "eventActionsTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarMonthViewComponent.prototype, "weekendDays", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarMonthViewComponent.prototype, "beforeViewRender", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarMonthViewComponent.prototype, "dayClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarMonthViewComponent.prototype, "eventClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarMonthViewComponent.prototype, "columnHeaderClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarMonthViewComponent.prototype, "eventTimesChanged", void 0);
CalendarMonthViewComponent = __decorate([
    Component({
        selector: 'mwl-calendar-month-view',
        template: `
    <div class="cal-month-view" role="grid">
      <mwl-calendar-month-view-header
        [days]="columnHeaders"
        [locale]="locale"
        (columnHeaderClicked)="columnHeaderClicked.emit($event)"
        [customTemplate]="headerTemplate"
      >
      </mwl-calendar-month-view-header>
      <div class="cal-days">
        <div
          *ngFor="let rowIndex of view.rowOffsets; trackBy: trackByRowOffset"
        >
          <div class="cal-cell-row">
            <mwl-calendar-month-cell
              *ngFor="
                let day of view.days
                  | slice: rowIndex:rowIndex + view.totalDaysVisibleInWeek;
                trackBy: trackByDate
              "
              [ngClass]="day?.cssClass"
              [day]="day"
              [openDay]="openDay"
              [locale]="locale"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipDelay]="tooltipDelay"
              [customTemplate]="cellTemplate"
              [ngStyle]="{ backgroundColor: day.backgroundColor }"
              (mwlClick)="dayClicked.emit({ day: day, sourceEvent: $event })"
              [clickListenerDisabled]="dayClicked.observers.length === 0"
              (mwlKeydownEnter)="
                dayClicked.emit({ day: day, sourceEvent: $event })
              "
              (highlightDay)="toggleDayHighlight($event.event, true)"
              (unhighlightDay)="toggleDayHighlight($event.event, false)"
              mwlDroppable
              dragOverClass="cal-drag-over"
              (drop)="
                eventDropped(
                  day,
                  $event.dropData.event,
                  $event.dropData.draggedFrom
                )
              "
              (eventClicked)="
                eventClicked.emit({
                  event: $event.event,
                  sourceEvent: $event.sourceEvent
                })
              "
              [attr.tabindex]="{} | calendarA11y: 'monthCellTabIndex'"
            >
            </mwl-calendar-month-cell>
          </div>
          <mwl-calendar-open-day-events
            [locale]="locale"
            [isOpen]="openRowIndex === rowIndex"
            [events]="openDay?.events"
            [date]="openDay?.date"
            [customTemplate]="openDayEventsTemplate"
            [eventTitleTemplate]="eventTitleTemplate"
            [eventActionsTemplate]="eventActionsTemplate"
            (eventClicked)="
              eventClicked.emit({
                event: $event.event,
                sourceEvent: $event.sourceEvent
              })
            "
            mwlDroppable
            dragOverClass="cal-drag-over"
            (drop)="
              eventDropped(
                openDay,
                $event.dropData.event,
                $event.dropData.draggedFrom
              )
            "
          >
          </mwl-calendar-open-day-events>
        </div>
      </div>
    </div>
  `
    }),
    __param(2, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [ChangeDetectorRef,
        CalendarUtils, String, DateAdapter])
], CalendarMonthViewComponent);
export { CalendarMonthViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbW9udGgtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy9tb250aC9jYWxlbmRhci1tb250aC12aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FBTyxFQUVMLGtDQUFrQyxHQUNuQyxNQUFNLHdEQUF3RCxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBaUIvRDs7Ozs7Ozs7O0dBU0c7QUF5RkgsSUFBYSwwQkFBMEIsR0FBdkMsTUFBYSwwQkFBMEI7SUErSnJDOztPQUVHO0lBQ0gsWUFDWSxHQUFzQixFQUN0QixLQUFvQixFQUNYLE1BQWMsRUFDdkIsV0FBd0I7UUFIeEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDdEIsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUVwQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQS9KcEM7OztXQUdHO1FBQ00sV0FBTSxHQUFjLEVBQUUsQ0FBQztRQUVoQzs7V0FFRztRQUNNLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBRXBDOztXQUVHO1FBQ00sb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFpQjFDOztXQUVHO1FBQ00scUJBQWdCLEdBQW1CLE1BQU0sQ0FBQztRQU9uRDs7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QUFBO3FDQUZILGlCQUFpQjtRQUNmLGFBQWEsVUFFUCxXQUFXO0dBdEt6QiwwQkFBMEIsQ0EyVnRDO1NBM1ZZLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgTE9DQUxFX0lELFxuICBJbmplY3QsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50LFxuICBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLFxufSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItZXZlbnQtdGltZXMtY2hhbmdlZC1ldmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2FsZW5kYXJVdGlscyB9IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci11dGlscy5wcm92aWRlcic7XG5pbXBvcnQgeyB2YWxpZGF0ZUV2ZW50cyB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7IERhdGVBZGFwdGVyIH0gZnJvbSAnLi4vLi4vZGF0ZS1hZGFwdGVycy9kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHsgUGxhY2VtZW50QXJyYXkgfSBmcm9tICdwb3NpdGlvbmluZyc7XG5pbXBvcnQgeyBNQ1dlZWtEYXksIE1DTW9udGhWaWV3RGF5LCBNQ1ZpZXdQZXJpb2QsIE1DTW9udGhWaWV3LCBNQ0V2ZW50IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL21jLWNhbGVuZGFyLXV0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBDYWxlbmRhck1vbnRoVmlld0JlZm9yZVJlbmRlckV2ZW50IHtcbiAgaGVhZGVyOiBNQ1dlZWtEYXlbXTtcbiAgYm9keTogTUNNb250aFZpZXdEYXlbXTtcbiAgcGVyaW9kOiBNQ1ZpZXdQZXJpb2Q7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsZW5kYXJNb250aFZpZXdFdmVudFRpbWVzQ2hhbmdlZEV2ZW50PFxuICBFdmVudE1ldGFUeXBlID0gYW55LFxuICBEYXlNZXRhVHlwZSA9IGFueVxuICA+IGV4dGVuZHMgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50PEV2ZW50TWV0YVR5cGU+IHtcbiAgZGF5OiBNQ01vbnRoVmlld0RheTxEYXlNZXRhVHlwZT47XG59XG5cbi8qKlxuICogU2hvd3MgYWxsIGV2ZW50cyBvbiBhIGdpdmVuIG1vbnRoLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIDxtd2wtY2FsZW5kYXItbW9udGgtdmlld1xuICogIFt2aWV3RGF0ZV09XCJ2aWV3RGF0ZVwiXG4gKiAgW2V2ZW50c109XCJldmVudHNcIj5cbiAqIDwvbXdsLWNhbGVuZGFyLW1vbnRoLXZpZXc+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLW1vbnRoLXZpZXcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJjYWwtbW9udGgtdmlld1wiIHJvbGU9XCJncmlkXCI+XG4gICAgICA8bXdsLWNhbGVuZGFyLW1vbnRoLXZpZXctaGVhZGVyXG4gICAgICAgIFtkYXlzXT1cImNvbHVtbkhlYWRlcnNcIlxuICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgIChjb2x1bW5IZWFkZXJDbGlja2VkKT1cImNvbHVtbkhlYWRlckNsaWNrZWQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImhlYWRlclRlbXBsYXRlXCJcbiAgICAgID5cbiAgICAgIDwvbXdsLWNhbGVuZGFyLW1vbnRoLXZpZXctaGVhZGVyPlxuICAgICAgPGRpdiBjbGFzcz1cImNhbC1kYXlzXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgcm93SW5kZXggb2Ygdmlldy5yb3dPZmZzZXRzOyB0cmFja0J5OiB0cmFja0J5Um93T2Zmc2V0XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtY2VsbC1yb3dcIj5cbiAgICAgICAgICAgIDxtd2wtY2FsZW5kYXItbW9udGgtY2VsbFxuICAgICAgICAgICAgICAqbmdGb3I9XCJcbiAgICAgICAgICAgICAgICBsZXQgZGF5IG9mIHZpZXcuZGF5c1xuICAgICAgICAgICAgICAgICAgfCBzbGljZTogcm93SW5kZXg6cm93SW5kZXggKyB2aWV3LnRvdGFsRGF5c1Zpc2libGVJbldlZWs7XG4gICAgICAgICAgICAgICAgdHJhY2tCeTogdHJhY2tCeURhdGVcbiAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiZGF5Py5jc3NDbGFzc1wiXG4gICAgICAgICAgICAgIFtkYXldPVwiZGF5XCJcbiAgICAgICAgICAgICAgW29wZW5EYXldPVwib3BlbkRheVwiXG4gICAgICAgICAgICAgIFtsb2NhbGVdPVwibG9jYWxlXCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXG4gICAgICAgICAgICAgIFt0b29sdGlwQXBwZW5kVG9Cb2R5XT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFt0b29sdGlwRGVsYXldPVwidG9vbHRpcERlbGF5XCJcbiAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImNlbGxUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsgYmFja2dyb3VuZENvbG9yOiBkYXkuYmFja2dyb3VuZENvbG9yIH1cIlxuICAgICAgICAgICAgICAobXdsQ2xpY2spPVwiZGF5Q2xpY2tlZC5lbWl0KHsgZGF5OiBkYXksIHNvdXJjZUV2ZW50OiAkZXZlbnQgfSlcIlxuICAgICAgICAgICAgICBbY2xpY2tMaXN0ZW5lckRpc2FibGVkXT1cImRheUNsaWNrZWQub2JzZXJ2ZXJzLmxlbmd0aCA9PT0gMFwiXG4gICAgICAgICAgICAgIChtd2xLZXlkb3duRW50ZXIpPVwiXG4gICAgICAgICAgICAgICAgZGF5Q2xpY2tlZC5lbWl0KHsgZGF5OiBkYXksIHNvdXJjZUV2ZW50OiAkZXZlbnQgfSlcbiAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgKGhpZ2hsaWdodERheSk9XCJ0b2dnbGVEYXlIaWdobGlnaHQoJGV2ZW50LmV2ZW50LCB0cnVlKVwiXG4gICAgICAgICAgICAgICh1bmhpZ2hsaWdodERheSk9XCJ0b2dnbGVEYXlIaWdobGlnaHQoJGV2ZW50LmV2ZW50LCBmYWxzZSlcIlxuICAgICAgICAgICAgICBtd2xEcm9wcGFibGVcbiAgICAgICAgICAgICAgZHJhZ092ZXJDbGFzcz1cImNhbC1kcmFnLW92ZXJcIlxuICAgICAgICAgICAgICAoZHJvcCk9XCJcbiAgICAgICAgICAgICAgICBldmVudERyb3BwZWQoXG4gICAgICAgICAgICAgICAgICBkYXksXG4gICAgICAgICAgICAgICAgICAkZXZlbnQuZHJvcERhdGEuZXZlbnQsXG4gICAgICAgICAgICAgICAgICAkZXZlbnQuZHJvcERhdGEuZHJhZ2dlZEZyb21cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgIChldmVudENsaWNrZWQpPVwiXG4gICAgICAgICAgICAgICAgZXZlbnRDbGlja2VkLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgZXZlbnQ6ICRldmVudC5ldmVudCxcbiAgICAgICAgICAgICAgICAgIHNvdXJjZUV2ZW50OiAkZXZlbnQuc291cmNlRXZlbnRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJ7fSB8IGNhbGVuZGFyQTExeTogJ21vbnRoQ2VsbFRhYkluZGV4J1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8L213bC1jYWxlbmRhci1tb250aC1jZWxsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxtd2wtY2FsZW5kYXItb3Blbi1kYXktZXZlbnRzXG4gICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgICAgICBbaXNPcGVuXT1cIm9wZW5Sb3dJbmRleCA9PT0gcm93SW5kZXhcIlxuICAgICAgICAgICAgW2V2ZW50c109XCJvcGVuRGF5Py5ldmVudHNcIlxuICAgICAgICAgICAgW2RhdGVdPVwib3BlbkRheT8uZGF0ZVwiXG4gICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwib3BlbkRheUV2ZW50c1RlbXBsYXRlXCJcbiAgICAgICAgICAgIFtldmVudFRpdGxlVGVtcGxhdGVdPVwiZXZlbnRUaXRsZVRlbXBsYXRlXCJcbiAgICAgICAgICAgIFtldmVudEFjdGlvbnNUZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiXG4gICAgICAgICAgICAoZXZlbnRDbGlja2VkKT1cIlxuICAgICAgICAgICAgICBldmVudENsaWNrZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6ICRldmVudC5ldmVudCxcbiAgICAgICAgICAgICAgICBzb3VyY2VFdmVudDogJGV2ZW50LnNvdXJjZUV2ZW50XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcIlxuICAgICAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgICAgICBkcmFnT3ZlckNsYXNzPVwiY2FsLWRyYWctb3ZlclwiXG4gICAgICAgICAgICAoZHJvcCk9XCJcbiAgICAgICAgICAgICAgZXZlbnREcm9wcGVkKFxuICAgICAgICAgICAgICAgIG9wZW5EYXksXG4gICAgICAgICAgICAgICAgJGV2ZW50LmRyb3BEYXRhLmV2ZW50LFxuICAgICAgICAgICAgICAgICRldmVudC5kcm9wRGF0YS5kcmFnZ2VkRnJvbVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICBcIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L213bC1jYWxlbmRhci1vcGVuLWRheS1ldmVudHM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTW9udGhWaWV3Q29tcG9uZW50XG4gIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB2aWV3IGRhdGVcbiAgICovXG4gIEBJbnB1dCgpIHZpZXdEYXRlOiBEYXRlO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBldmVudHMgdG8gZGlzcGxheSBvbiB2aWV3LlxuICAgKiBUaGUgc2NoZW1hIGlzIGF2YWlsYWJsZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vbWF0dGxld2lzOTIvY2FsZW5kYXItdXRpbHMvYmxvYi9jNTE2ODk5ODVmNTlhMjcxOTQwZTMwYmM0ZTJjNGUxZmVlM2ZjYjVjL3NyYy9jYWxlbmRhclV0aWxzLnRzI0w0OS1MNjNcbiAgICovXG4gIEBJbnB1dCgpIGV2ZW50czogTUNFdmVudFtdID0gW107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCB3aWxsIGJlIGhpZGRlbiBvbiB0aGUgdmlld1xuICAgKi9cbiAgQElucHV0KCkgZXhjbHVkZURheXM6IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGV2ZW50cyBsaXN0IGZvciB0aGUgZGF5IG9mIHRoZSBgdmlld0RhdGVgIG9wdGlvbiBpcyB2aXNpYmxlIG9yIG5vdFxuICAgKi9cbiAgQElucHV0KCkgYWN0aXZlRGF5SXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIElmIHNldCB3aWxsIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBkYXkgdGhhdCBzaG91bGQgYmUgb3Blbi4gSWYgbm90IHNldCwgdGhlIGB2aWV3RGF0ZWAgaXMgdXNlZFxuICAgKi9cbiAgQElucHV0KCkgYWN0aXZlRGF5OiBEYXRlO1xuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHRoYXQgd2hlbiBlbWl0dGVkIG9uIHdpbGwgcmUtcmVuZGVyIHRoZSBjdXJyZW50IHZpZXdcbiAgICovXG4gIEBJbnB1dCgpIHJlZnJlc2g6IFN1YmplY3Q8YW55PjtcblxuICAvKipcbiAgICogVGhlIGxvY2FsZSB1c2VkIHRvIGZvcm1hdCBkYXRlc1xuICAgKi9cbiAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwbGFjZW1lbnQgb2YgdGhlIGV2ZW50IHRvb2x0aXBcbiAgICovXG4gIEBJbnB1dCgpIHRvb2x0aXBQbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2F1dG8nO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIHRoZSBldmVudCB0b29sdGlwc1xuICAgKi9cbiAgQElucHV0KCkgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGFwcGVuZCB0b29sdGlwcyB0byB0aGUgYm9keSBvciBuZXh0IHRvIHRoZSB0cmlnZ2VyIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpIHRvb2x0aXBBcHBlbmRUb0JvZHk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIGJlZm9yZSB0aGUgdG9vbHRpcCBzaG91bGQgYmUgZGlzcGxheWVkLiBJZiBub3QgcHJvdmlkZWQgdGhlIHRvb2x0aXBcbiAgICogd2lsbCBiZSBkaXNwbGF5ZWQgaW1tZWRpYXRlbHkuXG4gICAqL1xuICBASW5wdXQoKSB0b29sdGlwRGVsYXk6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhcnQgbnVtYmVyIG9mIHRoZSB3ZWVrXG4gICAqL1xuICBASW5wdXQoKSB3ZWVrU3RhcnRzT246IG51bWJlcjtcblxuICAvKipcbiAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIHRvIHJlcGxhY2UgdGhlIGhlYWRlclxuICAgKi9cbiAgQElucHV0KCkgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBkYXkgY2VsbFxuICAgKi9cbiAgQElucHV0KCkgY2VsbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIHRoZSBzbGlkZSBkb3duIGJveCBvZiBldmVudHMgZm9yIHRoZSBhY3RpdmUgZGF5XG4gICAqL1xuICBASW5wdXQoKSBvcGVuRGF5RXZlbnRzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgZXZlbnQgdGl0bGVzXG4gICAqL1xuICBASW5wdXQoKSBldmVudFRpdGxlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgZXZlbnQgYWN0aW9uc1xuICAgKi9cbiAgQElucHV0KCkgZXZlbnRBY3Rpb25zVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCBpbmRpY2F0ZSB3aGljaCBkYXlzIGFyZSB3ZWVrZW5kc1xuICAgKi9cbiAgQElucHV0KCkgd2Vla2VuZERheXM6IG51bWJlcltdO1xuXG4gIC8qKlxuICAgKiBBbiBvdXRwdXQgdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgcmVuZGVyZWQgZm9yIHRoZSBjdXJyZW50IG1vbnRoLlxuICAgKiBJZiB5b3UgYWRkIHRoZSBgY3NzQ2xhc3NgIHByb3BlcnR5IHRvIGEgZGF5IGluIHRoZSBib2R5IGl0IHdpbGwgYWRkIHRoYXQgY2xhc3MgdG8gdGhlIGNlbGwgZWxlbWVudCBpbiB0aGUgdGVtcGxhdGVcbiAgICovXG4gIEBPdXRwdXQoKSBiZWZvcmVWaWV3UmVuZGVyID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBDYWxlbmRhck1vbnRoVmlld0JlZm9yZVJlbmRlckV2ZW50XG4gID4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGRheSBjZWxsIGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKSBkYXlDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgZGF5OiBNQ01vbnRoVmlld0RheTtcbiAgICBzb3VyY2VFdmVudDogTW91c2VFdmVudCB8IGFueTtcbiAgfT4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGV2ZW50IHRpdGxlIGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKSBldmVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBldmVudDogTUNFdmVudDtcbiAgICBzb3VyY2VFdmVudDogTW91c2VFdmVudCB8IGFueTtcbiAgfT4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSBoZWFkZXIgd2VlayBkYXkgaXMgY2xpY2tlZC4gUmV0dXJucyBJU08gZGF5IG51bWJlci5cbiAgICovXG4gIEBPdXRwdXQoKSBjb2x1bW5IZWFkZXJDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgaXNvRGF5TnVtYmVyOiBudW1iZXI7XG4gICAgc291cmNlRXZlbnQ6IE1vdXNlRXZlbnQgfCBhbnk7XG4gIH0+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGFuIGV2ZW50IGlzIGRyYWdnZWQgYW5kIGRyb3BwZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBldmVudFRpbWVzQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgQ2FsZW5kYXJNb250aFZpZXdFdmVudFRpbWVzQ2hhbmdlZEV2ZW50XG4gID4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29sdW1uSGVhZGVyczogTUNXZWVrRGF5W107XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHZpZXc6IE1DTW9udGhWaWV3O1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBvcGVuUm93SW5kZXg6IG51bWJlcjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgb3BlbkRheTogTUNNb250aFZpZXdEYXk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHJlZnJlc2hTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJvdGVjdGVkIHV0aWxzOiBDYWxlbmRhclV0aWxzLFxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBsb2NhbGU6IHN0cmluZyxcbiAgICBwcm90ZWN0ZWQgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyXG4gICkge1xuICAgIHRoaXMubG9jYWxlID0gbG9jYWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRyYWNrQnlSb3dPZmZzZXQgPSAoaW5kZXg6IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpID0+XG4gICAgdGhpcy52aWV3LmRheXNcbiAgICAgIC5zbGljZShvZmZzZXQsIHRoaXMudmlldy50b3RhbERheXNWaXNpYmxlSW5XZWVrKVxuICAgICAgLm1hcCgoZGF5KSA9PiBkYXkuZGF0ZS50b0lTT1N0cmluZygpKVxuICAgICAgLmpvaW4oJy0nKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeURhdGUgPSAoaW5kZXg6IG51bWJlciwgZGF5OiBNQ01vbnRoVmlld0RheSkgPT4gZGF5LmRhdGUudG9JU09TdHJpbmcoKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVmcmVzaCkge1xuICAgICAgdGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5yZWZyZXNoLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcmVzaEFsbCgpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCByZWZyZXNoSGVhZGVyID1cbiAgICAgIGNoYW5nZXMudmlld0RhdGUgfHwgY2hhbmdlcy5leGNsdWRlRGF5cyB8fCBjaGFuZ2VzLndlZWtlbmREYXlzO1xuICAgIGNvbnN0IHJlZnJlc2hCb2R5ID1cbiAgICAgIGNoYW5nZXMudmlld0RhdGUgfHxcbiAgICAgIGNoYW5nZXMuZXZlbnRzIHx8XG4gICAgICBjaGFuZ2VzLmV4Y2x1ZGVEYXlzIHx8XG4gICAgICBjaGFuZ2VzLndlZWtlbmREYXlzO1xuXG4gICAgaWYgKHJlZnJlc2hIZWFkZXIpIHtcbiAgICAgIHRoaXMucmVmcmVzaEhlYWRlcigpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmV2ZW50cykge1xuICAgICAgdmFsaWRhdGVFdmVudHModGhpcy5ldmVudHMpO1xuICAgIH1cblxuICAgIGlmIChyZWZyZXNoQm9keSkge1xuICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xuICAgIH1cblxuICAgIGlmIChyZWZyZXNoSGVhZGVyIHx8IHJlZnJlc2hCb2R5KSB7XG4gICAgICB0aGlzLmVtaXRCZWZvcmVWaWV3UmVuZGVyKCk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgY2hhbmdlcy5hY3RpdmVEYXlJc09wZW4gfHxcbiAgICAgIGNoYW5nZXMudmlld0RhdGUgfHxcbiAgICAgIGNoYW5nZXMuZXZlbnRzIHx8XG4gICAgICBjaGFuZ2VzLmV4Y2x1ZGVEYXlzIHx8XG4gICAgICBjaGFuZ2VzLmFjdGl2ZURheVxuICAgICkge1xuICAgICAgdGhpcy5jaGVja0FjdGl2ZURheUlzT3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdG9nZ2xlRGF5SGlnaGxpZ2h0KGV2ZW50OiBNQ0V2ZW50LCBpc0hpZ2hsaWdodGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy52aWV3LmRheXMuZm9yRWFjaCgoZGF5KSA9PiB7XG4gICAgICBpZiAoaXNIaWdobGlnaHRlZCAmJiBkYXkuZXZlbnRzLmluZGV4T2YoZXZlbnQpID4gLTEpIHtcbiAgICAgICAgZGF5LmJhY2tncm91bmRDb2xvciA9XG4gICAgICAgICAgKGV2ZW50LmNvbG9yICYmIGV2ZW50LmNvbG9yLnNlY29uZGFyeSkgfHwgJyNEMUU4RkYnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGRheS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZXZlbnREcm9wcGVkKFxuICAgIGRyb3BwZWRPbjogTUNNb250aFZpZXdEYXksXG4gICAgZXZlbnQ6IE1DRXZlbnQsXG4gICAgZHJhZ2dlZEZyb20/OiBNQ01vbnRoVmlld0RheVxuICApOiB2b2lkIHtcbiAgICBpZiAoZHJvcHBlZE9uICE9PSBkcmFnZ2VkRnJvbSkge1xuICAgICAgY29uc3QgeWVhcjogbnVtYmVyID0gdGhpcy5kYXRlQWRhcHRlci5nZXRZZWFyKGRyb3BwZWRPbi5kYXRlKTtcbiAgICAgIGNvbnN0IG1vbnRoOiBudW1iZXIgPSB0aGlzLmRhdGVBZGFwdGVyLmdldE1vbnRoKGRyb3BwZWRPbi5kYXRlKTtcbiAgICAgIGNvbnN0IGRhdGU6IG51bWJlciA9IHRoaXMuZGF0ZUFkYXB0ZXIuZ2V0RGF0ZShkcm9wcGVkT24uZGF0ZSk7XG4gICAgICBjb25zdCBuZXdTdGFydDogRGF0ZSA9IHRoaXMuZGF0ZUFkYXB0ZXIuc2V0RGF0ZShcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlci5zZXRNb250aChcbiAgICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLnNldFllYXIoZXZlbnQuc3RhcnQsIHllYXIpLFxuICAgICAgICAgIG1vbnRoXG4gICAgICAgICksXG4gICAgICAgIGRhdGVcbiAgICAgICk7XG4gICAgICBsZXQgbmV3RW5kOiBEYXRlO1xuICAgICAgaWYgKGV2ZW50LmVuZCkge1xuICAgICAgICBjb25zdCBzZWNvbmRzRGlmZjogbnVtYmVyID0gdGhpcy5kYXRlQWRhcHRlci5kaWZmZXJlbmNlSW5TZWNvbmRzKFxuICAgICAgICAgIG5ld1N0YXJ0LFxuICAgICAgICAgIGV2ZW50LnN0YXJ0XG4gICAgICAgICk7XG4gICAgICAgIG5ld0VuZCA9IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkU2Vjb25kcyhldmVudC5lbmQsIHNlY29uZHNEaWZmKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBuZXdTdGFydCxcbiAgICAgICAgbmV3RW5kLFxuICAgICAgICBkYXk6IGRyb3BwZWRPbixcbiAgICAgICAgdHlwZTogQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50VHlwZS5Ecm9wLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hIZWFkZXIoKTogdm9pZCB7XG4gICAgdGhpcy5jb2x1bW5IZWFkZXJzID0gdGhpcy51dGlscy5nZXRXZWVrVmlld0hlYWRlcih7XG4gICAgICB2aWV3RGF0ZTogdGhpcy52aWV3RGF0ZSxcbiAgICAgIHdlZWtTdGFydHNPbjogdGhpcy53ZWVrU3RhcnRzT24sXG4gICAgICBleGNsdWRlZDogdGhpcy5leGNsdWRlRGF5cyxcbiAgICAgIHdlZWtlbmREYXlzOiB0aGlzLndlZWtlbmREYXlzLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hCb2R5KCk6IHZvaWQge1xuICAgIHRoaXMudmlldyA9IHRoaXMudXRpbHMuZ2V0TW9udGhWaWV3KHtcbiAgICAgIGV2ZW50czogdGhpcy5ldmVudHMsXG4gICAgICB2aWV3RGF0ZTogdGhpcy52aWV3RGF0ZSxcbiAgICAgIHdlZWtTdGFydHNPbjogdGhpcy53ZWVrU3RhcnRzT24sXG4gICAgICBleGNsdWRlZDogdGhpcy5leGNsdWRlRGF5cyxcbiAgICAgIHdlZWtlbmREYXlzOiB0aGlzLndlZWtlbmREYXlzLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNoZWNrQWN0aXZlRGF5SXNPcGVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZURheUlzT3BlbiA9PT0gdHJ1ZSkge1xuICAgICAgY29uc3QgYWN0aXZlRGF5ID0gdGhpcy5hY3RpdmVEYXkgfHwgdGhpcy52aWV3RGF0ZTtcbiAgICAgIHRoaXMub3BlbkRheSA9IHRoaXMudmlldy5kYXlzLmZpbmQoKGRheSkgPT5cbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlci5pc1NhbWVEYXkoZGF5LmRhdGUsIGFjdGl2ZURheSlcbiAgICAgICk7XG4gICAgICBjb25zdCBpbmRleDogbnVtYmVyID0gdGhpcy52aWV3LmRheXMuaW5kZXhPZih0aGlzLm9wZW5EYXkpO1xuICAgICAgdGhpcy5vcGVuUm93SW5kZXggPVxuICAgICAgICBNYXRoLmZsb29yKGluZGV4IC8gdGhpcy52aWV3LnRvdGFsRGF5c1Zpc2libGVJbldlZWspICpcbiAgICAgICAgdGhpcy52aWV3LnRvdGFsRGF5c1Zpc2libGVJbldlZWs7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlblJvd0luZGV4ID0gbnVsbDtcbiAgICAgIHRoaXMub3BlbkRheSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5yZWZyZXNoSGVhZGVyKCk7XG4gICAgdGhpcy5yZWZyZXNoQm9keSgpO1xuICAgIHRoaXMuZW1pdEJlZm9yZVZpZXdSZW5kZXIoKTtcbiAgICB0aGlzLmNoZWNrQWN0aXZlRGF5SXNPcGVuKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZW1pdEJlZm9yZVZpZXdSZW5kZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29sdW1uSGVhZGVycyAmJiB0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMuYmVmb3JlVmlld1JlbmRlci5lbWl0KHtcbiAgICAgICAgaGVhZGVyOiB0aGlzLmNvbHVtbkhlYWRlcnMsXG4gICAgICAgIGJvZHk6IHRoaXMudmlldy5kYXlzLFxuICAgICAgICBwZXJpb2Q6IHRoaXMudmlldy5wZXJpb2QsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==