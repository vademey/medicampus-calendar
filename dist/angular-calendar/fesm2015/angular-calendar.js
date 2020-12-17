import { __decorate, __metadata, __param, __rest } from 'tslib';
import { Injectable, Inject, LOCALE_ID, Pipe, Input, TemplateRef, Component, EventEmitter, Output, HostListener, Directive, ElementRef, Injector, Renderer2, ComponentFactoryResolver, ViewContainerRef, InjectionToken, NgModule, NgZone, ChangeDetectorRef } from '@angular/core';
import { formatDate, I18nPluralPipe, DOCUMENT, CommonModule } from '@angular/common';
import { positionElements } from 'positioning';
import { Subject, of, timer, Observable, BehaviorSubject, interval } from 'rxjs';
import { takeUntil, switchMap, startWith, switchMapTo, map } from 'rxjs/operators';
export { DAYS_OF_WEEK } from 'calendar-utils';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { ResizableModule } from 'angular-resizable-element';
import { trigger, state, style, transition, animate } from '@angular/animations';

/**
 * This class is responsible for adding accessibility to the calendar.
 * You may override any of its methods via angulars DI to suit your requirements.
 * For example:
 *
 * ```typescript
 * import { A11yParams, CalendarA11y } from 'angular-calendar';
 * import { formatDate, I18nPluralPipe } from '@angular/common';
 * import { Injectable } from '@angular/core';
 *
 * // adding your own a11y params
 * export interface CustomA11yParams extends A11yParams {
 *   isDrSuess?: boolean;
 * }
 *
 * @Injectable()
 * export class CustomCalendarA11y extends CalendarA11y {
 *   constructor(protected i18nPlural: I18nPluralPipe) {
 *     super(i18nPlural);
 *   }
 *
 *   // overriding a function
 *   public openDayEventsLandmark({ date, locale, isDrSuess }: CustomA11yParams): string {
 *     if (isDrSuess) {
 *       return `
 *         ${formatDate(date, 'EEEE MMMM d', locale)}
 *          Today you are you! That is truer than true! There is no one alive
 *          who is you-er than you!
 *       `;
 *     }
 *   }
 * }
 *
 * // in your component that uses the calendar
 * providers: [{
 *  provide: CalendarA11y,
 *  useClass: CustomCalendarA11y
 * }]
 * ```
 */
let CalendarA11y = class CalendarA11y {
    constructor(i18nPlural) {
        this.i18nPlural = i18nPlural;
    }
    /**
     * Aria label for the badges/date of a cell
     * @example: `Saturday October 19 1 event click to expand`
     */
    monthCell({ day, locale }) {
        if (day.badgeTotal > 0) {
            return `
        ${formatDate(day.date, 'EEEE MMMM d', locale)},
        ${this.i18nPlural.transform(day.badgeTotal, {
                '=0': 'No events',
                '=1': 'One event',
                other: '# events',
            })},
         click to expand
      `;
        }
        else {
            return `${formatDate(day.date, 'EEEE MMMM d', locale)}`;
        }
    }
    /**
     * Aria label for the open day events start landmark
     * @example: `Saturday October 19 expanded view`
     */
    openDayEventsLandmark({ date, locale }) {
        return `
      Beginning of expanded view for ${formatDate(date, 'EEEE MMMM dd', locale)}
    `;
    }
    /**
     * Aria label for alert that a day in the month view was expanded
     * @example: `Saturday October 19 expanded`
     */
    openDayEventsAlert({ date, locale }) {
        return `${formatDate(date, 'EEEE MMMM dd', locale)} expanded`;
    }
    /**
     * Descriptive aria label for an event
     * @example: `Saturday October 19th, Scott's Pizza Party, from 11:00am to 5:00pm`
     */
    eventDescription({ event, locale }) {
        if (event.allDay === true) {
            return this.allDayEventDescription({ event, locale });
        }
        const aria = `
      ${formatDate(event.start, 'EEEE MMMM dd', locale)},
      ${event.title}, from ${formatDate(event.start, 'hh:mm a', locale)}
    `;
        if (event.end) {
            return aria + ` to ${formatDate(event.end, 'hh:mm a', locale)}`;
        }
        return aria;
    }
    /**
     * Descriptive aria label for an all day event
     * @example:
     * `Scott's Party, event spans multiple days: start time October 19 5:00pm, no stop time`
     */
    allDayEventDescription({ event, locale }) {
        const aria = `
      ${event.title}, event spans multiple days:
      start time ${formatDate(event.start, 'MMMM dd hh:mm a', locale)}
    `;
        if (event.end) {
            return (aria + `, stop time ${formatDate(event.end, 'MMMM d hh:mm a', locale)}`);
        }
        return aria + `, no stop time`;
    }
    /**
     * Aria label for the calendar event actions icons
     * @returns 'Edit' for fa-pencil icons, and 'Delete' for fa-times icons
     */
    actionButtonLabel({ action }) {
        return action.a11yLabel;
    }
    /**
     * @returns {number} Tab index to be given to month cells
     */
    monthCellTabIndex() {
        return 0;
    }
    /**
     * @returns true if the events inside the month cell should be aria-hidden
     */
    hideMonthCellEvents() {
        return true;
    }
    /**
     * @returns true if event titles should be aria-hidden (global)
     */
    hideEventTitle() {
        return true;
    }
    /**
     * @returns true if hour segments in the week view should be aria-hidden
     */
    hideWeekHourSegment() {
        return true;
    }
    /**
     * @returns true if hour segments in the day view should be aria-hidden
     */
    hideDayHourSegment() {
        return true;
    }
};
CalendarA11y.ctorParameters = () => [
    { type: I18nPluralPipe }
];
CalendarA11y = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [I18nPluralPipe])
], CalendarA11y);

/**
 * This pipe is primarily for rendering aria labels. Example usage:
 * ```typescript
 * // where `myEvent` is a `CalendarEvent` and myLocale is a locale identifier
 * {{ { event: myEvent, locale: myLocale } | calendarA11y: 'eventDescription' }}
 * ```
 */
let CalendarA11yPipe = class CalendarA11yPipe {
    constructor(calendarA11y, locale) {
        this.calendarA11y = calendarA11y;
        this.locale = locale;
    }
    transform(a11yParams, method) {
        a11yParams.locale = a11yParams.locale || this.locale;
        if (typeof this.calendarA11y[method] === 'undefined') {
            const allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarA11y.prototype)).filter((iMethod) => iMethod !== 'constructor');
            throw new Error(`${method} is not a valid a11y method. Can only be one of ${allowedMethods.join(', ')}`);
        }
        return this.calendarA11y[method](a11yParams);
    }
};
CalendarA11yPipe.ctorParameters = () => [
    { type: CalendarA11y },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];
CalendarA11yPipe = __decorate([
    Pipe({
        name: 'calendarA11y',
    }),
    __param(1, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [CalendarA11y, String])
], CalendarA11yPipe);

class DateAdapter {
}

