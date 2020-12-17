export var DAYS_OF_WEEK;
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
export const SECONDS_IN_DAY = 60 * 60 * 24;
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
export function getEventsInPeriod(dateAdapter, { events, periodStart, periodEnd }) {
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
export function getWeekViewHeader(dateAdapter, { viewDate, weekStartsOn, excluded = [], weekendDays, viewStart = dateAdapter.startOfWeek(viewDate, { weekStartsOn }), viewEnd = dateAdapter.addDays(viewStart, DAYS_IN_WEEK), }) {
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
export function getDifferenceInDaysWithExclusions(dateAdapter, { date1, date2, excluded }) {
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
export function getAllDayWeekEvents(dateAdapter, { events = [], excluded = [], precision = 'days', absolutePositionedEvents = false, viewStart, viewEnd, }) {
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
export function getWeekView(dateAdapter, { events = [], viewDate, weekStartsOn, excluded = [], precision = 'days', absolutePositionedEvents = false, hourSegments, hourDuration, dayStart, dayEnd, weekendDays, segmentHeight, minimumEventHeight, viewStart = dateAdapter.startOfWeek(viewDate, { weekStartsOn }), viewEnd = dateAdapter.endOfWeek(viewDate, { weekStartsOn }), }) {
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
export function getMonthView(dateAdapter, { events = [], viewDate, weekStartsOn, excluded = [], viewStart = dateAdapter.startOfMonth(viewDate), viewEnd = dateAdapter.endOfMonth(viewDate), weekendDays, }) {
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
export var EventValidationErrorMessage;
(function (EventValidationErrorMessage) {
    EventValidationErrorMessage["NotArray"] = "Events must be an array";
    EventValidationErrorMessage["StartPropertyMissing"] = "Event is missing the `start` property";
    EventValidationErrorMessage["StartPropertyNotDate"] = "Event `start` property should be a javascript date object. Do `new Date(event.start)` to fix it.";
    EventValidationErrorMessage["EndPropertyNotDate"] = "Event `end` property should be a javascript date object. Do `new Date(event.end)` to fix it.";
    EventValidationErrorMessage["EndsBeforeStart"] = "Event `start` property occurs after the `end`";
})(EventValidationErrorMessage || (EventValidationErrorMessage = {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWMtY2FsZW5kYXItdXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsidXRpbGl0aWVzL21jLWNhbGVuZGFyLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sQ0FBTixJQUFZLFlBUVg7QUFSRCxXQUFZLFlBQVk7SUFDcEIsbURBQVUsQ0FBQTtJQUNWLG1EQUFVLENBQUE7SUFDVixxREFBVyxDQUFBO0lBQ1gseURBQWEsQ0FBQTtJQUNiLHVEQUFZLENBQUE7SUFDWixtREFBVSxDQUFBO0lBQ1YsdURBQVksQ0FBQTtBQUNoQixDQUFDLEVBUlcsWUFBWSxLQUFaLFlBQVksUUFRdkI7QUFFRCxNQUFNLG9CQUFvQixHQUFhO0lBQ25DLFlBQVksQ0FBQyxNQUFNO0lBQ25CLFlBQVksQ0FBQyxRQUFRO0NBQ3hCLENBQUM7QUFDRixNQUFNLFlBQVksR0FBVyxDQUFDLENBQUM7QUFDL0IsTUFBTSxZQUFZLEdBQVcsRUFBRSxDQUFDO0FBQ2hDLE1BQU0sZUFBZSxHQUFXLEVBQUUsQ0FBQztBQUNuQyxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUErS25ELFNBQVMsa0JBQWtCLENBQ3ZCLFdBQXdCLEVBQ3hCLEVBQ0ksU0FBUyxFQUNULE9BQU8sRUFDUCxRQUFRLEVBQ1IsU0FBUyxHQU1aO0lBRUQsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNyQixPQUFPLENBQUMsQ0FBQztLQUNaO0lBQ0QsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsV0FBVyxDQUFDO0lBQ3BELE1BQU0sT0FBTyxHQUFTLFVBQVUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxNQUFNLE1B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O1FBRUQsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ1gsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxJQUFJLENBQUMsRUFBRTtnQkFDOUIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ2xFO1lBQ0QsSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDL0Q7U0FDSjtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGVBZGFwdGVyIH0gZnJvbSBcIi4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyXCI7XG5cbmV4cG9ydCBlbnVtIERBWVNfT0ZfV0VFSyB7XG4gICAgU1VOREFZID0gMCxcbiAgICBNT05EQVkgPSAxLFxuICAgIFRVRVNEQVkgPSAyLFxuICAgIFdFRE5FU0RBWSA9IDMsXG4gICAgVEhVUlNEQVkgPSA0LFxuICAgIEZSSURBWSA9IDUsXG4gICAgU0FUVVJEQVkgPSA2LFxufVxuXG5jb25zdCBERUZBVUxUX1dFRUtFTkRfREFZUzogbnVtYmVyW10gPSBbXG4gICAgREFZU19PRl9XRUVLLlNVTkRBWSxcbiAgICBEQVlTX09GX1dFRUsuU0FUVVJEQVksXG5dO1xuY29uc3QgREFZU19JTl9XRUVLOiBudW1iZXIgPSA3O1xuY29uc3QgSE9VUlNfSU5fREFZOiBudW1iZXIgPSAyNDtcbmNvbnN0IE1JTlVURVNfSU5fSE9VUjogbnVtYmVyID0gNjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19JTl9EQVk6IG51bWJlciA9IDYwICogNjAgKiAyNDtcblxuZXhwb3J0IGludGVyZmFjZSBNQ1dlZWtEYXkge1xuICAgIGRhdGU6IERhdGU7XG4gICAgZGF5OiBudW1iZXI7XG4gICAgaXNQYXN0OiBib29sZWFuO1xuICAgIGlzVG9kYXk6IGJvb2xlYW47XG4gICAgaXNGdXR1cmU6IGJvb2xlYW47XG4gICAgaXNXZWVrZW5kOiBib29sZWFuO1xuICAgIGNzc0NsYXNzPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50Q29sb3Ige1xuICAgIHByaW1hcnk6IHN0cmluZztcbiAgICBzZWNvbmRhcnk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ0V2ZW50QWN0aW9uIHtcbiAgICBpZD86IHN0cmluZyB8IG51bWJlcjtcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGNzc0NsYXNzPzogc3RyaW5nO1xuICAgIGExMXlMYWJlbD86IHN0cmluZztcbiAgICBvbkNsaWNrKHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIHNvdXJjZUV2ZW50LFxuICAgIH06IHtcbiAgICAgICAgZXZlbnQ6IE1DRXZlbnQ7XG4gICAgICAgIHNvdXJjZUV2ZW50OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudDtcbiAgICB9KTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DRXZlbnQ8TWV0YVR5cGUgPSBhbnk+IHtcbiAgICBpZD86IHN0cmluZyB8IG51bWJlcjtcbiAgICBzdGFydDogRGF0ZTtcbiAgICBlbmQ/OiBEYXRlO1xuICAgIHRpdGxlPzogc3RyaW5nO1xuICAgIGNvbG9yPzogRXZlbnRDb2xvcjtcbiAgICBhY3Rpb25zPzogTUNFdmVudEFjdGlvbltdO1xuICAgIGFsbERheT86IGJvb2xlYW47XG4gICAgY3NzQ2xhc3M/OiBzdHJpbmc7XG4gICAgcmVzaXphYmxlPzoge1xuICAgICAgICBiZWZvcmVTdGFydD86IGJvb2xlYW47XG4gICAgICAgIGFmdGVyRW5kPzogYm9vbGVhbjtcbiAgICB9O1xuICAgIGRyYWdnYWJsZT86IGJvb2xlYW47XG4gICAgbWV0YT86IE1ldGFUeXBlO1xuICAgIG9ubGluZTogYm9vbGVhbjtcbiAgICBvblNpdGU6IGJvb2xlYW47XG4gICAgcm9vbT86IE1DUm9vbTtcbiAgICB2aWRlb1VSTD86IHN0cmluZztcbiAgICBwcmVzZW5jZVJlY29yZGVkPzogYm9vbGVhbjtcbiAgICBsZXNzb246IE1DTGVzc29uO1xuICAgIHRvcGljPzogc3RyaW5nO1xuICAgIG5ld3NpZD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ0xlc3NvbiB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgc2hvcnROYW1lOiBzdHJpbmc7XG4gICAgbW9kdWxlOiBNQ01vZHVsZTtcbiAgICBzdWJqZWN0OiBNQ1N1YmplY3Q7XG4gICAgcGVyZm9ybWFuY2VSZWNvcmQ6IE1DUGVyZm9ybWFuY2VSZWNvcmQ7XG4gICAgbGVzc29uVHlwZTogTUNMZXNzb25UeXBlO1xuICAgIGlsaWFzVVJMOiBzdHJpbmc7XG4gICAgaGFzTGVhcm5pbmdNYXRlcmlhbDogYm9vbGVhbjtcbiAgICBzd2FwTGVzc29uQWxsb3dlZD86IGJvb2xlYW47XG4gICAgY2hhbmdlTGVzc29uQWxsb3dlZD86IGJvb2xlYW47XG4gICAgc3dhcEV2ZW50QWxsb3dlZDogYm9vbGVhbjtcbiAgICBjaGFuZ2VFdmVudEFsbG93ZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNNb2R1bGUge1xuICAgIGlkOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DUm9vbSB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgc2hvcnROYW1lOiBzdHJpbmc7XG4gICAgcm9vbUxpbms6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ1N1YmplY3Qge1xuICAgIGlkOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DUGVyZm9ybWFuY2VSZWNvcmQge1xuICAgIGlkOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DTGVzc29uVHlwZSB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgbWFuZGF0b3J5OiBib29sZWFuO1xuICAgIGNvbG9yOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNXZWVrVmlld0FsbERheUV2ZW50IHtcbiAgICBldmVudDogTUNFdmVudDtcbiAgICBvZmZzZXQ6IG51bWJlcjtcbiAgICBzcGFuOiBudW1iZXI7XG4gICAgc3RhcnRzQmVmb3JlV2VlazogYm9vbGVhbjtcbiAgICBlbmRzQWZ0ZXJXZWVrOiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DV2Vla1ZpZXdBbGxEYXlFdmVudFJvdyB7XG4gICAgaWQ/OiBzdHJpbmc7XG4gICAgcm93OiBNQ1dlZWtWaWV3QWxsRGF5RXZlbnRbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ1dlZWtWaWV3IHtcbiAgICBwZXJpb2Q6IE1DVmlld1BlcmlvZDtcbiAgICBhbGxEYXlFdmVudFJvd3M6IE1DV2Vla1ZpZXdBbGxEYXlFdmVudFJvd1tdO1xuICAgIGhvdXJDb2x1bW5zOiBNQ1dlZWtWaWV3SG91ckNvbHVtbltdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DTW9udGhWaWV3RGF5PE1ldGFUeXBlID0gYW55PiBleHRlbmRzIE1DV2Vla0RheSB7XG4gICAgaW5Nb250aDogYm9vbGVhbjtcbiAgICBldmVudHM6IE1DRXZlbnRbXTtcbiAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gICAgYmFkZ2VUb3RhbDogbnVtYmVyO1xuICAgIG1ldGE/OiBNZXRhVHlwZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ01vbnRoVmlldyB7XG4gICAgcm93T2Zmc2V0czogbnVtYmVyW107XG4gICAgZGF5czogTUNNb250aFZpZXdEYXlbXTtcbiAgICB0b3RhbERheXNWaXNpYmxlSW5XZWVrOiBudW1iZXI7XG4gICAgcGVyaW9kOiBNQ1ZpZXdQZXJpb2Q7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNXZWVrVmlld1RpbWVFdmVudCB7XG4gICAgZXZlbnQ6IE1DRXZlbnQ7XG4gICAgaGVpZ2h0OiBudW1iZXI7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICB0b3A6IG51bWJlcjtcbiAgICBsZWZ0OiBudW1iZXI7XG4gICAgc3RhcnRzQmVmb3JlRGF5OiBib29sZWFuO1xuICAgIGVuZHNBZnRlckRheTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIE1DRGF5VmlldyB7XG4gICAgZXZlbnRzOiBNQ1dlZWtWaWV3VGltZUV2ZW50W107XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBhbGxEYXlFdmVudHM6IE1DRXZlbnRbXTtcbiAgICBwZXJpb2Q6IE1DVmlld1BlcmlvZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ1dlZWtWaWV3SG91clNlZ21lbnQge1xuICAgIGlzU3RhcnQ6IGJvb2xlYW47XG4gICAgZGF0ZTogRGF0ZTtcbiAgICBkaXNwbGF5RGF0ZTogRGF0ZTtcbiAgICBjc3NDbGFzcz86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ1dlZWtWaWV3SG91ciB7XG4gICAgc2VnbWVudHM6IE1DV2Vla1ZpZXdIb3VyU2VnbWVudFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DV2Vla1ZpZXdIb3VyQ29sdW1uIHtcbiAgICBkYXRlOiBEYXRlO1xuICAgIGhvdXJzOiBNQ1dlZWtWaWV3SG91cltdO1xuICAgIGV2ZW50czogTUNXZWVrVmlld1RpbWVFdmVudFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DVmlld1BlcmlvZCB7XG4gICAgc3RhcnQ6IERhdGU7XG4gICAgZW5kOiBEYXRlO1xuICAgIGV2ZW50czogTUNFdmVudFtdO1xufVxuXG5mdW5jdGlvbiBnZXRFeGNsdWRlZFNlY29uZHMoXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHtcbiAgICAgICAgc3RhcnREYXRlLFxuICAgICAgICBzZWNvbmRzLFxuICAgICAgICBleGNsdWRlZCxcbiAgICAgICAgcHJlY2lzaW9uLFxuICAgIH06IHtcbiAgICAgICAgc3RhcnREYXRlOiBEYXRlO1xuICAgICAgICBzZWNvbmRzOiBudW1iZXI7XG4gICAgICAgIGV4Y2x1ZGVkOiBudW1iZXJbXTtcbiAgICAgICAgcHJlY2lzaW9uOiAnbWludXRlcycgfCAnZGF5cyc7XG4gICAgfVxuKTogbnVtYmVyIHtcbiAgICBpZiAoZXhjbHVkZWQubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgY29uc3QgeyBhZGRTZWNvbmRzLCBnZXREYXksIGFkZERheXMgfSA9IGRhdGVBZGFwdGVyO1xuICAgIGNvbnN0IGVuZERhdGU6IERhdGUgPSBhZGRTZWNvbmRzKHN0YXJ0RGF0ZSwgc2Vjb25kcyAtIDEpO1xuICAgIGNvbnN0IGRheVN0YXJ0OiBudW1iZXIgPSBnZXREYXkoc3RhcnREYXRlKTtcbiAgICBjb25zdCBkYXlFbmQ6IG51bWJlciA9IGdldERheShlbmREYXRlKTtcbiAgICBsZXQgcmVzdWx0OiBudW1iZXIgPSAwOyAvLyBDYWxjdWxhdGVkIGluIHNlY29uZHNcbiAgICBsZXQgY3VycmVudDogRGF0ZSA9IHN0YXJ0RGF0ZTtcblxuICAgIHdoaWxlIChjdXJyZW50IDwgZW5kRGF0ZSkge1xuICAgICAgICBjb25zdCBkYXk6IG51bWJlciA9IGdldERheShjdXJyZW50KTtcblxuICAgICAgICBpZiAoZXhjbHVkZWQuc29tZSgoZXhjbHVkZWREYXkpID0+IGV4Y2x1ZGVkRGF5ID09PSBkYXkpKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gY2FsY3VsYXRlRXhjbHVkZWRTZWNvbmRzKGRhdGVBZGFwdGVyLCB7XG4gICAgICAgICAgICAgICAgZGF5U3RhcnQsXG4gICAgICAgICAgICAgICAgZGF5RW5kLFxuICAgICAgICAgICAgICAgIGRheSxcbiAgICAgICAgICAgICAgICBwcmVjaXNpb24sXG4gICAgICAgICAgICAgICAgc3RhcnREYXRlLFxuICAgICAgICAgICAgICAgIGVuZERhdGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnQgPSBhZGREYXlzKGN1cnJlbnQsIDEpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUV4Y2x1ZGVkU2Vjb25kcyhcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBwcmVjaXNpb24sXG4gICAgICAgIGRheSxcbiAgICAgICAgZGF5U3RhcnQsXG4gICAgICAgIGRheUVuZCxcbiAgICAgICAgc3RhcnREYXRlLFxuICAgICAgICBlbmREYXRlLFxuICAgIH06IHtcbiAgICAgICAgZGF5OiBudW1iZXI7XG4gICAgICAgIHN0YXJ0RGF0ZTogRGF0ZTtcbiAgICAgICAgZW5kRGF0ZTogRGF0ZTtcbiAgICAgICAgZGF5U3RhcnQ6IG51bWJlcjtcbiAgICAgICAgZGF5RW5kOiBudW1iZXI7XG4gICAgICAgIHByZWNpc2lvbj86ICdtaW51dGVzJyB8ICdkYXlzJztcbiAgICB9XG4pOiBudW1iZXIge1xuICAgIGNvbnN0IHsgZGlmZmVyZW5jZUluU2Vjb25kcywgZW5kT2ZEYXksIHN0YXJ0T2ZEYXkgfSA9IGRhdGVBZGFwdGVyO1xuICAgIGlmIChwcmVjaXNpb24gPT09ICdtaW51dGVzJykge1xuICAgICAgICBpZiAoZGF5ID09PSBkYXlTdGFydCkge1xuICAgICAgICAgICAgcmV0dXJuIGRpZmZlcmVuY2VJblNlY29uZHMoZW5kT2ZEYXkoc3RhcnREYXRlKSwgc3RhcnREYXRlKSArIDE7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF5ID09PSBkYXlFbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBkaWZmZXJlbmNlSW5TZWNvbmRzKGVuZERhdGUsIHN0YXJ0T2ZEYXkoZW5kRGF0ZSkpICsgMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBTRUNPTkRTX0lOX0RBWTtcbn1cblxuZnVuY3Rpb24gZ2V0V2Vla1ZpZXdFdmVudFNwYW4oXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIG9mZnNldCxcbiAgICAgICAgc3RhcnRPZldlZWtEYXRlLFxuICAgICAgICBleGNsdWRlZCxcbiAgICAgICAgcHJlY2lzaW9uLFxuICAgICAgICB0b3RhbERheXNJblZpZXcsXG4gICAgfToge1xuICAgICAgICBldmVudDogTUNFdmVudDtcbiAgICAgICAgb2Zmc2V0OiBudW1iZXI7XG4gICAgICAgIHN0YXJ0T2ZXZWVrRGF0ZTogRGF0ZTtcbiAgICAgICAgZXhjbHVkZWQ6IG51bWJlcltdO1xuICAgICAgICBwcmVjaXNpb246ICdtaW51dGVzJyB8ICdkYXlzJztcbiAgICAgICAgdG90YWxEYXlzSW5WaWV3OiBudW1iZXI7XG4gICAgfVxuKTogbnVtYmVyIHtcbiAgICBjb25zdCB7XG4gICAgICAgIG1heCxcbiAgICAgICAgZGlmZmVyZW5jZUluU2Vjb25kcyxcbiAgICAgICAgYWRkRGF5cyxcbiAgICAgICAgZW5kT2ZEYXksXG4gICAgICAgIGRpZmZlcmVuY2VJbkRheXMsXG4gICAgfSA9IGRhdGVBZGFwdGVyO1xuICAgIGxldCBzcGFuOiBudW1iZXIgPSBTRUNPTkRTX0lOX0RBWTtcbiAgICBjb25zdCBiZWdpbjogRGF0ZSA9IG1heChbZXZlbnQuc3RhcnQsIHN0YXJ0T2ZXZWVrRGF0ZV0pO1xuXG4gICAgaWYgKGV2ZW50LmVuZCkge1xuICAgICAgICBzd2l0Y2ggKHByZWNpc2lvbikge1xuICAgICAgICAgICAgY2FzZSAnbWludXRlcyc6XG4gICAgICAgICAgICAgICAgc3BhbiA9IGRpZmZlcmVuY2VJblNlY29uZHMoZXZlbnQuZW5kLCBiZWdpbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHNwYW4gPVxuICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbmNlSW5EYXlzKGFkZERheXMoZW5kT2ZEYXkoZXZlbnQuZW5kKSwgMSksIGJlZ2luKSAqXG4gICAgICAgICAgICAgICAgICAgIFNFQ09ORFNfSU5fREFZO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb2Zmc2V0U2Vjb25kczogbnVtYmVyID0gb2Zmc2V0ICogU0VDT05EU19JTl9EQVk7XG4gICAgY29uc3QgdG90YWxMZW5ndGg6IG51bWJlciA9IG9mZnNldFNlY29uZHMgKyBzcGFuO1xuXG4gICAgLy8gdGhlIGJlc3Qgd2F5IHRvIGRldGVjdCBpZiBhbiBldmVudCBpcyBvdXRzaWRlIHRoZSB3ZWVrLXZpZXdcbiAgICAvLyBpcyB0byBjaGVjayBpZiB0aGUgdG90YWwgc3BhbiBiZWdpbm5pbmcgKGZyb20gc3RhcnRPZldlZWtEYXkgb3IgZXZlbnQgc3RhcnQpIGV4Y2VlZHMgdGhlIHRvdGFsIGRheXMgaW4gdGhlIHZpZXdcbiAgICBjb25zdCBzZWNvbmRzSW5WaWV3ID0gdG90YWxEYXlzSW5WaWV3ICogU0VDT05EU19JTl9EQVk7XG4gICAgaWYgKHRvdGFsTGVuZ3RoID4gc2Vjb25kc0luVmlldykge1xuICAgICAgICBzcGFuID0gc2Vjb25kc0luVmlldyAtIG9mZnNldFNlY29uZHM7XG4gICAgfVxuXG4gICAgc3BhbiAtPSBnZXRFeGNsdWRlZFNlY29uZHMoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgc3RhcnREYXRlOiBiZWdpbixcbiAgICAgICAgc2Vjb25kczogc3BhbixcbiAgICAgICAgZXhjbHVkZWQsXG4gICAgICAgIHByZWNpc2lvbixcbiAgICB9KTtcblxuICAgIHJldHVybiBzcGFuIC8gU0VDT05EU19JTl9EQVk7XG59XG5cbmZ1bmN0aW9uIGdldFdlZWtWaWV3RXZlbnRPZmZzZXQoXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIHN0YXJ0T2ZXZWVrOiBzdGFydE9mV2Vla0RhdGUsXG4gICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICBwcmVjaXNpb24sXG4gICAgfToge1xuICAgICAgICBldmVudDogTUNFdmVudDtcbiAgICAgICAgc3RhcnRPZldlZWs6IERhdGU7XG4gICAgICAgIGV4Y2x1ZGVkOiBudW1iZXJbXTtcbiAgICAgICAgcHJlY2lzaW9uOiAnbWludXRlcycgfCAnZGF5cyc7XG4gICAgfVxuKTogbnVtYmVyIHtcbiAgICBjb25zdCB7IGRpZmZlcmVuY2VJbkRheXMsIHN0YXJ0T2ZEYXksIGRpZmZlcmVuY2VJblNlY29uZHMgfSA9IGRhdGVBZGFwdGVyO1xuICAgIGlmIChldmVudC5zdGFydCA8IHN0YXJ0T2ZXZWVrRGF0ZSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBsZXQgb2Zmc2V0OiBudW1iZXIgPSAwO1xuXG4gICAgc3dpdGNoIChwcmVjaXNpb24pIHtcbiAgICAgICAgY2FzZSAnZGF5cyc6XG4gICAgICAgICAgICBvZmZzZXQgPVxuICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VJbkRheXMoc3RhcnRPZkRheShldmVudC5zdGFydCksIHN0YXJ0T2ZXZWVrRGF0ZSkgKlxuICAgICAgICAgICAgICAgIFNFQ09ORFNfSU5fREFZO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgICAgICAgICAgb2Zmc2V0ID0gZGlmZmVyZW5jZUluU2Vjb25kcyhldmVudC5zdGFydCwgc3RhcnRPZldlZWtEYXRlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIG9mZnNldCAtPSBnZXRFeGNsdWRlZFNlY29uZHMoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgc3RhcnREYXRlOiBzdGFydE9mV2Vla0RhdGUsXG4gICAgICAgIHNlY29uZHM6IG9mZnNldCxcbiAgICAgICAgZXhjbHVkZWQsXG4gICAgICAgIHByZWNpc2lvbixcbiAgICB9KTtcblxuICAgIHJldHVybiBNYXRoLmFicyhvZmZzZXQgLyBTRUNPTkRTX0lOX0RBWSk7XG59XG5cbmludGVyZmFjZSBJc0V2ZW50SW5QZXJpb2RBcmdzIHtcbiAgICBldmVudDogTUNFdmVudDtcbiAgICBwZXJpb2RTdGFydDogRGF0ZTtcbiAgICBwZXJpb2RFbmQ6IERhdGU7XG59XG5cbmZ1bmN0aW9uIGlzRXZlbnRJc1BlcmlvZChcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAgeyBldmVudCwgcGVyaW9kU3RhcnQsIHBlcmlvZEVuZCB9OiBJc0V2ZW50SW5QZXJpb2RBcmdzXG4pOiBib29sZWFuIHtcbiAgICBjb25zdCB7IGlzU2FtZVNlY29uZCB9ID0gZGF0ZUFkYXB0ZXI7XG4gICAgY29uc3QgZXZlbnRTdGFydDogRGF0ZSA9IGV2ZW50LnN0YXJ0O1xuICAgIGNvbnN0IGV2ZW50RW5kOiBEYXRlID0gZXZlbnQuZW5kIHx8IGV2ZW50LnN0YXJ0O1xuXG4gICAgaWYgKGV2ZW50U3RhcnQgPiBwZXJpb2RTdGFydCAmJiBldmVudFN0YXJ0IDwgcGVyaW9kRW5kKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChldmVudEVuZCA+IHBlcmlvZFN0YXJ0ICYmIGV2ZW50RW5kIDwgcGVyaW9kRW5kKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChldmVudFN0YXJ0IDwgcGVyaW9kU3RhcnQgJiYgZXZlbnRFbmQgPiBwZXJpb2RFbmQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgICBpc1NhbWVTZWNvbmQoZXZlbnRTdGFydCwgcGVyaW9kU3RhcnQpIHx8XG4gICAgICAgIGlzU2FtZVNlY29uZChldmVudFN0YXJ0LCBwZXJpb2RFbmQpXG4gICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICAgaXNTYW1lU2Vjb25kKGV2ZW50RW5kLCBwZXJpb2RTdGFydCkgfHxcbiAgICAgICAgaXNTYW1lU2Vjb25kKGV2ZW50RW5kLCBwZXJpb2RFbmQpXG4gICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ0dldEV2ZW50c0luUGVyaW9kQXJncyB7XG4gICAgZXZlbnRzOiBNQ0V2ZW50W107XG4gICAgcGVyaW9kU3RhcnQ6IERhdGU7XG4gICAgcGVyaW9kRW5kOiBEYXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXZlbnRzSW5QZXJpb2QoXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHsgZXZlbnRzLCBwZXJpb2RTdGFydCwgcGVyaW9kRW5kIH06IE1DR2V0RXZlbnRzSW5QZXJpb2RBcmdzXG4pOiBNQ0V2ZW50W10ge1xuICAgIHJldHVybiBldmVudHMuZmlsdGVyKChldmVudDogTUNFdmVudCkgPT5cbiAgICAgICAgaXNFdmVudElzUGVyaW9kKGRhdGVBZGFwdGVyLCB7IGV2ZW50LCBwZXJpb2RTdGFydCwgcGVyaW9kRW5kIH0pXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0V2Vla0RheShcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBkYXRlLFxuICAgICAgICB3ZWVrZW5kRGF5cyA9IERFRkFVTFRfV0VFS0VORF9EQVlTLFxuICAgIH06IHtcbiAgICAgICAgZGF0ZTogRGF0ZTtcbiAgICAgICAgd2Vla2VuZERheXM6IG51bWJlcltdO1xuICAgICAgICBwcmVjaXNpb24/OiAnZGF5cycgfCAnbWludXRlcyc7XG4gICAgfVxuKTogTUNXZWVrRGF5IHtcbiAgICBjb25zdCB7IHN0YXJ0T2ZEYXksIGlzU2FtZURheSwgZ2V0RGF5IH0gPSBkYXRlQWRhcHRlcjtcbiAgICBjb25zdCB0b2RheSA9IHN0YXJ0T2ZEYXkobmV3IERhdGUoKSk7XG4gICAgY29uc3QgZGF5ID0gZ2V0RGF5KGRhdGUpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRhdGUsXG4gICAgICAgIGRheSxcbiAgICAgICAgaXNQYXN0OiBkYXRlIDwgdG9kYXksXG4gICAgICAgIGlzVG9kYXk6IGlzU2FtZURheShkYXRlLCB0b2RheSksXG4gICAgICAgIGlzRnV0dXJlOiBkYXRlID4gdG9kYXksXG4gICAgICAgIGlzV2Vla2VuZDogd2Vla2VuZERheXMuaW5kZXhPZihkYXkpID4gLTEsXG4gICAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ0dldFdlZWtWaWV3SGVhZGVyQXJncyB7XG4gICAgdmlld0RhdGU6IERhdGU7XG4gICAgd2Vla1N0YXJ0c09uOiBudW1iZXI7XG4gICAgZXhjbHVkZWQ/OiBudW1iZXJbXTtcbiAgICB3ZWVrZW5kRGF5cz86IG51bWJlcltdO1xuICAgIHZpZXdTdGFydD86IERhdGU7XG4gICAgdmlld0VuZD86IERhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRXZWVrVmlld0hlYWRlcihcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICB2aWV3RGF0ZSxcbiAgICAgICAgd2Vla1N0YXJ0c09uLFxuICAgICAgICBleGNsdWRlZCA9IFtdLFxuICAgICAgICB3ZWVrZW5kRGF5cyxcbiAgICAgICAgdmlld1N0YXJ0ID0gZGF0ZUFkYXB0ZXIuc3RhcnRPZldlZWsodmlld0RhdGUsIHsgd2Vla1N0YXJ0c09uIH0pLFxuICAgICAgICB2aWV3RW5kID0gZGF0ZUFkYXB0ZXIuYWRkRGF5cyh2aWV3U3RhcnQsIERBWVNfSU5fV0VFSyksXG4gICAgfTogTUNHZXRXZWVrVmlld0hlYWRlckFyZ3Ncbik6IE1DV2Vla0RheVtdIHtcbiAgICBjb25zdCB7IGFkZERheXMsIGdldERheSB9ID0gZGF0ZUFkYXB0ZXI7XG4gICAgY29uc3QgZGF5czogTUNXZWVrRGF5W10gPSBbXTtcbiAgICBsZXQgZGF0ZSA9IHZpZXdTdGFydDtcbiAgICB3aGlsZSAoZGF0ZSA8IHZpZXdFbmQpIHtcbiAgICAgICAgaWYgKCFleGNsdWRlZC5zb21lKChlKSA9PiBnZXREYXkoZGF0ZSkgPT09IGUpKSB7XG4gICAgICAgICAgICBkYXlzLnB1c2goZ2V0V2Vla0RheShkYXRlQWRhcHRlciwgeyBkYXRlLCB3ZWVrZW5kRGF5cyB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZGF0ZSA9IGFkZERheXMoZGF0ZSwgMSk7XG4gICAgfVxuICAgIHJldHVybiBkYXlzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DR2V0V2Vla1ZpZXdBcmdzIHtcbiAgICBldmVudHM/OiBNQ0V2ZW50W107XG4gICAgdmlld0RhdGU6IERhdGU7XG4gICAgd2Vla1N0YXJ0c09uOiBudW1iZXI7XG4gICAgZXhjbHVkZWQ/OiBudW1iZXJbXTtcbiAgICBwcmVjaXNpb24/OiAnbWludXRlcycgfCAnZGF5cyc7XG4gICAgYWJzb2x1dGVQb3NpdGlvbmVkRXZlbnRzPzogYm9vbGVhbjtcbiAgICBob3VyU2VnbWVudHM/OiBudW1iZXI7XG4gICAgaG91ckR1cmF0aW9uPzogbnVtYmVyO1xuICAgIGRheVN0YXJ0OiBUaW1lO1xuICAgIGRheUVuZDogVGltZTtcbiAgICB3ZWVrZW5kRGF5cz86IG51bWJlcltdO1xuICAgIHNlZ21lbnRIZWlnaHQ6IG51bWJlcjtcbiAgICB2aWV3U3RhcnQ/OiBEYXRlO1xuICAgIHZpZXdFbmQ/OiBEYXRlO1xuICAgIG1pbmltdW1FdmVudEhlaWdodD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpZmZlcmVuY2VJbkRheXNXaXRoRXhjbHVzaW9ucyhcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAgeyBkYXRlMSwgZGF0ZTIsIGV4Y2x1ZGVkIH06IHsgZGF0ZTE6IERhdGU7IGRhdGUyOiBEYXRlOyBleGNsdWRlZDogbnVtYmVyW10gfVxuKTogbnVtYmVyIHtcbiAgICBsZXQgZGF0ZSA9IGRhdGUxO1xuICAgIGxldCBkaWZmID0gMDtcbiAgICB3aGlsZSAoZGF0ZSA8IGRhdGUyKSB7XG4gICAgICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGRhdGVBZGFwdGVyLmdldERheShkYXRlKSkgPT09IC0xKSB7XG4gICAgICAgICAgICBkaWZmKys7XG4gICAgICAgIH1cbiAgICAgICAgZGF0ZSA9IGRhdGVBZGFwdGVyLmFkZERheXMoZGF0ZSwgMSk7XG4gICAgfVxuICAgIHJldHVybiBkaWZmO1xufVxuXG5pbnRlcmZhY2UgTUNHZXRBbGxEYXlFdmVudEFyZ3Mge1xuICAgIHByZWNpc2lvbj86ICdkYXlzJyB8ICdtaW51dGVzJztcbiAgICBldmVudHM/OiBNQ0V2ZW50W107XG4gICAgYWJzb2x1dGVQb3NpdGlvbmVkRXZlbnRzPzogYm9vbGVhbjtcbiAgICB2aWV3U3RhcnQ6IERhdGU7XG4gICAgdmlld0VuZDogRGF0ZTtcbiAgICBleGNsdWRlZD86IG51bWJlcltdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsRGF5V2Vla0V2ZW50cyhcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBldmVudHMgPSBbXSxcbiAgICAgICAgZXhjbHVkZWQgPSBbXSxcbiAgICAgICAgcHJlY2lzaW9uID0gJ2RheXMnIGFzIGNvbnN0LFxuICAgICAgICBhYnNvbHV0ZVBvc2l0aW9uZWRFdmVudHMgPSBmYWxzZSxcbiAgICAgICAgdmlld1N0YXJ0LFxuICAgICAgICB2aWV3RW5kLFxuICAgIH06IE1DR2V0QWxsRGF5RXZlbnRBcmdzXG4pOiBNQ1dlZWtWaWV3QWxsRGF5RXZlbnRSb3dbXSB7XG4gICAgdmlld1N0YXJ0ID0gZGF0ZUFkYXB0ZXIuc3RhcnRPZkRheSh2aWV3U3RhcnQpO1xuICAgIHZpZXdFbmQgPSBkYXRlQWRhcHRlci5lbmRPZkRheSh2aWV3RW5kKTtcbiAgICBjb25zdCB7IGRpZmZlcmVuY2VJblNlY29uZHMsIGRpZmZlcmVuY2VJbkRheXMgfSA9IGRhdGVBZGFwdGVyO1xuICAgIGNvbnN0IG1heFJhbmdlOiBudW1iZXIgPSBnZXREaWZmZXJlbmNlSW5EYXlzV2l0aEV4Y2x1c2lvbnMoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgZGF0ZTE6IHZpZXdTdGFydCxcbiAgICAgICAgZGF0ZTI6IHZpZXdFbmQsXG4gICAgICAgIGV4Y2x1ZGVkLFxuICAgIH0pO1xuICAgIGNvbnN0IHRvdGFsRGF5c0luVmlldyA9IGRpZmZlcmVuY2VJbkRheXModmlld0VuZCwgdmlld1N0YXJ0KSArIDE7XG4gICAgY29uc3QgZXZlbnRzTWFwcGVkOiBNQ1dlZWtWaWV3QWxsRGF5RXZlbnRbXSA9IGV2ZW50c1xuICAgICAgICAuZmlsdGVyKChldmVudCkgPT4gZXZlbnQuYWxsRGF5KVxuICAgICAgICAubWFwKChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0OiBudW1iZXIgPSBnZXRXZWVrVmlld0V2ZW50T2Zmc2V0KGRhdGVBZGFwdGVyLCB7XG4gICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgc3RhcnRPZldlZWs6IHZpZXdTdGFydCxcbiAgICAgICAgICAgICAgICBleGNsdWRlZCxcbiAgICAgICAgICAgICAgICBwcmVjaXNpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHNwYW46IG51bWJlciA9IGdldFdlZWtWaWV3RXZlbnRTcGFuKGRhdGVBZGFwdGVyLCB7XG4gICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHN0YXJ0T2ZXZWVrRGF0ZTogdmlld1N0YXJ0LFxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbixcbiAgICAgICAgICAgICAgICB0b3RhbERheXNJblZpZXcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7IGV2ZW50LCBvZmZzZXQsIHNwYW4gfTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcigoZSkgPT4gZS5vZmZzZXQgPCBtYXhSYW5nZSlcbiAgICAgICAgLmZpbHRlcigoZSkgPT4gZS5zcGFuID4gMClcbiAgICAgICAgLm1hcCgoZW50cnkpID0+ICh7XG4gICAgICAgICAgICBldmVudDogZW50cnkuZXZlbnQsXG4gICAgICAgICAgICBvZmZzZXQ6IGVudHJ5Lm9mZnNldCxcbiAgICAgICAgICAgIHNwYW46IGVudHJ5LnNwYW4sXG4gICAgICAgICAgICBzdGFydHNCZWZvcmVXZWVrOiBlbnRyeS5ldmVudC5zdGFydCA8IHZpZXdTdGFydCxcbiAgICAgICAgICAgIGVuZHNBZnRlcldlZWs6IChlbnRyeS5ldmVudC5lbmQgfHwgZW50cnkuZXZlbnQuc3RhcnQpID4gdmlld0VuZCxcbiAgICAgICAgfSkpXG4gICAgICAgIC5zb3J0KChpdGVtQSwgaXRlbUIpOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRTZWNvbmRzRGlmZjogbnVtYmVyID0gZGlmZmVyZW5jZUluU2Vjb25kcyhcbiAgICAgICAgICAgICAgICBpdGVtQS5ldmVudC5zdGFydCxcbiAgICAgICAgICAgICAgICBpdGVtQi5ldmVudC5zdGFydFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChzdGFydFNlY29uZHNEaWZmID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpZmZlcmVuY2VJblNlY29uZHMoXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1CLmV2ZW50LmVuZCB8fCBpdGVtQi5ldmVudC5zdGFydCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbUEuZXZlbnQuZW5kIHx8IGl0ZW1BLmV2ZW50LnN0YXJ0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGFydFNlY29uZHNEaWZmO1xuICAgICAgICB9KTtcblxuICAgIGNvbnN0IGFsbERheUV2ZW50Um93czogTUNXZWVrVmlld0FsbERheUV2ZW50Um93W10gPSBbXTtcbiAgICBjb25zdCBhbGxvY2F0ZWRFdmVudHM6IE1DV2Vla1ZpZXdBbGxEYXlFdmVudFtdID0gW107XG5cbiAgICBldmVudHNNYXBwZWQuZm9yRWFjaCgoZXZlbnQ6IE1DV2Vla1ZpZXdBbGxEYXlFdmVudCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBpZiAoYWxsb2NhdGVkRXZlbnRzLmluZGV4T2YoZXZlbnQpID09PSAtMSkge1xuICAgICAgICAgICAgYWxsb2NhdGVkRXZlbnRzLnB1c2goZXZlbnQpO1xuICAgICAgICAgICAgbGV0IHJvd1NwYW46IG51bWJlciA9IGV2ZW50LnNwYW4gKyBldmVudC5vZmZzZXQ7XG4gICAgICAgICAgICBjb25zdCBvdGhlclJvd0V2ZW50czogTUNXZWVrVmlld0FsbERheUV2ZW50W10gPSBldmVudHNNYXBwZWRcbiAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXggKyAxKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKG5leHRFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0RXZlbnQub2Zmc2V0ID49IHJvd1NwYW4gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd1NwYW4gKyBuZXh0RXZlbnQuc3BhbiA8PSB0b3RhbERheXNJblZpZXcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZEV2ZW50cy5pbmRleE9mKG5leHRFdmVudCkgPT09IC0xXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dEV2ZW50T2Zmc2V0OiBudW1iZXIgPSBuZXh0RXZlbnQub2Zmc2V0IC0gcm93U3BhbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYWJzb2x1dGVQb3NpdGlvbmVkRXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEV2ZW50Lm9mZnNldCA9IG5leHRFdmVudE9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd1NwYW4gKz0gbmV4dEV2ZW50LnNwYW4gKyBuZXh0RXZlbnRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZWRFdmVudHMucHVzaChuZXh0RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHdlZWtFdmVudHMgPSBbZXZlbnQsIC4uLm90aGVyUm93RXZlbnRzXTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gd2Vla0V2ZW50c1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHdlZWtFdmVudCkgPT4gd2Vla0V2ZW50LmV2ZW50LmlkKVxuICAgICAgICAgICAgICAgIC5tYXAoKHdlZWtFdmVudCkgPT4gd2Vla0V2ZW50LmV2ZW50LmlkKVxuICAgICAgICAgICAgICAgIC5qb2luKCctJyk7XG4gICAgICAgICAgICBhbGxEYXlFdmVudFJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgcm93OiB3ZWVrRXZlbnRzLFxuICAgICAgICAgICAgICAgIC4uLihpZCA/IHsgaWQgfSA6IHt9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGFsbERheUV2ZW50Um93cztcbn1cblxuaW50ZXJmYWNlIE1DR2V0V2Vla1ZpZXdIb3VyR3JpZEFyZ3MgZXh0ZW5kcyBNQ0dldERheVZpZXdIb3VyR3JpZEFyZ3Mge1xuICAgIHdlZWtTdGFydHNPbjogbnVtYmVyO1xuICAgIGV4Y2x1ZGVkPzogbnVtYmVyW107XG4gICAgd2Vla2VuZERheXM/OiBudW1iZXJbXTtcbiAgICBldmVudHM/OiBNQ0V2ZW50W107XG4gICAgc2VnbWVudEhlaWdodDogbnVtYmVyO1xuICAgIHZpZXdTdGFydDogRGF0ZTtcbiAgICB2aWV3RW5kOiBEYXRlO1xuICAgIG1pbmltdW1FdmVudEhlaWdodDogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBnZXRXZWVrVmlld0hvdXJHcmlkKFxuICAgIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgICB7XG4gICAgICAgIGV2ZW50cyxcbiAgICAgICAgdmlld0RhdGUsXG4gICAgICAgIGhvdXJTZWdtZW50cyxcbiAgICAgICAgaG91ckR1cmF0aW9uLFxuICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgZGF5RW5kLFxuICAgICAgICB3ZWVrU3RhcnRzT24sXG4gICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICB3ZWVrZW5kRGF5cyxcbiAgICAgICAgc2VnbWVudEhlaWdodCxcbiAgICAgICAgdmlld1N0YXJ0LFxuICAgICAgICB2aWV3RW5kLFxuICAgICAgICBtaW5pbXVtRXZlbnRIZWlnaHQsXG4gICAgfTogTUNHZXRXZWVrVmlld0hvdXJHcmlkQXJnc1xuKTogTUNXZWVrVmlld0hvdXJDb2x1bW5bXSB7XG4gICAgY29uc3QgZGF5Vmlld0hvdXJHcmlkID0gZ2V0RGF5Vmlld0hvdXJHcmlkKGRhdGVBZGFwdGVyLCB7XG4gICAgICAgIHZpZXdEYXRlLFxuICAgICAgICBob3VyU2VnbWVudHMsXG4gICAgICAgIGhvdXJEdXJhdGlvbixcbiAgICAgICAgZGF5U3RhcnQsXG4gICAgICAgIGRheUVuZCxcbiAgICB9KTtcbiAgICBjb25zdCB3ZWVrRGF5cyA9IGdldFdlZWtWaWV3SGVhZGVyKGRhdGVBZGFwdGVyLCB7XG4gICAgICAgIHZpZXdEYXRlLFxuICAgICAgICB3ZWVrU3RhcnRzT24sXG4gICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICB3ZWVrZW5kRGF5cyxcbiAgICAgICAgdmlld1N0YXJ0LFxuICAgICAgICB2aWV3RW5kLFxuICAgIH0pO1xuICAgIGNvbnN0IHsgc2V0SG91cnMsIHNldE1pbnV0ZXMsIGdldEhvdXJzLCBnZXRNaW51dGVzIH0gPSBkYXRlQWRhcHRlcjtcblxuICAgIHJldHVybiB3ZWVrRGF5cy5tYXAoKGRheSkgPT4ge1xuICAgICAgICBjb25zdCBkYXlWaWV3ID0gZ2V0RGF5VmlldyhkYXRlQWRhcHRlciwge1xuICAgICAgICAgICAgZXZlbnRzLFxuICAgICAgICAgICAgdmlld0RhdGU6IGRheS5kYXRlLFxuICAgICAgICAgICAgaG91clNlZ21lbnRzLFxuICAgICAgICAgICAgZGF5U3RhcnQsXG4gICAgICAgICAgICBkYXlFbmQsXG4gICAgICAgICAgICBzZWdtZW50SGVpZ2h0LFxuICAgICAgICAgICAgZXZlbnRXaWR0aDogMSxcbiAgICAgICAgICAgIGhvdXJEdXJhdGlvbixcbiAgICAgICAgICAgIG1pbmltdW1FdmVudEhlaWdodCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgaG91cnMgPSBkYXlWaWV3SG91ckdyaWQubWFwKChob3VyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IGhvdXIuc2VnbWVudHMubWFwKChzZWdtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IHNldE1pbnV0ZXMoXG4gICAgICAgICAgICAgICAgICAgIHNldEhvdXJzKGRheS5kYXRlLCBnZXRIb3VycyhzZWdtZW50LmRhdGUpKSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0TWludXRlcyhzZWdtZW50LmRhdGUpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5zZWdtZW50LCBkYXRlIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLmhvdXIsIHNlZ21lbnRzIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbHVtbkNvdW50KFxuICAgICAgICAgICAgYWxsRXZlbnRzOiBNQ1dlZWtWaWV3VGltZUV2ZW50W10sXG4gICAgICAgICAgICBwcmV2T3ZlcmxhcHBpbmdFdmVudHM6IE1DV2Vla1ZpZXdUaW1lRXZlbnRbXVxuICAgICAgICApOiBudW1iZXIge1xuICAgICAgICAgICAgY29uc3QgY29sdW1uQ291bnQgPSBNYXRoLm1heChcbiAgICAgICAgICAgICAgICAuLi5wcmV2T3ZlcmxhcHBpbmdFdmVudHMubWFwKChpRXZlbnQpID0+IGlFdmVudC5sZWZ0ICsgMSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5leHRPdmVybGFwcGluZ0V2ZW50cyA9IGFsbEV2ZW50c1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGlFdmVudCkgPT4gaUV2ZW50LmxlZnQgPj0gY29sdW1uQ291bnQpXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoaUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRPdmVyTGFwcGluZ1dlZWtWaWV3RXZlbnRzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZPdmVybGFwcGluZ0V2ZW50cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpRXZlbnQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlFdmVudC50b3AgKyBpRXZlbnQuaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICApLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKG5leHRPdmVybGFwcGluZ0V2ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldENvbHVtbkNvdW50KGFsbEV2ZW50cywgbmV4dE92ZXJsYXBwaW5nRXZlbnRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbHVtbkNvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwcGVkRXZlbnRzID0gZGF5Vmlldy5ldmVudHMubWFwKChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sdW1uQ291bnQgPSBnZXRDb2x1bW5Db3VudChcbiAgICAgICAgICAgICAgICBkYXlWaWV3LmV2ZW50cyxcbiAgICAgICAgICAgICAgICBnZXRPdmVyTGFwcGluZ1dlZWtWaWV3RXZlbnRzKFxuICAgICAgICAgICAgICAgICAgICBkYXlWaWV3LmV2ZW50cyxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQudG9wLFxuICAgICAgICAgICAgICAgICAgICBldmVudC50b3AgKyBldmVudC5oZWlnaHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IDEwMCAvIGNvbHVtbkNvdW50O1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uZXZlbnQsIGxlZnQ6IGV2ZW50LmxlZnQgKiB3aWR0aCwgd2lkdGggfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhvdXJzLFxuICAgICAgICAgICAgZGF0ZTogZGF5LmRhdGUsXG4gICAgICAgICAgICBldmVudHM6IG1hcHBlZEV2ZW50cy5tYXAoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3ZlckxhcHBpbmdFdmVudHMgPSBnZXRPdmVyTGFwcGluZ1dlZWtWaWV3RXZlbnRzKFxuICAgICAgICAgICAgICAgICAgICBtYXBwZWRFdmVudHMuZmlsdGVyKChvdGhlckV2ZW50KSA9PiBvdGhlckV2ZW50LmxlZnQgPiBldmVudC5sZWZ0KSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQudG9wLFxuICAgICAgICAgICAgICAgICAgICBldmVudC50b3AgKyBldmVudC5oZWlnaHRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmIChvdmVyTGFwcGluZ0V2ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5ldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5vdmVyTGFwcGluZ0V2ZW50cy5tYXAoKG90aGVyRXZlbnQpID0+IG90aGVyRXZlbnQubGVmdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIC0gZXZlbnQubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50O1xuICAgICAgICAgICAgfSksXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRXZWVrVmlldyhcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBldmVudHMgPSBbXSxcbiAgICAgICAgdmlld0RhdGUsXG4gICAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgICAgZXhjbHVkZWQgPSBbXSxcbiAgICAgICAgcHJlY2lzaW9uID0gJ2RheXMnLFxuICAgICAgICBhYnNvbHV0ZVBvc2l0aW9uZWRFdmVudHMgPSBmYWxzZSxcbiAgICAgICAgaG91clNlZ21lbnRzLFxuICAgICAgICBob3VyRHVyYXRpb24sXG4gICAgICAgIGRheVN0YXJ0LFxuICAgICAgICBkYXlFbmQsXG4gICAgICAgIHdlZWtlbmREYXlzLFxuICAgICAgICBzZWdtZW50SGVpZ2h0LFxuICAgICAgICBtaW5pbXVtRXZlbnRIZWlnaHQsXG4gICAgICAgIHZpZXdTdGFydCA9IGRhdGVBZGFwdGVyLnN0YXJ0T2ZXZWVrKHZpZXdEYXRlLCB7IHdlZWtTdGFydHNPbiB9KSxcbiAgICAgICAgdmlld0VuZCA9IGRhdGVBZGFwdGVyLmVuZE9mV2Vlayh2aWV3RGF0ZSwgeyB3ZWVrU3RhcnRzT24gfSksXG4gICAgfTogTUNHZXRXZWVrVmlld0FyZ3Ncbik6IE1DV2Vla1ZpZXcge1xuICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgIGV2ZW50cyA9IFtdO1xuICAgIH1cbiAgICBjb25zdCB7IHN0YXJ0T2ZEYXksIGVuZE9mRGF5IH0gPSBkYXRlQWRhcHRlcjtcbiAgICB2aWV3U3RhcnQgPSBzdGFydE9mRGF5KHZpZXdTdGFydCk7XG4gICAgdmlld0VuZCA9IGVuZE9mRGF5KHZpZXdFbmQpO1xuICAgIGNvbnN0IGV2ZW50c0luUGVyaW9kID0gZ2V0RXZlbnRzSW5QZXJpb2QoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgZXZlbnRzLFxuICAgICAgICBwZXJpb2RTdGFydDogdmlld1N0YXJ0LFxuICAgICAgICBwZXJpb2RFbmQ6IHZpZXdFbmQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBoZWFkZXIgPSBnZXRXZWVrVmlld0hlYWRlcihkYXRlQWRhcHRlciwge1xuICAgICAgICB2aWV3RGF0ZSxcbiAgICAgICAgd2Vla1N0YXJ0c09uLFxuICAgICAgICBleGNsdWRlZCxcbiAgICAgICAgd2Vla2VuZERheXMsXG4gICAgICAgIHZpZXdTdGFydCxcbiAgICAgICAgdmlld0VuZCxcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGFsbERheUV2ZW50Um93czogZ2V0QWxsRGF5V2Vla0V2ZW50cyhkYXRlQWRhcHRlciwge1xuICAgICAgICAgICAgZXZlbnRzOiBldmVudHNJblBlcmlvZCxcbiAgICAgICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICAgICAgcHJlY2lzaW9uLFxuICAgICAgICAgICAgYWJzb2x1dGVQb3NpdGlvbmVkRXZlbnRzLFxuICAgICAgICAgICAgdmlld1N0YXJ0LFxuICAgICAgICAgICAgdmlld0VuZCxcbiAgICAgICAgfSksXG4gICAgICAgIHBlcmlvZDoge1xuICAgICAgICAgICAgZXZlbnRzOiBldmVudHNJblBlcmlvZCxcbiAgICAgICAgICAgIHN0YXJ0OiBoZWFkZXJbMF0uZGF0ZSxcbiAgICAgICAgICAgIGVuZDogZW5kT2ZEYXkoaGVhZGVyW2hlYWRlci5sZW5ndGggLSAxXS5kYXRlKSxcbiAgICAgICAgfSxcbiAgICAgICAgaG91ckNvbHVtbnM6IGdldFdlZWtWaWV3SG91ckdyaWQoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgICAgIGV2ZW50cyxcbiAgICAgICAgICAgIHZpZXdEYXRlLFxuICAgICAgICAgICAgaG91clNlZ21lbnRzLFxuICAgICAgICAgICAgaG91ckR1cmF0aW9uLFxuICAgICAgICAgICAgZGF5U3RhcnQsXG4gICAgICAgICAgICBkYXlFbmQsXG4gICAgICAgICAgICB3ZWVrU3RhcnRzT24sXG4gICAgICAgICAgICBleGNsdWRlZCxcbiAgICAgICAgICAgIHdlZWtlbmREYXlzLFxuICAgICAgICAgICAgc2VnbWVudEhlaWdodCxcbiAgICAgICAgICAgIHZpZXdTdGFydCxcbiAgICAgICAgICAgIHZpZXdFbmQsXG4gICAgICAgICAgICBtaW5pbXVtRXZlbnRIZWlnaHQsXG4gICAgICAgIH0pLFxuICAgIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNHZXRNb250aFZpZXdBcmdzIHtcbiAgICBldmVudHM/OiBNQ0V2ZW50W107XG4gICAgdmlld0RhdGU6IERhdGU7XG4gICAgd2Vla1N0YXJ0c09uOiBudW1iZXI7XG4gICAgZXhjbHVkZWQ/OiBudW1iZXJbXTtcbiAgICB2aWV3U3RhcnQ/OiBEYXRlO1xuICAgIHZpZXdFbmQ/OiBEYXRlO1xuICAgIHdlZWtlbmREYXlzPzogbnVtYmVyW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb250aFZpZXcoXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHtcbiAgICAgICAgZXZlbnRzID0gW10sXG4gICAgICAgIHZpZXdEYXRlLFxuICAgICAgICB3ZWVrU3RhcnRzT24sXG4gICAgICAgIGV4Y2x1ZGVkID0gW10sXG4gICAgICAgIHZpZXdTdGFydCA9IGRhdGVBZGFwdGVyLnN0YXJ0T2ZNb250aCh2aWV3RGF0ZSksXG4gICAgICAgIHZpZXdFbmQgPSBkYXRlQWRhcHRlci5lbmRPZk1vbnRoKHZpZXdEYXRlKSxcbiAgICAgICAgd2Vla2VuZERheXMsXG4gICAgfTogTUNHZXRNb250aFZpZXdBcmdzXG4pOiBNQ01vbnRoVmlldyB7XG4gICAgaWYgKCFldmVudHMpIHtcbiAgICAgICAgZXZlbnRzID0gW107XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgICBzdGFydE9mV2VlayxcbiAgICAgICAgZW5kT2ZXZWVrLFxuICAgICAgICBkaWZmZXJlbmNlSW5EYXlzLFxuICAgICAgICBzdGFydE9mRGF5LFxuICAgICAgICBhZGRIb3VycyxcbiAgICAgICAgZW5kT2ZEYXksXG4gICAgICAgIGlzU2FtZU1vbnRoLFxuICAgICAgICBnZXREYXksXG4gICAgICAgIGdldE1vbnRoLFxuICAgIH0gPSBkYXRlQWRhcHRlcjtcbiAgICBjb25zdCBzdGFydDogRGF0ZSA9IHN0YXJ0T2ZXZWVrKHZpZXdTdGFydCwgeyB3ZWVrU3RhcnRzT24gfSk7XG4gICAgY29uc3QgZW5kOiBEYXRlID0gZW5kT2ZXZWVrKHZpZXdFbmQsIHsgd2Vla1N0YXJ0c09uIH0pO1xuICAgIGNvbnN0IGV2ZW50c0luTW9udGg6IE1DRXZlbnRbXSA9IGdldEV2ZW50c0luUGVyaW9kKGRhdGVBZGFwdGVyLCB7XG4gICAgICAgIGV2ZW50cyxcbiAgICAgICAgcGVyaW9kU3RhcnQ6IHN0YXJ0LFxuICAgICAgICBwZXJpb2RFbmQ6IGVuZCxcbiAgICB9KTtcbiAgICBjb25zdCBpbml0aWFsVmlld0RheXM6IE1DTW9udGhWaWV3RGF5W10gPSBbXTtcbiAgICBsZXQgcHJldmlvdXNEYXRlOiBEYXRlO1xuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBkaWZmZXJlbmNlSW5EYXlzKGVuZCwgc3RhcnQpICsgMTsgaSsrKSB7XG4gICAgICAgIC8vIGhhY2t5IGZpeCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL21hdHRsZXdpczkyL2FuZ3VsYXItY2FsZW5kYXIvaXNzdWVzLzE3M1xuICAgICAgICBsZXQgZGF0ZTogRGF0ZTtcbiAgICAgICAgaWYgKHByZXZpb3VzRGF0ZSkge1xuICAgICAgICAgICAgZGF0ZSA9IHN0YXJ0T2ZEYXkoYWRkSG91cnMocHJldmlvdXNEYXRlLCBIT1VSU19JTl9EQVkpKTtcbiAgICAgICAgICAgIGlmIChwcmV2aW91c0RhdGUuZ2V0VGltZSgpID09PSBkYXRlLmdldFRpbWUoKSkge1xuICAgICAgICAgICAgICAgIC8vIERTVCBjaGFuZ2UsIHNvIG5lZWQgdG8gYWRkIDI1IGhvdXJzXG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgICAgICBkYXRlID0gc3RhcnRPZkRheShhZGRIb3VycyhwcmV2aW91c0RhdGUsIEhPVVJTX0lOX0RBWSArIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByZXZpb3VzRGF0ZSA9IGRhdGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRlID0gcHJldmlvdXNEYXRlID0gc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWV4Y2x1ZGVkLnNvbWUoKGUpID0+IGdldERheShkYXRlKSA9PT0gZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRheTogTUNNb250aFZpZXdEYXkgPSBnZXRXZWVrRGF5KGRhdGVBZGFwdGVyLCB7XG4gICAgICAgICAgICAgICAgZGF0ZSxcbiAgICAgICAgICAgICAgICB3ZWVrZW5kRGF5cyxcbiAgICAgICAgICAgIH0pIGFzIE1DTW9udGhWaWV3RGF5O1xuICAgICAgICAgICAgY29uc3QgZXZlbnRzSW5QZXJpb2Q6IE1DRXZlbnRbXSA9IGdldEV2ZW50c0luUGVyaW9kKGRhdGVBZGFwdGVyLCB7XG4gICAgICAgICAgICAgICAgZXZlbnRzOiBldmVudHNJbk1vbnRoLFxuICAgICAgICAgICAgICAgIHBlcmlvZFN0YXJ0OiBzdGFydE9mRGF5KGRhdGUpLFxuICAgICAgICAgICAgICAgIHBlcmlvZEVuZDogZW5kT2ZEYXkoZGF0ZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRheS5pbk1vbnRoID0gaXNTYW1lTW9udGgoZGF0ZSwgdmlld0RhdGUpO1xuICAgICAgICAgICAgZGF5LmV2ZW50cyA9IGV2ZW50c0luUGVyaW9kO1xuICAgICAgICAgICAgZGF5LmJhZGdlVG90YWwgPSBldmVudHNJblBlcmlvZC5sZW5ndGg7XG4gICAgICAgICAgICBpbml0aWFsVmlld0RheXMucHVzaChkYXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGRheXM6IE1DTW9udGhWaWV3RGF5W10gPSBbXTtcbiAgICBjb25zdCB0b3RhbERheXNWaXNpYmxlSW5XZWVrOiBudW1iZXIgPSBEQVlTX0lOX1dFRUsgLSBleGNsdWRlZC5sZW5ndGg7XG4gICAgaWYgKHRvdGFsRGF5c1Zpc2libGVJbldlZWsgPCBEQVlTX0lOX1dFRUspIHtcbiAgICAgICAgZm9yIChcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgaSA8IGluaXRpYWxWaWV3RGF5cy5sZW5ndGg7XG4gICAgICAgICAgICBpICs9IHRvdGFsRGF5c1Zpc2libGVJbldlZWtcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCByb3c6IE1DTW9udGhWaWV3RGF5W10gPSBpbml0aWFsVmlld0RheXMuc2xpY2UoXG4gICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICBpICsgdG90YWxEYXlzVmlzaWJsZUluV2Vla1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGlzUm93SW5Nb250aDogYm9vbGVhbiA9IHJvdy5zb21lKFxuICAgICAgICAgICAgICAgIChkYXkpID0+IHZpZXdTdGFydCA8PSBkYXkuZGF0ZSAmJiBkYXkuZGF0ZSA8IHZpZXdFbmRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoaXNSb3dJbk1vbnRoKSB7XG4gICAgICAgICAgICAgICAgZGF5cyA9IFsuLi5kYXlzLCAuLi5yb3ddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGF5cyA9IGluaXRpYWxWaWV3RGF5cztcbiAgICB9XG5cbiAgICBjb25zdCByb3dzOiBudW1iZXIgPSBNYXRoLmZsb29yKGRheXMubGVuZ3RoIC8gdG90YWxEYXlzVmlzaWJsZUluV2Vlayk7XG4gICAgY29uc3Qgcm93T2Zmc2V0czogbnVtYmVyW10gPSBbXTtcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcm93czsgaSsrKSB7XG4gICAgICAgIHJvd09mZnNldHMucHVzaChpICogdG90YWxEYXlzVmlzaWJsZUluV2Vlayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcm93T2Zmc2V0cyxcbiAgICAgICAgdG90YWxEYXlzVmlzaWJsZUluV2VlayxcbiAgICAgICAgZGF5cyxcbiAgICAgICAgcGVyaW9kOiB7XG4gICAgICAgICAgICBzdGFydDogZGF5c1swXS5kYXRlLFxuICAgICAgICAgICAgZW5kOiBlbmRPZkRheShkYXlzW2RheXMubGVuZ3RoIC0gMV0uZGF0ZSksXG4gICAgICAgICAgICBldmVudHM6IGV2ZW50c0luTW9udGgsXG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ0dldERheVZpZXdBcmdzIHtcbiAgICBldmVudHM/OiBNQ0V2ZW50W107XG4gICAgdmlld0RhdGU6IERhdGU7XG4gICAgaG91clNlZ21lbnRzOiBudW1iZXI7XG4gICAgZGF5U3RhcnQ6IHtcbiAgICAgICAgaG91cjogbnVtYmVyO1xuICAgICAgICBtaW51dGU6IG51bWJlcjtcbiAgICB9O1xuICAgIGRheUVuZDoge1xuICAgICAgICBob3VyOiBudW1iZXI7XG4gICAgICAgIG1pbnV0ZTogbnVtYmVyO1xuICAgIH07XG4gICAgZXZlbnRXaWR0aDogbnVtYmVyO1xuICAgIHNlZ21lbnRIZWlnaHQ6IG51bWJlcjtcbiAgICBob3VyRHVyYXRpb246IG51bWJlcjtcbiAgICBtaW5pbXVtRXZlbnRIZWlnaHQ6IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gZ2V0T3ZlckxhcHBpbmdXZWVrVmlld0V2ZW50cyhcbiAgICBldmVudHM6IE1DV2Vla1ZpZXdUaW1lRXZlbnRbXSxcbiAgICB0b3A6IG51bWJlcixcbiAgICBib3R0b206IG51bWJlclxuKTogTUNXZWVrVmlld1RpbWVFdmVudFtdIHtcbiAgICByZXR1cm4gZXZlbnRzLmZpbHRlcigocHJldmlvdXNFdmVudDogTUNXZWVrVmlld1RpbWVFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBwcmV2aW91c0V2ZW50VG9wOiBudW1iZXIgPSBwcmV2aW91c0V2ZW50LnRvcDtcbiAgICAgICAgY29uc3QgcHJldmlvdXNFdmVudEJvdHRvbTogbnVtYmVyID1cbiAgICAgICAgICAgIHByZXZpb3VzRXZlbnQudG9wICsgcHJldmlvdXNFdmVudC5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKHRvcCA8IHByZXZpb3VzRXZlbnRCb3R0b20gJiYgcHJldmlvdXNFdmVudEJvdHRvbSA8IGJvdHRvbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAodG9wIDwgcHJldmlvdXNFdmVudFRvcCAmJiBwcmV2aW91c0V2ZW50VG9wIDwgYm90dG9tKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChwcmV2aW91c0V2ZW50VG9wIDw9IHRvcCAmJiBib3R0b20gPD0gcHJldmlvdXNFdmVudEJvdHRvbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldERheVZpZXcoXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHtcbiAgICAgICAgZXZlbnRzLFxuICAgICAgICB2aWV3RGF0ZSxcbiAgICAgICAgaG91clNlZ21lbnRzLFxuICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgZGF5RW5kLFxuICAgICAgICBldmVudFdpZHRoLFxuICAgICAgICBzZWdtZW50SGVpZ2h0LFxuICAgICAgICBob3VyRHVyYXRpb24sXG4gICAgICAgIG1pbmltdW1FdmVudEhlaWdodCxcbiAgICB9OiBNQ0dldERheVZpZXdBcmdzXG4pOiBNQ0RheVZpZXcge1xuICAgIGNvbnN0IHtcbiAgICAgICAgc2V0TWludXRlcyxcbiAgICAgICAgc2V0SG91cnMsXG4gICAgICAgIHN0YXJ0T2ZEYXksXG4gICAgICAgIHN0YXJ0T2ZNaW51dGUsXG4gICAgICAgIGVuZE9mRGF5LFxuICAgICAgICBkaWZmZXJlbmNlSW5NaW51dGVzLFxuICAgIH0gPSBkYXRlQWRhcHRlcjtcblxuICAgIGNvbnN0IHN0YXJ0T2ZWaWV3OiBEYXRlID0gc2V0TWludXRlcyhcbiAgICAgICAgc2V0SG91cnMoc3RhcnRPZkRheSh2aWV3RGF0ZSksIHNhbml0aXNlSG91cnMoZGF5U3RhcnQuaG91cikpLFxuICAgICAgICBzYW5pdGlzZU1pbnV0ZXMoZGF5U3RhcnQubWludXRlKVxuICAgICk7XG4gICAgY29uc3QgZW5kT2ZWaWV3OiBEYXRlID0gc2V0TWludXRlcyhcbiAgICAgICAgc2V0SG91cnMoc3RhcnRPZk1pbnV0ZShlbmRPZkRheSh2aWV3RGF0ZSkpLCBzYW5pdGlzZUhvdXJzKGRheUVuZC5ob3VyKSksXG4gICAgICAgIHNhbml0aXNlTWludXRlcyhkYXlFbmQubWludXRlKVxuICAgICk7XG4gICAgZW5kT2ZWaWV3LnNldFNlY29uZHMoNTksIDk5OSk7XG4gICAgY29uc3QgcHJldmlvdXNEYXlFdmVudHM6IE1DV2Vla1ZpZXdUaW1lRXZlbnRbXSA9IFtdO1xuICAgIGNvbnN0IGV2ZW50c0luUGVyaW9kID0gZ2V0RXZlbnRzSW5QZXJpb2QoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgZXZlbnRzOiBldmVudHMuZmlsdGVyKChldmVudDogTUNFdmVudCkgPT4gIWV2ZW50LmFsbERheSksXG4gICAgICAgIHBlcmlvZFN0YXJ0OiBzdGFydE9mVmlldyxcbiAgICAgICAgcGVyaW9kRW5kOiBlbmRPZlZpZXcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBkYXlWaWV3RXZlbnRzOiBNQ1dlZWtWaWV3VGltZUV2ZW50W10gPSBldmVudHNJblBlcmlvZFxuICAgICAgICAuc29ydCgoZXZlbnRBOiBNQ0V2ZW50LCBldmVudEI6IE1DRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBldmVudEEuc3RhcnQudmFsdWVPZigpIC0gZXZlbnRCLnN0YXJ0LnZhbHVlT2YoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm1hcCgoZXZlbnQ6IE1DRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50U3RhcnQ6IERhdGUgPSBldmVudC5zdGFydDtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50RW5kOiBEYXRlID0gZXZlbnQuZW5kIHx8IGV2ZW50U3RhcnQ7XG4gICAgICAgICAgICBjb25zdCBzdGFydHNCZWZvcmVEYXk6IGJvb2xlYW4gPSBldmVudFN0YXJ0IDwgc3RhcnRPZlZpZXc7XG4gICAgICAgICAgICBjb25zdCBlbmRzQWZ0ZXJEYXk6IGJvb2xlYW4gPSBldmVudEVuZCA+IGVuZE9mVmlldztcbiAgICAgICAgICAgIGNvbnN0IGhvdXJIZWlnaHRNb2RpZmllcjogbnVtYmVyID1cbiAgICAgICAgICAgICAgICAoaG91clNlZ21lbnRzICogc2VnbWVudEhlaWdodCkgLyAoaG91ckR1cmF0aW9uIHx8IE1JTlVURVNfSU5fSE9VUik7XG5cbiAgICAgICAgICAgIGxldCB0b3A6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBpZiAoZXZlbnRTdGFydCA+IHN0YXJ0T2ZWaWV3KSB7XG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSBkaWZmZXJlbmNlIGluIG1pbnV0ZXMgaWYgdGhlIHVzZXIncyBvZmZzZXQgaXMgZGlmZmVyZW50IGJldHdlZW4gdGhlIHN0YXJ0IG9mIHRoZSBkYXkgYW5kIHRoZSBldmVudCAoZS5nLiB3aGVuIGdvaW5nIHRvIG9yIGZyb20gRFNUKVxuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50T2Zmc2V0ID0gZXZlbnRTdGFydC5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0T2Zmc2V0ID0gc3RhcnRPZlZpZXcuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmID0gc3RhcnRPZmZzZXQgLSBldmVudE9mZnNldDtcbiAgICAgICAgICAgICAgICB0b3AgKz0gZGlmZmVyZW5jZUluTWludXRlcyhldmVudFN0YXJ0LCBzdGFydE9mVmlldykgKyBkaWZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9wICo9IGhvdXJIZWlnaHRNb2RpZmllcjtcblxuICAgICAgICAgICAgY29uc3Qgc3RhcnREYXRlOiBEYXRlID0gc3RhcnRzQmVmb3JlRGF5ID8gc3RhcnRPZlZpZXcgOiBldmVudFN0YXJ0O1xuICAgICAgICAgICAgY29uc3QgZW5kRGF0ZTogRGF0ZSA9IGVuZHNBZnRlckRheSA/IGVuZE9mVmlldyA6IGV2ZW50RW5kO1xuICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gZGlmZmVyZW5jZUluTWludXRlcyhlbmREYXRlLCBzdGFydERhdGUpO1xuICAgICAgICAgICAgaWYgKCFldmVudC5lbmQpIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBzZWdtZW50SGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQgKj0gaG91ckhlaWdodE1vZGlmaWVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWluaW11bUV2ZW50SGVpZ2h0ICYmIGhlaWdodCA8IG1pbmltdW1FdmVudEhlaWdodCkge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IG1pbmltdW1FdmVudEhlaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYm90dG9tOiBudW1iZXIgPSB0b3AgKyBoZWlnaHQ7XG5cbiAgICAgICAgICAgIGNvbnN0IG92ZXJsYXBwaW5nUHJldmlvdXNFdmVudHMgPSBnZXRPdmVyTGFwcGluZ1dlZWtWaWV3RXZlbnRzKFxuICAgICAgICAgICAgICAgIHByZXZpb3VzRGF5RXZlbnRzLFxuICAgICAgICAgICAgICAgIHRvcCxcbiAgICAgICAgICAgICAgICBib3R0b21cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGxldCBsZWZ0OiBudW1iZXIgPSAwO1xuXG4gICAgICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICAgICAgb3ZlcmxhcHBpbmdQcmV2aW91c0V2ZW50cy5zb21lKFxuICAgICAgICAgICAgICAgICAgICAocHJldmlvdXNFdmVudCkgPT4gcHJldmlvdXNFdmVudC5sZWZ0ID09PSBsZWZ0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbGVmdCArPSBldmVudFdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkYXlFdmVudDogTUNXZWVrVmlld1RpbWVFdmVudCA9IHtcbiAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IGV2ZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgdG9wLFxuICAgICAgICAgICAgICAgIGxlZnQsXG4gICAgICAgICAgICAgICAgc3RhcnRzQmVmb3JlRGF5LFxuICAgICAgICAgICAgICAgIGVuZHNBZnRlckRheSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHByZXZpb3VzRGF5RXZlbnRzLnB1c2goZGF5RXZlbnQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGF5RXZlbnQ7XG4gICAgICAgIH0pO1xuXG4gICAgY29uc3Qgd2lkdGg6IG51bWJlciA9IE1hdGgubWF4KFxuICAgICAgICAuLi5kYXlWaWV3RXZlbnRzLm1hcCgoZXZlbnQ6IE1DV2Vla1ZpZXdUaW1lRXZlbnQpID0+IGV2ZW50LmxlZnQgKyBldmVudC53aWR0aClcbiAgICApO1xuICAgIGNvbnN0IGFsbERheUV2ZW50czogTUNFdmVudFtdID0gZ2V0RXZlbnRzSW5QZXJpb2QoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgZXZlbnRzOiBldmVudHMuZmlsdGVyKChldmVudDogTUNFdmVudCkgPT4gZXZlbnQuYWxsRGF5KSxcbiAgICAgICAgcGVyaW9kU3RhcnQ6IHN0YXJ0T2ZEYXkoc3RhcnRPZlZpZXcpLFxuICAgICAgICBwZXJpb2RFbmQ6IGVuZE9mRGF5KGVuZE9mVmlldyksXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBldmVudHM6IGRheVZpZXdFdmVudHMsXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBhbGxEYXlFdmVudHMsXG4gICAgICAgIHBlcmlvZDoge1xuICAgICAgICAgICAgZXZlbnRzOiBldmVudHNJblBlcmlvZCxcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydE9mVmlldyxcbiAgICAgICAgICAgIGVuZDogZW5kT2ZWaWV3LFxuICAgICAgICB9LFxuICAgIH07XG59XG5cbmludGVyZmFjZSBUaW1lIHtcbiAgICBob3VyOiBudW1iZXI7XG4gICAgbWludXRlOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBNQ0dldERheVZpZXdIb3VyR3JpZEFyZ3Mge1xuICAgIHZpZXdEYXRlOiBEYXRlO1xuICAgIGhvdXJTZWdtZW50czogbnVtYmVyO1xuICAgIGhvdXJEdXJhdGlvbjogbnVtYmVyO1xuICAgIGRheVN0YXJ0OiBUaW1lO1xuICAgIGRheUVuZDogVGltZTtcbn1cblxuZnVuY3Rpb24gc2FuaXRpc2VIb3Vycyhob3VyczogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4oMjMsIGhvdXJzKSwgMCk7XG59XG5cbmZ1bmN0aW9uIHNhbml0aXNlTWludXRlcyhtaW51dGVzOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbig1OSwgbWludXRlcyksIDApO1xufVxuXG5mdW5jdGlvbiBnZXREYXlWaWV3SG91ckdyaWQoXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHtcbiAgICAgICAgdmlld0RhdGUsXG4gICAgICAgIGhvdXJTZWdtZW50cyxcbiAgICAgICAgaG91ckR1cmF0aW9uLFxuICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgZGF5RW5kLFxuICAgIH06IE1DR2V0RGF5Vmlld0hvdXJHcmlkQXJnc1xuKTogTUNXZWVrVmlld0hvdXJbXSB7XG4gICAgY29uc3Qge1xuICAgICAgICBzZXRNaW51dGVzLFxuICAgICAgICBzZXRIb3VycyxcbiAgICAgICAgc3RhcnRPZkRheSxcbiAgICAgICAgc3RhcnRPZk1pbnV0ZSxcbiAgICAgICAgZW5kT2ZEYXksXG4gICAgICAgIGFkZE1pbnV0ZXMsXG4gICAgICAgIGFkZEhvdXJzLFxuICAgICAgICBhZGREYXlzLFxuICAgIH0gPSBkYXRlQWRhcHRlcjtcbiAgICBjb25zdCBob3VyczogTUNXZWVrVmlld0hvdXJbXSA9IFtdO1xuXG4gICAgbGV0IHN0YXJ0T2ZWaWV3OiBEYXRlID0gc2V0TWludXRlcyhcbiAgICAgICAgc2V0SG91cnMoc3RhcnRPZkRheSh2aWV3RGF0ZSksIHNhbml0aXNlSG91cnMoZGF5U3RhcnQuaG91cikpLFxuICAgICAgICBzYW5pdGlzZU1pbnV0ZXMoZGF5U3RhcnQubWludXRlKVxuICAgICk7XG4gICAgbGV0IGVuZE9mVmlldzogRGF0ZSA9IHNldE1pbnV0ZXMoXG4gICAgICAgIHNldEhvdXJzKHN0YXJ0T2ZNaW51dGUoZW5kT2ZEYXkodmlld0RhdGUpKSwgc2FuaXRpc2VIb3VycyhkYXlFbmQuaG91cikpLFxuICAgICAgICBzYW5pdGlzZU1pbnV0ZXMoZGF5RW5kLm1pbnV0ZSlcbiAgICApO1xuICAgIGNvbnN0IHNlZ21lbnREdXJhdGlvbjogbnVtYmVyID1cbiAgICAgICAgKGhvdXJEdXJhdGlvbiB8fCBNSU5VVEVTX0lOX0hPVVIpIC8gaG91clNlZ21lbnRzO1xuICAgIGxldCBzdGFydE9mVmlld0RheTogRGF0ZSA9IHN0YXJ0T2ZEYXkodmlld0RhdGUpO1xuICAgIGNvbnN0IGVuZE9mVmlld0RheTogRGF0ZSA9IGVuZE9mRGF5KHZpZXdEYXRlKTtcbiAgICBsZXQgZGF0ZUFkanVzdG1lbnQ6IChkOiBEYXRlKSA9PiBEYXRlID0gKGQ6IERhdGUpID0+IGQ7XG5cbiAgICAvLyB0aGlzIG1lYW5zIHRoYXQgd2UgY2hhbmdlIGZyb20gb3IgdG8gRFNUIG9uIHRoaXMgZGF5IGFuZCB0aGF0J3MgZ29pbmcgdG8gY2F1c2UgcHJvYmxlbXMgc28gd2UgYnVtcCB0aGUgZGF0ZVxuICAgIGlmIChzdGFydE9mVmlld0RheS5nZXRUaW1lem9uZU9mZnNldCgpICE9PSBlbmRPZlZpZXdEYXkuZ2V0VGltZXpvbmVPZmZzZXQoKSkge1xuICAgICAgICBzdGFydE9mVmlld0RheSA9IGFkZERheXMoc3RhcnRPZlZpZXdEYXksIDEpO1xuICAgICAgICBzdGFydE9mVmlldyA9IGFkZERheXMoc3RhcnRPZlZpZXcsIDEpO1xuICAgICAgICBlbmRPZlZpZXcgPSBhZGREYXlzKGVuZE9mVmlldywgMSk7XG4gICAgICAgIGRhdGVBZGp1c3RtZW50ID0gKGQ6IERhdGUpID0+IGFkZERheXMoZCwgLTEpO1xuICAgIH1cblxuICAgIGNvbnN0IGRheUR1cmF0aW9uOiBudW1iZXIgPSBob3VyRHVyYXRpb25cbiAgICAgICAgPyAoSE9VUlNfSU5fREFZICogNjApIC8gaG91ckR1cmF0aW9uXG4gICAgICAgIDogTUlOVVRFU19JTl9IT1VSO1xuXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGRheUR1cmF0aW9uOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2VnbWVudHM6IE1DV2Vla1ZpZXdIb3VyU2VnbWVudFtdID0gW107XG4gICAgICAgIGZvciAobGV0IGo6IG51bWJlciA9IDA7IGogPCBob3VyU2VnbWVudHM7IGorKykge1xuICAgICAgICAgICAgY29uc3QgZGF0ZTogRGF0ZSA9IGFkZE1pbnV0ZXMoXG4gICAgICAgICAgICAgICAgYWRkTWludXRlcyhzdGFydE9mVmlldywgaSAqIChob3VyRHVyYXRpb24gfHwgTUlOVVRFU19JTl9IT1VSKSksXG4gICAgICAgICAgICAgICAgaiAqIHNlZ21lbnREdXJhdGlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChkYXRlID49IHN0YXJ0T2ZWaWV3ICYmIGRhdGUgPCBlbmRPZlZpZXcpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogZGF0ZUFkanVzdG1lbnQoZGF0ZSksXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlEYXRlOiBkYXRlLFxuICAgICAgICAgICAgICAgICAgICBpc1N0YXJ0OiBqID09PSAwLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBob3Vycy5wdXNoKHsgc2VnbWVudHMgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaG91cnM7XG59XG5cbmV4cG9ydCBlbnVtIEV2ZW50VmFsaWRhdGlvbkVycm9yTWVzc2FnZSB7XG4gICAgTm90QXJyYXkgPSAnRXZlbnRzIG11c3QgYmUgYW4gYXJyYXknLFxuICAgIFN0YXJ0UHJvcGVydHlNaXNzaW5nID0gJ0V2ZW50IGlzIG1pc3NpbmcgdGhlIGBzdGFydGAgcHJvcGVydHknLFxuICAgIFN0YXJ0UHJvcGVydHlOb3REYXRlID0gJ0V2ZW50IGBzdGFydGAgcHJvcGVydHkgc2hvdWxkIGJlIGEgamF2YXNjcmlwdCBkYXRlIG9iamVjdC4gRG8gYG5ldyBEYXRlKGV2ZW50LnN0YXJ0KWAgdG8gZml4IGl0LicsXG4gICAgRW5kUHJvcGVydHlOb3REYXRlID0gJ0V2ZW50IGBlbmRgIHByb3BlcnR5IHNob3VsZCBiZSBhIGphdmFzY3JpcHQgZGF0ZSBvYmplY3QuIERvIGBuZXcgRGF0ZShldmVudC5lbmQpYCB0byBmaXggaXQuJyxcbiAgICBFbmRzQmVmb3JlU3RhcnQgPSAnRXZlbnQgYHN0YXJ0YCBwcm9wZXJ0eSBvY2N1cnMgYWZ0ZXIgdGhlIGBlbmRgJyxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRXZlbnRzKFxuICAgIGV2ZW50czogTUNFdmVudFtdLFxuICAgIGxvZzogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkXG4pOiBib29sZWFuIHtcbiAgICBsZXQgaXNWYWxpZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBmdW5jdGlvbiBpc0Vycm9yKG1zZzogc3RyaW5nLCBldmVudDogTUNFdmVudCk6IHZvaWQge1xuICAgICAgICBsb2cobXNnLCBldmVudCk7XG4gICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXZlbnRzKSkge1xuICAgICAgICBsb2coRXZlbnRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlLk5vdEFycmF5LCBldmVudHMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmICghZXZlbnQuc3RhcnQpIHtcbiAgICAgICAgICAgIGlzRXJyb3IoRXZlbnRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlLlN0YXJ0UHJvcGVydHlNaXNzaW5nLCBldmVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIShldmVudC5zdGFydCBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICBpc0Vycm9yKEV2ZW50VmFsaWRhdGlvbkVycm9yTWVzc2FnZS5TdGFydFByb3BlcnR5Tm90RGF0ZSwgZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LmVuZCkge1xuICAgICAgICAgICAgaWYgKCEoZXZlbnQuZW5kIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBpc0Vycm9yKEV2ZW50VmFsaWRhdGlvbkVycm9yTWVzc2FnZS5FbmRQcm9wZXJ0eU5vdERhdGUsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldmVudC5zdGFydCA+IGV2ZW50LmVuZCkge1xuICAgICAgICAgICAgICAgIGlzRXJyb3IoRXZlbnRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlLkVuZHNCZWZvcmVTdGFydCwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaXNWYWxpZDtcbn0iXX0=