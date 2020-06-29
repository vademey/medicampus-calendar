import { EventValidationErrorMessage } from 'calendar-utils';
import { DateAdapter } from 'calendar-utils/date-adapters/date-adapter';
import { addDays, addHours, addMinutes, addSeconds, differenceInDays, differenceInMinutes, differenceInSeconds, endOfDay, endOfMonth, endOfWeek, getDay, isSameDay, isSameMonth, isSameSecond, setHours, setMinutes, startOfDay, startOfMinute, startOfMonth, startOfWeek } from 'date-fns';
import max from 'date-fns/max';

const WEEKEND_DAY_NUMBERS: number[] = [0, 6];
const DAYS_IN_WEEK: number = 7;
const HOURS_IN_DAY: number = 24;
const MINUTES_IN_HOUR: number = 60;
export const SECONDS_IN_DAY: number = 60 * 60 * 24;
export const SECONDS_IN_WEEK: number = SECONDS_IN_DAY * DAYS_IN_WEEK;

export interface MCWeekDay {
    date: Date;
    day: 0 | 6 | 1 | 2 | 3 | 4 | 5;
    isPast: boolean;
    isToday: boolean;
    isFuture: boolean;
    isWeekend: boolean;
    cssClass?: string;
}

export interface EventColor {
    primary: string;
    secondary: string;
}

export interface MCEventAction {
    id?: string | number;
    label: string;
    cssClass?: string;
    a11yLabel?: string;
    onClick({ event, sourceEvent, }: {
        event: MCCalendarEvent;
        sourceEvent: MouseEvent | KeyboardEvent;
    }): any;
}

export interface MCCalendarEvent<MetaType = any> {
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    color?: EventColor;
    actions?: MCEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: MetaType;
}

export interface MCWeekViewEvent {
    event: MCCalendarEvent;
    offset: number;
    span: number;
    startsBeforeWeek: boolean;
    endsAfterWeek: boolean;
}

export interface MCWeekViewEventRow {
    row: MCWeekViewEvent[];
}

export interface MCMonthViewDay extends MCWeekDay {
    inMonth: boolean;
    events: MCCalendarEvent[];
    backgroundColor?: string;
    cssClass?: string;
    badgeTotal: number;
}

export interface MCDayViewEvent {
    event: MCCalendarEvent;
    height: number;
    width: number;
    top: number;
    left: number;
    startsBeforeDay: boolean;
    endsAfterDay: boolean;
}

export interface MCDayView {
    events: MCDayViewEvent[];
    width: number;
    allDayEvents: MCCalendarEvent[];
}

export interface MCDayViewHourSegment {
    isStart: boolean;
    date: Date;
    cssClass?: string;
}

export interface MCDayViewHour {
    segments: MCDayViewHourSegment[];
}

function getExcludedSeconds({ startDate, seconds, excluded, precision = 'days' }:
    { startDate: Date, seconds: number, excluded: number[], precision?: 'minutes' | 'days' }): number {
    if (excluded.length < 1) {
        return 0;
    }
    const endDate: Date = addSeconds(startDate, seconds - 1);
    const dayStart: number = getDay(startDate);
    const dayEnd: number = getDay(addSeconds(endDate, 0));
    let result: number = 0; // Calculated in seconds
    let current: Date = startDate;

    while (current < endDate) {
        const day: number = getDay(current);

        if (excluded.some(excludedDay => excludedDay === day)) {
            result += calculateExcludedSeconds({ dayStart, dayEnd, day, precision, startDate, endDate });
        }

        current = addDays(current, 1);
    }

    return result;

}

function calculateExcludedSeconds({ precision, day, dayStart, dayEnd, startDate, endDate }:
    { day: number, startDate: Date, endDate: Date, dayStart: number, dayEnd: number, precision?: 'minutes' | 'days' }): number {
    if (precision === 'minutes') {
        if (day === dayStart) {
            return differenceInSeconds(endOfDay(startDate), startDate) + 1;
        } else if (day === dayEnd) {
            return differenceInSeconds(endDate, startOfDay(endDate)) + 1;
        }
    }

    return SECONDS_IN_DAY;
}

function getWeekViewEventSpan(
    { event, offset, startOfWeekDate, excluded, precision = 'days' }:
        { event: MCCalendarEvent, offset: number, startOfWeekDate: Date, excluded: number[], precision?: 'minutes' | 'days' }
): number {

    let span: number = SECONDS_IN_DAY;
    const begin: Date = max([event.start, startOfWeekDate]);

    if (event.end) {
        switch (precision) {
            case 'minutes':
                span = differenceInSeconds(event.end, begin);
                break;
            default:
                span = differenceInDays(addDays(event.end, 1), begin) * SECONDS_IN_DAY;
                break;
        }
    }

    const offsetSeconds: number = offset * SECONDS_IN_DAY;
    const totalLength: number = offsetSeconds + span;

    // the best way to detect if an event is outside the week-view
    // is to check if the total span beginning (from startOfWeekDay or event start) exceeds 7days
    if (totalLength > SECONDS_IN_WEEK) {
        span = SECONDS_IN_WEEK - offsetSeconds;
    }

    span -= getExcludedSeconds({ startDate: begin, seconds: span, excluded, precision });

    return span / SECONDS_IN_DAY;
}

export function getWeekViewEventOffset({ event, startOfWeek, excluded = [], precision = 'days' }:
    { event: MCCalendarEvent, startOfWeek: Date, excluded?: number[], precision?: 'minutes' | 'days' }): number {
    if (event.start < startOfWeek) {
        return 0;
    }

    let offset: number = 0;

    switch (precision) {
        case 'days':
            offset = differenceInDays(
                startOfDay(event.start),
                startOfWeek
            ) * SECONDS_IN_DAY;
            break;
        case 'minutes':
            offset = differenceInSeconds(
                event.start,
                startOfWeek
            );
            break;
    }

    offset -= getExcludedSeconds({ startDate: startOfWeek, seconds: offset, excluded, precision });

    return offset / SECONDS_IN_DAY;
}

interface MCIsEventInPeriodArgs {
    event: MCCalendarEvent;
    periodStart: Date;
    periodEnd: Date;
}

function isEventIsPeriod({ event, periodStart, periodEnd }: MCIsEventInPeriodArgs): boolean {

    const eventStart: Date = event.start;
    const eventEnd: Date = event.end || event.start;

    if (eventStart > periodStart && eventStart < periodEnd) {
        return true;
    }

    if (eventEnd > periodStart && eventEnd < periodEnd) {
        return true;
    }

    if (eventStart < periodStart && eventEnd > periodEnd) {
        return true;
    }

    if (isSameSecond(eventStart, periodStart) || isSameSecond(eventStart, periodEnd)) {
        return true;
    }

    if (isSameSecond(eventEnd, periodStart) || isSameSecond(eventEnd, periodEnd)) {
        return true;
    }

    return false;

}

interface MCGetEventsInPeriodArgs {
    events: MCCalendarEvent[];
    periodStart: Date;
    periodEnd: Date;
}

function getEventsInPeriod({ events, periodStart, periodEnd }: MCGetEventsInPeriodArgs): MCCalendarEvent[] {
    return events.filter((event: MCCalendarEvent) => isEventIsPeriod({ event, periodStart, periodEnd }));
}

function getWeekDay({ date }: { date: Date }): MCWeekDay {
    const today: Date = startOfDay(new Date());
    return {
        date,
        day: getDay(date),
        isPast: date < today,
        isToday: isSameDay(date, today),
        isFuture: date > today,
        isWeekend: WEEKEND_DAY_NUMBERS.indexOf(getDay(date)) > -1
    };
}

export interface MCGetWeekViewHeaderArgs {
    viewDate: Date;
    weekStartsOn: 0 | 6 | 1 | 2 | 3 | 4 | 5;
    excluded?: number[];
}

export function getWeekViewHeader({ viewDate, weekStartsOn, excluded = [] }: MCGetWeekViewHeaderArgs): MCWeekDay[] {
    const start: Date = startOfWeek(viewDate, { weekStartsOn });
    const days: MCWeekDay[] = [];
    for (let i: number = 0; i < DAYS_IN_WEEK; i++) {
        const date: Date = addDays(start, i);
        if (!excluded.some(e => date.getDay() === e)) {
            days.push(getWeekDay({ date }));
        }
    }

    return days;
}

interface Time {
    hour: number;
    minute: number;
}

export interface MCGetWeekViewArgs {
    events?: MCCalendarEvent[];
    viewDate: Date;
    weekStartsOn: 0 | 6 | 1 | 2 | 3 | 4 | 5;
    excluded?: number[];
    precision?: 'minutes' | 'days';
    absolutePositionedEvents?: boolean;
    hourSegments?: number;
    hourDuration?: number;
    dayStart: Time;
    dayEnd: Time;
    weekendDays?: number[];
    segmentHeight: number;
    viewStart?: Date;
    viewEnd?: Date;
    minimumEventHeight?: number;
}

/*export function getWeekView({
    events = [],
    viewDate,
    weekStartsOn,
    excluded = [],
    precision = 'days',
    absolutePositionedEvents = false,
    dayStart,
    dayEnd,
    hourSegments
}: MCGetWeekViewArgs): MCWeekView {

    if (!events) {
        events = [];
    }

    const startOfViewWeek: Date = startOfWeek(viewDate, { weekStartsOn });
    const endOfViewWeek: Date = endOfWeek(viewDate, { weekStartsOn });
    const maxRange: number = DAYS_IN_WEEK - excluded.length;

    const eventsMapped: MCWeekViewEvent[] = getEventsInPeriod({ events, periodStart: startOfViewWeek, periodEnd: endOfViewWeek }).map(event => {
        const offset: number = getWeekViewEventOffset({ event, startOfWeek: startOfViewWeek, excluded, precision });
        const span: number = getWeekViewEventSpan({ event, offset, startOfWeekDate: startOfViewWeek, excluded, precision });
        return { event, offset, span };
    }).filter(e => e.offset < maxRange).filter(e => e.span > 0).map(entry => ({
        event: entry.event,
        offset: entry.offset,
        span: entry.span,
        startsBeforeWeek: entry.event.start < startOfViewWeek,
        endsAfterWeek: (entry.event.end || entry.event.start) > endOfViewWeek
    })).sort((itemA, itemB): number => {
        const startSecondsDiff: number = differenceInSeconds(itemA.event.start, itemB.event.start);
        if (startSecondsDiff === 0) {
            return differenceInSeconds(itemB.event.end || itemB.event.start, itemA.event.end || itemA.event.start);
        }
        return startSecondsDiff;
    });

    const eventRows: MCWeekViewEventRow[] = [];
    const allocatedEvents: MCWeekViewEvent[] = [];

    eventsMapped.forEach((event: MCWeekViewEvent, index: number) => {
        if (allocatedEvents.indexOf(event) === -1) {
            allocatedEvents.push(event);
            let rowSpan: number = event.span + event.offset;
            const otherRowEvents: MCWeekViewEvent[] = eventsMapped.slice(index + 1).filter(nextEvent => {
                if (
                    nextEvent.offset >= rowSpan &&
                    rowSpan + nextEvent.span <= DAYS_IN_WEEK &&
                    allocatedEvents.indexOf(nextEvent) === -1
                ) {
                    const nextEventOffset: number = nextEvent.offset - rowSpan;
                    if (!absolutePositionedEvents) {
                        nextEvent.offset = nextEventOffset;
                    }
                    rowSpan += nextEvent.span + nextEventOffset;
                    allocatedEvents.push(nextEvent);
                    return true;
                }
            });
            eventRows.push({
                row: [
                    event,
                    ...otherRowEvents
                ]
            });
        }
    });

    return {
        period: {
            start: startOfViewWeek, end: endOfViewWeek,
            events
        },
        allDayEventRows: eventRows,
        hourColumns: ({ viewDate, dayStart, dayEnd, hourSegments })
    };
}
*/