var DAYS_OF_WEEK;
(function (DAYS_OF_WEEK) {
    DAYS_OF_WEEK[DAYS_OF_WEEK["SUNDAY"] = 0] = "SUNDAY";
    DAYS_OF_WEEK[DAYS_OF_WEEK["MONDAY"] = 1] = "MONDAY";
    DAYS_OF_WEEK[DAYS_OF_WEEK["TUESDAY"] = 2] = "TUESDAY";
    DAYS_OF_WEEK[DAYS_OF_WEEK["WEDNESDAY"] = 3] = "WEDNESDAY";
    DAYS_OF_WEEK[DAYS_OF_WEEK["THURSDAY"] = 4] = "THURSDAY";
    DAYS_OF_WEEK[DAYS_OF_WEEK["FRIDAY"] = 5] = "FRIDAY";
    DAYS_OF_WEEK[DAYS_OF_WEEK["SATURDAY"] = 6] = "SATURDAY";
})(DAYS_OF_WEEK || (DAYS_OF_WEEK = {}));
const DEFAULT_WEEKEND_DAYS = [
    DAYS_OF_WEEK.SUNDAY,
    DAYS_OF_WEEK.SATURDAY,
];
const DAYS_IN_WEEK = 7;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_DAY = 60 * 60 * 24;
function getExcludedSeconds(dateAdapter, { startDate, seconds, excluded, precision, }) {
    if (excluded.length < 1) {
        return 0;
    }
    const { addSeconds, getDay, addDays } = dateAdapter;
    const endDate = addSeconds(startDate, seconds - 1);
    const dayStart = getDay(startDate);
    const dayEnd = getDay(endDate);
    let result = 0; // Calculated in seconds
    let current = startDate;
    while (current < endDate) {
        const day = getDay(current);
        if (excluded.some((excludedDay) => excludedDay === day)) {
            result += calculateExcludedSeconds(dateAdapter, {
                dayStart,
                dayEnd,
                day,
                precision,
                startDate,
                endDate,
            });
        }
        current = addDays(current, 1);
    }
    return result;
}
function calculateExcludedSeconds(dateAdapter, { precision, day, dayStart, dayEnd, startDate, endDate, }) {
    const { differenceInSeconds, endOfDay, startOfDay } = dateAdapter;
    if (precision === 'minutes') {
        if (day === dayStart) {
            return differenceInSeconds(endOfDay(startDate), startDate) + 1;
        }
        else if (day === dayEnd) {
            return differenceInSeconds(endDate, startOfDay(endDate)) + 1;
        }
    }
    return SECONDS_IN_DAY;
}
function getWeekViewEventSpan(dateAdapter, { event, offset, startOfWeekDate, excluded, precision, totalDaysInView, }) {
    const { max, differenceInSeconds, addDays, endOfDay, differenceInDays, } = dateAdapter;
    let span = SECONDS_IN_DAY;
    const begin = max([event.start, startOfWeekDate]);
    if (event.end) {
        switch (precision) {
            case 'minutes':
                span = differenceInSeconds(event.end, begin);
                break;
            default:
                span =
                    differenceInDays(addDays(endOfDay(event.end), 1), begin) *
                        SECONDS_IN_DAY;
                break;
        }
    }
    const offsetSeconds = offset * SECONDS_IN_DAY;
    const totalLength = offsetSeconds + span;
    // the best way to detect if an event is outside the week-view
    // is to check if the total span beginning (from startOfWeekDay or event start) exceeds the total days in the view
    const secondsInView = totalDaysInView * SECONDS_IN_DAY;
    if (totalLength > secondsInView) {
        span = secondsInView - offsetSeconds;
    }
    span -= getExcludedSeconds(dateAdapter, {
        startDate: begin,
        seconds: span,
        excluded,
        precision,
    });
    return span / SECONDS_IN_DAY;
}
function getWeekViewEventOffset(dateAdapter, { event, startOfWeek: startOfWeekDate, excluded, precision, }) {
    const { differenceInDays, startOfDay, differenceInSeconds } = dateAdapter;
    if (event.start < startOfWeekDate) {
        return 0;
    }
    let offset = 0;
    switch (precision) {
        case 'days':
            offset =
                differenceInDays(startOfDay(event.start), startOfWeekDate) *
                    SECONDS_IN_DAY;
            break;
        case 'minutes':
            offset = differenceInSeconds(event.start, startOfWeekDate);
            break;
    }
    offset -= getExcludedSeconds(dateAdapter, {
        startDate: startOfWeekDate,
        seconds: offset,
        excluded,
        precision,
    });
    return Math.abs(offset / SECONDS_IN_DAY);
}
function isEventIsPeriod(dateAdapter, { event, periodStart, periodEnd }) {
    const { isSameSecond } = dateAdapter;
    const eventStart = event.start;
    const eventEnd = event.end || event.start;
    if (eventStart > periodStart && eventStart < periodEnd) {
        return true;
    }
    if (eventEnd > periodStart && eventEnd < periodEnd) {
        return true;
    }
    if (eventStart < periodStart && eventEnd > periodEnd) {
        return true;
    }
    if (isSameSecond(eventStart, periodStart) ||
        isSameSecond(eventStart, periodEnd)) {
        return true;
    }
    if (isSameSecond(eventEnd, periodStart) ||
        isSameSecond(eventEnd, periodEnd)) {
        return true;
    }
    return false;
}
function getEventsInPeriod(dateAdapter, { events, periodStart, periodEnd }) {
    return events.filter((event) => isEventIsPeriod(dateAdapter, { event, periodStart, periodEnd }));
}
function getWeekDay(dateAdapter, { date, weekendDays = DEFAULT_WEEKEND_DAYS, }) {
    const { startOfDay, isSameDay, getDay } = dateAdapter;
    const today = startOfDay(new Date());
    const day = getDay(date);
    return {
        date,
        day,
        isPast: date < today,
        isToday: isSameDay(date, today),
        isFuture: date > today,
        isWeekend: weekendDays.indexOf(day) > -1,
    };
}
function getWeekViewHeader(dateAdapter, { viewDate, weekStartsOn, excluded = [], weekendDays, viewStart = dateAdapter.startOfWeek(viewDate, { weekStartsOn }), viewEnd = dateAdapter.addDays(viewStart, DAYS_IN_WEEK), }) {
    const { addDays, getDay } = dateAdapter;
    const days = [];
    let date = viewStart;
    while (date < viewEnd) {
        if (!excluded.some((e) => getDay(date) === e)) {
            days.push(getWeekDay(dateAdapter, { date, weekendDays }));
        }
        date = addDays(date, 1);
    }
    return days;
}
function getDifferenceInDaysWithExclusions(dateAdapter, { date1, date2, excluded }) {
    let date = date1;
    let diff = 0;
    while (date < date2) {
        if (excluded.indexOf(dateAdapter.getDay(date)) === -1) {
            diff++;
        }
        date = dateAdapter.addDays(date, 1);
    }
    return diff;
}
function getAllDayWeekEvents(dateAdapter, { events = [], excluded = [], precision = 'days', absolutePositionedEvents = false, viewStart, viewEnd, }) {
    viewStart = dateAdapter.startOfDay(viewStart);
    viewEnd = dateAdapter.endOfDay(viewEnd);
    const { differenceInSeconds, differenceInDays } = dateAdapter;
    const maxRange = getDifferenceInDaysWithExclusions(dateAdapter, {
        date1: viewStart,
        date2: viewEnd,
        excluded,
    });
    const totalDaysInView = differenceInDays(viewEnd, viewStart) + 1;
    const eventsMapped = events
        .filter((event) => event.allDay)
        .map((event) => {
        const offset = getWeekViewEventOffset(dateAdapter, {
            event,
            startOfWeek: viewStart,
            excluded,
            precision,
        });
        const span = getWeekViewEventSpan(dateAdapter, {
            event,
            offset,
            startOfWeekDate: viewStart,
            excluded,
            precision,
            totalDaysInView,
        });
        return { event, offset, span };
    })
        .filter((e) => e.offset < maxRange)
        .filter((e) => e.span > 0)
        .map((entry) => ({
        event: entry.event,
        offset: entry.offset,
        span: entry.span,
        startsBeforeWeek: entry.event.start < viewStart,
        endsAfterWeek: (entry.event.end || entry.event.start) > viewEnd,
    }))
        .sort((itemA, itemB) => {
        const startSecondsDiff = differenceInSeconds(itemA.event.start, itemB.event.start);
        if (startSecondsDiff === 0) {
            return differenceInSeconds(itemB.event.end || itemB.event.start, itemA.event.end || itemA.event.start);
        }
        return startSecondsDiff;
    });
    const allDayEventRows = [];
    const allocatedEvents = [];
    eventsMapped.forEach((event, index) => {
        if (allocatedEvents.indexOf(event) === -1) {
            allocatedEvents.push(event);
            let rowSpan = event.span + event.offset;
            const otherRowEvents = eventsMapped
                .slice(index + 1)
                .filter((nextEvent) => {
                if (nextEvent.offset >= rowSpan &&
                    rowSpan + nextEvent.span <= totalDaysInView &&
                    allocatedEvents.indexOf(nextEvent) === -1) {
                    const nextEventOffset = nextEvent.offset - rowSpan;
                    if (!absolutePositionedEvents) {
                        nextEvent.offset = nextEventOffset;
                    }
                    rowSpan += nextEvent.span + nextEventOffset;
                    allocatedEvents.push(nextEvent);
                    return true;
                }
            });
            const weekEvents = [event, ...otherRowEvents];
            const id = weekEvents
                .filter((weekEvent) => weekEvent.event.id)
                .map((weekEvent) => weekEvent.event.id)
                .join('-');
            allDayEventRows.push(Object.assign({ row: weekEvents }, (id ? { id } : {})));
        }
    });
    return allDayEventRows;
}
function getWeekViewHourGrid(dateAdapter, { events, viewDate, hourSegments, hourDuration, dayStart, dayEnd, weekStartsOn, excluded, weekendDays, segmentHeight, viewStart, viewEnd, minimumEventHeight, }) {
    const dayViewHourGrid = getDayViewHourGrid(dateAdapter, {
        viewDate,
        hourSegments,
        hourDuration,
        dayStart,
        dayEnd,
    });
    const weekDays = getWeekViewHeader(dateAdapter, {
        viewDate,
        weekStartsOn,
        excluded,
        weekendDays,
        viewStart,
        viewEnd,
    });
    const { setHours, setMinutes, getHours, getMinutes } = dateAdapter;
    return weekDays.map((day) => {
        const dayView = getDayView(dateAdapter, {
            events,
            viewDate: day.date,
            hourSegments,
            dayStart,
            dayEnd,
            segmentHeight,
            eventWidth: 1,
            hourDuration,
            minimumEventHeight,
        });
        const hours = dayViewHourGrid.map((hour) => {
            const segments = hour.segments.map((segment) => {
                const date = setMinutes(setHours(day.date, getHours(segment.date)), getMinutes(segment.date));
                return Object.assign(Object.assign({}, segment), { date });
            });
            return Object.assign(Object.assign({}, hour), { segments });
        });
        function getColumnCount(allEvents, prevOverlappingEvents) {
            const columnCount = Math.max(...prevOverlappingEvents.map((iEvent) => iEvent.left + 1));
            const nextOverlappingEvents = allEvents
                .filter((iEvent) => iEvent.left >= columnCount)
                .filter((iEvent) => {
                return (getOverLappingWeekViewEvents(prevOverlappingEvents, iEvent.top, iEvent.top + iEvent.height).length > 0);
            });
            if (nextOverlappingEvents.length > 0) {
                return getColumnCount(allEvents, nextOverlappingEvents);
            }
            else {
                return columnCount;
            }
        }
        const mappedEvents = dayView.events.map((event) => {
            const columnCount = getColumnCount(dayView.events, getOverLappingWeekViewEvents(dayView.events, event.top, event.top + event.height));
            const width = 100 / columnCount;
            return Object.assign(Object.assign({}, event), { left: event.left * width, width });
        });
        return {
            hours,
            date: day.date,
            events: mappedEvents.map((event) => {
                const overLappingEvents = getOverLappingWeekViewEvents(mappedEvents.filter((otherEvent) => otherEvent.left > event.left), event.top, event.top + event.height);
                if (overLappingEvents.length > 0) {
                    return Object.assign(Object.assign({}, event), { width: Math.min(...overLappingEvents.map((otherEvent) => otherEvent.left)) - event.left });
                }
                return event;
            }),
        };
    });
}
function getWeekView(dateAdapter, { events = [], viewDate, weekStartsOn, excluded = [], precision = 'days', absolutePositionedEvents = false, hourSegments, hourDuration, dayStart, dayEnd, weekendDays, segmentHeight, minimumEventHeight, viewStart = dateAdapter.startOfWeek(viewDate, { weekStartsOn }), viewEnd = dateAdapter.endOfWeek(viewDate, { weekStartsOn }), }) {
    if (!events) {
        events = [];
    }
    const { startOfDay, endOfDay } = dateAdapter;
    viewStart = startOfDay(viewStart);
    viewEnd = endOfDay(viewEnd);
    const eventsInPeriod = getEventsInPeriod(dateAdapter, {
        events,
        periodStart: viewStart,
        periodEnd: viewEnd,
    });
    const header = getWeekViewHeader(dateAdapter, {
        viewDate,
        weekStartsOn,
        excluded,
        weekendDays,
        viewStart,
        viewEnd,
    });
    return {
        allDayEventRows: getAllDayWeekEvents(dateAdapter, {
            events: eventsInPeriod,
            excluded,
            precision,
            absolutePositionedEvents,
            viewStart,
            viewEnd,
        }),
        period: {
            events: eventsInPeriod,
            start: header[0].date,
            end: endOfDay(header[header.length - 1].date),
        },
        hourColumns: getWeekViewHourGrid(dateAdapter, {
            events,
            viewDate,
            hourSegments,
            hourDuration,
            dayStart,
            dayEnd,
            weekStartsOn,
            excluded,
            weekendDays,
            segmentHeight,
            viewStart,
            viewEnd,
            minimumEventHeight,
        }),
    };
}
function getMonthView(dateAdapter, { events = [], viewDate, weekStartsOn, excluded = [], viewStart = dateAdapter.startOfMonth(viewDate), viewEnd = dateAdapter.endOfMonth(viewDate), weekendDays, }) {
    if (!events) {
        events = [];
    }
    const { startOfWeek, endOfWeek, differenceInDays, startOfDay, addHours, endOfDay, isSameMonth, getDay, getMonth, } = dateAdapter;
    const start = startOfWeek(viewStart, { weekStartsOn });
    const end = endOfWeek(viewEnd, { weekStartsOn });
    const eventsInMonth = getEventsInPeriod(dateAdapter, {
        events,
        periodStart: start,
        periodEnd: end,
    });
    const initialViewDays = [];
    let previousDate;
    for (let i = 0; i < differenceInDays(end, start) + 1; i++) {
        // hacky fix for https://github.com/mattlewis92/angular-calendar/issues/173
        let date;
        if (previousDate) {
            date = startOfDay(addHours(previousDate, HOURS_IN_DAY));
            if (previousDate.getTime() === date.getTime()) {
                // DST change, so need to add 25 hours
                /* istanbul ignore next */
                date = startOfDay(addHours(previousDate, HOURS_IN_DAY + 1));
            }
            previousDate = date;
        }
        else {
            date = previousDate = start;
        }
        if (!excluded.some((e) => getDay(date) === e)) {
            const day = getWeekDay(dateAdapter, {
                date,
                weekendDays,
            });
            const eventsInPeriod = getEventsInPeriod(dateAdapter, {
                events: eventsInMonth,
                periodStart: startOfDay(date),
                periodEnd: endOfDay(date),
            });
            day.inMonth = isSameMonth(date, viewDate);
            day.events = eventsInPeriod;
            day.badgeTotal = eventsInPeriod.length;
            initialViewDays.push(day);
        }
    }
    let days = [];
    const totalDaysVisibleInWeek = DAYS_IN_WEEK - excluded.length;
    if (totalDaysVisibleInWeek < DAYS_IN_WEEK) {
        for (let i = 0; i < initialViewDays.length; i += totalDaysVisibleInWeek) {
            const row = initialViewDays.slice(i, i + totalDaysVisibleInWeek);
            const isRowInMonth = row.some((day) => viewStart <= day.date && day.date < viewEnd);
            if (isRowInMonth) {
                days = [...days, ...row];
            }
        }
    }
    else {
        days = initialViewDays;
    }
    const rows = Math.floor(days.length / totalDaysVisibleInWeek);
    const rowOffsets = [];
    for (let i = 0; i < rows; i++) {
        rowOffsets.push(i * totalDaysVisibleInWeek);
    }
    return {
        rowOffsets,
        totalDaysVisibleInWeek,
        days,
        period: {
            start: days[0].date,
            end: endOfDay(days[days.length - 1].date),
            events: eventsInMonth,
        },
    };
}
function getOverLappingWeekViewEvents(events, top, bottom) {
    return events.filter((previousEvent) => {
        const previousEventTop = previousEvent.top;
        const previousEventBottom = previousEvent.top + previousEvent.height;
        if (top < previousEventBottom && previousEventBottom < bottom) {
            return true;
        }
        else if (top < previousEventTop && previousEventTop < bottom) {
            return true;
        }
        else if (previousEventTop <= top && bottom <= previousEventBottom) {
            return true;
        }
        return false;
    });
}
function getDayView(dateAdapter, { events, viewDate, hourSegments, dayStart, dayEnd, eventWidth, segmentHeight, hourDuration, minimumEventHeight, }) {
    const { setMinutes, setHours, startOfDay, startOfMinute, endOfDay, differenceInMinutes, } = dateAdapter;
    const startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
    const endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
    endOfView.setSeconds(59, 999);
    const previousDayEvents = [];
    const eventsInPeriod = getEventsInPeriod(dateAdapter, {
        events: events.filter((event) => !event.allDay),
        periodStart: startOfView,
        periodEnd: endOfView,
    });
    const dayViewEvents = eventsInPeriod
        .sort((eventA, eventB) => {
        return eventA.start.valueOf() - eventB.start.valueOf();
    })
        .map((event) => {
        const eventStart = event.start;
        const eventEnd = event.end || eventStart;
        const startsBeforeDay = eventStart < startOfView;
        const endsAfterDay = eventEnd > endOfView;
        const hourHeightModifier = (hourSegments * segmentHeight) / (hourDuration || MINUTES_IN_HOUR);
        let top = 0;
        if (eventStart > startOfView) {
            // adjust the difference in minutes if the user's offset is different between the start of the day and the event (e.g. when going to or from DST)
            const eventOffset = eventStart.getTimezoneOffset();
            const startOffset = startOfView.getTimezoneOffset();
            const diff = startOffset - eventOffset;
            top += differenceInMinutes(eventStart, startOfView) + diff;
        }
        top *= hourHeightModifier;
        const startDate = startsBeforeDay ? startOfView : eventStart;
        const endDate = endsAfterDay ? endOfView : eventEnd;
        let height = differenceInMinutes(endDate, startDate);
        if (!event.end) {
            height = segmentHeight;
        }
        else {
            height *= hourHeightModifier;
        }
        if (minimumEventHeight && height < minimumEventHeight) {
            height = minimumEventHeight;
        }
        const bottom = top + height;
        const overlappingPreviousEvents = getOverLappingWeekViewEvents(previousDayEvents, top, bottom);
        let left = 0;
        while (overlappingPreviousEvents.some((previousEvent) => previousEvent.left === left)) {
            left += eventWidth;
        }
        const dayEvent = {
            event,
            height,
            width: eventWidth,
            top,
            left,
            startsBeforeDay,
            endsAfterDay,
        };
        previousDayEvents.push(dayEvent);
        return dayEvent;
    });
    const width = Math.max(...dayViewEvents.map((event) => event.left + event.width));
    const allDayEvents = getEventsInPeriod(dateAdapter, {
        events: events.filter((event) => event.allDay),
        periodStart: startOfDay(startOfView),
        periodEnd: endOfDay(endOfView),
    });
    return {
        events: dayViewEvents,
        width,
        allDayEvents,
        period: {
            events: eventsInPeriod,
            start: startOfView,
            end: endOfView,
        },
    };
}
function sanitiseHours(hours) {
    return Math.max(Math.min(23, hours), 0);
}
function sanitiseMinutes(minutes) {
    return Math.max(Math.min(59, minutes), 0);
}
function getDayViewHourGrid(dateAdapter, { viewDate, hourSegments, hourDuration, dayStart, dayEnd, }) {
    const { setMinutes, setHours, startOfDay, startOfMinute, endOfDay, addMinutes, addHours, addDays, } = dateAdapter;
    const hours = [];
    let startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
    let endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
    const segmentDuration = (hourDuration || MINUTES_IN_HOUR) / hourSegments;
    let startOfViewDay = startOfDay(viewDate);
    const endOfViewDay = endOfDay(viewDate);
    let dateAdjustment = (d) => d;
    // this means that we change from or to DST on this day and that's going to cause problems so we bump the date
    if (startOfViewDay.getTimezoneOffset() !== endOfViewDay.getTimezoneOffset()) {
        startOfViewDay = addDays(startOfViewDay, 1);
        startOfView = addDays(startOfView, 1);
        endOfView = addDays(endOfView, 1);
        dateAdjustment = (d) => addDays(d, -1);
    }
    const dayDuration = hourDuration
        ? (HOURS_IN_DAY * 60) / hourDuration
        : MINUTES_IN_HOUR;
    for (let i = 0; i < dayDuration; i++) {
        const segments = [];
        for (let j = 0; j < hourSegments; j++) {
            const date = addMinutes(addMinutes(startOfView, i * (hourDuration || MINUTES_IN_HOUR)), j * segmentDuration);
            if (date >= startOfView && date < endOfView) {
                segments.push({
                    date: dateAdjustment(date),
                    displayDate: date,
                    isStart: j === 0,
                });
            }
        }
        if (segments.length > 0) {
            hours.push({ segments });
        }
    }
    return hours;
}
var EventValidationErrorMessage;
(function (EventValidationErrorMessage) {
    EventValidationErrorMessage["NotArray"] = "Events must be an array";
    EventValidationErrorMessage["StartPropertyMissing"] = "Event is missing the `start` property";
    EventValidationErrorMessage["StartPropertyNotDate"] = "Event `start` property should be a javascript date object. Do `new Date(event.start)` to fix it.";
    EventValidationErrorMessage["EndPropertyNotDate"] = "Event `end` property should be a javascript date object. Do `new Date(event.end)` to fix it.";
    EventValidationErrorMessage["EndsBeforeStart"] = "Event `start` property occurs after the `end`";
})(EventValidationErrorMessage || (EventValidationErrorMessage = {}));
function validateEvents(events, log) {
    let isValid = true;
    function isError(msg, event) {
        log(msg, event);
        isValid = false;
    }
    if (!Array.isArray(events)) {
        log(EventValidationErrorMessage.NotArray, events);
        return false;
    }
    events.forEach((event) => {
        if (!event.start) {
            isError(EventValidationErrorMessage.StartPropertyMissing, event);
        }
        else if (!(event.start instanceof Date)) {
            isError(EventValidationErrorMessage.StartPropertyNotDate, event);
        }
        if (event.end) {
            if (!(event.end instanceof Date)) {
                isError(EventValidationErrorMessage.EndPropertyNotDate, event);
            }
            if (event.start > event.end) {
                isError(EventValidationErrorMessage.EndsBeforeStart, event);
            }
        }
    });
    return isValid;
}

const validateEvents$1 = (events) => {
    const warn = (...args) => console.warn('angular-calendar', ...args);
    return validateEvents(events, warn);
};
function isInside(outer, inner) {
    return (Math.floor(outer.left) <= Math.ceil(inner.left) &&
        Math.floor(inner.left) <= Math.ceil(outer.right) &&
        Math.floor(outer.left) <= Math.ceil(inner.right) &&
        Math.floor(inner.right) <= Math.ceil(outer.right) &&
        Math.floor(outer.top) <= Math.ceil(inner.top) &&
        Math.floor(inner.top) <= Math.ceil(outer.bottom) &&
        Math.floor(outer.top) <= Math.ceil(inner.bottom) &&
        Math.floor(inner.bottom) <= Math.ceil(outer.bottom));
}
function roundToNearest(amount, precision) {
    return Math.round(amount / precision) * precision;
}
const trackByEventId = (index, event) => event.id ? event.id : event;
const trackByWeekDayHeaderDate = (index, day) => day.date.toISOString();
const trackByHourSegment = (index, segment) => segment.date.toISOString();
const trackByHour = (index, hour) => hour.segments[0].date.toISOString();
const trackByWeekAllDayEvent = (index, weekEvent) => (weekEvent.event.id ? weekEvent.event.id : weekEvent.event);
const trackByWeekTimeEvent = (index, weekEvent) => (weekEvent.event.id ? weekEvent.event.id : weekEvent.event);
const MINUTES_IN_HOUR$1 = 60;
function getPixelAmountInMinutes(hourSegments, hourSegmentHeight) {
    return MINUTES_IN_HOUR$1 / (hourSegments * hourSegmentHeight);
}
function getMinutesMoved(movedY, hourSegments, hourSegmentHeight, eventSnapSize) {
    const draggedInPixelsSnapSize = roundToNearest(movedY, eventSnapSize || hourSegmentHeight);
    const pixelAmountInMinutes = getPixelAmountInMinutes(hourSegments, hourSegmentHeight);
    return draggedInPixelsSnapSize * pixelAmountInMinutes;
}
function getMinimumEventHeightInMinutes(hourSegments, hourSegmentHeight) {
    return (getPixelAmountInMinutes(hourSegments, hourSegmentHeight) * hourSegmentHeight);
}
function getDefaultEventEnd(dateAdapter, event, minimumMinutes) {
    if (event.end) {
        return event.end;
    }
    else {
        return dateAdapter.addMinutes(event.start, minimumMinutes);
    }
}
function addDaysWithExclusions(dateAdapter, date, days, excluded) {
    let daysCounter = 0;
    let daysToAdd = 0;
    const changeDays = days < 0 ? dateAdapter.subDays : dateAdapter.addDays;
    let result = date;
    while (daysToAdd <= Math.abs(days)) {
        result = changeDays(date, daysCounter);
        const day = dateAdapter.getDay(result);
        if (excluded.indexOf(day) === -1) {
            daysToAdd++;
        }
        daysCounter++;
    }
    return result;
}
function isDraggedWithinPeriod(newStart, newEnd, period) {
    const end = newEnd || newStart;
    return ((period.start <= newStart && newStart <= period.end) ||
        (period.start <= end && end <= period.end));
}
function shouldFireDroppedEvent(dropEvent, date, allDay, calendarId) {
    return (dropEvent.dropData &&
        dropEvent.dropData.event &&
        (dropEvent.dropData.calendarId !== calendarId ||
            (dropEvent.dropData.event.allDay && !allDay) ||
            (!dropEvent.dropData.event.allDay && allDay)));
}
function getWeekViewPeriod(dateAdapter, viewDate, weekStartsOn, excluded = [], daysInWeek) {
    let viewStart = daysInWeek
        ? dateAdapter.startOfDay(viewDate)
        : dateAdapter.startOfWeek(viewDate, { weekStartsOn });
    const endOfWeek = dateAdapter.endOfWeek(viewDate, { weekStartsOn });
    while (excluded.indexOf(dateAdapter.getDay(viewStart)) > -1 &&
        viewStart < endOfWeek) {
        viewStart = dateAdapter.addDays(viewStart, 1);
    }
    if (daysInWeek) {
        const viewEnd = dateAdapter.endOfDay(addDaysWithExclusions(dateAdapter, viewStart, daysInWeek - 1, excluded));
        return { viewStart, viewEnd };
    }
    else {
        let viewEnd = endOfWeek;
        while (excluded.indexOf(dateAdapter.getDay(viewEnd)) > -1 &&
            viewEnd > viewStart) {
            viewEnd = dateAdapter.subDays(viewEnd, 1);
        }
        return { viewStart, viewEnd };
    }
}
function isWithinThreshold({ x, y }) {
    const DRAG_THRESHOLD = 1;
    return Math.abs(x) > DRAG_THRESHOLD || Math.abs(y) > DRAG_THRESHOLD;
}

