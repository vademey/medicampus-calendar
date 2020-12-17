import { __decorate, __metadata, __param, __rest } from "tslib";
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnInit, OnDestroy, LOCALE_ID, Inject, TemplateRef, } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarDragHelper } from '../common/calendar-drag-helper.provider';
import { CalendarResizeHelper } from '../common/calendar-resize-helper.provider';
import { CalendarEventTimesChangedEventType, } from '../common/calendar-event-times-changed-event.interface';
import { CalendarUtils } from '../common/calendar-utils.provider';
import { validateEvents, roundToNearest, trackByWeekDayHeaderDate, trackByHourSegment, trackByHour, getMinutesMoved, getDefaultEventEnd, getMinimumEventHeightInMinutes, addDaysWithExclusions, isDraggedWithinPeriod, shouldFireDroppedEvent, getWeekViewPeriod, trackByWeekAllDayEvent, trackByWeekTimeEvent, } from '../common/util';
import { DateAdapter } from '../../date-adapters/date-adapter';
/**
 * Shows all events on a given week. Example usage:
 *
 * ```typescript
 * <mwl-calendar-week-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-week-view>
 * ```
 */
let CalendarWeekViewComponent = class CalendarWeekViewComponent {
    /**
     * @hidden
     */
    constructor(cdr, utils, locale, dateAdapter) {
        this.cdr = cdr;
        this.utils = utils;
        this.dateAdapter = dateAdapter;
        /**
         * An array of events to display on view
         * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
         */
        this.events = [];
        /**
         * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
         */
        this.excludeDays = [];
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
         * The precision to display events.
         * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
         */
        this.precision = 'days';
        /**
         * Whether to snap events to a grid when dragging
         */
        this.snapDraggedEvents = true;
        /**
         * The number of segments in an hour. Must be <= 6
         */
        this.hourSegments = 2;
        /**
         * The height in pixels of each hour segment
         */
        this.hourSegmentHeight = 30;
        /**
         * The day start hours in 24 hour time. Must be 0-23
         */
        this.dayStartHour = 0;
        /**
         * The day start minutes. Must be 0-59
         */
        this.dayStartMinute = 0;
        /**
         * The day end hours in 24 hour time. Must be 0-23
         */
        this.dayEndHour = 23;
        /**
         * The day end minutes. Must be 0-59
         */
        this.dayEndMinute = 59;
        /**
         * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
         */
        this.dayHeaderClicked = new EventEmitter();
        /**
         * Called when the event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when an event is resized or dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        /**
         * An output that will be called before the view is rendered for the current week.
         * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
         */
        this.beforeViewRender = new EventEmitter();
        /**
         * Called when an hour segment is clicked
         */
        this.hourSegmentClicked = new EventEmitter();
        /**
         * @hidden
         */
        this.allDayEventResizes = new Map();
        /**
         * @hidden
         */
        this.timeEventResizes = new Map();
        /**
         * @hidden
         */
        this.eventDragEnterByType = {
            allDay: 0,
            time: 0,
        };
        /**
         * @hidden
         */
        this.dragActive = false;
        /**
         * @hidden
         */
        this.dragAlreadyMoved = false;
        /**
         * @hidden
         */
        this.calendarId = Symbol('angular calendar week view id');
        /**
         * @hidden
         */
        this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
        /**
         * @hidden
         */
        this.trackByHourSegment = trackByHourSegment;
        /**
         * @hidden
         */
        this.trackByHour = trackByHour;
        /**
         * @hidden
         */
        this.trackByWeekAllDayEvent = trackByWeekAllDayEvent;
        /**
         * @hidden
         */
        this.trackByWeekTimeEvent = trackByWeekTimeEvent;
        /**
         * @hidden
         */
        this.trackByHourColumn = (index, column) => column.hours[0] ? column.hours[0].segments[0].date.toISOString() : column;
        /**
         * @hidden
         */
        this.trackById = (index, row) => row.id;
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
        const refreshHeader = changes.viewDate ||
            changes.excludeDays ||
            changes.weekendDays ||
            changes.daysInWeek ||
            changes.weekStartsOn;
        const refreshBody = changes.viewDate ||
            changes.dayStartHour ||
            changes.dayStartMinute ||
            changes.dayEndHour ||
            changes.dayEndMinute ||
            changes.hourSegments ||
            changes.weekStartsOn ||
            changes.weekendDays ||
            changes.excludeDays ||
            changes.hourSegmentHeight ||
            changes.events ||
            changes.daysInWeek;
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
    timeEventResizeStarted(eventsContainer, timeEvent, resizeEvent) {
        this.timeEventResizes.set(timeEvent.event, resizeEvent);
        this.resizeStarted(eventsContainer);
    }
    /**
     * @hidden
     */
    timeEventResizing(timeEvent, resizeEvent) {
        this.timeEventResizes.set(timeEvent.event, resizeEvent);
        const adjustedEvents = new Map();
        const tempEvents = [...this.events];
        this.timeEventResizes.forEach((lastResizeEvent, event) => {
            const newEventDates = this.getTimeEventResizedDates(event, lastResizeEvent);
            const adjustedEvent = Object.assign(Object.assign({}, event), newEventDates);
            adjustedEvents.set(adjustedEvent, event);
            const eventIndex = tempEvents.indexOf(event);
            tempEvents[eventIndex] = adjustedEvent;
        });
        this.restoreOriginalEvents(tempEvents, adjustedEvents, true);
    }
    /**
     * @hidden
     */
    timeEventResizeEnded(timeEvent) {
        this.view = this.getWeekView(this.events);
        const lastResizeEvent = this.timeEventResizes.get(timeEvent.event);
        if (lastResizeEvent) {
            this.timeEventResizes.delete(timeEvent.event);
            const newEventDates = this.getTimeEventResizedDates(timeEvent.event, lastResizeEvent);
            this.eventTimesChanged.emit({
                newStart: newEventDates.start,
                newEnd: newEventDates.end,
                event: timeEvent.event,
                type: CalendarEventTimesChangedEventType.Resize,
            });
        }
    }
    /**
     * @hidden
     */
    allDayEventResizeStarted(allDayEventsContainer, allDayEvent, resizeEvent) {
        this.allDayEventResizes.set(allDayEvent, {
            originalOffset: allDayEvent.offset,
            originalSpan: allDayEvent.span,
            edge: typeof resizeEvent.edges.left !== 'undefined' ? 'left' : 'right',
        });
        this.resizeStarted(allDayEventsContainer, this.getDayColumnWidth(allDayEventsContainer));
    }
    /**
     * @hidden
     */
    allDayEventResizing(allDayEvent, resizeEvent, dayWidth) {
        const currentResize = this.allDayEventResizes.get(allDayEvent);
        if (typeof resizeEvent.edges.left !== 'undefined') {
            const diff = Math.round(+resizeEvent.edges.left / dayWidth);
            allDayEvent.offset = currentResize.originalOffset + diff;
            allDayEvent.span = currentResize.originalSpan - diff;
        }
        else if (typeof resizeEvent.edges.right !== 'undefined') {
            const diff = Math.round(+resizeEvent.edges.right / dayWidth);
            allDayEvent.span = currentResize.originalSpan + diff;
        }
    }
    /**
     * @hidden
     */
    allDayEventResizeEnded(allDayEvent) {
        const currentResize = this.allDayEventResizes.get(allDayEvent);
        if (currentResize) {
            const allDayEventResizingBeforeStart = currentResize.edge === 'left';
            let daysDiff;
            if (allDayEventResizingBeforeStart) {
                daysDiff = allDayEvent.offset - currentResize.originalOffset;
            }
            else {
                daysDiff = allDayEvent.span - currentResize.originalSpan;
            }
            allDayEvent.offset = currentResize.originalOffset;
            allDayEvent.span = currentResize.originalSpan;
            let newStart = allDayEvent.event.start;
            let newEnd = allDayEvent.event.end || allDayEvent.event.start;
            if (allDayEventResizingBeforeStart) {
                newStart = addDaysWithExclusions(this.dateAdapter, newStart, daysDiff, this.excludeDays);
            }
            else {
                newEnd = addDaysWithExclusions(this.dateAdapter, newEnd, daysDiff, this.excludeDays);
            }
            this.eventTimesChanged.emit({
                newStart,
                newEnd,
                event: allDayEvent.event,
                type: CalendarEventTimesChangedEventType.Resize,
            });
            this.allDayEventResizes.delete(allDayEvent);
        }
    }
    /**
     * @hidden
     */
    getDayColumnWidth(eventRowContainer) {
        return Math.floor(eventRowContainer.offsetWidth / this.days.length);
    }
    /**
     * @hidden
     */
    dateDragEnter(date) {
        this.lastDragEnterDate = date;
    }
    /**
     * @hidden
     */
    eventDropped(dropEvent, date, allDay) {
        if (shouldFireDroppedEvent(dropEvent, date, allDay, this.calendarId) &&
            this.lastDragEnterDate.getTime() === date.getTime() &&
            (!this.snapDraggedEvents ||
                dropEvent.dropData.event !== this.lastDraggedEvent)) {
            this.eventTimesChanged.emit({
                type: CalendarEventTimesChangedEventType.Drop,
                event: dropEvent.dropData.event,
                newStart: date,
                allDay,
            });
        }
        this.lastDraggedEvent = null;
    }
    /**
     * @hidden
     */
    dragEnter(type) {
        this.eventDragEnterByType[type]++;
    }
    /**
     * @hidden
     */
    dragLeave(type) {
        this.eventDragEnterByType[type]--;
    }
    /**
     * @hidden
     */
    dragStarted(eventsContainer, event, dayEvent) {
        this.dayColumnWidth = this.getDayColumnWidth(eventsContainer);
        const dragHelper = new CalendarDragHelper(eventsContainer, event);
        this.validateDrag = ({ x, y, transform }) => this.allDayEventResizes.size === 0 &&
            this.timeEventResizes.size === 0 &&
            dragHelper.validateDrag({
                x,
                y,
                snapDraggedEvents: this.snapDraggedEvents,
                dragAlreadyMoved: this.dragAlreadyMoved,
                transform,
            });
        this.dragActive = true;
        this.dragAlreadyMoved = false;
        this.lastDraggedEvent = null;
        this.eventDragEnterByType = {
            allDay: 0,
            time: 0,
        };
        if (!this.snapDraggedEvents && dayEvent) {
            this.view.hourColumns.forEach((column) => {
                const linkedEvent = column.events.find((columnEvent) => columnEvent.event === dayEvent.event && columnEvent !== dayEvent);
                // hide any linked events while dragging
                if (linkedEvent) {
                    linkedEvent.width = 0;
                    linkedEvent.height = 0;
                }
            });
        }
        this.cdr.markForCheck();
    }
    /**
     * @hidden
     */
    dragMove(dayEvent, dragEvent) {
        const newEventTimes = this.getDragMovedEventTimes(dayEvent, dragEvent, this.dayColumnWidth, true);
        const originalEvent = dayEvent.event;
        const adjustedEvent = Object.assign(Object.assign({}, originalEvent), newEventTimes);
        const tempEvents = this.events.map((event) => {
            if (event === originalEvent) {
                return adjustedEvent;
            }
            return event;
        });
        this.restoreOriginalEvents(tempEvents, new Map([[adjustedEvent, originalEvent]]), this.snapDraggedEvents);
        this.dragAlreadyMoved = true;
    }
    /**
     * @hidden
     */
    allDayEventDragMove() {
        this.dragAlreadyMoved = true;
    }
    /**
     * @hidden
     */
    dragEnded(weekEvent, dragEndEvent, dayWidth, useY = false) {
        this.view = this.getWeekView(this.events);
        this.dragActive = false;
        this.validateDrag = null;
        const { start, end } = this.getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY);
        if ((this.snapDraggedEvents ||
            this.eventDragEnterByType[useY ? 'time' : 'allDay'] > 0) &&
            isDraggedWithinPeriod(start, end, this.view.period)) {
            this.lastDraggedEvent = weekEvent.event;
            this.eventTimesChanged.emit({
                newStart: start,
                newEnd: end,
                event: weekEvent.event,
                type: CalendarEventTimesChangedEventType.Drag,
                allDay: !useY,
            });
        }
    }
    refreshHeader() {
        this.days = this.utils.getWeekViewHeader(Object.assign({ viewDate: this.viewDate, weekStartsOn: this.weekStartsOn, excluded: this.excludeDays, weekendDays: this.weekendDays }, getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)));
    }
    refreshBody() {
        this.view = this.getWeekView(this.events);
    }
    refreshAll() {
        this.refreshHeader();
        this.refreshBody();
        this.emitBeforeViewRender();
    }
    emitBeforeViewRender() {
        if (this.days && this.view) {
            this.beforeViewRender.emit(Object.assign({ header: this.days }, this.view));
        }
    }
    getWeekView(events) {
        return this.utils.getWeekView(Object.assign({ events, viewDate: this.viewDate, weekStartsOn: this.weekStartsOn, excluded: this.excludeDays, precision: this.precision, absolutePositionedEvents: true, hourSegments: this.hourSegments, dayStart: {
                hour: this.dayStartHour,
                minute: this.dayStartMinute,
            }, dayEnd: {
                hour: this.dayEndHour,
                minute: this.dayEndMinute,
            }, segmentHeight: this.hourSegmentHeight, weekendDays: this.weekendDays }, getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)));
    }
    getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY) {
        const daysDragged = roundToNearest(dragEndEvent.x, dayWidth) / dayWidth;
        const minutesMoved = useY
            ? getMinutesMoved(dragEndEvent.y, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize)
            : 0;
        const start = this.dateAdapter.addMinutes(addDaysWithExclusions(this.dateAdapter, weekEvent.event.start, daysDragged, this.excludeDays), minutesMoved);
        let end;
        if (weekEvent.event.end) {
            end = this.dateAdapter.addMinutes(addDaysWithExclusions(this.dateAdapter, weekEvent.event.end, daysDragged, this.excludeDays), minutesMoved);
        }
        return { start, end };
    }
    restoreOriginalEvents(tempEvents, adjustedEvents, snapDraggedEvents = true) {
        const previousView = this.view;
        this.view = this.getWeekView(tempEvents);
        const adjustedEventsArray = tempEvents.filter((event) => adjustedEvents.has(event));
        this.view.hourColumns.forEach((column, columnIndex) => {
            previousView.hourColumns[columnIndex].hours.forEach((hour, hourIndex) => {
                hour.segments.forEach((segment, segmentIndex) => {
                    column.hours[hourIndex].segments[segmentIndex].cssClass =
                        segment.cssClass;
                });
            });
            adjustedEventsArray.forEach((adjustedEvent) => {
                const originalEvent = adjustedEvents.get(adjustedEvent);
                const existingColumnEvent = column.events.find((columnEvent) => columnEvent.event === adjustedEvent);
                if (existingColumnEvent) {
                    // restore the original event so trackBy kicks in and the dom isn't changed
                    existingColumnEvent.event = originalEvent;
                    existingColumnEvent['tempEvent'] = adjustedEvent;
                    if (!snapDraggedEvents) {
                        existingColumnEvent.height = 0;
                        existingColumnEvent.width = 0;
                    }
                }
                else {
                    // add a dummy event to the drop so if the event was removed from the original column the drag doesn't end early
                    const event = {
                        event: originalEvent,
                        left: 0,
                        top: 0,
                        height: 0,
                        width: 0,
                        startsBeforeDay: false,
                        endsAfterDay: false,
                        tempEvent: adjustedEvent,
                    };
                    column.events.push(event);
                }
            });
        });
        adjustedEvents.clear();
    }
    getTimeEventResizedDates(calendarEvent, resizeEvent) {
        const minimumEventHeight = getMinimumEventHeightInMinutes(this.hourSegments, this.hourSegmentHeight);
        const newEventDates = {
            start: calendarEvent.start,
            end: getDefaultEventEnd(this.dateAdapter, calendarEvent, minimumEventHeight),
        };
        const { end } = calendarEvent, eventWithoutEnd = __rest(calendarEvent, ["end"]);
        const smallestResizes = {
            start: this.dateAdapter.addMinutes(newEventDates.end, minimumEventHeight * -1),
            end: getDefaultEventEnd(this.dateAdapter, eventWithoutEnd, minimumEventHeight),
        };
        if (typeof resizeEvent.edges.left !== 'undefined') {
            const daysDiff = Math.round(+resizeEvent.edges.left / this.dayColumnWidth);
            const newStart = addDaysWithExclusions(this.dateAdapter, newEventDates.start, daysDiff, this.excludeDays);
            if (newStart < smallestResizes.start) {
                newEventDates.start = newStart;
            }
            else {
                newEventDates.start = smallestResizes.start;
            }
        }
        else if (typeof resizeEvent.edges.right !== 'undefined') {
            const daysDiff = Math.round(+resizeEvent.edges.right / this.dayColumnWidth);
            const newEnd = addDaysWithExclusions(this.dateAdapter, newEventDates.end, daysDiff, this.excludeDays);
            if (newEnd > smallestResizes.end) {
                newEventDates.end = newEnd;
            }
            else {
                newEventDates.end = smallestResizes.end;
            }
        }
        if (typeof resizeEvent.edges.top !== 'undefined') {
            const minutesMoved = getMinutesMoved(resizeEvent.edges.top, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize);
            const newStart = this.dateAdapter.addMinutes(newEventDates.start, minutesMoved);
            if (newStart < smallestResizes.start) {
                newEventDates.start = newStart;
            }
            else {
                newEventDates.start = smallestResizes.start;
            }
        }
        else if (typeof resizeEvent.edges.bottom !== 'undefined') {
            const minutesMoved = getMinutesMoved(resizeEvent.edges.bottom, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize);
            const newEnd = this.dateAdapter.addMinutes(newEventDates.end, minutesMoved);
            if (newEnd > smallestResizes.end) {
                newEventDates.end = newEnd;
            }
            else {
                newEventDates.end = smallestResizes.end;
            }
        }
        return newEventDates;
    }
    resizeStarted(eventsContainer, minWidth) {
        this.dayColumnWidth = this.getDayColumnWidth(eventsContainer);
        const resizeHelper = new CalendarResizeHelper(eventsContainer, minWidth);
        this.validateResize = ({ rectangle }) => resizeHelper.validateResize({ rectangle });
        this.cdr.markForCheck();
    }
};
CalendarWeekViewComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: CalendarUtils },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: DateAdapter }
];
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarWeekViewComponent.prototype, "viewDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarWeekViewComponent.prototype, "events", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarWeekViewComponent.prototype, "excludeDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Subject)
], CalendarWeekViewComponent.prototype, "refresh", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarWeekViewComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarWeekViewComponent.prototype, "tooltipDisabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarWeekViewComponent.prototype, "tooltipPlacement", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewComponent.prototype, "tooltipTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarWeekViewComponent.prototype, "tooltipAppendToBody", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "tooltipDelay", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "weekStartsOn", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewComponent.prototype, "headerTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewComponent.prototype, "eventTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewComponent.prototype, "eventTitleTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewComponent.prototype, "eventActionsTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarWeekViewComponent.prototype, "precision", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarWeekViewComponent.prototype, "weekendDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarWeekViewComponent.prototype, "snapDraggedEvents", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "hourSegments", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "hourSegmentHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "dayStartHour", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "dayStartMinute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "dayEndHour", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "dayEndMinute", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewComponent.prototype, "hourSegmentTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "eventSnapSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewComponent.prototype, "allDayEventsLabelTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewComponent.prototype, "daysInWeek", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewComponent.prototype, "currentTimeMarkerTemplate", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewComponent.prototype, "dayHeaderClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewComponent.prototype, "eventClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewComponent.prototype, "eventTimesChanged", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewComponent.prototype, "beforeViewRender", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewComponent.prototype, "hourSegmentClicked", void 0);
CalendarWeekViewComponent = __decorate([
    Component({
        selector: 'mwl-calendar-week-view',
        template: `
    <div class="cal-week-view" role="grid">
      <mwl-calendar-week-view-header
        style="display: none;"
        [days]="days"
        [locale]="locale"
        [customTemplate]="headerTemplate"
        (dayHeaderClicked)="dayHeaderClicked.emit($event)"
        (eventDropped)="
          eventDropped({ dropData: $event }, $event.newStart, true)
        "
        (dragEnter)="dateDragEnter($event.date)"
      >
      </mwl-calendar-week-view-header>
      <div
        class="cal-all-day-events"
        #allDayEventsContainer
        *ngIf="view.allDayEventRows.length > 0"
        mwlDroppable
        (dragEnter)="dragEnter('allDay')"
        (dragLeave)="dragLeave('allDay')"
      >
        <div class="cal-day-columns">
          <div
            class="cal-time-label-column"
            [ngTemplateOutlet]="allDayEventsLabelTemplate"
          ></div>
          <div
            class="cal-day-column"
            *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
            mwlDroppable
            dragOverClass="cal-drag-over"
            (drop)="eventDropped($event, day.date, true)"
            (dragEnter)="dateDragEnter(day.date)"
          ></div>
        </div>
        <div
          *ngFor="let eventRow of view.allDayEventRows; trackBy: trackById"
          #eventRowContainer
          class="cal-events-row"
        >
          <div
            *ngFor="
              let allDayEvent of eventRow.row;
              trackBy: trackByWeekAllDayEvent
            "
            #event
            class="cal-event-container"
            [class.cal-draggable]="
              allDayEvent.event.draggable && allDayEventResizes.size === 0
            "
            [class.cal-starts-within-week]="!allDayEvent.startsBeforeWeek"
            [class.cal-ends-within-week]="!allDayEvent.endsAfterWeek"
            [ngClass]="allDayEvent.event?.cssClass"
            [style.width.%]="(100 / days.length) * allDayEvent.span"
            [style.marginLeft.%]="(100 / days.length) * allDayEvent.offset"
            mwlResizable
            [resizeSnapGrid]="{ left: dayColumnWidth, right: dayColumnWidth }"
            [validateResize]="validateResize"
            (resizeStart)="
              allDayEventResizeStarted(eventRowContainer, allDayEvent, $event)
            "
            (resizing)="
              allDayEventResizing(allDayEvent, $event, dayColumnWidth)
            "
            (resizeEnd)="allDayEventResizeEnded(allDayEvent)"
            mwlDraggable
            dragActiveClass="cal-drag-active"
            [dropData]="{ event: allDayEvent.event, calendarId: calendarId }"
            [dragAxis]="{
              x: allDayEvent.event.draggable && allDayEventResizes.size === 0,
              y:
                !snapDraggedEvents &&
                allDayEvent.event.draggable &&
                allDayEventResizes.size === 0
            }"
            [dragSnapGrid]="snapDraggedEvents ? { x: dayColumnWidth } : {}"
            [validateDrag]="validateDrag"
            [touchStartLongPress]="{ delay: 300, delta: 30 }"
            (dragStart)="dragStarted(eventRowContainer, event)"
            (dragging)="allDayEventDragMove()"
            (dragEnd)="dragEnded(allDayEvent, $event, dayColumnWidth)"
          >
            <div
              class="cal-resize-handle cal-resize-handle-before-start"
              *ngIf="
                allDayEvent.event?.resizable?.beforeStart &&
                !allDayEvent.startsBeforeWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ left: true }"
            ></div>
            <mwl-calendar-week-view-event
              [locale]="locale"
              [hourSegmentHeight]="hourSegmentHeight"
              [weekEvent]="allDayEvent"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipDelay]="tooltipDelay"
              [customTemplate]="eventTemplate"
              [eventTitleTemplate]="eventTitleTemplate"
              [eventActionsTemplate]="eventActionsTemplate"
              [daysInWeek]="daysInWeek"
              (eventClicked)="
                eventClicked.emit({
                  event: allDayEvent.event,
                  sourceEvent: $event.sourceEvent
                })
              "
            >
            </mwl-calendar-week-view-event>
            <div
              class="cal-resize-handle cal-resize-handle-after-end"
              *ngIf="
                allDayEvent.event?.resizable?.afterEnd &&
                !allDayEvent.endsAfterWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ right: true }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="cal-time-events"
        mwlDroppable
        (dragEnter)="dragEnter('time')"
        (dragLeave)="dragLeave('time')"
      >
        <div
          class="cal-time-label-column"
          *ngIf="view.hourColumns.length > 0 && daysInWeek !== 1"
        >
          <div
            *ngFor="
              let hour of view.hourColumns[0].hours;
              trackBy: trackByHour;
              let odd = odd
            "
            class="cal-hour"
            [class.cal-hour-odd]="odd"
          >
            <mwl-calendar-week-view-hour-segment
              *ngFor="let segment of hour.segments; trackBy: trackByHourSegment"
              [style.height.px]="hourSegmentHeight"
              [segment]="segment"
              [segmentHeight]="hourSegmentHeight"
              [locale]="locale"
              [customTemplate]="hourSegmentTemplate"
              [isTimeLabel]="true"
              [daysInWeek]="daysInWeek"
            >
            </mwl-calendar-week-view-hour-segment>
          </div>
        </div>
        <div
          class="cal-day-columns"
          [class.cal-resize-active]="timeEventResizes.size > 0"
          #dayColumns
        >
          <div
            class="cal-day-column"
            *ngFor="let column of view.hourColumns; trackBy: trackByHourColumn"
          >
            <mwl-calendar-week-view-current-time-marker
              [columnDate]="column.date"
              [dayStartHour]="dayStartHour"
              [dayStartMinute]="dayStartMinute"
              [dayEndHour]="dayEndHour"
              [dayEndMinute]="dayEndMinute"
              [hourSegments]="hourSegments"
              [hourSegmentHeight]="hourSegmentHeight"
              [customTemplate]="currentTimeMarkerTemplate"
            ></mwl-calendar-week-view-current-time-marker>
            <div class="cal-events-container">
              <div
                *ngFor="
                  let timeEvent of column.events;
                  trackBy: trackByWeekTimeEvent
                "
                #event
                class="cal-event-container"
                id="cal-event-{{ timeEvent.event.id }}"
                [class.cal-draggable]="
                  timeEvent.event.draggable && timeEventResizes.size === 0
                "
                [class.cal-starts-within-day]="!timeEvent.startsBeforeDay"
                [class.cal-ends-within-day]="!timeEvent.endsAfterDay"
                [ngClass]="timeEvent.event.cssClass"
                [hidden]="timeEvent.height === 0 && timeEvent.width === 0"
                [style.top.px]="timeEvent.top"
                [style.height.px]="timeEvent.height"
                [style.left.%]="timeEvent.left"
                [style.width.%]="timeEvent.width"
                mwlResizable
                [resizeSnapGrid]="{
                  left: dayColumnWidth,
                  right: dayColumnWidth,
                  top: eventSnapSize || hourSegmentHeight,
                  bottom: eventSnapSize || hourSegmentHeight
                }"
                [validateResize]="validateResize"
                [allowNegativeResizes]="true"
                (resizeStart)="
                  timeEventResizeStarted(dayColumns, timeEvent, $event)
                "
                (resizing)="timeEventResizing(timeEvent, $event)"
                (resizeEnd)="timeEventResizeEnded(timeEvent)"
                mwlDraggable
                dragActiveClass="cal-drag-active"
                [dropData]="{ event: timeEvent.event, calendarId: calendarId }"
                [dragAxis]="{
                  x: timeEvent.event.draggable && timeEventResizes.size === 0,
                  y: timeEvent.event.draggable && timeEventResizes.size === 0
                }"
                [dragSnapGrid]="
                  snapDraggedEvents
                    ? {
                        x: dayColumnWidth,
                        y: eventSnapSize || hourSegmentHeight
                      }
                    : {}
                "
                [touchStartLongPress]="{ delay: 300, delta: 30 }"
                [ghostDragEnabled]="!snapDraggedEvents"
                [ghostElementTemplate]="weekEventTemplate"
                [validateDrag]="validateDrag"
                (dragStart)="dragStarted(dayColumns, event, timeEvent)"
                (dragging)="dragMove(timeEvent, $event)"
                (dragEnd)="dragEnded(timeEvent, $event, dayColumnWidth, true)"
              >
                <div
                  class="cal-resize-handle cal-resize-handle-before-start"
                  *ngIf="
                    timeEvent.event?.resizable?.beforeStart &&
                    !timeEvent.startsBeforeDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    left: true,
                    top: true
                  }"
                ></div>
                <ng-template
                  [ngTemplateOutlet]="weekEventTemplate"
                ></ng-template>
                <ng-template #weekEventTemplate>
                  <mwl-calendar-week-view-event
                    [locale]="locale"
                    [hourSegmentHeight]="hourSegmentHeight"
                    [weekEvent]="timeEvent"
                    [tooltipPlacement]="tooltipPlacement"
                    [tooltipTemplate]="tooltipTemplate"
                    [tooltipAppendToBody]="tooltipAppendToBody"
                    [tooltipDisabled]="
                      tooltipDisabled || dragActive || timeEventResizes.size > 0
                    "
                    [tooltipDelay]="tooltipDelay"
                    [customTemplate]="eventTemplate"
                    [eventTitleTemplate]="eventTitleTemplate"
                    [eventActionsTemplate]="eventActionsTemplate"
                    [column]="column"
                    [daysInWeek]="daysInWeek"
                    (eventClicked)="
                      eventClicked.emit({
                        event: timeEvent.event,
                        sourceEvent: $event.sourceEvent
                      })
                    "
                  >
                  </mwl-calendar-week-view-event>
                </ng-template>
                <div
                  class="cal-resize-handle cal-resize-handle-after-end"
                  *ngIf="
                    timeEvent.event?.resizable?.afterEnd &&
                    !timeEvent.endsAfterDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    right: true,
                    bottom: true
                  }"
                ></div>
              </div>
            </div>

            <div
              *ngFor="
                let hour of column.hours;
                trackBy: trackByHour;
                let odd = odd
              "
              class="cal-hour"
              [class.cal-hour-odd]="odd"
            >
              <mwl-calendar-week-view-hour-segment
                *ngFor="
                  let segment of hour.segments;
                  trackBy: trackByHourSegment
                "
                [style.height.px]="hourSegmentHeight"
                [segment]="segment"
                [segmentHeight]="hourSegmentHeight"
                [locale]="locale"
                [customTemplate]="hourSegmentTemplate"
                [daysInWeek]="daysInWeek"
                (mwlClick)="
                  hourSegmentClicked.emit({
                    date: segment.date,
                    sourceEvent: $event
                  })
                "
                [clickListenerDisabled]="
                  hourSegmentClicked.observers.length === 0
                "
                mwlDroppable
                [dragOverClass]="
                  !dragActive || !snapDraggedEvents ? 'cal-drag-over' : null
                "
                dragActiveClass="cal-drag-active"
                (drop)="eventDropped($event, segment.date, false)"
                (dragEnter)="dateDragEnter(segment.date)"
                [isTimeLabel]="daysInWeek === 1"
              >
              </mwl-calendar-week-view-hour-segment>
            </div>
          </div>
        </div>
        
        <div
          class="cal-time-label-column" style="border-left: thin solid #e1e1e1;"
          *ngIf="view.hourColumns.length > 0 && daysInWeek !== 1"
        >
          <div
            *ngFor="
              let hour of view.hourColumns[0].hours;
              trackBy: trackByHour;
              let odd = odd
            "
            class="cal-hour"
            [class.cal-hour-odd]="odd"
          >
            <mwl-calendar-week-view-hour-segment
              *ngFor="let segment of hour.segments; trackBy: trackByHourSegment"
              [style.height.px]="hourSegmentHeight"
              [segment]="segment"
              [segmentHeight]="hourSegmentHeight"
              [locale]="locale"
              [customTemplate]="hourSegmentTemplate"
              [isTimeLabel]="false"
              [daysInWeek]="daysInWeek"
            >
            </mwl-calendar-week-view-hour-segment>
          </div>
        </div>
      </div>
    </div>
  `
    }),
    __param(2, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [ChangeDetectorRef,
        CalendarUtils, String, DateAdapter])
], CalendarWeekViewComponent);
export { CalendarWeekViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXIvIiwic291cmNlcyI6WyJtb2R1bGVzL3dlZWsvY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixpQkFBaUIsRUFDakIsU0FBUyxFQUNULE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFHN0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDakYsT0FBTyxFQUVMLGtDQUFrQyxHQUNuQyxNQUFNLHdEQUF3RCxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQ0wsY0FBYyxFQUNkLGNBQWMsRUFDZCx3QkFBd0IsRUFDeEIsa0JBQWtCLEVBQ2xCLFdBQVcsRUFDWCxlQUFlLEVBQ2Ysa0JBQWtCLEVBQ2xCLDhCQUE4QixFQUM5QixxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3JCLHNCQUFzQixFQUN0QixpQkFBaUIsRUFDakIsc0JBQXNCLEVBQ3RCLG9CQUFvQixHQUNyQixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQTRCL0Q7Ozs7Ozs7OztHQVNHO0FBNFdILElBQWEseUJBQXlCLEdBQXRDLE1BQWEseUJBQXlCO0lBaVNwQzs7T0FFRztJQUNILFlBQ1ksR0FBc0IsRUFDdEIsS0FBb0IsRUFDWCxNQUFjLEVBQ3ZCLFdB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdVdUO0tBQ0YsQ0FBQztJQXdTRyxXQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtxQ0FGSCxpQkFBaUI7UUFDZixhQUFhLFVBRVAsV0FBVztHQXhTekIseUJBQXlCLENBbzdCckM7U0FwN0JZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgTE9DQUxFX0lELFxuICBJbmplY3QsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBSZXNpemVFdmVudCB9IGZyb20gJ2FuZ3VsYXItcmVzaXphYmxlLWVsZW1lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJEcmFnSGVscGVyIH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWRyYWctaGVscGVyLnByb3ZpZGVyJztcbmltcG9ydCB7IENhbGVuZGFyUmVzaXplSGVscGVyIH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLXJlc2l6ZS1oZWxwZXIucHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50LFxuICBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLFxufSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItZXZlbnQtdGltZXMtY2hhbmdlZC1ldmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2FsZW5kYXJVdGlscyB9IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci11dGlscy5wcm92aWRlcic7XG5pbXBvcnQge1xuICB2YWxpZGF0ZUV2ZW50cyxcbiAgcm91bmRUb05lYXJlc3QsXG4gIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSxcbiAgdHJhY2tCeUhvdXJTZWdtZW50LFxuICB0cmFja0J5SG91cixcbiAgZ2V0TWludXRlc01vdmVkLFxuICBnZXREZWZhdWx0RXZlbnRFbmQsXG4gIGdldE1pbmltdW1FdmVudEhlaWdodEluTWludXRlcyxcbiAgYWRkRGF5c1dpdGhFeGNsdXNpb25zLFxuICBpc0RyYWdnZWRXaXRoaW5QZXJpb2QsXG4gIHNob3VsZEZpcmVEcm9wcGVkRXZlbnQsXG4gIGdldFdlZWtWaWV3UGVyaW9kLFxuICB0cmFja0J5V2Vla0FsbERheUV2ZW50LFxuICB0cmFja0J5V2Vla1RpbWVFdmVudCxcbn0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5pbXBvcnQge1xuICBEcmFnRW5kRXZlbnQsXG4gIERyb3BFdmVudCxcbiAgRHJhZ01vdmVFdmVudCxcbiAgVmFsaWRhdGVEcmFnLFxufSBmcm9tICdhbmd1bGFyLWRyYWdnYWJsZS1kcm9wcGFibGUnO1xuaW1wb3J0IHsgUGxhY2VtZW50QXJyYXkgfSBmcm9tICdwb3NpdGlvbmluZyc7XG5pbXBvcnQge1xuICBNQ0V2ZW50LFxuICBNQ1dlZWtEYXksXG4gIE1DV2Vla1ZpZXcsXG4gIE1DV2Vla1ZpZXdBbGxEYXlFdmVudCxcbiAgTUNXZWVrVmlld0hvdXJDb2x1bW4sXG4gIE1DV2Vla1ZpZXdBbGxEYXlFdmVudFJvdyxcbiAgTUNXZWVrVmlld1RpbWVFdmVudCxcbn0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL21jLWNhbGVuZGFyLXV0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBXZWVrVmlld0FsbERheUV2ZW50UmVzaXplIHtcbiAgb3JpZ2luYWxPZmZzZXQ6IG51bWJlcjtcbiAgb3JpZ2luYWxTcGFuOiBudW1iZXI7XG4gIGVkZ2U6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYWxlbmRhcldlZWtWaWV3QmVmb3JlUmVuZGVyRXZlbnQgZXh0ZW5kcyBNQ1dlZWtWaWV3IHtcbiAgaGVhZGVyOiBNQ1dlZWtEYXlbXTtcbn1cblxuLyoqXG4gKiBTaG93cyBhbGwgZXZlbnRzIG9uIGEgZ2l2ZW4gd2Vlay4gRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiA8bXdsLWNhbGVuZGFyLXdlZWstdmlld1xuICogIFt2aWV3RGF0ZV09XCJ2aWV3RGF0ZVwiXG4gKiAgW2V2ZW50c109XCJldmVudHNcIj5cbiAqIDwvbXdsLWNhbGVuZGFyLXdlZWstdmlldz5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItd2Vlay12aWV3JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiY2FsLXdlZWstdmlld1wiIHJvbGU9XCJncmlkXCI+XG4gICAgICA8bXdsLWNhbGVuZGFyLXdlZWstdmlldy1oZWFkZXJcbiAgICAgICAgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiXG4gICAgICAgIFtkYXlzXT1cImRheXNcIlxuICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJoZWFkZXJUZW1wbGF0ZVwiXG4gICAgICAgIChkYXlIZWFkZXJDbGlja2VkKT1cImRheUhlYWRlckNsaWNrZWQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgKGV2ZW50RHJvcHBlZCk9XCJcbiAgICAgICAgICBldmVudERyb3BwZWQoeyBkcm9wRGF0YTogJGV2ZW50IH0sICRldmVudC5uZXdTdGFydCwgdHJ1ZSlcbiAgICAgICAgXCJcbiAgICAgICAgKGRyYWdFbnRlcik9XCJkYXRlRHJhZ0VudGVyKCRldmVudC5kYXRlKVwiXG4gICAgICA+XG4gICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctaGVhZGVyPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImNhbC1hbGwtZGF5LWV2ZW50c1wiXG4gICAgICAgICNhbGxEYXlFdmVudHNDb250YWluZXJcbiAgICAgICAgKm5nSWY9XCJ2aWV3LmFsbERheUV2ZW50Um93cy5sZW5ndGggPiAwXCJcbiAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgIChkcmFnRW50ZXIpPVwiZHJhZ0VudGVyKCdhbGxEYXknKVwiXG4gICAgICAgIChkcmFnTGVhdmUpPVwiZHJhZ0xlYXZlKCdhbGxEYXknKVwiXG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtZGF5LWNvbHVtbnNcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzcz1cImNhbC10aW1lLWxhYmVsLWNvbHVtblwiXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJhbGxEYXlFdmVudHNMYWJlbFRlbXBsYXRlXCJcbiAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtZGF5LWNvbHVtblwiXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgZGF5IG9mIGRheXM7IHRyYWNrQnk6IHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZVwiXG4gICAgICAgICAgICBtd2xEcm9wcGFibGVcbiAgICAgICAgICAgIGRyYWdPdmVyQ2xhc3M9XCJjYWwtZHJhZy1vdmVyXCJcbiAgICAgICAgICAgIChkcm9wKT1cImV2ZW50RHJvcHBlZCgkZXZlbnQsIGRheS5kYXRlLCB0cnVlKVwiXG4gICAgICAgICAgICAoZHJhZ0VudGVyKT1cImRhdGVEcmFnRW50ZXIoZGF5LmRhdGUpXCJcbiAgICAgICAgICA+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgKm5nRm9yPVwibGV0IGV2ZW50Um93IG9mIHZpZXcuYWxsRGF5RXZlbnRSb3dzOyB0cmFja0J5OiB0cmFja0J5SWRcIlxuICAgICAgICAgICNldmVudFJvd0NvbnRhaW5lclxuICAgICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50cy1yb3dcIlxuICAgICAgICA+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgKm5nRm9yPVwiXG4gICAgICAgICAgICAgIGxldCBhbGxEYXlFdmVudCBvZiBldmVudFJvdy5yb3c7XG4gICAgICAgICAgICAgIHRyYWNrQnk6IHRyYWNrQnlXZWVrQWxsRGF5RXZlbnRcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAjZXZlbnRcbiAgICAgICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50LWNvbnRhaW5lclwiXG4gICAgICAgICAgICBbY2xhc3MuY2FsLWRyYWdnYWJsZV09XCJcbiAgICAgICAgICAgICAgYWxsRGF5RXZlbnQuZXZlbnQuZHJhZ2dhYmxlICYmIGFsbERheUV2ZW50UmVzaXplcy5zaXplID09PSAwXG4gICAgICAgICAgICBcIlxuICAgICAgICAgICAgW2NsYXNzLmNhbC1zdGFydHMtd2l0aGluLXdlZWtdPVwiIWFsbERheUV2ZW50LnN0YXJ0c0JlZm9yZVdlZWtcIlxuICAgICAgICAgICAgW2NsYXNzLmNhbC1lbmRzLXdpdGhpbi13ZWVrXT1cIiFhbGxEYXlFdmVudC5lbmRzQWZ0ZXJXZWVrXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cImFsbERheUV2ZW50LmV2ZW50Py5jc3NDbGFzc1wiXG4gICAgICAgICAgICBbc3R5bGUud2lkdGguJV09XCIoMTAwIC8gZGF5cy5sZW5ndGgpICogYWxsRGF5RXZlbnQuc3BhblwiXG4gICAgICAgICAgICBbc3R5bGUubWFyZ2luTGVmdC4lXT1cIigxMDAgLyBkYXlzLmxlbmd0aCkgKiBhbGxEYXlFdmVudC5vZmZzZXRcIlxuICAgICAgICAgICAgbXdsUmVzaXphYmxlXG4gICAgICAgICAgICBbcmVzaXplU25hcEdyaWRdPVwieyBsZWZ0OiBkYXlDb2x1bW5XaWR0aCwgcmlnaHQ6IGRheUNvbHVtbldpZHRoIH1cIlxuICAgICAgICAgICAgW3ZhbGlkYXRlUmVzaXplXT1cInZhbGlkYXRlUmVzaXplXCJcbiAgICAgICAgICAgIChyZXNpemVTdGFydCk9XCJcbiAgICAgICAgICAgICAgYWxsRGF5RXZlbnRSZXNpemVTdGFydGVkKGV2ZW50Um93Q29udGFpbmVyLCBhbGxEYXlFdmVudCwgJGV2ZW50KVxuICAgICAgICAgICAgXCJcbiAgICAgICAgICAgIChyZXNpemluZyk9XCJcbiAgICAgICAgICAgICAgYWxsRGF5RXZlbnRSZXNpemluZyhhbGxEYXlFdmVudCwgJGV2ZW50LCBkYXlDb2x1bW5XaWR0aClcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAocmVzaXplRW5kKT1cImFsbERheUV2ZW50UmVzaXplRW5kZWQoYWxsRGF5RXZlbnQpXCJcbiAgICAgICAgICAgIG13bERyYWdnYWJsZVxuICAgICAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgICAgIFtkcm9wRGF0YV09XCJ7IGV2ZW50OiBhbGxEYXlFdmVudC5ldmVudCwgY2FsZW5kYXJJZDogY2FsZW5kYXJJZCB9XCJcbiAgICAgICAgICAgIFtkcmFnQXhpc109XCJ7XG4gICAgICAgICAgICAgIHg6IGFsbERheUV2ZW50LmV2ZW50LmRyYWdnYWJsZSAmJiBhbGxEYXlFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMCxcbiAgICAgICAgICAgICAgeTpcbiAgICAgICAgICAgICAgICAhc25hcERyYWdnZWRFdmVudHMgJiZcbiAgICAgICAgICAgICAgICBhbGxEYXlFdmVudC5ldmVudC5kcmFnZ2FibGUgJiZcbiAgICAgICAgICAgICAgICBhbGxEYXlFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMFxuICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICBbZHJhZ1NuYXBHcmlkXT1cInNuYXBEcmFnZ2VkRXZlbnRzID8geyB4OiBkYXlDb2x1bW5XaWR0aCB9IDoge31cIlxuICAgICAgICAgICAgW3ZhbGlkYXRlRHJhZ109XCJ2YWxpZGF0ZURyYWdcIlxuICAgICAgICAgICAgW3RvdWNoU3RhcnRMb25nUHJlc3NdPVwieyBkZWxheTogMzAwLCBkZWx0YTogMzAgfVwiXG4gICAgICAgICAgICAoZHJhZ1N0YXJ0KT1cImRyYWdTdGFydGVkKGV2ZW50Um93Q29udGFpbmVyLCBldmVudClcIlxuICAgICAgICAgICAgKGRyYWdnaW5nKT1cImFsbERheUV2ZW50RHJhZ01vdmUoKVwiXG4gICAgICAgICAgICAoZHJhZ0VuZCk9XCJkcmFnRW5kZWQoYWxsRGF5RXZlbnQsICRldmVudCwgZGF5Q29sdW1uV2lkdGgpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzPVwiY2FsLXJlc2l6ZS1oYW5kbGUgY2FsLXJlc2l6ZS1oYW5kbGUtYmVmb3JlLXN0YXJ0XCJcbiAgICAgICAgICAgICAgKm5nSWY9XCJcbiAgICAgICAgICAgICAgICBhbGxEYXlFdmVudC5ldmVudD8ucmVzaXphYmxlPy5iZWZvcmVTdGFydCAmJlxuICAgICAgICAgICAgICAgICFhbGxEYXlFdmVudC5zdGFydHNCZWZvcmVXZWVrXG4gICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgIG13bFJlc2l6ZUhhbmRsZVxuICAgICAgICAgICAgICBbcmVzaXplRWRnZXNdPVwieyBsZWZ0OiB0cnVlIH1cIlxuICAgICAgICAgICAgPjwvZGl2PlxuICAgICAgICAgICAgPG13bC1jYWxlbmRhci13ZWVrLXZpZXctZXZlbnRcbiAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxuICAgICAgICAgICAgICBbaG91clNlZ21lbnRIZWlnaHRdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICBbd2Vla0V2ZW50XT1cImFsbERheUV2ZW50XCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXG4gICAgICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBBcHBlbmRUb0JvZHldPVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICAgICAgICAgIFt0b29sdGlwRGVsYXldPVwidG9vbHRpcERlbGF5XCJcbiAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImV2ZW50VGVtcGxhdGVcIlxuICAgICAgICAgICAgICBbZXZlbnRUaXRsZVRlbXBsYXRlXT1cImV2ZW50VGl0bGVUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFtldmVudEFjdGlvbnNUZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFtkYXlzSW5XZWVrXT1cImRheXNJbldlZWtcIlxuICAgICAgICAgICAgICAoZXZlbnRDbGlja2VkKT1cIlxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2tlZC5lbWl0KHtcbiAgICAgICAgICAgICAgICAgIGV2ZW50OiBhbGxEYXlFdmVudC5ldmVudCxcbiAgICAgICAgICAgICAgICAgIHNvdXJjZUV2ZW50OiAkZXZlbnQuc291cmNlRXZlbnRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9td2wtY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzcz1cImNhbC1yZXNpemUtaGFuZGxlIGNhbC1yZXNpemUtaGFuZGxlLWFmdGVyLWVuZFwiXG4gICAgICAgICAgICAgICpuZ0lmPVwiXG4gICAgICAgICAgICAgICAgYWxsRGF5RXZlbnQuZXZlbnQ/LnJlc2l6YWJsZT8uYWZ0ZXJFbmQgJiZcbiAgICAgICAgICAgICAgICAhYWxsRGF5RXZlbnQuZW5kc0FmdGVyV2Vla1xuICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICBtd2xSZXNpemVIYW5kbGVcbiAgICAgICAgICAgICAgW3Jlc2l6ZUVkZ2VzXT1cInsgcmlnaHQ6IHRydWUgfVwiXG4gICAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiY2FsLXRpbWUtZXZlbnRzXCJcbiAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgIChkcmFnRW50ZXIpPVwiZHJhZ0VudGVyKCd0aW1lJylcIlxuICAgICAgICAoZHJhZ0xlYXZlKT1cImRyYWdMZWF2ZSgndGltZScpXCJcbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzPVwiY2FsLXRpbWUtbGFiZWwtY29sdW1uXCJcbiAgICAgICAgICAqbmdJZj1cInZpZXcuaG91ckNvbHVtbnMubGVuZ3RoID4gMCAmJiBkYXlzSW5XZWVrICE9PSAxXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICpuZ0Zvcj1cIlxuICAgICAgICAgICAgICBsZXQgaG91ciBvZiB2aWV3LmhvdXJDb2x1bW5zWzBdLmhvdXJzO1xuICAgICAgICAgICAgICB0cmFja0J5OiB0cmFja0J5SG91cjtcbiAgICAgICAgICAgICAgbGV0IG9kZCA9IG9kZFxuICAgICAgICAgICAgXCJcbiAgICAgICAgICAgIGNsYXNzPVwiY2FsLWhvdXJcIlxuICAgICAgICAgICAgW2NsYXNzLmNhbC1ob3VyLW9kZF09XCJvZGRcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxtd2wtY2FsZW5kYXItd2Vlay12aWV3LWhvdXItc2VnbWVudFxuICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgc2VnbWVudCBvZiBob3VyLnNlZ21lbnRzOyB0cmFja0J5OiB0cmFja0J5SG91clNlZ21lbnRcIlxuICAgICAgICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cImhvdXJTZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgICAgICAgW3NlZ21lbnRdPVwic2VnbWVudFwiXG4gICAgICAgICAgICAgIFtzZWdtZW50SGVpZ2h0XT1cImhvdXJTZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxuICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiaG91clNlZ21lbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFtpc1RpbWVMYWJlbF09XCJ0cnVlXCJcbiAgICAgICAgICAgICAgW2RheXNJbldlZWtdPVwiZGF5c0luV2Vla1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctaG91ci1zZWdtZW50PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzPVwiY2FsLWRheS1jb2x1bW5zXCJcbiAgICAgICAgICBbY2xhc3MuY2FsLXJlc2l6ZS1hY3RpdmVdPVwidGltZUV2ZW50UmVzaXplcy5zaXplID4gMFwiXG4gICAgICAgICAgI2RheUNvbHVtbnNcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzPVwiY2FsLWRheS1jb2x1bW5cIlxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGNvbHVtbiBvZiB2aWV3LmhvdXJDb2x1bW5zOyB0cmFja0J5OiB0cmFja0J5SG91ckNvbHVtblwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPG13bC1jYWxlbmRhci13ZWVrLXZpZXctY3VycmVudC10aW1lLW1hcmtlclxuICAgICAgICAgICAgICBbY29sdW1uRGF0ZV09XCJjb2x1bW4uZGF0ZVwiXG4gICAgICAgICAgICAgIFtkYXlTdGFydEhvdXJdPVwiZGF5U3RhcnRIb3VyXCJcbiAgICAgICAgICAgICAgW2RheVN0YXJ0TWludXRlXT1cImRheVN0YXJ0TWludXRlXCJcbiAgICAgICAgICAgICAgW2RheUVuZEhvdXJdPVwiZGF5RW5kSG91clwiXG4gICAgICAgICAgICAgIFtkYXlFbmRNaW51dGVdPVwiZGF5RW5kTWludXRlXCJcbiAgICAgICAgICAgICAgW2hvdXJTZWdtZW50c109XCJob3VyU2VnbWVudHNcIlxuICAgICAgICAgICAgICBbaG91clNlZ21lbnRIZWlnaHRdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiY3VycmVudFRpbWVNYXJrZXJUZW1wbGF0ZVwiXG4gICAgICAgICAgICA+PC9td2wtY2FsZW5kYXItd2Vlay12aWV3LWN1cnJlbnQtdGltZS1tYXJrZXI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLWV2ZW50cy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICpuZ0Zvcj1cIlxuICAgICAgICAgICAgICAgICAgbGV0IHRpbWVFdmVudCBvZiBjb2x1bW4uZXZlbnRzO1xuICAgICAgICAgICAgICAgICAgdHJhY2tCeTogdHJhY2tCeVdlZWtUaW1lRXZlbnRcbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgICNldmVudFxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50LWNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgaWQ9XCJjYWwtZXZlbnQte3sgdGltZUV2ZW50LmV2ZW50LmlkIH19XCJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWRyYWdnYWJsZV09XCJcbiAgICAgICAgICAgICAgICAgIHRpbWVFdmVudC5ldmVudC5kcmFnZ2FibGUgJiYgdGltZUV2ZW50UmVzaXplcy5zaXplID09PSAwXG4gICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLXN0YXJ0cy13aXRoaW4tZGF5XT1cIiF0aW1lRXZlbnQuc3RhcnRzQmVmb3JlRGF5XCJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FsLWVuZHMtd2l0aGluLWRheV09XCIhdGltZUV2ZW50LmVuZHNBZnRlckRheVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwidGltZUV2ZW50LmV2ZW50LmNzc0NsYXNzXCJcbiAgICAgICAgICAgICAgICBbaGlkZGVuXT1cInRpbWVFdmVudC5oZWlnaHQgPT09IDAgJiYgdGltZUV2ZW50LndpZHRoID09PSAwXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUudG9wLnB4XT1cInRpbWVFdmVudC50b3BcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwidGltZUV2ZW50LmhlaWdodFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmxlZnQuJV09XCJ0aW1lRXZlbnQubGVmdFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLiVdPVwidGltZUV2ZW50LndpZHRoXCJcbiAgICAgICAgICAgICAgICBtd2xSZXNpemFibGVcbiAgICAgICAgICAgICAgICBbcmVzaXplU25hcEdyaWRdPVwie1xuICAgICAgICAgICAgICAgICAgbGVmdDogZGF5Q29sdW1uV2lkdGgsXG4gICAgICAgICAgICAgICAgICByaWdodDogZGF5Q29sdW1uV2lkdGgsXG4gICAgICAgICAgICAgICAgICB0b3A6IGV2ZW50U25hcFNpemUgfHwgaG91clNlZ21lbnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICBib3R0b206IGV2ZW50U25hcFNpemUgfHwgaG91clNlZ21lbnRIZWlnaHRcbiAgICAgICAgICAgICAgICB9XCJcbiAgICAgICAgICAgICAgICBbdmFsaWRhdGVSZXNpemVdPVwidmFsaWRhdGVSZXNpemVcIlxuICAgICAgICAgICAgICAgIFthbGxvd05lZ2F0aXZlUmVzaXplc109XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAocmVzaXplU3RhcnQpPVwiXG4gICAgICAgICAgICAgICAgICB0aW1lRXZlbnRSZXNpemVTdGFydGVkKGRheUNvbHVtbnMsIHRpbWVFdmVudCwgJGV2ZW50KVxuICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgKHJlc2l6aW5nKT1cInRpbWVFdmVudFJlc2l6aW5nKHRpbWVFdmVudCwgJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKHJlc2l6ZUVuZCk9XCJ0aW1lRXZlbnRSZXNpemVFbmRlZCh0aW1lRXZlbnQpXCJcbiAgICAgICAgICAgICAgICBtd2xEcmFnZ2FibGVcbiAgICAgICAgICAgICAgICBkcmFnQWN0aXZlQ2xhc3M9XCJjYWwtZHJhZy1hY3RpdmVcIlxuICAgICAgICAgICAgICAgIFtkcm9wRGF0YV09XCJ7IGV2ZW50OiB0aW1lRXZlbnQuZXZlbnQsIGNhbGVuZGFySWQ6IGNhbGVuZGFySWQgfVwiXG4gICAgICAgICAgICAgICAgW2RyYWdBeGlzXT1cIntcbiAgICAgICAgICAgICAgICAgIHg6IHRpbWVFdmVudC5ldmVudC5kcmFnZ2FibGUgJiYgdGltZUV2ZW50UmVzaXplcy5zaXplID09PSAwLFxuICAgICAgICAgICAgICAgICAgeTogdGltZUV2ZW50LmV2ZW50LmRyYWdnYWJsZSAmJiB0aW1lRXZlbnRSZXNpemVzLnNpemUgPT09IDBcbiAgICAgICAgICAgICAgICB9XCJcbiAgICAgICAgICAgICAgICBbZHJhZ1NuYXBHcmlkXT1cIlxuICAgICAgICAgICAgICAgICAgc25hcERyYWdnZWRFdmVudHNcbiAgICAgICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBkYXlDb2x1bW5XaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IGV2ZW50U25hcFNpemUgfHwgaG91clNlZ21lbnRIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDoge31cbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgIFt0b3VjaFN0YXJ0TG9uZ1ByZXNzXT1cInsgZGVsYXk6IDMwMCwgZGVsdGE6IDMwIH1cIlxuICAgICAgICAgICAgICAgIFtnaG9zdERyYWdFbmFibGVkXT1cIiFzbmFwRHJhZ2dlZEV2ZW50c1wiXG4gICAgICAgICAgICAgICAgW2dob3N0RWxlbWVudFRlbXBsYXRlXT1cIndlZWtFdmVudFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICBbdmFsaWRhdGVEcmFnXT1cInZhbGlkYXRlRHJhZ1wiXG4gICAgICAgICAgICAgICAgKGRyYWdTdGFydCk9XCJkcmFnU3RhcnRlZChkYXlDb2x1bW5zLCBldmVudCwgdGltZUV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKGRyYWdnaW5nKT1cImRyYWdNb3ZlKHRpbWVFdmVudCwgJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKGRyYWdFbmQpPVwiZHJhZ0VuZGVkKHRpbWVFdmVudCwgJGV2ZW50LCBkYXlDb2x1bW5XaWR0aCwgdHJ1ZSlcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJjYWwtcmVzaXplLWhhbmRsZSBjYWwtcmVzaXplLWhhbmRsZS1iZWZvcmUtc3RhcnRcIlxuICAgICAgICAgICAgICAgICAgKm5nSWY9XCJcbiAgICAgICAgICAgICAgICAgICAgdGltZUV2ZW50LmV2ZW50Py5yZXNpemFibGU/LmJlZm9yZVN0YXJ0ICYmXG4gICAgICAgICAgICAgICAgICAgICF0aW1lRXZlbnQuc3RhcnRzQmVmb3JlRGF5XG4gICAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgICAgbXdsUmVzaXplSGFuZGxlXG4gICAgICAgICAgICAgICAgICBbcmVzaXplRWRnZXNdPVwie1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIndlZWtFdmVudFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICA+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI3dlZWtFdmVudFRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgPG13bC1jYWxlbmRhci13ZWVrLXZpZXctZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxuICAgICAgICAgICAgICAgICAgICBbaG91clNlZ21lbnRIZWlnaHRdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICAgICAgICBbd2Vla0V2ZW50XT1cInRpbWVFdmVudFwiXG4gICAgICAgICAgICAgICAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cInRvb2x0aXBQbGFjZW1lbnRcIlxuICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgIFt0b29sdGlwQXBwZW5kVG9Cb2R5XT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cIlxuICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXBEaXNhYmxlZCB8fCBkcmFnQWN0aXZlIHx8IHRpbWVFdmVudFJlc2l6ZXMuc2l6ZSA+IDBcbiAgICAgICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICAgICAgW3Rvb2x0aXBEZWxheV09XCJ0b29sdGlwRGVsYXlcIlxuICAgICAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgIFtldmVudFRpdGxlVGVtcGxhdGVdPVwiZXZlbnRUaXRsZVRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgW2V2ZW50QWN0aW9uc1RlbXBsYXRlXT1cImV2ZW50QWN0aW9uc1RlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgW2NvbHVtbl09XCJjb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICBbZGF5c0luV2Vla109XCJkYXlzSW5XZWVrXCJcbiAgICAgICAgICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJcbiAgICAgICAgICAgICAgICAgICAgICBldmVudENsaWNrZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudDogdGltZUV2ZW50LmV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRXZlbnQ6ICRldmVudC5zb3VyY2VFdmVudFxuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctZXZlbnQ+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzcz1cImNhbC1yZXNpemUtaGFuZGxlIGNhbC1yZXNpemUtaGFuZGxlLWFmdGVyLWVuZFwiXG4gICAgICAgICAgICAgICAgICAqbmdJZj1cIlxuICAgICAgICAgICAgICAgICAgICB0aW1lRXZlbnQuZXZlbnQ/LnJlc2l6YWJsZT8uYWZ0ZXJFbmQgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRpbWVFdmVudC5lbmRzQWZ0ZXJEYXlcbiAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgICBtd2xSZXNpemVIYW5kbGVcbiAgICAgICAgICAgICAgICAgIFtyZXNpemVFZGdlc109XCJ7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAqbmdGb3I9XCJcbiAgICAgICAgICAgICAgICBsZXQgaG91ciBvZiBjb2x1bW4uaG91cnM7XG4gICAgICAgICAgICAgICAgdHJhY2tCeTogdHJhY2tCeUhvdXI7XG4gICAgICAgICAgICAgICAgbGV0IG9kZCA9IG9kZFxuICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICBjbGFzcz1cImNhbC1ob3VyXCJcbiAgICAgICAgICAgICAgW2NsYXNzLmNhbC1ob3VyLW9kZF09XCJvZGRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8bXdsLWNhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnRcbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJcbiAgICAgICAgICAgICAgICAgIGxldCBzZWdtZW50IG9mIGhvdXIuc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgICB0cmFja0J5OiB0cmFja0J5SG91clNlZ21lbnRcbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICAgIFtzZWdtZW50XT1cInNlZ21lbnRcIlxuICAgICAgICAgICAgICAgIFtzZWdtZW50SGVpZ2h0XT1cImhvdXJTZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImhvdXJTZWdtZW50VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFtkYXlzSW5XZWVrXT1cImRheXNJbldlZWtcIlxuICAgICAgICAgICAgICAgIChtd2xDbGljayk9XCJcbiAgICAgICAgICAgICAgICAgIGhvdXJTZWdtZW50Q2xpY2tlZC5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogc2VnbWVudC5kYXRlLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VFdmVudDogJGV2ZW50XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgW2NsaWNrTGlzdGVuZXJEaXNhYmxlZF09XCJcbiAgICAgICAgICAgICAgICAgIGhvdXJTZWdtZW50Q2xpY2tlZC5vYnNlcnZlcnMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICBtd2xEcm9wcGFibGVcbiAgICAgICAgICAgICAgICBbZHJhZ092ZXJDbGFzc109XCJcbiAgICAgICAgICAgICAgICAgICFkcmFnQWN0aXZlIHx8ICFzbmFwRHJhZ2dlZEV2ZW50cyA/ICdjYWwtZHJhZy1vdmVyJyA6IG51bGxcbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgIGRyYWdBY3RpdmVDbGFzcz1cImNhbC1kcmFnLWFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgKGRyb3ApPVwiZXZlbnREcm9wcGVkKCRldmVudCwgc2VnbWVudC5kYXRlLCBmYWxzZSlcIlxuICAgICAgICAgICAgICAgIChkcmFnRW50ZXIpPVwiZGF0ZURyYWdFbnRlcihzZWdtZW50LmRhdGUpXCJcbiAgICAgICAgICAgICAgICBbaXNUaW1lTGFiZWxdPVwiZGF5c0luV2VlayA9PT0gMVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPC9td2wtY2FsZW5kYXItd2Vlay12aWV3LWhvdXItc2VnbWVudD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cImNhbC10aW1lLWxhYmVsLWNvbHVtblwiIHN0eWxlPVwiYm9yZGVyLWxlZnQ6IHRoaW4gc29saWQgI2UxZTFlMTtcIlxuICAgICAgICAgICpuZ0lmPVwidmlldy5ob3VyQ29sdW1ucy5sZW5ndGggPiAwICYmIGRheXNJbldlZWsgIT09IDFcIlxuICAgICAgICA+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgKm5nRm9yPVwiXG4gICAgICAgICAgICAgIGxldCBob3VyIG9mIHZpZXcuaG91ckNvbHVtbnNbMF0uaG91cnM7XG4gICAgICAgICAgICAgIHRyYWNrQnk6IHRyYWNrQnlIb3VyO1xuICAgICAgICAgICAgICBsZXQgb2RkID0gb2RkXG4gICAgICAgICAgICBcIlxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtaG91clwiXG4gICAgICAgICAgICBbY2xhc3MuY2FsLWhvdXItb2RkXT1cIm9kZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPG13bC1jYWxlbmRhci13ZWVrLXZpZXctaG91ci1zZWdtZW50XG4gICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBzZWdtZW50IG9mIGhvdXIuc2VnbWVudHM7IHRyYWNrQnk6IHRyYWNrQnlIb3VyU2VnbWVudFwiXG4gICAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICBbc2VnbWVudF09XCJzZWdtZW50XCJcbiAgICAgICAgICAgICAgW3NlZ21lbnRIZWlnaHRdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJob3VyU2VnbWVudFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgW2lzVGltZUxhYmVsXT1cImZhbHNlXCJcbiAgICAgICAgICAgICAgW2RheXNJbldlZWtdPVwiZGF5c0luV2Vla1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctaG91ci1zZWdtZW50PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB2aWV3IGRhdGVcbiAgICovXG4gIEBJbnB1dCgpIHZpZXdEYXRlOiBEYXRlO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBldmVudHMgdG8gZGlzcGxheSBvbiB2aWV3XG4gICAqIFRoZSBzY2hlbWEgaXMgYXZhaWxhYmxlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0bGV3aXM5Mi9jYWxlbmRhci11dGlscy9ibG9iL2M1MTY4OTk4NWY1OWEyNzE5NDBlMzBiYzRlMmM0ZTFmZWUzZmNiNWMvc3JjL2NhbGVuZGFyVXRpbHMudHMjTDQ5LUw2M1xuICAgKi9cbiAgQElucHV0KCkgZXZlbnRzOiBNQ0V2ZW50W10gPSBbXTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZGF5IGluZGV4ZXMgKDAgPSBzdW5kYXksIDEgPSBtb25kYXkgZXRjKSB0aGF0IHdpbGwgYmUgaGlkZGVuIG9uIHRoZSB2aWV3XG4gICAqL1xuICBASW5wdXQoKSBleGNsdWRlRGF5czogbnVtYmVyW10gPSBbXTtcblxuICAvKipcbiAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IHdoZW4gZW1pdHRlZCBvbiB3aWxsIHJlLXJlbmRlciB0aGUgY3VycmVudCB2aWV3XG4gICAqL1xuICBASW5wdXQoKSByZWZyZXNoOiBTdWJqZWN0PGFueT47XG5cbiAgLyoqXG4gICAqIFRoZSBsb2NhbGUgdXNlZCB0byBmb3JtYXQgZGF0ZXNcbiAgICovXG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHBsYWNlbWVudCBvZiB0aGUgZXZlbnQgdG9vbHRpcFxuICAgKi9cbiAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYXV0byc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgdGhlIGV2ZW50IHRvb2x0aXBzXG4gICAqL1xuICBASW5wdXQoKSB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXBwZW5kIHRvb2x0aXBzIHRvIHRoZSBib2R5IG9yIG5leHQgdG8gdGhlIHRyaWdnZXIgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCkgdG9vbHRpcEFwcGVuZFRvQm9keTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIHRoZSB0b29sdGlwIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIG5vdCBwcm92aWRlZCB0aGUgdG9vbHRpcFxuICAgKiB3aWxsIGJlIGRpc3BsYXllZCBpbW1lZGlhdGVseS5cbiAgICovXG4gIEBJbnB1dCgpIHRvb2x0aXBEZWxheTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGFydCBudW1iZXIgb2YgdGhlIHdlZWsuXG4gICAqIFRoaXMgaXMgaWdub3JlZCB3aGVuIHRoZSBgZGF5c0luV2Vla2AgaW5wdXQgaXMgYWxzbyBzZXQgYXMgdGhlIGB2aWV3RGF0ZWAgd2lsbCBiZSB1c2VkIGFzIHRoZSBzdGFydCBvZiB0aGUgd2VlayBpbnN0ZWFkLlxuICAgKiBOb3RlLCB5b3Ugc2hvdWxkIGFsc28gcGFzcyB0aGlzIHRvIHRoZSBjYWxlbmRhciB0aXRsZSBwaXBlIHNvIGl0IHNob3dzIHRoZSBzYW1lIGRheXM6IHt7IHZpZXdEYXRlIHwgY2FsZW5kYXJEYXRlOih2aWV3ICsgJ1ZpZXdUaXRsZScpOmxvY2FsZTp3ZWVrU3RhcnRzT24gfX1cbiAgICovXG4gIEBJbnB1dCgpIHdlZWtTdGFydHNPbjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgdG8gcmVwbGFjZSB0aGUgaGVhZGVyXG4gICAqL1xuICBASW5wdXQoKSBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB3ZWVrIHZpZXcgZXZlbnRzXG4gICAqL1xuICBASW5wdXQoKSBldmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IHRpdGxlc1xuICAgKi9cbiAgQElucHV0KCkgZXZlbnRUaXRsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IGFjdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpIGV2ZW50QWN0aW9uc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlY2lzaW9uIHRvIGRpc3BsYXkgZXZlbnRzLlxuICAgKiBgZGF5c2Agd2lsbCByb3VuZCBldmVudCBzdGFydCBhbmQgZW5kIGRhdGVzIHRvIHRoZSBuZWFyZXN0IGRheSBhbmQgYG1pbnV0ZXNgIHdpbGwgbm90IGRvIHRoaXMgcm91bmRpbmdcbiAgICovXG4gIEBJbnB1dCgpIHByZWNpc2lvbjogJ2RheXMnIHwgJ21pbnV0ZXMnID0gJ2RheXMnO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBkYXkgaW5kZXhlcyAoMCA9IHN1bmRheSwgMSA9IG1vbmRheSBldGMpIHRoYXQgaW5kaWNhdGUgd2hpY2ggZGF5cyBhcmUgd2Vla2VuZHNcbiAgICovXG4gIEBJbnB1dCgpIHdlZWtlbmREYXlzOiBudW1iZXJbXTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBzbmFwIGV2ZW50cyB0byBhIGdyaWQgd2hlbiBkcmFnZ2luZ1xuICAgKi9cbiAgQElucHV0KCkgc25hcERyYWdnZWRFdmVudHM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHNlZ21lbnRzIGluIGFuIGhvdXIuIE11c3QgYmUgPD0gNlxuICAgKi9cbiAgQElucHV0KCkgaG91clNlZ21lbnRzOiBudW1iZXIgPSAyO1xuXG4gIC8qKlxuICAgKiBUaGUgaGVpZ2h0IGluIHBpeGVscyBvZiBlYWNoIGhvdXIgc2VnbWVudFxuICAgKi9cbiAgQElucHV0KCkgaG91clNlZ21lbnRIZWlnaHQ6IG51bWJlciA9IDMwO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IHN0YXJ0IGhvdXJzIGluIDI0IGhvdXIgdGltZS4gTXVzdCBiZSAwLTIzXG4gICAqL1xuICBASW5wdXQoKSBkYXlTdGFydEhvdXI6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgc3RhcnQgbWludXRlcy4gTXVzdCBiZSAwLTU5XG4gICAqL1xuICBASW5wdXQoKSBkYXlTdGFydE1pbnV0ZTogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogVGhlIGRheSBlbmQgaG91cnMgaW4gMjQgaG91ciB0aW1lLiBNdXN0IGJlIDAtMjNcbiAgICovXG4gIEBJbnB1dCgpIGRheUVuZEhvdXI6IG51bWJlciA9IDIzO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IGVuZCBtaW51dGVzLiBNdXN0IGJlIDAtNTlcbiAgICovXG4gIEBJbnB1dCgpIGRheUVuZE1pbnV0ZTogbnVtYmVyID0gNTk7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBob3VyIHNlZ21lbnRcbiAgICovXG4gIEBJbnB1dCgpIGhvdXJTZWdtZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFRoZSBncmlkIHNpemUgdG8gc25hcCByZXNpemluZyBhbmQgZHJhZ2dpbmcgb2YgaG91cmx5IGV2ZW50cyB0b1xuICAgKi9cbiAgQElucHV0KCkgZXZlbnRTbmFwU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIHRoZSBhbGwgZGF5IGV2ZW50cyBsYWJlbCB0ZXh0XG4gICAqL1xuICBASW5wdXQoKSBhbGxEYXlFdmVudHNMYWJlbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgaW4gYSB3ZWVrLiBDYW4gYmUgdXNlZCB0byBjcmVhdGUgYSBzaG9ydGVyIG9yIGxvbmdlciB3ZWVrIHZpZXcuXG4gICAqIFRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsgd2lsbCBhbHdheXMgYmUgdGhlIGB2aWV3RGF0ZWAgYW5kIGB3ZWVrU3RhcnRzT25gIGlmIHNldCB3aWxsIGJlIGlnbm9yZWRcbiAgICovXG4gIEBJbnB1dCgpIGRheXNJbldlZWs6IG51bWJlcjtcblxuICAvKipcbiAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB0aGUgY3VycmVudCB0aW1lIG1hcmtlclxuICAgKi9cbiAgQElucHV0KCkgY3VycmVudFRpbWVNYXJrZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSBoZWFkZXIgd2VlayBkYXkgaXMgY2xpY2tlZC4gQWRkaW5nIGEgYGNzc0NsYXNzYCBwcm9wZXJ0eSBvbiBgJGV2ZW50LmRheWAgd2lsbCBhZGQgdGhhdCBjbGFzcyB0byB0aGUgaGVhZGVyIGVsZW1lbnRcbiAgICovXG4gIEBPdXRwdXQoKSBkYXlIZWFkZXJDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgZGF5OiBNQ1dlZWtEYXk7XG4gICAgc291cmNlRXZlbnQ6IE1vdXNlRXZlbnQ7XG4gIH0+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBldmVudCB0aXRsZSBpcyBjbGlja2VkXG4gICAqL1xuICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgZXZlbnQ6IE1DRXZlbnQ7XG4gICAgc291cmNlRXZlbnQ6IE1vdXNlRXZlbnQgfCBhbnk7XG4gIH0+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGFuIGV2ZW50IGlzIHJlc2l6ZWQgb3IgZHJhZ2dlZCBhbmQgZHJvcHBlZFxuICAgKi9cbiAgQE91dHB1dCgpIGV2ZW50VGltZXNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxcbiAgICBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRcbiAgPigpO1xuXG4gIC8qKlxuICAgKiBBbiBvdXRwdXQgdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgcmVuZGVyZWQgZm9yIHRoZSBjdXJyZW50IHdlZWsuXG4gICAqIElmIHlvdSBhZGQgdGhlIGBjc3NDbGFzc2AgcHJvcGVydHkgdG8gYSBkYXkgaW4gdGhlIGhlYWRlciBpdCB3aWxsIGFkZCB0aGF0IGNsYXNzIHRvIHRoZSBjZWxsIGVsZW1lbnQgaW4gdGhlIHRlbXBsYXRlXG4gICAqL1xuICBAT3V0cHV0KCkgYmVmb3JlVmlld1JlbmRlciA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgQ2FsZW5kYXJXZWVrVmlld0JlZm9yZVJlbmRlckV2ZW50XG4gID4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYW4gaG91ciBzZWdtZW50IGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKSBob3VyU2VnbWVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBkYXRlOiBEYXRlO1xuICAgIHNvdXJjZUV2ZW50OiBNb3VzZUV2ZW50O1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkYXlzOiBNQ1dlZWtEYXlbXTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdmlldzogTUNXZWVrVmlldztcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcmVmcmVzaFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBhbGxEYXlFdmVudFJlc2l6ZXM6IE1hcDxcbiAgICBNQ1dlZWtWaWV3QWxsRGF5RXZlbnQsXG4gICAgV2Vla1ZpZXdBbGxEYXlFdmVudFJlc2l6ZVxuICA+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0aW1lRXZlbnRSZXNpemVzOiBNYXA8TUNFdmVudCwgUmVzaXplRXZlbnQ+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBldmVudERyYWdFbnRlckJ5VHlwZSA9IHtcbiAgICBhbGxEYXk6IDAsXG4gICAgdGltZTogMCxcbiAgfTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZHJhZ0FjdGl2ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkcmFnQWxyZWFkeU1vdmVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHZhbGlkYXRlRHJhZzogVmFsaWRhdGVEcmFnO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB2YWxpZGF0ZVJlc2l6ZTogKGFyZ3M6IGFueSkgPT4gYm9vbGVhbjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZGF5Q29sdW1uV2lkdGg6IG51bWJlcjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY2FsZW5kYXJJZCA9IFN5bWJvbCgnYW5ndWxhciBjYWxlbmRhciB3ZWVrIHZpZXcgaWQnKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbGFzdERyYWdnZWRFdmVudDogTUNFdmVudDtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlID0gdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5SG91clNlZ21lbnQgPSB0cmFja0J5SG91clNlZ21lbnQ7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRyYWNrQnlIb3VyID0gdHJhY2tCeUhvdXI7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRyYWNrQnlXZWVrQWxsRGF5RXZlbnQgPSB0cmFja0J5V2Vla0FsbERheUV2ZW50O1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5V2Vla1RpbWVFdmVudCA9IHRyYWNrQnlXZWVrVGltZUV2ZW50O1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwcml2YXRlIGxhc3REcmFnRW50ZXJEYXRlOiBEYXRlO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgdXRpbHM6IENhbGVuZGFyVXRpbHMsXG4gICAgQEluamVjdChMT0NBTEVfSUQpIGxvY2FsZTogc3RyaW5nLFxuICAgIHByb3RlY3RlZCBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXJcbiAgKSB7XG4gICAgdGhpcy5sb2NhbGUgPSBsb2NhbGU7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeUhvdXJDb2x1bW4gPSAoaW5kZXg6IG51bWJlciwgY29sdW1uOiBNQ1dlZWtWaWV3SG91ckNvbHVtbikgPT5cbiAgICBjb2x1bW4uaG91cnNbMF0gPyBjb2x1bW4uaG91cnNbMF0uc2VnbWVudHNbMF0uZGF0ZS50b0lTT1N0cmluZygpIDogY29sdW1uO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5SWQgPSAoaW5kZXg6IG51bWJlciwgcm93OiBNQ1dlZWtWaWV3QWxsRGF5RXZlbnRSb3cpID0+IHJvdy5pZDtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVmcmVzaCkge1xuICAgICAgdGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5yZWZyZXNoLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcmVzaEFsbCgpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCByZWZyZXNoSGVhZGVyID1cbiAgICAgIGNoYW5nZXMudmlld0RhdGUgfHxcbiAgICAgIGNoYW5nZXMuZXhjbHVkZURheXMgfHxcbiAgICAgIGNoYW5nZXMud2Vla2VuZERheXMgfHxcbiAgICAgIGNoYW5nZXMuZGF5c0luV2VlayB8fFxuICAgICAgY2hhbmdlcy53ZWVrU3RhcnRzT247XG5cbiAgICBjb25zdCByZWZyZXNoQm9keSA9XG4gICAgICBjaGFuZ2VzLnZpZXdEYXRlIHx8XG4gICAgICBjaGFuZ2VzLmRheVN0YXJ0SG91ciB8fFxuICAgICAgY2hhbmdlcy5kYXlTdGFydE1pbnV0ZSB8fFxuICAgICAgY2hhbmdlcy5kYXlFbmRIb3VyIHx8XG4gICAgICBjaGFuZ2VzLmRheUVuZE1pbnV0ZSB8fFxuICAgICAgY2hhbmdlcy5ob3VyU2VnbWVudHMgfHxcbiAgICAgIGNoYW5nZXMud2Vla1N0YXJ0c09uIHx8XG4gICAgICBjaGFuZ2VzLndlZWtlbmREYXlzIHx8XG4gICAgICBjaGFuZ2VzLmV4Y2x1ZGVEYXlzIHx8XG4gICAgICBjaGFuZ2VzLmhvdXJTZWdtZW50SGVpZ2h0IHx8XG4gICAgICBjaGFuZ2VzLmV2ZW50cyB8fFxuICAgICAgY2hhbmdlcy5kYXlzSW5XZWVrO1xuXG4gICAgaWYgKHJlZnJlc2hIZWFkZXIpIHtcbiAgICAgIHRoaXMucmVmcmVzaEhlYWRlcigpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmV2ZW50cykge1xuICAgICAgdmFsaWRhdGVFdmVudHModGhpcy5ldmVudHMpO1xuICAgIH1cblxuICAgIGlmIChyZWZyZXNoQm9keSkge1xuICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xuICAgIH1cblxuICAgIGlmIChyZWZyZXNoSGVhZGVyIHx8IHJlZnJlc2hCb2R5KSB7XG4gICAgICB0aGlzLmVtaXRCZWZvcmVWaWV3UmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVmcmVzaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0aW1lRXZlbnRSZXNpemVTdGFydGVkKFxuICAgIGV2ZW50c0NvbnRhaW5lcjogSFRNTEVsZW1lbnQsXG4gICAgdGltZUV2ZW50OiBNQ1dlZWtWaWV3VGltZUV2ZW50LFxuICAgIHJlc2l6ZUV2ZW50OiBSZXNpemVFdmVudFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnRpbWVFdmVudFJlc2l6ZXMuc2V0KHRpbWVFdmVudC5ldmVudCwgcmVzaXplRXZlbnQpO1xuICAgIHRoaXMucmVzaXplU3RhcnRlZChldmVudHNDb250YWluZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRpbWVFdmVudFJlc2l6aW5nKHRpbWVFdmVudDogTUNXZWVrVmlld1RpbWVFdmVudCwgcmVzaXplRXZlbnQ6IFJlc2l6ZUV2ZW50KSB7XG4gICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLnNldCh0aW1lRXZlbnQuZXZlbnQsIHJlc2l6ZUV2ZW50KTtcbiAgICBjb25zdCBhZGp1c3RlZEV2ZW50cyA9IG5ldyBNYXA8TUNFdmVudCwgTUNFdmVudD4oKTtcblxuICAgIGNvbnN0IHRlbXBFdmVudHMgPSBbLi4udGhpcy5ldmVudHNdO1xuXG4gICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLmZvckVhY2goKGxhc3RSZXNpemVFdmVudCwgZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG5ld0V2ZW50RGF0ZXMgPSB0aGlzLmdldFRpbWVFdmVudFJlc2l6ZWREYXRlcyhcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGxhc3RSZXNpemVFdmVudFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGFkanVzdGVkRXZlbnQgPSB7IC4uLmV2ZW50LCAuLi5uZXdFdmVudERhdGVzIH07XG4gICAgICBhZGp1c3RlZEV2ZW50cy5zZXQoYWRqdXN0ZWRFdmVudCwgZXZlbnQpO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IHRlbXBFdmVudHMuaW5kZXhPZihldmVudCk7XG4gICAgICB0ZW1wRXZlbnRzW2V2ZW50SW5kZXhdID0gYWRqdXN0ZWRFdmVudDtcbiAgICB9KTtcblxuICAgIHRoaXMucmVzdG9yZU9yaWdpbmFsRXZlbnRzKHRlbXBFdmVudHMsIGFkanVzdGVkRXZlbnRzLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0aW1lRXZlbnRSZXNpemVFbmRlZCh0aW1lRXZlbnQ6IE1DV2Vla1ZpZXdUaW1lRXZlbnQpIHtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmdldFdlZWtWaWV3KHRoaXMuZXZlbnRzKTtcbiAgICBjb25zdCBsYXN0UmVzaXplRXZlbnQgPSB0aGlzLnRpbWVFdmVudFJlc2l6ZXMuZ2V0KHRpbWVFdmVudC5ldmVudCk7XG4gICAgaWYgKGxhc3RSZXNpemVFdmVudCkge1xuICAgICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLmRlbGV0ZSh0aW1lRXZlbnQuZXZlbnQpO1xuICAgICAgY29uc3QgbmV3RXZlbnREYXRlcyA9IHRoaXMuZ2V0VGltZUV2ZW50UmVzaXplZERhdGVzKFxuICAgICAgICB0aW1lRXZlbnQuZXZlbnQsXG4gICAgICAgIGxhc3RSZXNpemVFdmVudFxuICAgICAgKTtcbiAgICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgIG5ld1N0YXJ0OiBuZXdFdmVudERhdGVzLnN0YXJ0LFxuICAgICAgICBuZXdFbmQ6IG5ld0V2ZW50RGF0ZXMuZW5kLFxuICAgICAgICBldmVudDogdGltZUV2ZW50LmV2ZW50LFxuICAgICAgICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLlJlc2l6ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBhbGxEYXlFdmVudFJlc2l6ZVN0YXJ0ZWQoXG4gICAgYWxsRGF5RXZlbnRzQ29udGFpbmVyOiBIVE1MRWxlbWVudCxcbiAgICBhbGxEYXlFdmVudDogTUNXZWVrVmlld0FsbERheUV2ZW50LFxuICAgIHJlc2l6ZUV2ZW50OiBSZXNpemVFdmVudFxuICApOiB2b2lkIHtcbiAgICB0aGlzLmFsbERheUV2ZW50UmVzaXplcy5zZXQoYWxsRGF5RXZlbnQsIHtcbiAgICAgIG9yaWdpbmFsT2Zmc2V0OiBhbGxEYXlFdmVudC5vZmZzZXQsXG4gICAgICBvcmlnaW5hbFNwYW46IGFsbERheUV2ZW50LnNwYW4sXG4gICAgICBlZGdlOiB0eXBlb2YgcmVzaXplRXZlbnQuZWRnZXMubGVmdCAhPT0gJ3VuZGVmaW5lZCcgPyAnbGVmdCcgOiAncmlnaHQnLFxuICAgIH0pO1xuICAgIHRoaXMucmVzaXplU3RhcnRlZChcbiAgICAgIGFsbERheUV2ZW50c0NvbnRhaW5lcixcbiAgICAgIHRoaXMuZ2V0RGF5Q29sdW1uV2lkdGgoYWxsRGF5RXZlbnRzQ29udGFpbmVyKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgYWxsRGF5RXZlbnRSZXNpemluZyhcbiAgICBhbGxEYXlFdmVudDogTUNXZWVrVmlld0FsbERheUV2ZW50LFxuICAgIHJlc2l6ZUV2ZW50OiBSZXNpemVFdmVudCxcbiAgICBkYXlXaWR0aDogbnVtYmVyXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRSZXNpemU6IFdlZWtWaWV3QWxsRGF5RXZlbnRSZXNpemUgPSB0aGlzLmFsbERheUV2ZW50UmVzaXplcy5nZXQoXG4gICAgICBhbGxEYXlFdmVudFxuICAgICk7XG5cbiAgICBpZiAodHlwZW9mIHJlc2l6ZUV2ZW50LmVkZ2VzLmxlZnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkaWZmOiBudW1iZXIgPSBNYXRoLnJvdW5kKCtyZXNpemVFdmVudC5lZGdlcy5sZWZ0IC8gZGF5V2lkdGgpO1xuICAgICAgYWxsRGF5RXZlbnQub2Zmc2V0ID0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbE9mZnNldCArIGRpZmY7XG4gICAgICBhbGxEYXlFdmVudC5zcGFuID0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbFNwYW4gLSBkaWZmO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc2l6ZUV2ZW50LmVkZ2VzLnJpZ2h0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgZGlmZjogbnVtYmVyID0gTWF0aC5yb3VuZCgrcmVzaXplRXZlbnQuZWRnZXMucmlnaHQgLyBkYXlXaWR0aCk7XG4gICAgICBhbGxEYXlFdmVudC5zcGFuID0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbFNwYW4gKyBkaWZmO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBhbGxEYXlFdmVudFJlc2l6ZUVuZGVkKGFsbERheUV2ZW50OiBNQ1dlZWtWaWV3QWxsRGF5RXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50UmVzaXplOiBXZWVrVmlld0FsbERheUV2ZW50UmVzaXplID0gdGhpcy5hbGxEYXlFdmVudFJlc2l6ZXMuZ2V0KFxuICAgICAgYWxsRGF5RXZlbnRcbiAgICApO1xuXG4gICAgaWYgKGN1cnJlbnRSZXNpemUpIHtcbiAgICAgIGNvbnN0IGFsbERheUV2ZW50UmVzaXppbmdCZWZvcmVTdGFydCA9IGN1cnJlbnRSZXNpemUuZWRnZSA9PT0gJ2xlZnQnO1xuICAgICAgbGV0IGRheXNEaWZmOiBudW1iZXI7XG4gICAgICBpZiAoYWxsRGF5RXZlbnRSZXNpemluZ0JlZm9yZVN0YXJ0KSB7XG4gICAgICAgIGRheXNEaWZmID0gYWxsRGF5RXZlbnQub2Zmc2V0IC0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbE9mZnNldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRheXNEaWZmID0gYWxsRGF5RXZlbnQuc3BhbiAtIGN1cnJlbnRSZXNpemUub3JpZ2luYWxTcGFuO1xuICAgICAgfVxuXG4gICAgICBhbGxEYXlFdmVudC5vZmZzZXQgPSBjdXJyZW50UmVzaXplLm9yaWdpbmFsT2Zmc2V0O1xuICAgICAgYWxsRGF5RXZlbnQuc3BhbiA9IGN1cnJlbnRSZXNpemUub3JpZ2luYWxTcGFuO1xuXG4gICAgICBsZXQgbmV3U3RhcnQ6IERhdGUgPSBhbGxEYXlFdmVudC5ldmVudC5zdGFydDtcbiAgICAgIGxldCBuZXdFbmQ6IERhdGUgPSBhbGxEYXlFdmVudC5ldmVudC5lbmQgfHwgYWxsRGF5RXZlbnQuZXZlbnQuc3RhcnQ7XG4gICAgICBpZiAoYWxsRGF5RXZlbnRSZXNpemluZ0JlZm9yZVN0YXJ0KSB7XG4gICAgICAgIG5ld1N0YXJ0ID0gYWRkRGF5c1dpdGhFeGNsdXNpb25zKFxuICAgICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgICAgbmV3U3RhcnQsXG4gICAgICAgICAgZGF5c0RpZmYsXG4gICAgICAgICAgdGhpcy5leGNsdWRlRGF5c1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RW5kID0gYWRkRGF5c1dpdGhFeGNsdXNpb25zKFxuICAgICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgICAgbmV3RW5kLFxuICAgICAgICAgIGRheXNEaWZmLFxuICAgICAgICAgIHRoaXMuZXhjbHVkZURheXNcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ldmVudFRpbWVzQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgbmV3U3RhcnQsXG4gICAgICAgIG5ld0VuZCxcbiAgICAgICAgZXZlbnQ6IGFsbERheUV2ZW50LmV2ZW50LFxuICAgICAgICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLlJlc2l6ZSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hbGxEYXlFdmVudFJlc2l6ZXMuZGVsZXRlKGFsbERheUV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZ2V0RGF5Q29sdW1uV2lkdGgoZXZlbnRSb3dDb250YWluZXI6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihldmVudFJvd0NvbnRhaW5lci5vZmZzZXRXaWR0aCAvIHRoaXMuZGF5cy5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGRhdGVEcmFnRW50ZXIoZGF0ZTogRGF0ZSkge1xuICAgIHRoaXMubGFzdERyYWdFbnRlckRhdGUgPSBkYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGV2ZW50RHJvcHBlZChcbiAgICBkcm9wRXZlbnQ6IERyb3BFdmVudDx7IGV2ZW50PzogTUNFdmVudDsgY2FsZW5kYXJJZD86IHN5bWJvbCB9PixcbiAgICBkYXRlOiBEYXRlLFxuICAgIGFsbERheTogYm9vbGVhblxuICApOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBzaG91bGRGaXJlRHJvcHBlZEV2ZW50KGRyb3BFdmVudCwgZGF0ZSwgYWxsRGF5LCB0aGlzLmNhbGVuZGFySWQpICYmXG4gICAgICB0aGlzLmxhc3REcmFnRW50ZXJEYXRlLmdldFRpbWUoKSA9PT0gZGF0ZS5nZXRUaW1lKCkgJiZcbiAgICAgICghdGhpcy5zbmFwRHJhZ2dlZEV2ZW50cyB8fFxuICAgICAgICBkcm9wRXZlbnQuZHJvcERhdGEuZXZlbnQgIT09IHRoaXMubGFzdERyYWdnZWRFdmVudClcbiAgICApIHtcbiAgICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgIHR5cGU6IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGUuRHJvcCxcbiAgICAgICAgZXZlbnQ6IGRyb3BFdmVudC5kcm9wRGF0YS5ldmVudCxcbiAgICAgICAgbmV3U3RhcnQ6IGRhdGUsXG4gICAgICAgIGFsbERheSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmxhc3REcmFnZ2VkRXZlbnQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGRyYWdFbnRlcih0eXBlOiAnYWxsRGF5JyB8ICd0aW1lJykge1xuICAgIHRoaXMuZXZlbnREcmFnRW50ZXJCeVR5cGVbdHlwZV0rKztcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkcmFnTGVhdmUodHlwZTogJ2FsbERheScgfCAndGltZScpIHtcbiAgICB0aGlzLmV2ZW50RHJhZ0VudGVyQnlUeXBlW3R5cGVdLS07XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZHJhZ1N0YXJ0ZWQoXG4gICAgZXZlbnRzQ29udGFpbmVyOiBIVE1MRWxlbWVudCxcbiAgICBldmVudDogSFRNTEVsZW1lbnQsXG4gICAgZGF5RXZlbnQ/OiBNQ1dlZWtWaWV3VGltZUV2ZW50XG4gICk6IHZvaWQge1xuICAgIHRoaXMuZGF5Q29sdW1uV2lkdGggPSB0aGlzLmdldERheUNvbHVtbldpZHRoKGV2ZW50c0NvbnRhaW5lcik7XG4gICAgY29uc3QgZHJhZ0hlbHBlcjogQ2FsZW5kYXJEcmFnSGVscGVyID0gbmV3IENhbGVuZGFyRHJhZ0hlbHBlcihcbiAgICAgIGV2ZW50c0NvbnRhaW5lcixcbiAgICAgIGV2ZW50XG4gICAgKTtcbiAgICB0aGlzLnZhbGlkYXRlRHJhZyA9ICh7IHgsIHksIHRyYW5zZm9ybSB9KSA9PlxuICAgICAgdGhpcy5hbGxEYXlFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMCAmJlxuICAgICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLnNpemUgPT09IDAgJiZcbiAgICAgIGRyYWdIZWxwZXIudmFsaWRhdGVEcmFnKHtcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgc25hcERyYWdnZWRFdmVudHM6IHRoaXMuc25hcERyYWdnZWRFdmVudHMsXG4gICAgICAgIGRyYWdBbHJlYWR5TW92ZWQ6IHRoaXMuZHJhZ0FscmVhZHlNb3ZlZCxcbiAgICAgICAgdHJhbnNmb3JtLFxuICAgICAgfSk7XG4gICAgdGhpcy5kcmFnQWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdBbHJlYWR5TW92ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmxhc3REcmFnZ2VkRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuZXZlbnREcmFnRW50ZXJCeVR5cGUgPSB7XG4gICAgICBhbGxEYXk6IDAsXG4gICAgICB0aW1lOiAwLFxuICAgIH07XG4gICAgaWYgKCF0aGlzLnNuYXBEcmFnZ2VkRXZlbnRzICYmIGRheUV2ZW50KSB7XG4gICAgICB0aGlzLnZpZXcuaG91ckNvbHVtbnMuZm9yRWFjaCgoY29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpbmtlZEV2ZW50ID0gY29sdW1uLmV2ZW50cy5maW5kKFxuICAgICAgICAgIChjb2x1bW5FdmVudCkgPT5cbiAgICAgICAgICAgIGNvbHVtbkV2ZW50LmV2ZW50ID09PSBkYXlFdmVudC5ldmVudCAmJiBjb2x1bW5FdmVudCAhPT0gZGF5RXZlbnRcbiAgICAgICAgKTtcbiAgICAgICAgLy8gaGlkZSBhbnkgbGlua2VkIGV2ZW50cyB3aGlsZSBkcmFnZ2luZ1xuICAgICAgICBpZiAobGlua2VkRXZlbnQpIHtcbiAgICAgICAgICBsaW5rZWRFdmVudC53aWR0aCA9IDA7XG4gICAgICAgICAgbGlua2VkRXZlbnQuaGVpZ2h0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGRyYWdNb3ZlKGRheUV2ZW50OiBNQ1dlZWtWaWV3VGltZUV2ZW50LCBkcmFnRXZlbnQ6IERyYWdNb3ZlRXZlbnQpIHtcbiAgICBjb25zdCBuZXdFdmVudFRpbWVzID0gdGhpcy5nZXREcmFnTW92ZWRFdmVudFRpbWVzKFxuICAgICAgZGF5RXZlbnQsXG4gICAgICBkcmFnRXZlbnQsXG4gICAgICB0aGlzLmRheUNvbHVtbldpZHRoLFxuICAgICAgdHJ1ZVxuICAgICk7XG4gICAgY29uc3Qgb3JpZ2luYWxFdmVudCA9IGRheUV2ZW50LmV2ZW50O1xuICAgIGNvbnN0IGFkanVzdGVkRXZlbnQgPSB7IC4uLm9yaWdpbmFsRXZlbnQsIC4uLm5ld0V2ZW50VGltZXMgfTtcbiAgICBjb25zdCB0ZW1wRXZlbnRzID0gdGhpcy5ldmVudHMubWFwKChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50ID09PSBvcmlnaW5hbEV2ZW50KSB7XG4gICAgICAgIHJldHVybiBhZGp1c3RlZEV2ZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV2ZW50O1xuICAgIH0pO1xuICAgIHRoaXMucmVzdG9yZU9yaWdpbmFsRXZlbnRzKFxuICAgICAgdGVtcEV2ZW50cyxcbiAgICAgIG5ldyBNYXAoW1thZGp1c3RlZEV2ZW50LCBvcmlnaW5hbEV2ZW50XV0pLFxuICAgICAgdGhpcy5zbmFwRHJhZ2dlZEV2ZW50c1xuICAgICk7XG4gICAgdGhpcy5kcmFnQWxyZWFkeU1vdmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBhbGxEYXlFdmVudERyYWdNb3ZlKCkge1xuICAgIHRoaXMuZHJhZ0FscmVhZHlNb3ZlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZHJhZ0VuZGVkKFxuICAgIHdlZWtFdmVudDogTUNXZWVrVmlld0FsbERheUV2ZW50IHwgTUNXZWVrVmlld1RpbWVFdmVudCxcbiAgICBkcmFnRW5kRXZlbnQ6IERyYWdFbmRFdmVudCxcbiAgICBkYXlXaWR0aDogbnVtYmVyLFxuICAgIHVzZVkgPSBmYWxzZVxuICApOiB2b2lkIHtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmdldFdlZWtWaWV3KHRoaXMuZXZlbnRzKTtcbiAgICB0aGlzLmRyYWdBY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnZhbGlkYXRlRHJhZyA9IG51bGw7XG4gICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSB0aGlzLmdldERyYWdNb3ZlZEV2ZW50VGltZXMoXG4gICAgICB3ZWVrRXZlbnQsXG4gICAgICBkcmFnRW5kRXZlbnQsXG4gICAgICBkYXlXaWR0aCxcbiAgICAgIHVzZVlcbiAgICApO1xuICAgIGlmIChcbiAgICAgICh0aGlzLnNuYXBEcmFnZ2VkRXZlbnRzIHx8XG4gICAgICAgIHRoaXMuZXZlbnREcmFnRW50ZXJCeVR5cGVbdXNlWSA/ICd0aW1lJyA6ICdhbGxEYXknXSA+IDApICYmXG4gICAgICBpc0RyYWdnZWRXaXRoaW5QZXJpb2Qoc3RhcnQsIGVuZCwgdGhpcy52aWV3LnBlcmlvZClcbiAgICApIHtcbiAgICAgIHRoaXMubGFzdERyYWdnZWRFdmVudCA9IHdlZWtFdmVudC5ldmVudDtcbiAgICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgIG5ld1N0YXJ0OiBzdGFydCxcbiAgICAgICAgbmV3RW5kOiBlbmQsXG4gICAgICAgIGV2ZW50OiB3ZWVrRXZlbnQuZXZlbnQsXG4gICAgICAgIHR5cGU6IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGUuRHJhZyxcbiAgICAgICAgYWxsRGF5OiAhdXNlWSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCByZWZyZXNoSGVhZGVyKCk6IHZvaWQge1xuICAgIHRoaXMuZGF5cyA9IHRoaXMudXRpbHMuZ2V0V2Vla1ZpZXdIZWFkZXIoe1xuICAgICAgdmlld0RhdGU6IHRoaXMudmlld0RhdGUsXG4gICAgICB3ZWVrU3RhcnRzT246IHRoaXMud2Vla1N0YXJ0c09uLFxuICAgICAgZXhjbHVkZWQ6IHRoaXMuZXhjbHVkZURheXMsXG4gICAgICB3ZWVrZW5kRGF5czogdGhpcy53ZWVrZW5kRGF5cyxcbiAgICAgIC4uLmdldFdlZWtWaWV3UGVyaW9kKFxuICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLFxuICAgICAgICB0aGlzLnZpZXdEYXRlLFxuICAgICAgICB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgICAgdGhpcy5leGNsdWRlRGF5cyxcbiAgICAgICAgdGhpcy5kYXlzSW5XZWVrXG4gICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hCb2R5KCk6IHZvaWQge1xuICAgIHRoaXMudmlldyA9IHRoaXMuZ2V0V2Vla1ZpZXcodGhpcy5ldmVudHMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5yZWZyZXNoSGVhZGVyKCk7XG4gICAgdGhpcy5yZWZyZXNoQm9keSgpO1xuICAgIHRoaXMuZW1pdEJlZm9yZVZpZXdSZW5kZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBlbWl0QmVmb3JlVmlld1JlbmRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kYXlzICYmIHRoaXMudmlldykge1xuICAgICAgdGhpcy5iZWZvcmVWaWV3UmVuZGVyLmVtaXQoe1xuICAgICAgICBoZWFkZXI6IHRoaXMuZGF5cyxcbiAgICAgICAgLi4udGhpcy52aWV3LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldFdlZWtWaWV3KGV2ZW50czogTUNFdmVudFtdKSB7XG4gICAgcmV0dXJuIHRoaXMudXRpbHMuZ2V0V2Vla1ZpZXcoe1xuICAgICAgZXZlbnRzLFxuICAgICAgdmlld0RhdGU6IHRoaXMudmlld0RhdGUsXG4gICAgICB3ZWVrU3RhcnRzT246IHRoaXMud2Vla1N0YXJ0c09uLFxuICAgICAgZXhjbHVkZWQ6IHRoaXMuZXhjbHVkZURheXMsXG4gICAgICBwcmVjaXNpb246IHRoaXMucHJlY2lzaW9uLFxuICAgICAgYWJzb2x1dGVQb3NpdGlvbmVkRXZlbnRzOiB0cnVlLFxuICAgICAgaG91clNlZ21lbnRzOiB0aGlzLmhvdXJTZWdtZW50cyxcbiAgICAgIGRheVN0YXJ0OiB7XG4gICAgICAgIGhvdXI6IHRoaXMuZGF5U3RhcnRIb3VyLFxuICAgICAgICBtaW51dGU6IHRoaXMuZGF5U3RhcnRNaW51dGUsXG4gICAgICB9LFxuICAgICAgZGF5RW5kOiB7XG4gICAgICAgIGhvdXI6IHRoaXMuZGF5RW5kSG91cixcbiAgICAgICAgbWludXRlOiB0aGlzLmRheUVuZE1pbnV0ZSxcbiAgICAgIH0sXG4gICAgICBzZWdtZW50SGVpZ2h0OiB0aGlzLmhvdXJTZWdtZW50SGVpZ2h0LFxuICAgICAgd2Vla2VuZERheXM6IHRoaXMud2Vla2VuZERheXMsXG4gICAgICAuLi5nZXRXZWVrVmlld1BlcmlvZChcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgdGhpcy52aWV3RGF0ZSxcbiAgICAgICAgdGhpcy53ZWVrU3RhcnRzT24sXG4gICAgICAgIHRoaXMuZXhjbHVkZURheXMsXG4gICAgICAgIHRoaXMuZGF5c0luV2Vla1xuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXREcmFnTW92ZWRFdmVudFRpbWVzKFxuICAgIHdlZWtFdmVudDogTUNXZWVrVmlld0FsbERheUV2ZW50IHwgTUNXZWVrVmlld1RpbWVFdmVudCxcbiAgICBkcmFnRW5kRXZlbnQ6IERyYWdFbmRFdmVudCB8IERyYWdNb3ZlRXZlbnQsXG4gICAgZGF5V2lkdGg6IG51bWJlcixcbiAgICB1c2VZOiBib29sZWFuXG4gICkge1xuICAgIGNvbnN0IGRheXNEcmFnZ2VkID0gcm91bmRUb05lYXJlc3QoZHJhZ0VuZEV2ZW50LngsIGRheVdpZHRoKSAvIGRheVdpZHRoO1xuICAgIGNvbnN0IG1pbnV0ZXNNb3ZlZCA9IHVzZVlcbiAgICAgID8gZ2V0TWludXRlc01vdmVkKFxuICAgICAgICBkcmFnRW5kRXZlbnQueSxcbiAgICAgICAgdGhpcy5ob3VyU2VnbWVudHMsXG4gICAgICAgIHRoaXMuaG91clNlZ21lbnRIZWlnaHQsXG4gICAgICAgIHRoaXMuZXZlbnRTbmFwU2l6ZVxuICAgICAgKVxuICAgICAgOiAwO1xuXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMoXG4gICAgICBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgIHdlZWtFdmVudC5ldmVudC5zdGFydCxcbiAgICAgICAgZGF5c0RyYWdnZWQsXG4gICAgICAgIHRoaXMuZXhjbHVkZURheXNcbiAgICAgICksXG4gICAgICBtaW51dGVzTW92ZWRcbiAgICApO1xuICAgIGxldCBlbmQ6IERhdGU7XG4gICAgaWYgKHdlZWtFdmVudC5ldmVudC5lbmQpIHtcbiAgICAgIGVuZCA9IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkTWludXRlcyhcbiAgICAgICAgYWRkRGF5c1dpdGhFeGNsdXNpb25zKFxuICAgICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgICAgd2Vla0V2ZW50LmV2ZW50LmVuZCxcbiAgICAgICAgICBkYXlzRHJhZ2dlZCxcbiAgICAgICAgICB0aGlzLmV4Y2x1ZGVEYXlzXG4gICAgICAgICksXG4gICAgICAgIG1pbnV0ZXNNb3ZlZFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBzdGFydCwgZW5kIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVzdG9yZU9yaWdpbmFsRXZlbnRzKFxuICAgIHRlbXBFdmVudHM6IE1DRXZlbnRbXSxcbiAgICBhZGp1c3RlZEV2ZW50czogTWFwPE1DRXZlbnQsIE1DRXZlbnQ+LFxuICAgIHNuYXBEcmFnZ2VkRXZlbnRzID0gdHJ1ZVxuICApIHtcbiAgICBjb25zdCBwcmV2aW91c1ZpZXcgPSB0aGlzLnZpZXc7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5nZXRXZWVrVmlldyh0ZW1wRXZlbnRzKTtcbiAgICBjb25zdCBhZGp1c3RlZEV2ZW50c0FycmF5ID0gdGVtcEV2ZW50cy5maWx0ZXIoKGV2ZW50KSA9PlxuICAgICAgYWRqdXN0ZWRFdmVudHMuaGFzKGV2ZW50KVxuICAgICk7XG4gICAgdGhpcy52aWV3LmhvdXJDb2x1bW5zLmZvckVhY2goKGNvbHVtbiwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgIHByZXZpb3VzVmlldy5ob3VyQ29sdW1uc1tjb2x1bW5JbmRleF0uaG91cnMuZm9yRWFjaCgoaG91ciwgaG91ckluZGV4KSA9PiB7XG4gICAgICAgIGhvdXIuc2VnbWVudHMuZm9yRWFjaCgoc2VnbWVudCwgc2VnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgY29sdW1uLmhvdXJzW2hvdXJJbmRleF0uc2VnbWVudHNbc2VnbWVudEluZGV4XS5jc3NDbGFzcyA9XG4gICAgICAgICAgICBzZWdtZW50LmNzc0NsYXNzO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBhZGp1c3RlZEV2ZW50c0FycmF5LmZvckVhY2goKGFkanVzdGVkRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxFdmVudCA9IGFkanVzdGVkRXZlbnRzLmdldChhZGp1c3RlZEV2ZW50KTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdDb2x1bW5FdmVudCA9IGNvbHVtbi5ldmVudHMuZmluZChcbiAgICAgICAgICAoY29sdW1uRXZlbnQpID0+IGNvbHVtbkV2ZW50LmV2ZW50ID09PSBhZGp1c3RlZEV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIGlmIChleGlzdGluZ0NvbHVtbkV2ZW50KSB7XG4gICAgICAgICAgLy8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgZXZlbnQgc28gdHJhY2tCeSBraWNrcyBpbiBhbmQgdGhlIGRvbSBpc24ndCBjaGFuZ2VkXG4gICAgICAgICAgZXhpc3RpbmdDb2x1bW5FdmVudC5ldmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gICAgICAgICAgZXhpc3RpbmdDb2x1bW5FdmVudFsndGVtcEV2ZW50J10gPSBhZGp1c3RlZEV2ZW50O1xuICAgICAgICAgIGlmICghc25hcERyYWdnZWRFdmVudHMpIHtcbiAgICAgICAgICAgIGV4aXN0aW5nQ29sdW1uRXZlbnQuaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIGV4aXN0aW5nQ29sdW1uRXZlbnQud2lkdGggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBhZGQgYSBkdW1teSBldmVudCB0byB0aGUgZHJvcCBzbyBpZiB0aGUgZXZlbnQgd2FzIHJlbW92ZWQgZnJvbSB0aGUgb3JpZ2luYWwgY29sdW1uIHRoZSBkcmFnIGRvZXNuJ3QgZW5kIGVhcmx5XG4gICAgICAgICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAgICAgICBldmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIHN0YXJ0c0JlZm9yZURheTogZmFsc2UsXG4gICAgICAgICAgICBlbmRzQWZ0ZXJEYXk6IGZhbHNlLFxuICAgICAgICAgICAgdGVtcEV2ZW50OiBhZGp1c3RlZEV2ZW50LFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29sdW1uLmV2ZW50cy5wdXNoKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgYWRqdXN0ZWRFdmVudHMuY2xlYXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRUaW1lRXZlbnRSZXNpemVkRGF0ZXMoXG4gICAgY2FsZW5kYXJFdmVudDogTUNFdmVudCxcbiAgICByZXNpemVFdmVudDogUmVzaXplRXZlbnRcbiAgKSB7XG4gICAgY29uc3QgbWluaW11bUV2ZW50SGVpZ2h0ID0gZ2V0TWluaW11bUV2ZW50SGVpZ2h0SW5NaW51dGVzKFxuICAgICAgdGhpcy5ob3VyU2VnbWVudHMsXG4gICAgICB0aGlzLmhvdXJTZWdtZW50SGVpZ2h0XG4gICAgKTtcbiAgICBjb25zdCBuZXdFdmVudERhdGVzID0ge1xuICAgICAgc3RhcnQ6IGNhbGVuZGFyRXZlbnQuc3RhcnQsXG4gICAgICBlbmQ6IGdldERlZmF1bHRFdmVudEVuZChcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgY2FsZW5kYXJFdmVudCxcbiAgICAgICAgbWluaW11bUV2ZW50SGVpZ2h0XG4gICAgICApLFxuICAgIH07XG4gICAgY29uc3QgeyBlbmQsIC4uLmV2ZW50V2l0aG91dEVuZCB9ID0gY2FsZW5kYXJFdmVudDtcbiAgICBjb25zdCBzbWFsbGVzdFJlc2l6ZXMgPSB7XG4gICAgICBzdGFydDogdGhpcy5kYXRlQWRhcHRlci5hZGRNaW51dGVzKFxuICAgICAgICBuZXdFdmVudERhdGVzLmVuZCxcbiAgICAgICAgbWluaW11bUV2ZW50SGVpZ2h0ICogLTFcbiAgICAgICksXG4gICAgICBlbmQ6IGdldERlZmF1bHRFdmVudEVuZChcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgZXZlbnRXaXRob3V0RW5kLFxuICAgICAgICBtaW5pbXVtRXZlbnRIZWlnaHRcbiAgICAgICksXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgcmVzaXplRXZlbnQuZWRnZXMubGVmdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IGRheXNEaWZmID0gTWF0aC5yb3VuZChcbiAgICAgICAgK3Jlc2l6ZUV2ZW50LmVkZ2VzLmxlZnQgLyB0aGlzLmRheUNvbHVtbldpZHRoXG4gICAgICApO1xuICAgICAgY29uc3QgbmV3U3RhcnQgPSBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQsXG4gICAgICAgIGRheXNEaWZmLFxuICAgICAgICB0aGlzLmV4Y2x1ZGVEYXlzXG4gICAgICApO1xuICAgICAgaWYgKG5ld1N0YXJ0IDwgc21hbGxlc3RSZXNpemVzLnN0YXJ0KSB7XG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQgPSBuZXdTdGFydDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQgPSBzbWFsbGVzdFJlc2l6ZXMuc3RhcnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzaXplRXZlbnQuZWRnZXMucmlnaHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkYXlzRGlmZiA9IE1hdGgucm91bmQoXG4gICAgICAgICtyZXNpemVFdmVudC5lZGdlcy5yaWdodCAvIHRoaXMuZGF5Q29sdW1uV2lkdGhcbiAgICAgICk7XG4gICAgICBjb25zdCBuZXdFbmQgPSBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuZW5kLFxuICAgICAgICBkYXlzRGlmZixcbiAgICAgICAgdGhpcy5leGNsdWRlRGF5c1xuICAgICAgKTtcbiAgICAgIGlmIChuZXdFbmQgPiBzbWFsbGVzdFJlc2l6ZXMuZW5kKSB7XG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuZW5kID0gbmV3RW5kO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RXZlbnREYXRlcy5lbmQgPSBzbWFsbGVzdFJlc2l6ZXMuZW5kO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVzaXplRXZlbnQuZWRnZXMudG9wICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgbWludXRlc01vdmVkID0gZ2V0TWludXRlc01vdmVkKFxuICAgICAgICByZXNpemVFdmVudC5lZGdlcy50b3AgYXMgbnVtYmVyLFxuICAgICAgICB0aGlzLmhvdXJTZWdtZW50cyxcbiAgICAgICAgdGhpcy5ob3VyU2VnbWVudEhlaWdodCxcbiAgICAgICAgdGhpcy5ldmVudFNuYXBTaXplXG4gICAgICApO1xuICAgICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMoXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQsXG4gICAgICAgIG1pbnV0ZXNNb3ZlZFxuICAgICAgKTtcbiAgICAgIGlmIChuZXdTdGFydCA8IHNtYWxsZXN0UmVzaXplcy5zdGFydCkge1xuICAgICAgICBuZXdFdmVudERhdGVzLnN0YXJ0ID0gbmV3U3RhcnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdFdmVudERhdGVzLnN0YXJ0ID0gc21hbGxlc3RSZXNpemVzLnN0YXJ0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc2l6ZUV2ZW50LmVkZ2VzLmJvdHRvbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IG1pbnV0ZXNNb3ZlZCA9IGdldE1pbnV0ZXNNb3ZlZChcbiAgICAgICAgcmVzaXplRXZlbnQuZWRnZXMuYm90dG9tIGFzIG51bWJlcixcbiAgICAgICAgdGhpcy5ob3VyU2VnbWVudHMsXG4gICAgICAgIHRoaXMuaG91clNlZ21lbnRIZWlnaHQsXG4gICAgICAgIHRoaXMuZXZlbnRTbmFwU2l6ZVxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkTWludXRlcyhcbiAgICAgICAgbmV3RXZlbnREYXRlcy5lbmQsXG4gICAgICAgIG1pbnV0ZXNNb3ZlZFxuICAgICAgKTtcbiAgICAgIGlmIChuZXdFbmQgPiBzbWFsbGVzdFJlc2l6ZXMuZW5kKSB7XG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuZW5kID0gbmV3RW5kO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RXZlbnREYXRlcy5lbmQgPSBzbWFsbGVzdFJlc2l6ZXMuZW5kO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdFdmVudERhdGVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlc2l6ZVN0YXJ0ZWQoZXZlbnRzQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgbWluV2lkdGg/OiBudW1iZXIpIHtcbiAgICB0aGlzLmRheUNvbHVtbldpZHRoID0gdGhpcy5nZXREYXlDb2x1bW5XaWR0aChldmVudHNDb250YWluZXIpO1xuICAgIGNvbnN0IHJlc2l6ZUhlbHBlcjogQ2FsZW5kYXJSZXNpemVIZWxwZXIgPSBuZXcgQ2FsZW5kYXJSZXNpemVIZWxwZXIoXG4gICAgICBldmVudHNDb250YWluZXIsXG4gICAgICBtaW5XaWR0aFxuICAgICk7XG4gICAgdGhpcy52YWxpZGF0ZVJlc2l6ZSA9ICh7IHJlY3RhbmdsZSB9KSA9PlxuICAgICAgcmVzaXplSGVscGVyLnZhbGlkYXRlUmVzaXplKHsgcmVjdGFuZ2xlIH0pO1xuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iXX0=