export function getWeekView(dateAdapter: DateAdapter,
    { events = [],
        viewDate,
        weekStartsOn,
        excluded = [],
        precision = 'days',
        absolutePositionedEvents = false,
        dayStart,
        dayEnd,
        hourSegments,
        viewStart,
        viewEnd }
        : MCGetWeekViewArgs): MCWeekView {
    if (!events) {
        events = [];
    }
    const startOfDay = dateAdapter.startOfDay;
    const endOfDay = dateAdapter.endOfDay;
    viewStart = startOfDay(viewStart);
    viewEnd = endOfDay(viewEnd);
    const eventsInPeriod = getEventsInPeriod({
        events,
        periodStart: viewStart,
        periodEnd: viewEnd,
    });
    const header = getWeekViewHeader({
        viewDate,
        weekStartsOn,
        excluded
    });
    return {
        allDayEventRows: getAllDayWeekEvents(dateAdapter, {
            events,
            excluded,
            precision,
            absolutePositionedEvents,
            viewStart,
            viewEnd,
            eventsInPeriod,
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
            dayStart,
            dayEnd,
            weekStartsOn,
            excluded,
            viewStart,
            viewEnd
        }),
    };
}

function getWeekViewHourGrid(dateAdapter, _a) {
    const events = _a.events;
    const viewDate = _a.viewDate;
    const hourSegments = _a.hourSegments;
    const dayStart = _a.dayStart;
    const dayEnd = _a.dayEnd;
    const weekStartsOn = _a.weekStartsOn;
    const excluded = _a.excluded;
    const segmentHeight = _a.segmentHeight;
    const dayViewHourGrid = getDayViewHourGrid({
        viewDate,
        hourSegments,
        dayStart,
        dayEnd,
    });
    const weekDays = getWeekViewHeader({
        viewDate,
        weekStartsOn,
        excluded
    });
    const setHours = dateAdapter.setHours;
    const setMinutes = dateAdapter.setMinutes;
    const getHours = dateAdapter.getHours;
    const getMinutes = dateAdapter.getMinutes;

    let __assign = (this && this.__assign) || function () {
        __assign = Object.assign || ((t) => {
            for (let s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (const p in s) {
                    if (Object.prototype.hasOwnProperty.call(s, p)) {
                        t[p] = s[p];
                    }
                }
            }
            return t;
        });
        return __assign.apply(this, arguments);
    };


    return weekDays.map((day) => {
        const dayView = getDayView({
            events,
            viewDate: day.date,
            hourSegments,
            dayStart,
            dayEnd,
            segmentHeight,
            eventWidth: 1,
        });
        const hours = dayViewHourGrid.map((hour) => {
            const segments = hour.segments.map((segment) => {
                const date = setMinutes(setHours(day.date, getHours(segment.date)), getMinutes(segment.date));
                return __assign(__assign({}, segment), { date });
            });
            return __assign(__assign({}, hour), { segments });
        });
        function getColumnCount(allEvents, prevOverlappingEvents) {
            const columnCount = Math.max.apply(Math, prevOverlappingEvents.map((iEvent) => { return iEvent.left + 1; }));
            const nextOverlappingEvents = allEvents
                .filter((iEvent) => { return iEvent.left >= columnCount; })
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
            return __assign(__assign({}, event), { left: event.left * width, width });
        });
        return {
            hours,
            date: day.date,
            events: mappedEvents.map((event) => {
                const overLappingEvents = getOverLappingWeekViewEvents(mappedEvents.filter((otherEvent) => { return otherEvent.left > event.left; }), event.top, event.top + event.height);
                if (overLappingEvents.length > 0) {
                    return __assign(__assign({}, event), { width: Math.min.apply(Math, overLappingEvents.map(function (otherEvent) { return otherEvent.left; })) - event.left });
                }
                return event;
            }),
        };
    });
}