/**
 * This will use the angular date pipe to do all date formatting. It is the default date formatter used by the calendar.
 */
let CalendarAngularDateFormatter = class CalendarAngularDateFormatter {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
    }
    /**
     * The month view header week day labels
     */
    monthViewColumnHeader({ date, locale }) {
        return formatDate(date, 'EEEE', locale);
    }
    /**
     * The month view cell day number
     */
    monthViewDayNumber({ date, locale }) {
        return formatDate(date, 'd', locale);
    }
    /**
     * The month view title
     */
    monthViewTitle({ date, locale }) {
        return formatDate(date, 'LLLL y', locale);
    }
    /**
     * The week view header week day labels
     */
    weekViewColumnHeader({ date, locale }) {
        return formatDate(date, 'EEEE', locale);
    }
    /**
     * The week view sub header day and month labels
     */
    weekViewColumnSubHeader({ date, locale, }) {
        return formatDate(date, 'MMM d', locale);
    }
    /**
     * The week view title
     */
    weekViewTitle({ date, locale, weekStartsOn, excludeDays, daysInWeek, }) {
        const { viewStart, viewEnd } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
        const format = (dateToFormat, showYear) => formatDate(dateToFormat, 'MMM d' + (showYear ? ', yyyy' : ''), locale);
        return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
    }
    /**
     * The time formatting down the left hand side of the week view
     */
    weekViewHour({ date, locale }) {
        return formatDate(date, 'h a', locale);
    }
    /**
     * The time formatting down the left hand side of the day view
     */
    dayViewHour({ date, locale }) {
        return formatDate(date, 'h a', locale);
    }
    /**
     * The day view title
     */
    dayViewTitle({ date, locale }) {
        return formatDate(date, 'EEEE, MMMM d, y', locale);
    }
    eventStartDateTitle({ date, locale, }) {
        return formatDate(date, 'd. MMMM y / HH:mm', locale);
    }
    eventStartTimeTitle({ date, locale, }) {
        return formatDate(date, 'HH:mm', locale);
    }
    eventEndTimeTitle({ date, locale, }) {
        return formatDate(date, 'HH:mm', locale);
    }
};
CalendarAngularDateFormatter.ctorParameters = () => [
    { type: DateAdapter }
];
CalendarAngularDateFormatter = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DateAdapter])
], CalendarAngularDateFormatter);

/**
 * This class is responsible for all formatting of dates. There are 3 implementations available, the `CalendarAngularDateFormatter` (default) which uses the angular date pipe to format dates, the `CalendarNativeDateFormatter` which will use the <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to format dates, or there is the `CalendarMomentDateFormatter` which uses <a href="http://momentjs.com/" target="_blank">moment</a>.
 *
 * If you wish, you may override any of the defaults via angulars DI. For example:
 *
 * ```typescript
 * import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
 * import { formatDate } from '@angular/common';
 * import { Injectable } from '@angular/core';
 *
 * @Injectable()
 * class CustomDateFormatter extends CalendarDateFormatter {
 *
 *   public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
 *     return formatDate(date, 'EEE', locale); // use short week days
 *   }
 *
 * }
 *
 * // in your component that uses the calendar
 * providers: [{
 *   provide: CalendarDateFormatter,
 *   useClass: CustomDateFormatter
 * }]
 * ```
 */
let CalendarDateFormatter = class CalendarDateFormatter extends CalendarAngularDateFormatter {
};
CalendarDateFormatter = __decorate([
    Injectable()
], CalendarDateFormatter);

/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
let CalendarDatePipe = class CalendarDatePipe {
    constructor(dateFormatter, locale) {
        this.dateFormatter = dateFormatter;
        this.locale = locale;
    }
    transform(date, method, locale = this.locale, weekStartsOn = 0, excludeDays = [], daysInWeek) {
        if (typeof this.dateFormatter[method] === 'undefined') {
            const allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarDateFormatter.prototype)).filter((iMethod) => iMethod !== 'constructor');
            throw new Error(`${method} is not a valid date formatter. Can only be one of ${allowedMethods.join(', ')}`);
        }
        return this.dateFormatter[method]({
            date,
            locale,
            weekStartsOn,
            excludeDays,
            daysInWeek,
        });
    }
};
CalendarDatePipe.ctorParameters = () => [
    { type: CalendarDateFormatter },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];
CalendarDatePipe = __decorate([
    Pipe({
        name: 'calendarDate',
    }),
    __param(1, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [CalendarDateFormatter, String])
], CalendarDatePipe);

let CalendarEventActionsComponent = class CalendarEventActionsComponent {
    constructor() {
        this.trackByActionId = (index, action) => action.id ? action.id : action;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarEventActionsComponent.prototype, "event", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarEventActionsComponent.prototype, "customTemplate", void 0);
CalendarEventActionsComponent = __decorate([
    Component({
        selector: 'mwl-calendar-event-actions',
        template: `
    <ng-template
      #defaultTemplate
      let-event="event"
      let-trackByActionId="trackByActionId"
    >
      <span *ngIf="event.actions" class="cal-event-actions">
        <a
          class="cal-event-action"
          href="javascript:;"
          *ngFor="let action of event.actions; trackBy: trackByActionId"
          (mwlClick)="action.onClick({ event: event, sourceEvent: $event })"
          (mwlKeydownEnter)="
            action.onClick({ event: event, sourceEvent: $event })
          "
          [ngClass]="action.cssClass"
          [innerHtml]="action.label"
          tabindex="0"
          role="button"
          [attr.aria-label]="
            { action: action } | calendarA11y: 'actionButtonLabel'
          "
        >
        </a>
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        trackByActionId: trackByActionId
      }"
    >
    </ng-template>
  `
    })
], CalendarEventActionsComponent);

/**
 * This class is responsible for displaying all event titles within the calendar. You may override any of its methods via angulars DI to suit your requirements. For example:
 *
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { CalendarEventTitleFormatter, MCCalendarEvent } from 'angular-calendar';
 *
 * @Injectable()
 * class CustomEventTitleFormatter extends MCCalendarEventTitleFormatter {
 *
 *   month(event: MCCalendarEvent): string {
 *     return `Custom prefix: ${event.title}`;
 *   }
 *
 * }
 *
 * // in your component
 * providers: [{
 *  provide: MCCalendarEventTitleFormatter,
 *  useClass: CustomEventTitleFormatter
 * }]
 * ```
 */
class CalendarEventTitleFormatter {
    /**
     * The month view event title.
     */
    month(event, title) {
        return event.title;
    }
    /**
     * The month view event tooltip. Return a falsey value from this to disable the tooltip.
     */
    monthTooltip(event, title) {
        return event.title;
    }
    /**
     * The week view event title.
     */
    week(event, title) {
        return event.title;
    }
    /**
     * The week view event tooltip. Return a falsey value from this to disable the tooltip.
     */
    weekTooltip(event, title) {
        return event.title;
    }
    /**
     * The day view event title.
     */
    day(event, title) {
        return event.title;
    }
    /**
     * The day view event tooltip. Return a falsey value from this to disable the tooltip.
     */
    dayTooltip(event, title) {
        return event.title;
    }
}

let CalendarEventTitleComponent = class CalendarEventTitleComponent {
    constructor() {
        this.quicklinkClick = new EventEmitter();
        this.isLive = false;
    }
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
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarEventTitleComponent.prototype, "event", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarEventTitleComponent.prototype, "customTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarEventTitleComponent.prototype, "view", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CalendarEventTitleComponent.prototype, "quicklinkClick", void 0);
CalendarEventTitleComponent = __decorate([
    Component({
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
  `
    })
], CalendarEventTitleComponent);

let CalendarEventTitlePipe = class CalendarEventTitlePipe {
    constructor(calendarEventTitle) {
        this.calendarEventTitle = calendarEventTitle;
    }
    transform(title, titleType, event) {
        return this.calendarEventTitle[titleType](event, title);
    }
};
CalendarEventTitlePipe.ctorParameters = () => [
    { type: CalendarEventTitleFormatter }
];
CalendarEventTitlePipe = __decorate([
    Pipe({
        name: 'calendarEventTitle',
    }),
    __metadata("design:paramtypes", [CalendarEventTitleFormatter])
], CalendarEventTitlePipe);

var CalendarView;
(function (CalendarView) {
    CalendarView["Month"] = "month";
    CalendarView["Week"] = "week";
    CalendarView["Day"] = "day";
})(CalendarView || (CalendarView = {}));

/**
 * Change the view date to the next view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarNextView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Next
 * </button>
 * ```
 */
let CalendarNextViewDirective = class CalendarNextViewDirective {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
        /**
         * Days to skip when going forward by 1 day
         */
        this.excludeDays = [];
        this.stepDays = 1;
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     */
    onClick() {
        const addFn = {
            day: this.dateAdapter.addDays,
            week: this.dateAdapter.addWeeks,
            month: this.dateAdapter.addMonths,
        }[this.view];
        if (this.view === CalendarView.Day) {
            this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, this.stepDays, this.excludeDays));
        }
        else if (this.view === CalendarView.Week && this.daysInWeek) {
            this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, this.daysInWeek, this.excludeDays));
        }
        else {
            this.viewDateChange.emit(addFn(this.viewDate, 1));
        }
    }
};
CalendarNextViewDirective.ctorParameters = () => [
    { type: DateAdapter }
];
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarNextViewDirective.prototype, "view", void 0);
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarNextViewDirective.prototype, "viewDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarNextViewDirective.prototype, "excludeDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarNextViewDirective.prototype, "stepDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarNextViewDirective.prototype, "daysInWeek", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CalendarNextViewDirective.prototype, "viewDateChange", void 0);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarNextViewDirective.prototype, "onClick", null);
CalendarNextViewDirective = __decorate([
    Directive({
        selector: '[mwlCalendarNextView]',
    }),
    __metadata("design:paramtypes", [DateAdapter])
], CalendarNextViewDirective);

/**
 * Change the view date to the previous view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarPreviousView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Previous
 * </button>
 * ```
 */
let CalendarPreviousViewDirective = class CalendarPreviousViewDirective {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
        /**
         * Days to skip when going back by 1 day
         */
        this.excludeDays = [];
        this.stepDays = 1;
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     */
    onClick() {
        const subFn = {
            day: this.dateAdapter.subDays,
            week: this.dateAdapter.subWeeks,
            month: this.dateAdapter.subMonths,
        }[this.view];
        if (this.view === CalendarView.Day) {
            this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -(this.stepDays), this.excludeDays));
        }
        else if (this.view === CalendarView.Week && this.daysInWeek) {
            this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -this.daysInWeek, this.excludeDays));
        }
        else {
            this.viewDateChange.emit(subFn(this.viewDate, 1));
        }
    }
};
CalendarPreviousViewDirective.ctorParameters = () => [
    { type: DateAdapter }
];
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarPreviousViewDirective.prototype, "view", void 0);
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarPreviousViewDirective.prototype, "viewDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarPreviousViewDirective.prototype, "excludeDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarPreviousViewDirective.prototype, "stepDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarPreviousViewDirective.prototype, "daysInWeek", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CalendarPreviousViewDirective.prototype, "viewDateChange", void 0);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarPreviousViewDirective.prototype, "onClick", null);
CalendarPreviousViewDirective = __decorate([
    Directive({
        selector: '[mwlCalendarPreviousView]',
    }),
    __metadata("design:paramtypes", [DateAdapter])
], CalendarPreviousViewDirective);

/**
 * Change the view date to the current day. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarToday
 *  [(viewDate)]="viewDate">
 *  Today
 * </button>
 * ```
 */
let CalendarTodayDirective = class CalendarTodayDirective {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     */
    onClick() {
        this.viewDateChange.emit(this.dateAdapter.startOfDay(new Date()));
    }
};
CalendarTodayDirective.ctorParameters = () => [
    { type: DateAdapter }
];
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarTodayDirective.prototype, "viewDate", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CalendarTodayDirective.prototype, "viewDateChange", void 0);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarTodayDirective.prototype, "onClick", null);
CalendarTodayDirective = __decorate([
    Directive({
        selector: '[mwlCalendarToday]',
    }),
    __metadata("design:paramtypes", [DateAdapter])
], CalendarTodayDirective);

let CalendarTooltipWindowComponent = class CalendarTooltipWindowComponent {
};
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarTooltipWindowComponent.prototype, "contents", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarTooltipWindowComponent.prototype, "placement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarTooltipWindowComponent.prototype, "event", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarTooltipWindowComponent.prototype, "customTemplate", void 0);
CalendarTooltipWindowComponent = __decorate([
    Component({
        selector: 'mwl-calendar-tooltip-window',
        template: `
    <ng-template
      #defaultTemplate
      let-contents="contents"
      let-placement="placement"
      let-event="event"
    >
      <div class="cal-tooltip" [ngClass]="'cal-tooltip-' + placement">
        <div class="cal-tooltip-arrow"></div>
        <div class="cal-tooltip-inner" [innerHtml]="contents"></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        contents: contents,
        placement: placement,
        event: event
      }"
    >
    </ng-template>
  `
    })
], CalendarTooltipWindowComponent);
let CalendarTooltipDirective = class CalendarTooltipDirective {
    constructor(elementRef, injector, renderer, componentFactoryResolver, viewContainerRef, document //tslint:disable-line
    ) {
        this.elementRef = elementRef;
        this.injector = injector;
        this.renderer = renderer;
        this.viewContainerRef = viewContainerRef;
        this.document = document;
        this.placement = 'auto'; // tslint:disable-line no-input-rename
        this.delay = null; // tslint:disable-line no-input-rename
        this.cancelTooltipDelay$ = new Subject();
        this.tooltipFactory = componentFactoryResolver.resolveComponentFactory(CalendarTooltipWindowComponent);
    }
    ngOnChanges(changes) {
        if (this.tooltipRef &&
            (changes.contents || changes.customTemplate || changes.event)) {
            this.tooltipRef.instance.contents = this.contents;
            this.tooltipRef.instance.customTemplate = this.customTemplate;
            this.tooltipRef.instance.event = this.event;
            this.tooltipRef.changeDetectorRef.markForCheck();
            if (!this.contents) {
                this.hide();
            }
        }
    }
    ngOnDestroy() {
        this.hide();
    }
    onMouseOver() {
        const delay$ = this.delay === null ? of('now') : timer(this.delay);
        delay$.pipe(takeUntil(this.cancelTooltipDelay$)).subscribe(() => {
            this.show();
        });
    }
    onMouseOut() {
        this.hide();
    }
    show() {
        if (!this.tooltipRef && this.contents) {
            this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipFactory, 0, this.injector, []);
            this.tooltipRef.instance.contents = this.contents;
            this.tooltipRef.instance.customTemplate = this.customTemplate;
            this.tooltipRef.instance.event = this.event;
            if (this.appendToBody) {
                this.document.body.appendChild(this.tooltipRef.location.nativeElement);
            }
            requestAnimationFrame(() => {
                this.positionTooltip();
            });
        }
    }
    hide() {
        if (this.tooltipRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.tooltipRef.hostView));
            this.tooltipRef = null;
        }
        this.cancelTooltipDelay$.next();
    }
    positionTooltip(previousPositions = []) {
        if (this.tooltipRef) {
            this.tooltipRef.changeDetectorRef.detectChanges();
            this.tooltipRef.instance.placement = positionElements(this.elementRef.nativeElement, this.tooltipRef.location.nativeElement.children[0], this.placement, this.appendToBody);
            // keep re-positioning the tooltip until the arrow position doesn't make a difference
            if (previousPositions.indexOf(this.tooltipRef.instance.placement) === -1) {
                this.positionTooltip([
                    ...previousPositions,
                    this.tooltipRef.instance.placement,
                ]);
            }
        }
    }
};
CalendarTooltipDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Injector },
    { type: Renderer2 },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
__decorate([
    Input('mwlCalendarTooltip'),
    __metadata("design:type", String)
], CalendarTooltipDirective.prototype, "contents", void 0);
__decorate([
    Input('tooltipPlacement'),
    __metadata("design:type", Object)
], CalendarTooltipDirective.prototype, "placement", void 0);
__decorate([
    Input('tooltipTemplate'),
    __metadata("design:type", TemplateRef)
], CalendarTooltipDirective.prototype, "customTemplate", void 0);
__decorate([
    Input('tooltipEvent'),
    __metadata("design:type", Object)
], CalendarTooltipDirective.prototype, "event", void 0);
__decorate([
    Input('tooltipAppendToBody'),
    __metadata("design:type", Boolean)
], CalendarTooltipDirective.prototype, "appendToBody", void 0);
__decorate([
    Input('tooltipDelay'),
    __metadata("design:type", Number)
], CalendarTooltipDirective.prototype, "delay", void 0);
__decorate([
    HostListener('mouseenter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarTooltipDirective.prototype, "onMouseOver", null);
__decorate([
    HostListener('mouseleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarTooltipDirective.prototype, "onMouseOut", null);
CalendarTooltipDirective = __decorate([
    Directive({
        selector: '[mwlCalendarTooltip]',
    }),
    __param(5, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [ElementRef,
        Injector,
        Renderer2,
        ComponentFactoryResolver,
        ViewContainerRef, Object])
], CalendarTooltipDirective);

let CalendarUtils = class CalendarUtils {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
    }
    getMonthView(args) {
        return getMonthView(this.dateAdapter, args);
    }
    getWeekViewHeader(args) {
        return getWeekViewHeader(this.dateAdapter, args);
    }
    getWeekView(args) {
        return getWeekView(this.dateAdapter, args);
    }
};
CalendarUtils.ctorParameters = () => [
    { type: DateAdapter }
];
CalendarUtils = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DateAdapter])
], CalendarUtils);

let ClickDirective = class ClickDirective {
    constructor(renderer, elm, document) {
        this.renderer = renderer;
        this.elm = elm;
        this.document = document;
        this.clickListenerDisabled = false;
        this.click = new EventEmitter(); // tslint:disable-line
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        if (!this.clickListenerDisabled) {
            this.listen()
                .pipe(takeUntil(this.destroy$))
                .subscribe((event) => {
                event.stopPropagation();
                this.click.emit(event);
            });
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
    listen() {
        return new Observable((observer) => {
            return this.renderer.listen(this.elm.nativeElement, 'click', (event) => {
                observer.next(event);
            });
        });
    }
};
ClickDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
__decorate([
    Input(),
    __metadata("design:type", Object)
], ClickDirective.prototype, "clickListenerDisabled", void 0);
__decorate([
    Output('mwlClick'),
    __metadata("design:type", Object)
], ClickDirective.prototype, "click", void 0);
ClickDirective = __decorate([
    Directive({
        selector: '[mwlClick]',
    }),
    __param(2, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [Renderer2,
        ElementRef, Object])
], ClickDirective);

let KeydownEnterDirective = class KeydownEnterDirective {
    constructor() {
        this.keydown = new EventEmitter(); // tslint:disable-line
    }
    onKeyPress(event) {
        if (event.keyCode === 13 || event.which === 13 || event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.keydown.emit(event);
        }
    }
};
__decorate([
    Output('mwlKeydownEnter'),
    __metadata("design:type", Object)
], KeydownEnterDirective.prototype, "keydown", void 0);
__decorate([
    HostListener('keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KeydownEnterDirective.prototype, "onKeyPress", null);
KeydownEnterDirective = __decorate([
    Directive({
        selector: '[mwlKeydownEnter]',
    })
], KeydownEnterDirective);

var CalendarEventTimesChangedEventType;
(function (CalendarEventTimesChangedEventType) {
    CalendarEventTimesChangedEventType["Drag"] = "drag";
    CalendarEventTimesChangedEventType["Drop"] = "drop";
    CalendarEventTimesChangedEventType["Resize"] = "resize";
})(CalendarEventTimesChangedEventType || (CalendarEventTimesChangedEventType = {}));

const MOMENT = new InjectionToken('Moment');
/**
 * This will use <a href="http://momentjs.com/" target="_blank">moment</a> to do all date formatting. To use this class:
 *
 * ```typescript
 * import { CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
 * import moment from 'moment';
 *
 * // in your component
 * provide: [{
 *   provide: MOMENT, useValue: moment
 * }, {
 *   provide: CalendarDateFormatter, useClass: CalendarMomentDateFormatter
 * }]
 *
 * ```
 */
let CalendarMomentDateFormatter = class CalendarMomentDateFormatter {
    /**
     * @hidden
     */
    constructor(moment, dateAdapter) {
        this.moment = moment;
        this.dateAdapter = dateAdapter;
    }
    /**
     * The month view header week day labels
     */
    monthViewColumnHeader({ date, locale }) {
        return this.moment(date).locale(locale).format('dddd');
    }
    /**
     * The month view cell day number
     */
    monthViewDayNumber({ date, locale }) {
        return this.moment(date).locale(locale).format('D');
    }
    /**
     * The month view title
     */
    monthViewTitle({ date, locale }) {
        return this.moment(date).locale(locale).format('MMMM YYYY');
    }
    /**
     * The week view header week day labels
     */
    weekViewColumnHeader({ date, locale }) {
        return this.moment(date).locale(locale).format('dddd');
    }
    /**
     * The week view sub header day and month labels
     */
    weekViewColumnSubHeader({ date, locale, }) {
        return this.moment(date).locale(locale).format('MMM D');
    }
    /**
     * The week view title
     */
    weekViewTitle({ date, locale, weekStartsOn, excludeDays, daysInWeek, }) {
        const { viewStart, viewEnd } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
        const format = (dateToFormat, showYear) => this.moment(dateToFormat)
            .locale(locale)
            .format('MMM D' + (showYear ? ', YYYY' : ''));
        return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
    }
    /**
     * The time formatting down the left hand side of the week view
     */
    weekViewHour({ date, locale }) {
        return this.moment(date).locale(locale).format('ha');
    }
    /**
     * The time formatting down the left hand side of the day view
     */
    dayViewHour({ date, locale }) {
        return this.moment(date).locale(locale).format('ha');
    }
    /**
     * The day view title
     */
    dayViewTitle({ date, locale }) {
        return this.moment(date).locale(locale).format('dddd, D MMMM, YYYY');
    }
};
CalendarMomentDateFormatter.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [MOMENT,] }] },
    { type: DateAdapter }
];
CalendarMomentDateFormatter = __decorate([
    Injectable(),
    __param(0, Inject(MOMENT)),
    __metadata("design:paramtypes", [Object, DateAdapter])
], CalendarMomentDateFormatter);

/**
 * This will use <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to do all date formatting.
 *
 * You will need to include a <a href="https://github.com/andyearnshaw/Intl.js/">polyfill</a> for older browsers.
 */
let CalendarNativeDateFormatter = class CalendarNativeDateFormatter {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
    }
    /**
     * The month view header week day labels
     */
    monthViewColumnHeader({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    }
    /**
     * The month view cell day number
     */
    monthViewDayNumber({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(date);
    }
    /**
     * The month view title
     */
    monthViewTitle({ date, locale }) {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
        }).format(date);
    }
    /**
     * The week view header week day labels
     */
    weekViewColumnHeader({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    }
    /**
     * The week view sub header day and month labels
     */
    weekViewColumnSubHeader({ date, locale, }) {
        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
        }).format(date);
    }
    /**
     * The week view title
     */
    weekViewTitle({ date, locale, weekStartsOn, excludeDays, daysInWeek, }) {
        const { viewStart, viewEnd } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
        const format = (dateToFormat, showYear) => new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
            year: showYear ? 'numeric' : undefined,
        }).format(dateToFormat);
        return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
    }
    /**
     * The time formatting down the left hand side of the week view
     */
    weekViewHour({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
    }
    /**
     * The time formatting down the left hand side of the day view
     */
    dayViewHour({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
    }
    /**
     * The day view title
     */
    dayViewTitle({ date, locale }) {
        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        }).format(date);
    }
};
CalendarNativeDateFormatter.ctorParameters = () => [
    { type: DateAdapter }
];
CalendarNativeDateFormatter = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DateAdapter])
], CalendarNativeDateFormatter);