function getOverLappingWeekViewEvents(events, top, bottom) {
    return events.filter(
        (previousEvent) => {
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

function getAllDayWeekEvents(dateAdapter, _a) {
    const excluded = _a.excluded;
    const precision = _a.precision;
    const absolutePositionedEvents = _a.absolutePositionedEvents;
    const viewStart = _a.viewStart;
    const viewEnd = _a.viewEnd;
    const eventsInPeriod = _a.eventsInPeriod;
    const differenceInSeconds = dateAdapter.differenceInSeconds;
    const differenceInDays = dateAdapter.differenceInDays;
    const maxRange = getDifferenceInDaysWithExclusions(dateAdapter, {
        date1: viewStart,
        date2: viewEnd,
        excluded,
    });
    const totalDaysInView = differenceInDays(viewEnd, viewStart) + 1;
    const __spreadArrays = (this && this.__spreadArrays) || (() => {
        for (let s = 0, i = 0, il = arguments.length; i < il; i++) {
            s += arguments[i].length;
            for (let r = Array(s), k = 0, i = 0; i < il; i++) {
                for (let a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
                    r[k] = a[j];

                    return r;
                }
            }
        }
    });
    let __assign = (this && this.__assign) || function () {
        __assign = Object.assign || ((t) => {
            for (let s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (const p in s) {
                    if (Object.prototype.hasOwnProperty.call(s, p)) {
                        t[p] = s[p];
                    }
                }
            }
            return t;
        });
        return __assign.apply(this, arguments);
    };
    const eventsMapped = eventsInPeriod
        .filter((event) => { return event.allDay; })
        .map((event) => {
            const offset = getWeekViewEventOffset({
                event,
                startOfWeek: viewStart,
                excluded,
                precision,
            });
            const span = getWeekViewEventSpan({
                event,
                offset,
                startOfWeekDate: viewStart,
                excluded,
                precision
            });
            return { event, offset, span };
        })
        .filter((e) => { return e.offset < maxRange; })
        .filter((e) => { return e.span > 0; })
        .map((entry) => {
            return ({
                event: entry.event,
                offset: entry.offset,
                span: entry.span,
                startsBeforeWeek: entry.event.start < viewStart,
                endsAfterWeek: (entry.event.end || entry.event.start) > viewEnd,
            });
        })
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
            let rowSpan_1 = event.span + event.offset;
            const otherRowEvents = eventsMapped
                .slice(index + 1)
                .filter((nextEvent) => {
                    if (nextEvent.offset >= rowSpan_1 &&
                        rowSpan_1 + nextEvent.span <= totalDaysInView &&
                        allocatedEvents.indexOf(nextEvent) === -1) {
                        const nextEventOffset = nextEvent.offset - rowSpan_1;
                        if (!absolutePositionedEvents) {
                            nextEvent.offset = nextEventOffset;
                        }
                        rowSpan_1 += nextEvent.span + nextEventOffset;
                        allocatedEvents.push(nextEvent);
                        return true;
                    }
                });
            const weekEvents = __spreadArrays([event], otherRowEvents);
            const id = weekEvents
                .filter((weekEvent) => { return weekEvent.event.id; })
                .map((weekEvent) => { return weekEvent.event.id; })
                .join('-');
            allDayEventRows.push(__assign({ row: weekEvents }, (id ? { id } : {})));
        }
    });
    return allDayEventRows;
}