var CalendarCommonModule_1;
/**
 * Import this module to if you're just using a singular view and want to save on bundle size. Example usage:
 *
 * ```typescript
 * import { CalendarCommonModule, CalendarMonthModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalendarCommonModule.forRoot(),
 *     CalendarMonthModule
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
let CalendarCommonModule = CalendarCommonModule_1 = class CalendarCommonModule {
    static forRoot(dateAdapter, config = {}) {
        return {
            ngModule: CalendarCommonModule_1,
            providers: [
                dateAdapter,
                config.eventTitleFormatter || CalendarEventTitleFormatter,
                config.dateFormatter || CalendarDateFormatter,
                config.utils || CalendarUtils,
                config.a11y || CalendarA11y,
            ],
        };
    }
};
CalendarCommonModule = CalendarCommonModule_1 = __decorate([
    NgModule({
        declarations: [
            CalendarEventActionsComponent,
            CalendarEventTitleComponent,
            CalendarTooltipWindowComponent,
            CalendarTooltipDirective,
            CalendarPreviousViewDirective,
            CalendarNextViewDirective,
            CalendarTodayDirective,
            CalendarDatePipe,
            CalendarEventTitlePipe,
            CalendarA11yPipe,
            ClickDirective,
            KeydownEnterDirective
        ],
        imports: [CommonModule],
        exports: [
            CalendarEventActionsComponent,
            CalendarEventTitleComponent,
            CalendarTooltipWindowComponent,
            CalendarTooltipDirective,
            CalendarPreviousViewDirective,
            CalendarNextViewDirective,
            CalendarTodayDirective,
            CalendarDatePipe,
            CalendarEventTitlePipe,
            CalendarA11yPipe,
            ClickDirective,
            KeydownEnterDirective,
        ],
        providers: [I18nPluralPipe],
        entryComponents: [CalendarTooltipWindowComponent],
    })
], CalendarCommonModule);

/**
 * Shows all events on a given day. Example usage:
 *
 * ```typescript
 * <mwl-calendar-day-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-day-view>
 * ```
 */
let CalendarDayViewComponent = class CalendarDayViewComponent {
    constructor() {
        /**
         * An array of events to display on view
         * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
         */
        this.events = [];
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
         * The placement of the event tooltip
         */
        this.tooltipPlacement = 'auto';
        this.tooltipDisabled = true;
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
         * Whether to snap events to a grid when dragging
         */
        this.snapDraggedEvents = true;
        /**
         * Called when an event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when an hour segment is clicked
         */
        this.hourSegmentClicked = new EventEmitter();
        /**
         * Called when an event is resized or dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        /**
         * An output that will be called before the view is rendered for the current day.
         * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
         */
        this.beforeViewRender = new EventEmitter();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarDayViewComponent.prototype, "viewDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarDayViewComponent.prototype, "events", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarDayViewComponent.prototype, "hourSegments", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarDayViewComponent.prototype, "hourSegmentHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarDayViewComponent.prototype, "dayStartHour", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarDayViewComponent.prototype, "dayStartMinute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarDayViewComponent.prototype, "dayEndHour", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarDayViewComponent.prototype, "dayEndMinute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Subject)
], CalendarDayViewComponent.prototype, "refresh", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarDayViewComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarDayViewComponent.prototype, "eventSnapSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarDayViewComponent.prototype, "tooltipPlacement", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarDayViewComponent.prototype, "tooltipTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarDayViewComponent.prototype, "tooltipDisabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarDayViewComponent.prototype, "tooltipAppendToBody", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarDayViewComponent.prototype, "tooltipDelay", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarDayViewComponent.prototype, "hourSegmentTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarDayViewComponent.prototype, "eventTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarDayViewComponent.prototype, "eventTitleTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarDayViewComponent.prototype, "eventActionsTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarDayViewComponent.prototype, "snapDraggedEvents", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarDayViewComponent.prototype, "allDayEventsLabelTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarDayViewComponent.prototype, "currentTimeMarkerTemplate", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarDayViewComponent.prototype, "eventClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarDayViewComponent.prototype, "hourSegmentClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarDayViewComponent.prototype, "eventTimesChanged", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarDayViewComponent.prototype, "beforeViewRender", void 0);
CalendarDayViewComponent = __decorate([
    Component({
        selector: 'mwl-calendar-day-view',
        template: `
    <mwl-calendar-week-view
      class="cal-day-view"
      [daysInWeek]="1"
      [viewDate]="viewDate"
      [events]="events"
      [hourSegments]="hourSegments"
      [hourSegmentHeight]="hourSegmentHeight"
      [dayStartHour]="dayStartHour"
      [dayStartMinute]="dayStartMinute"
      [dayEndHour]="dayEndHour"
      [dayEndMinute]="dayEndMinute"
      [refresh]="refresh"
      [locale]="locale"
      [eventSnapSize]="eventSnapSize"
      [tooltipPlacement]="tooltipPlacement"
      [tooltipDisabled]="tooltipDisabled"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipAppendToBody]="tooltipAppendToBody"
      [tooltipDelay]="tooltipDelay"
      [hourSegmentTemplate]="hourSegmentTemplate"
      [eventTemplate]="eventTemplate"
      [eventTitleTemplate]="eventTitleTemplate"
      [eventActionsTemplate]="eventActionsTemplate"
      [snapDraggedEvents]="snapDraggedEvents"
      [allDayEventsLabelTemplate]="allDayEventsLabelTemplate"
      [currentTimeMarkerTemplate]="currentTimeMarkerTemplate"
      (eventClicked)="eventClicked.emit($event)"
      (hourSegmentClicked)="hourSegmentClicked.emit($event)"
      (eventTimesChanged)="eventTimesChanged.emit($event)"
      (beforeViewRender)="beforeViewRender.emit($event)"
    ></mwl-calendar-week-view>
  `
    })
], CalendarDayViewComponent);

let CalendarWeekViewCurrentTimeMarkerComponent = class CalendarWeekViewCurrentTimeMarkerComponent {
    constructor(dateAdapter, zone) {
        this.dateAdapter = dateAdapter;
        this.zone = zone;
        this.columnDate$ = new BehaviorSubject(this.columnDate);
        this.marker$ = this.zone.onStable.pipe(switchMap(() => interval(60 * 1000)), startWith(0), switchMapTo(this.columnDate$), map((columnDate) => {
            const startOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayStartHour), this.dayStartMinute);
            const endOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayEndHour), this.dayEndMinute);
            const hourHeightModifier = (this.hourSegments * this.hourSegmentHeight) / 60;
            const now = new Date();
            return {
                isVisible: this.dateAdapter.isSameDay(columnDate, now) &&
                    now >= startOfDay &&
                    now <= endOfDay,
                top: this.dateAdapter.differenceInMinutes(now, startOfDay) *
                    hourHeightModifier,
            };
        }));
    }
    ngOnChanges(changes) {
        if (changes.columnDate) {
            this.columnDate$.next(changes.columnDate.currentValue);
        }
    }
};
CalendarWeekViewCurrentTimeMarkerComponent.ctorParameters = () => [
    { type: DateAdapter },
    { type: NgZone }
];
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "columnDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "dayStartHour", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "dayStartMinute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "dayEndHour", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "dayEndMinute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "hourSegments", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "hourSegmentHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "customTemplate", void 0);
CalendarWeekViewCurrentTimeMarkerComponent = __decorate([
    Component({
        selector: 'mwl-calendar-week-view-current-time-marker',
        template: `
    <ng-template
      #defaultTemplate
      let-columnDate="columnDate"
      let-dayStartHour="dayStartHour"
      let-dayStartMinute="dayStartMinute"
      let-dayEndHour="dayEndHour"
      let-dayEndMinute="dayEndMinute"
      let-isVisible="isVisible"
      let-topPx="topPx"
    >
      <div
        class="cal-current-time-marker"
        *ngIf="isVisible"
        [style.top.px]="topPx"
      >
        <div style="position: absolute;height: 18px;width: 18px;top: -8px;left: -6px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px" style="fill: red;">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        columnDate: columnDate,
        dayStartHour: dayStartHour,
        dayStartMinute: dayStartMinute,
        dayEndHour: dayEndHour,
        dayEndMinute: dayEndMinute,
        isVisible: (marker$ | async)?.isVisible,
        topPx: (marker$ | async)?.top
      }"
    >
    </ng-template>
  `
    }),
    __metadata("design:paramtypes", [DateAdapter, NgZone])
], CalendarWeekViewCurrentTimeMarkerComponent);

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

let CalendarWeekViewHeaderComponent = class CalendarWeekViewHeaderComponent {
    constructor() {
        this.dayHeaderClicked = new EventEmitter();
        this.eventDropped = new EventEmitter();
        this.dragEnter = new EventEmitter();
        this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarWeekViewHeaderComponent.prototype, "days", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarWeekViewHeaderComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewHeaderComponent.prototype, "customTemplate", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewHeaderComponent.prototype, "dayHeaderClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewHeaderComponent.prototype, "eventDropped", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarWeekViewHeaderComponent.prototype, "dragEnter", void 0);
CalendarWeekViewHeaderComponent = __decorate([
    Component({
        selector: 'mwl-calendar-week-view-header',
        template: `
    <ng-template
      #defaultTemplate
      let-days="days"
      let-locale="locale"
      let-dayHeaderClicked="dayHeaderClicked"
      let-eventDropped="eventDropped"
      let-trackByWeekDayHeaderDate="trackByWeekDayHeaderDate"
      let-dragEnter="dragEnter"
    >
      <div class="cal-day-headers" role="row">
        <div
          class="cal-header"
          *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          [ngClass]="day.cssClass"
          (mwlClick)="dayHeaderClicked.emit({ day: day, sourceEvent: $event })"
          mwlDroppable
          dragOverClass="cal-drag-over"
          (drop)="
            eventDropped.emit({
              event: $event.dropData.event,
              newStart: day.date
            })
          "
          (dragEnter)="dragEnter.emit({ date: day.date })"
          tabindex="0"
          role="columnheader"
        >
          <b>{{ day.date | calendarDate: 'weekViewColumnHeader':locale }}</b
          ><br />
          <span>{{
            day.date | calendarDate: 'weekViewColumnSubHeader':locale
          }}</span>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        days: days,
        locale: locale,
        dayHeaderClicked: dayHeaderClicked,
        eventDropped: eventDropped,
        dragEnter: dragEnter,
        trackByWeekDayHeaderDate: trackByWeekDayHeaderDate
      }"
    >
    </ng-template>
  `
    })
], CalendarWeekViewHeaderComponent);

let CalendarWeekViewHourSegmentComponent = class CalendarWeekViewHourSegmentComponent {
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarWeekViewHourSegmentComponent.prototype, "segment", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewHourSegmentComponent.prototype, "segmentHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarWeekViewHourSegmentComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarWeekViewHourSegmentComponent.prototype, "isTimeLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewHourSegmentComponent.prototype, "daysInWeek", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewHourSegmentComponent.prototype, "customTemplate", void 0);
CalendarWeekViewHourSegmentComponent = __decorate([
    Component({
        selector: 'mwl-calendar-week-view-hour-segment',
        template: `
    <ng-template
      #defaultTemplate
      let-segment="segment"
      let-locale="locale"
      let-segmentHeight="segmentHeight"
      let-isTimeLabel="isTimeLabel"
      let-daysInWeek="daysInWeek"
    >
      <div
        [attr.aria-hidden]="
          {}
            | calendarA11y
              : (daysInWeek === 1
                  ? 'hideDayHourSegment'
                  : 'hideWeekHourSegment')
        "
        class="cal-hour-segment"
        [style.height.px]="segmentHeight"
        [class.cal-hour-start]="segment.isStart"
        [class.cal-after-hour-start]="!segment.isStart"
        [ngClass]="segment.cssClass"
      >
        <div class="cal-time" *ngIf="isTimeLabel" [style.height.px]="segmentHeight * 2">
          {{
            segment.displayDate
              | calendarDate
                : (daysInWeek === 1 ? 'dayViewHour' : 'weekViewHour')
                : locale
          }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        segment: segment,
        locale: locale,
        segmentHeight: segmentHeight,
        isTimeLabel: isTimeLabel,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `
    })
], CalendarWeekViewHourSegmentComponent);

class CalendarDragHelper {
    constructor(dragContainerElement, draggableElement) {
        this.dragContainerElement = dragContainerElement;
        this.startPosition = draggableElement.getBoundingClientRect();
    }
    validateDrag({ x, y, snapDraggedEvents, dragAlreadyMoved, transform, }) {
        if (snapDraggedEvents) {
            const newRect = Object.assign({}, this.startPosition, {
                left: this.startPosition.left + transform.x,
                right: this.startPosition.right + transform.x,
                top: this.startPosition.top + transform.y,
                bottom: this.startPosition.bottom + transform.y,
            });
            return ((isWithinThreshold({ x, y }) || dragAlreadyMoved) &&
                isInside(this.dragContainerElement.getBoundingClientRect(), newRect));
        }
        else {
            return isWithinThreshold({ x, y }) || dragAlreadyMoved;
        }
    }
}

class CalendarResizeHelper {
    constructor(resizeContainerElement, minWidth) {
        this.resizeContainerElement = resizeContainerElement;
        this.minWidth = minWidth;
    }
    validateResize({ rectangle }) {
        if (this.minWidth &&
            Math.ceil(rectangle.width) < Math.ceil(this.minWidth)) {
            return false;
        }
        return isInside(this.resizeContainerElement.getBoundingClientRect(), rectangle);
    }
}

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
            validateEvents$1(this.events);
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

let QuicklinksComponent = class QuicklinksComponent {
    constructor() {
        this.quicklinkClick = new EventEmitter();
        this.isLive = false;
    }
    ngOnChanges() {
        setInterval(() => {
            this.isLive =
                this.event.videoURL &&
                    new Date() >= this.event.start &&
                    new Date() < this.event.end;
        }, 60);
    }
    navigateToLink(link) {
        this.quicklinkClick.emit(link);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], QuicklinksComponent.prototype, "event", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], QuicklinksComponent.prototype, "quicklinkClick", void 0);
QuicklinksComponent = __decorate([
    Component({
        selector: 'mwl-mc-quicklinks',
        template: "<div class=\"mc-quicklink\" (click)=\"\n    event.lesson.hasLearningMaterial && event.lesson.iliasURL &&\n      navigateToLink('ref_id=' + event.lesson.iliasURL)\n  \">\n  <svg [ngStyle]=\"{\n      fill: (event.lesson.hasLearningMaterial && event.lesson.iliasURL ? event.color?.primary : 'gray'),\n      opacity: (event.lesson.hasLearningMaterial && event.lesson.iliasURL ? '1' : '0.8')\n    }\" xmlns=\"http://www.w3.org/2000/svg\" enable-background=\"new 0 0 24 24\" viewBox=\"0 0 24 24\" width=\"18px\"\n    height=\"18px\">\n    <path\n      d=\"M17.5,10.5c0.88,0,1.73,0.09,2.5,0.26V9.24C19.21,9.09,18.36,9,17.5,9c-1.7,0-3.24,0.29-4.5,0.83v1.66 C14.13,10.85,15.7,10.5,17.5,10.5z\" />\n    <path\n      d=\"M13,12.49v1.66c1.13-0.64,2.7-0.99,4.5-0.99c0.88,0,1.73,0.09,2.5,0.26V11.9c-0.79-0.15-1.64-0.24-2.5-0.24 C15.8,11.66,14.26,11.96,13,12.49z\" />\n    <path\n      d=\"M17.5,14.33c-1.7,0-3.24,0.29-4.5,0.83v1.66c1.13-0.64,2.7-0.99,4.5-0.99c0.88,0,1.73,0.09,2.5,0.26v-1.52 C19.21,14.41,18.36,14.33,17.5,14.33z\" />\n    <rect fill=\"none\" height=\"24\" width=\"24\" />\n    <path\n      d=\"M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z\" />\n  </svg>\n  <!--<mat-icon [ngStyle]=\"{ 'color': color }\">menu_book</mat-icon>-->\n</div>\n\n<!--<div\n  class=\"mc-quicklink\"\n  (click)=\"navigateToLink('../lesson/learning-objectives/43')\"\n>\n  <svg\n    [ngStyle]=\"{ fill: event.color?.primary }\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    viewBox=\"0 0 24 24\"\n    width=\"18px\"\n    height=\"18px\"\n  >\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M12.36 6l.08.39.32 1.61H18v6h-3.36l-.08-.39-.32-1.61H7V6h5.36M14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6L14 4z\"\n    />\n  </svg>-->\n<!--<mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">assistant_photo</mat-icon>-->\n<!--</div>-->\n\n<!--<div class=\"mc-quicklink\" (click)=\"navigateToLink('../performance')\">\n  <svg\n    [ngStyle]=\"{ fill: event.color?.primary }\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    viewBox=\"0 0 24 24\"\n    width=\"18px\"\n    height=\"18px\"\n  >\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z\"\n    />\n  </svg>-->\n<!--<mat-icon [ngStyle]=\"{ 'color': color }\">playlist_add_check</mat-icon>-->\n<!--</div>-->\n\n<div *ngIf=\"event.onSite && !event.online\" class=\"mc-quicklink\"\n  (click)=\"event.room.roomLink && navigateToLink(event.room.roomLink)\">\n  <svg\n    [ngStyle]=\"{ fill: (event.room.roomLink ? event.color?.primary : 'gray'), opacity: (event.room.roomLink ? '1' : '0.8') }\"\n    xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18px\" height=\"18px\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z\" />\n    <circle cx=\"12\" cy=\"9\" r=\"2.5\" />\n  </svg>\n  <!--<mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">room</mat-icon>-->\n</div>\n<div *ngIf=\"!event.onSite && event.online\" class=\"mc-quicklink\" (click)=\"isLive && navigateToLink(event.videoURL)\">\n  <svg [ngStyle]=\"{\n      fill: isLive ? event.color?.primary : 'gray',\n      opacity: isLive ? '1' : '0.8'\n    }\" xmlns=\"http://www.w3.org/2000/svg\" height=\"18px\" viewBox=\"0 0 24 24\" width=\"18px\">\n    <!--<path\n      d=\"M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z\" />-->\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\"></path>\n    <path\n      d=\"M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z\">\n    </path>\n  </svg>\n  <!--<mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">ondemand_video</mat-icon>-->\n</div>\n\n<div *ngIf=\"event.onSite && event.online\" class=\"mc-quicklink\"\n  (click)=\"(event.room.roomLink || isLive) && navigateToLink('hybrid')\">\n  <svg\n    [ngStyle]=\"{ fill: ((event.room.roomLink || isLive) ? event.color?.primary : 'gray'), opacity: ((event.room.roomLink || isLive) ? '1' : '0.8') }\"\n    xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"26px\" height=\"26px\" style=\"margin: auto;\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" style=\"transform: scale(0.7);\" />\n    <!--<path xmlns=\"http://www.w3.org/2000/svg\"\n      d=\"M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z\"\n      style=\"transform: scale(0.5) translate(24px, 24px);\" />-->\n    <path\n      d=\"M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z\"\n      style=\"transform: scale(0.6) translate(18px, 18px);\"></path>\n    <path\n      d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z\"\n      style=\"transform: scale(0.6);\" />\n    <circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"12\" cy=\"9\" r=\"2.5\" style=\"transform: scale(0.6);\" />\n    <line xmlns=\"http://www.w3.org/2000/svg\" [ngStyle]=\"{ stroke: event.color?.primary }\" x1=\"20\" y1=\"4\" x2=\"4\"\n      y2=\"20\" />\n  </svg>\n  <!--<mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">ondemand_video</mat-icon>-->\n</div>\n\n<!--<div class=\"mc-quicklink\" (click)=\"navigateToLink('lesson/evaluation/43')\">\n  <svg [ngStyle]=\"{ fill: event.color?.primary }\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18px\"\n    height=\"18px\">\n    <path d=\"M0 0h24v24H0V0zm0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z\" />\n  </svg>\n  <mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">thumb_up</mat-icon>\n</div>-->\n\n<!--<div\n  class=\"mc-quicklink\"\n  (click)=\"navigateToLink('../lesson/event-swapping/43')\"\n>\n  <svg\n    [ngStyle]=\"{ fill: event.color?.primary }\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    viewBox=\"0 0 24 24\"\n    width=\"18px\"\n    height=\"18px\"\n  >\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z\"\n    />\n  </svg>-->\n<!--<mat-icon [ngStyle]=\"{ 'color': color }\">date_range</mat-icon>-->\n<!--</div>-->\n",
        styles: [":host{display:flex;justify-content:flex-start;flex-wrap:wrap;padding:0 10px 10px}:host .mc-quicklink{box-shadow:0 0 4px 1px #ccc;height:36px;width:36px;background:#f6f6f6;display:flex;margin:5px;border:1px solid transparent}:host .mc-quicklink:hover{opacity:.7}:host .mc-quicklink svg{margin:auto;height:20px;width:20px;font-size:20px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}:host .mc-quicklink svg *{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}"]
    }),
    __metadata("design:paramtypes", [])
], QuicklinksComponent);

let CalendarWeekModule = class CalendarWeekModule {
};
CalendarWeekModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ResizableModule,
            DragAndDropModule,
            CalendarCommonModule
        ],
        declarations: [
            CalendarWeekViewComponent,
            CalendarWeekViewHeaderComponent,
            CalendarWeekViewEventComponent,
            CalendarWeekViewHourSegmentComponent,
            CalendarWeekViewCurrentTimeMarkerComponent,
            QuicklinksComponent
        ],
        exports: [
            ResizableModule,
            DragAndDropModule,
            CalendarWeekViewComponent,
            CalendarWeekViewHeaderComponent,
            CalendarWeekViewEventComponent,
            CalendarWeekViewHourSegmentComponent,
            CalendarWeekViewCurrentTimeMarkerComponent,
            QuicklinksComponent
        ],
    })
], CalendarWeekModule);