export function getDifferenceInDaysWithExclusions(dateAdapter, _a) {
    const date1 = _a.date1;
    const date2 = _a.date2;
    const excluded = _a.excluded;
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

export interface MCGetMonthViewArgs {
    events?: MCCalendarEvent[];
    viewDate: Date;
    weekStartsOn: 0 | 6 | 1 | 2 | 3 | 4 | 5;
    excluded?: number[];
    viewStart?: Date;
    viewEnd?: Date;
}

export function getMonthView({
    events = [],
    viewDate,
    weekStartsOn,
    excluded = [],
    viewStart = startOfMonth(viewDate),
    viewEnd = endOfMonth(viewDate)
}: MCGetMonthViewArgs): MCMonthView {

    if (!events) {
        events = [];
    }

    const start: Date = startOfWeek(viewStart, { weekStartsOn });
    const end: Date = endOfWeek(viewEnd, { weekStartsOn });
    const eventsInMonth: MCCalendarEvent[] = getEventsInPeriod({
        events,
        periodStart: start,
        periodEnd: end
    });
    const initialViewDays: MCMonthViewDay[] = [];
    let previousDate: Date;
    for (let i: number = 0; i < differenceInDays(end, start) + 1; i++) {
        // hacky fix for https://github.com/mattlewis92/angular-calendar/issues/173
        let date: Date;
        if (previousDate) {
            date = startOfDay(addHours(previousDate, HOURS_IN_DAY));
            if (previousDate.getTime() === date.getTime()) { // DST change, so need to add 25 hours
                date = startOfDay(addHours(previousDate, HOURS_IN_DAY + 1));
            }
            previousDate = date;
        } else {
            date = previousDate = start;
        }

        if (!excluded.some(e => date.getDay() === e)) {
            const day: MCMonthViewDay = getWeekDay({ date }) as MCMonthViewDay;
            const events: MCCalendarEvent[] = getEventsInPeriod({
                events: eventsInMonth,
                periodStart: startOfDay(date),
                periodEnd: endOfDay(date)
            });
            day.inMonth = isSameMonth(date, viewDate);
            day.events = events;
            day.badgeTotal = events.length;
            initialViewDays.push(day);
        }
    }

    let days: MCMonthViewDay[] = [];
    const totalDaysVisibleInWeek: number = DAYS_IN_WEEK - excluded.length;
    for (let i: number = 0; i < initialViewDays.length; i += totalDaysVisibleInWeek) {
        const row: MCMonthViewDay[] = initialViewDays.slice(i, i + totalDaysVisibleInWeek);
        const isRowInMonth: boolean = row.some(day => day.date.getMonth() === viewDate.getMonth());
        if (isRowInMonth) {
            days = [...days, ...row];
        }
    }

    const rows: number = Math.floor(days.length / totalDaysVisibleInWeek);
    const rowOffsets: number[] = [];
    for (let i: number = 0; i < rows; i++) {
        rowOffsets.push(i * totalDaysVisibleInWeek);
    }

    return {
        rowOffsets,
        totalDaysVisibleInWeek,
        days,
        period: { start, end, events }
    };

}

export interface MCGetDayViewArgs {
    events?: MCCalendarEvent[];
    viewDate: Date;
    hourSegments: number;
    dayStart: {
        hour: number;
        minute: number;
    };
    dayEnd: {
        hour: number;
        minute: number;
    };
    eventWidth: number;
    segmentHeight: number;
}

export function getDayView({ events = [], viewDate, hourSegments, dayStart, dayEnd, eventWidth, segmentHeight }: MCGetDayViewArgs): MCDayView {

    if (!events) {
        events = [];
    }

    const startOfView: Date = setMinutes(setHours(startOfDay(viewDate), dayStart.hour), dayStart.minute);
    const endOfView: Date = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), dayEnd.hour), dayEnd.minute);
    const previousDayEvents: MCDayViewEvent[] = [];

    const dayViewEvents: MCDayViewEvent[] = getEventsInPeriod({
        events: events.filter((event: MCCalendarEvent) => !event.allDay),
        periodStart: startOfView,
        periodEnd: endOfView
    }).sort((eventA: MCCalendarEvent, eventB: MCCalendarEvent) => {
        return eventA.start.valueOf() - eventB.start.valueOf();
    }).map((event: MCCalendarEvent) => {

        const eventStart: Date = event.start;
        const eventEnd: Date = event.end || eventStart;
        const startsBeforeDay: boolean = eventStart < startOfView;
        const endsAfterDay: boolean = eventEnd > endOfView;
        const hourHeightModifier: number = (hourSegments * segmentHeight) / MINUTES_IN_HOUR;

        let top: number = 0;
        if (eventStart > startOfView) {
            top += differenceInMinutes(eventStart, startOfView);
        }
        top *= hourHeightModifier;

        const startDate: Date = startsBeforeDay ? startOfView : eventStart;
        const endDate: Date = endsAfterDay ? endOfView : eventEnd;
        let height: number = differenceInMinutes(endDate, startDate);
        if (!event.end) {
            height = segmentHeight;
        } else {
            height *= hourHeightModifier;
        }

        const bottom: number = top + height;

        const overlappingPreviousEvents: MCDayViewEvent[] = previousDayEvents.filter((previousEvent: MCDayViewEvent) => {
            const previousEventTop: number = previousEvent.top;
            const previousEventBottom: number = previousEvent.top + previousEvent.height;

            if (top < previousEventBottom && previousEventBottom < bottom) {
                return true;
            } else if (previousEventTop <= top && bottom <= previousEventBottom) {
                return true;
            }

            return false;

        });

        let left: number = 0;

        while (overlappingPreviousEvents.some(previousEvent => previousEvent.left === left)) {
            left += eventWidth;
        }

        const dayEvent: MCDayViewEvent = {
            event,
            height,
            width: eventWidth,
            top,
            left,
            startsBeforeDay,
            endsAfterDay
        };

        if (height > 0) {
            previousDayEvents.push(dayEvent);
        }

        return dayEvent;

    }).filter((dayEvent: MCDayViewEvent) => dayEvent.height > 0);

    const width: number = Math.max(...dayViewEvents.map((event: MCDayViewEvent) => event.left + event.width));
    const allDayEvents: MCCalendarEvent[] = getEventsInPeriod({
        events: events.filter((event: MCCalendarEvent) => event.allDay),
        periodStart: startOfDay(startOfView),
        periodEnd: endOfDay(endOfView)
    });

    return {
        events: dayViewEvents,
        width,
        allDayEvents
    };

}