let CalendarDayModule = class CalendarDayModule {
};
CalendarDayModule = __decorate([
    NgModule({
        imports: [CommonModule, CalendarCommonModule, CalendarWeekModule],
        declarations: [CalendarDayViewComponent],
        exports: [CalendarDayViewComponent],
    })
], CalendarDayModule);

let CalendarMonthCellComponent = class CalendarMonthCellComponent {
    constructor() {
        this.highlightDay = new EventEmitter();
        this.unhighlightDay = new EventEmitter();
        this.eventClicked = new EventEmitter();
        this.trackByEventId = trackByEventId;
        this.validateDrag = isWithinThreshold;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarMonthCellComponent.prototype, "day", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarMonthCellComponent.prototype, "openDay", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarMonthCellComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarMonthCellComponent.prototype, "tooltipPlacement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarMonthCellComponent.prototype, "tooltipAppendToBody", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthCellComponent.prototype, "customTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthCellComponent.prototype, "tooltipTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarMonthCellComponent.prototype, "tooltipDelay", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CalendarMonthCellComponent.prototype, "highlightDay", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CalendarMonthCellComponent.prototype, "unhighlightDay", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarMonthCellComponent.prototype, "eventClicked", void 0);
CalendarMonthCellComponent = __decorate([
    Component({
        selector: 'mwl-calendar-month-cell',
        template: `
    <ng-template
      #defaultTemplate
      let-day="day"
      let-openDay="openDay"
      let-locale="locale"
      let-tooltipPlacement="tooltipPlacement"
      let-highlightDay="highlightDay"
      let-unhighlightDay="unhighlightDay"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDelay="tooltipDelay"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-cell-top"
        [attr.aria-label]="
          { day: day, locale: locale } | calendarA11y: 'monthCell'
        "
      >
        <span aria-hidden="true">
          <span class="cal-day-badge" *ngIf="day.badgeTotal > 0">{{
            day.badgeTotal
          }}</span>
          <span class="cal-day-number">{{
            day.date | calendarDate: 'monthViewDayNumber':locale
          }}</span>
        </span>
      </div>
      <div class="cal-events" *ngIf="day.events.length > 0">
        <div
          class="cal-event"
          *ngFor="let event of day.events; trackBy: trackByEventId"
          [ngStyle]="{ backgroundColor: event.color?.primary }"
          [ngClass]="event?.cssClass"
          (mouseenter)="highlightDay.emit({ event: event })"
          (mouseleave)="unhighlightDay.emit({ event: event })"
          [mwlCalendarTooltip]="
            event.title | calendarEventTitle: 'monthTooltip':event
          "
          [tooltipPlacement]="tooltipPlacement"
          [tooltipEvent]="event"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipAppendToBody]="tooltipAppendToBody"
          [tooltipDelay]="tooltipDelay"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event, draggedFrom: day }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
          (mwlClick)="eventClicked.emit({ event: event, sourceEvent: $event })"
          [attr.aria-hidden]="{} | calendarA11y: 'hideMonthCellEvents'"
        ></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        openDay: openDay,
        locale: locale,
        tooltipPlacement: tooltipPlacement,
        highlightDay: highlightDay,
        unhighlightDay: unhighlightDay,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDelay: tooltipDelay,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
        host: {
            class: 'cal-cell cal-day-cell',
            '[class.cal-past]': 'day.isPast',
            '[class.cal-today]': 'day.isToday',
            '[class.cal-future]': 'day.isFuture',
            '[class.cal-weekend]': 'day.isWeekend',
            '[class.cal-in-month]': 'day.inMonth',
            '[class.cal-out-month]': '!day.inMonth',
            '[class.cal-has-events]': 'day.events.length > 0',
            '[class.cal-open]': 'day === openDay',
            '[class.cal-event-highlight]': '!!day.backgroundColor',
        }
    })
], CalendarMonthCellComponent);

let CalendarMonthViewHeaderComponent = class CalendarMonthViewHeaderComponent {
    constructor() {
        this.columnHeaderClicked = new EventEmitter();
        this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], CalendarMonthViewHeaderComponent.prototype, "days", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarMonthViewHeaderComponent.prototype, "locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarMonthViewHeaderComponent.prototype, "customTemplate", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CalendarMonthViewHeaderComponent.prototype, "columnHeaderClicked", void 0);
CalendarMonthViewHeaderComponent = __decorate([
    Component({
        selector: 'mwl-calendar-month-view-header',
        template: `
    <ng-template
      #defaultTemplate
      let-days="days"
      let-locale="locale"
      let-trackByWeekDayHeaderDate="trackByWeekDayHeaderDate"
    >
      <div class="cal-cell-row cal-header" role="row">
        <div
          class="cal-cell"
          *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          (click)="
            columnHeaderClicked.emit({
              isoDayNumber: day.day,
              sourceEvent: $event
            })
          "
          [ngClass]="day.cssClass"
          tabindex="0"
          role="columnheader"
        >
          {{ day.date | calendarDate: 'monthViewColumnHeader':locale }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        days: days,
        locale: locale,
        trackByWeekDayHeaderDate: trackByWeekDayHeaderDate
      }"
    >
    </ng-template>
  `
    })
], CalendarMonthViewHeaderComponent);

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
            validateEvents$1(this.events);
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

const collapseAnimation = trigger('collapse', [
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

let CalendarMonthModule = class CalendarMonthModule {
};
CalendarMonthModule = __decorate([
    NgModule({
        imports: [CommonModule, DragAndDropModule, CalendarCommonModule],
        declarations: [
            CalendarMonthViewComponent,
            CalendarMonthCellComponent,
            CalendarOpenDayEventsComponent,
            CalendarMonthViewHeaderComponent,
        ],
        exports: [
            DragAndDropModule,
            CalendarMonthViewComponent,
            CalendarMonthCellComponent,
            CalendarOpenDayEventsComponent,
            CalendarMonthViewHeaderComponent,
        ],
    })
], CalendarMonthModule);

var CalendarModule_1;
/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalenderModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalenderModule.forRoot()
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
let CalendarModule = CalendarModule_1 = class CalendarModule {
    static forRoot(dateAdapter, config = {}) {
        return {
            ngModule: CalendarModule_1,
            providers: [
                dateAdapter,
                config.eventTitleFormatter || CalendarEventTitleFormatter,
                config.dateFormatter || CalendarDateFormatter,
                config.utils || CalendarUtils,
                config.a11y || CalendarA11y,
            ],
        };
    }
};
CalendarModule = CalendarModule_1 = __decorate([
    NgModule({
        imports: [
            CalendarCommonModule,
            CalendarMonthModule,
            CalendarWeekModule,
            CalendarDayModule,
        ],
        exports: [
            CalendarCommonModule,
            CalendarMonthModule,
            CalendarWeekModule,
            CalendarDayModule,
        ],
    })
], CalendarModule);

/*
 * Public API Surface of angular-calendar
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CalendarA11y, CalendarAngularDateFormatter, CalendarCommonModule, CalendarDateFormatter, CalendarDayModule, CalendarDayViewComponent, CalendarEventTimesChangedEventType, CalendarEventTitleFormatter, CalendarModule, CalendarMomentDateFormatter, CalendarMonthModule, CalendarMonthViewComponent, CalendarNativeDateFormatter, CalendarUtils, CalendarView, CalendarWeekModule, CalendarWeekViewComponent, DateAdapter, MOMENT, collapseAnimation, getWeekViewPeriod, CalendarOpenDayEventsComponent as ɵa, CalendarEventActionsComponent as ɵb, CalendarEventTitleComponent as ɵc, CalendarTooltipWindowComponent as ɵd, CalendarTooltipDirective as ɵe, CalendarPreviousViewDirective as ɵf, CalendarNextViewDirective as ɵg, CalendarTodayDirective as ɵh, CalendarDatePipe as ɵi, CalendarEventTitlePipe as ɵj, CalendarA11yPipe as ɵk, ClickDirective as ɵl, KeydownEnterDirective as ɵm, CalendarMonthCellComponent as ɵn, CalendarMonthViewHeaderComponent as ɵo, CalendarWeekViewHeaderComponent as ɵp, CalendarWeekViewEventComponent as ɵq, CalendarWeekViewHourSegmentComponent as ɵr, CalendarWeekViewCurrentTimeMarkerComponent as ɵs, QuicklinksComponent as ɵt };
//# sourceMappingURL=angular-calendar.js.map