export interface MCGetDayViewHourGridArgs {
    viewDate: Date;
    hourSegments?: number;
    dayStart: any;
    dayEnd: any;
}

export function getDayViewHourGrid({ viewDate, hourSegments, dayStart, dayEnd }: MCGetDayViewHourGridArgs): MCDayViewHour[] {

    const hours: MCDayViewHour[] = [];

    const startOfView: Date = setMinutes(setHours(startOfDay(viewDate), dayStart.hour), dayStart.minute);
    const endOfView: Date = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), dayEnd.hour), dayEnd.minute);
    const segmentDuration: number = MINUTES_IN_HOUR / hourSegments;
    const startOfViewDay: Date = startOfDay(viewDate);

    for (let i: number = 0; i < HOURS_IN_DAY; i++) {
        const segments: MCDayViewHourSegment[] = [];
        for (let j: number = 0; j < hourSegments; j++) {
            const date: Date = addMinutes(addHours(startOfViewDay, i), j * segmentDuration);
            if (date >= startOfView && date < endOfView) {
                segments.push({
                    date,
                    isStart: j === 0
                });
            }
        }
        if (segments.length > 0) {
            hours.push({ segments });
        }
    }

    return hours;
}

export function validateEvents(events, log) {
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

export interface MCWeekViewAllDayEvent {
    event: MCCalendarEvent;
    offset: number;
    span: number;
    startsBeforeWeek: boolean;
    endsAfterWeek: boolean;
}
export interface MCWeekViewAllDayEventRow {
    id?: string;
    row: MCWeekViewAllDayEvent[];
}
export interface MCWeekView {
    period: MCViewPeriod;
    allDayEventRows: MCWeekViewAllDayEventRow[];
    hourColumns: MCWeekViewHourColumn[];
}
export interface MCMonthViewDay<MetaType = any> extends MCWeekDay {
    inMonth: boolean;
    events: MCCalendarEvent[];
    backgroundColor?: string;
    badgeTotal: number;
    meta?: MetaType;
}
export interface MCMonthView {
    rowOffsets: number[];
    days: MCMonthViewDay[];
    totalDaysVisibleInWeek: number;
    period: MCViewPeriod;
}
export interface MCWeekViewTimeEvent {
    event: MCCalendarEvent;
    height: number;
    width: number;
    top: number;
    left: number;
    startsBeforeDay: boolean;
    endsAfterDay: boolean;
}
export interface MCWeekViewHourSegment {
    isStart: boolean;
    date: Date;
    displayDate: Date;
    cssClass?: string;
}
export interface MCWeekViewHour {
    segments: MCWeekViewHourSegment[];
}
export interface MCWeekViewHourColumn {
    date: Date;
    hours: MCWeekViewHour[];
    events: MCWeekViewTimeEvent[];
}
export interface MCViewPeriod {
    start: Date;
    end: Date;
    events: MCCalendarEvent[];
}
