import { __assign, __read, __spread } from "tslib";
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
var DEFAULT_WEEKEND_DAYS = [
    DAYS_OF_WEEK.SUNDAY,
    DAYS_OF_WEEK.SATURDAY,
];
var DAYS_IN_WEEK = 7;
var HOURS_IN_DAY = 24;
var MINUTES_IN_HOUR = 60;
export var SECONDS_IN_DAY = 60 * 60 * 24;
function getExcludedSeconds(dateAdapter, _a) {
    var startDate = _a.startDate, seconds = _a.seconds, excluded = _a.excluded, precision = _a.precision;
    if (excluded.length < 1) {
        return 0;
    }
    var addSeconds = dateAdapter.addSeconds, getDay = dateAdapter.getDay, addDays = dateAdapter.addDays;
    var endDate = addSeconds(startDate, seconds - 1);
    var dayStart = getDay(startDate);
    var dayEnd = getDay(endDate);
    var result = 0; // Calculated in seconds
    var current = startDate;
    var _loop_1 = function () {
        var day = getDay(current);
        if (excluded.some(function (excludedDay) { return excludedDay === day; })) {
            result += calculateExcludedSeconds(dateAdapter, {
                dayStart: dayStart,
                dayEnd: dayEnd,
                day: day,
                precision: precision,
                startDate: startDate,
                endDate: endDate,
            });
        }
        current = addDays(current, 1);
    };
    while (current < endDate) {
        _loop_1();
    }
    return result;
}
function calculateExcludedSeconds(dateAdapter, _a) {
    var precision = _a.precision, day = _a.day, dayStart = _a.dayStart, dayEnd = _a.dayEnd, startDate = _a.startDate, endDate = _a.endDate;
    var differenceInSeconds = dateAdapter.differenceInSeconds, endOfDay = dateAdapter.endOfDay, startOfDay = dateAdapter.startOfDay;
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
function getWeekViewEventSpan(dateAdapter, _a) {
    var event = _a.event, offset = _a.offset, startOfWeekDate = _a.startOfWeekDate, excluded = _a.excluded, precision = _a.precision, totalDaysInView = _a.totalDaysInView;
    var max = dateAdapter.max, differenceInSeconds = dateAdapter.differenceInSeconds, addDays = dateAdapter.addDays, endOfDay = dateAdapter.endOfDay, differenceInDays = dateAdapter.differenceInDays;
    var span = SECONDS_IN_DAY;
    var begin = max([event.start, startOfWeekDate]);
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
    var offsetSeconds = offset * SECONDS_IN_DAY;
    var totalLength = offsetSeconds + span;
    // the best way to detect if an event is outside the week-view
    // is to check if the total span beginning (from startOfWeekDay or event start) exceeds the total days in the view
    var secondsInView = totalDaysInView * SECONDS_IN_DAY;
    if (totalLength > secondsInView) {
        span = secondsInView - offsetSeconds;
    }
    span -= getExcludedSeconds(dateAdapter, {
        startDate: begin,
        seconds: span,
        excluded: excluded,
        precision: precision,
    });
    return span / SECONDS_IN_DAY;
}
function getWeekViewEventOffset(dateAdapter, _a) {
    var event = _a.event, startOfWeekDate = _a.startOfWeek, excluded = _a.excluded, precision = _a.precision;
    var differenceInDays = dateAdapter.differenceInDays, startOfDay = dateAdapter.startOfDay, differenceInSeconds = dateAdapter.differenceInSeconds;
    if (event.start < startOfWeekDate) {
        return 0;
    }
    var offset = 0;
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
        excluded: excluded,
        precision: precision,
    });
    return Math.abs(offset / SECONDS_IN_DAY);
}
function isEventIsPeriod(dateAdapter, _a) {
    var event = _a.event, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
    var isSameSecond = dateAdapter.isSameSecond;
    var eventStart = event.start;
    var eventEnd = event.end || event.start;
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
export function getEventsInPeriod(dateAdapter, _a) {
    var events = _a.events, periodStart = _a.periodStart, periodEnd = _a.periodEnd;
    return events.filter(function (event) {
        return isEventIsPeriod(dateAdapter, { event: event, periodStart: periodStart, periodEnd: periodEnd });
    });
}
function getWeekDay(dateAdapter, _a) {
    var date = _a.date, _b = _a.weekendDays, weekendDays = _b === void 0 ? DEFAULT_WEEKEND_DAYS : _b;
    var startOfDay = dateAdapter.startOfDay, isSameDay = dateAdapter.isSameDay, getDay = dateAdapter.getDay;
    var today = startOfDay(new Date());
    var day = getDay(date);
    return {
        date: date,
        day: day,
        isPast: date < today,
        isToday: isSameDay(date, today),
        isFuture: date > today,
        isWeekend: weekendDays.indexOf(day) > -1,
    };
}
export function getWeekViewHeader(dateAdapter, _a) {
    var viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn, _b = _a.excluded, excluded = _b === void 0 ? [] : _b, weekendDays = _a.weekendDays, _c = _a.viewStart, viewStart = _c === void 0 ? dateAdapter.startOfWeek(viewDate, { weekStartsOn: weekStartsOn }) : _c, _d = _a.viewEnd, viewEnd = _d === void 0 ? dateAdapter.addDays(viewStart, DAYS_IN_WEEK) : _d;
    var addDays = dateAdapter.addDays, getDay = dateAdapter.getDay;
    var days = [];
    var date = viewStart;
    while (date < viewEnd) {
        if (!excluded.some(function (e) { return getDay(date) === e; })) {
            days.push(getWeekDay(dateAdapter, { date: date, weekendDays: weekendDays }));
        }
        date = addDays(date, 1);
    }
    return days;
}
export function getDifferenceInDaysWithExclusions(dateAdapter, _a) {
    var date1 = _a.date1, date2 = _a.date2, excluded = _a.excluded;
    var date = date1;
    var diff = 0;
    while (date < date2) {
        if (excluded.indexOf(dateAdapter.getDay(date)) === -1) {
            diff++;
        }
        date = dateAdapter.addDays(date, 1);
    }
    return diff;
}
export function getAllDayWeekEvents(dateAdapter, _a) {
    var _b = _a.events, events = _b === void 0 ? [] : _b, _c = _a.excluded, excluded = _c === void 0 ? [] : _c, _d = _a.precision, precision = _d === void 0 ? 'days' : _d, _e = _a.absolutePositionedEvents, absolutePositionedEvents = _e === void 0 ? false : _e, viewStart = _a.viewStart, viewEnd = _a.viewEnd;
    viewStart = dateAdapter.startOfDay(viewStart);
    viewEnd = dateAdapter.endOfDay(viewEnd);
    var differenceInSeconds = dateAdapter.differenceInSeconds, differenceInDays = dateAdapter.differenceInDays;
    var maxRange = getDifferenceInDaysWithExclusions(dateAdapter, {
        date1: viewStart,
        date2: viewEnd,
        excluded: excluded,
    });
    var totalDaysInView = differenceInDays(viewEnd, viewStart) + 1;
    var eventsMapped = events
        .filter(function (event) { return event.allDay; })
        .map(function (event) {
        var offset = getWeekViewEventOffset(dateAdapter, {
            event: event,
            startOfWeek: viewStart,
            excluded: excluded,
            precision: precision,
        });
        var span = getWeekViewEventSpan(dateAdapter, {
            event: event,
            offset: offset,
            startOfWeekDate: viewStart,
            excluded: excluded,
            precision: precision,
            totalDaysInView: totalDaysInView,
        });
        return { event: event, offset: offset, span: span };
    })
        .filter(function (e) { return e.offset < maxRange; })
        .filter(function (e) { return e.span > 0; })
        .map(function (entry) { return ({
        event: entry.event,
        offset: entry.offset,
        span: entry.span,
        startsBeforeWeek: entry.event.start < viewStart,
        endsAfterWeek: (entry.event.end || entry.event.start) > viewEnd,
    }); })
        .sort(function (itemA, itemB) {
        var startSecondsDiff = differenceInSeconds(itemA.event.start, itemB.event.start);
        if (startSecondsDiff === 0) {
            return differenceInSeconds(itemB.event.end || itemB.event.start, itemA.event.end || itemA.event.start);
        }
        return startSecondsDiff;
    });
    var allDayEventRows = [];
    var allocatedEvents = [];
    eventsMapped.forEach(function (event, index) {
        if (allocatedEvents.indexOf(event) === -1) {
            allocatedEvents.push(event);
            var rowSpan_1 = event.span + event.offset;
            var otherRowEvents = eventsMapped
                .slice(index + 1)
                .filter(function (nextEvent) {
                if (nextEvent.offset >= rowSpan_1 &&
                    rowSpan_1 + nextEvent.span <= totalDaysInView &&
                    allocatedEvents.indexOf(nextEvent) === -1) {
                    var nextEventOffset = nextEvent.offset - rowSpan_1;
                    if (!absolutePositionedEvents) {
                        nextEvent.offset = nextEventOffset;
                    }
                    rowSpan_1 += nextEvent.span + nextEventOffset;
                    allocatedEvents.push(nextEvent);
                    return true;
                }
            });
            var weekEvents = __spread([event], otherRowEvents);
            var id = weekEvents
                .filter(function (weekEvent) { return weekEvent.event.id; })
                .map(function (weekEvent) { return weekEvent.event.id; })
                .join('-');
            allDayEventRows.push(__assign({ row: weekEvents }, (id ? { id: id } : {})));
        }
    });
    return allDayEventRows;
}
function getWeekViewHourGrid(dateAdapter, _a) {
    var events = _a.events, viewDate = _a.viewDate, hourSegments = _a.hourSegments, hourDuration = _a.hourDuration, dayStart = _a.dayStart, dayEnd = _a.dayEnd, weekStartsOn = _a.weekStartsOn, excluded = _a.excluded, weekendDays = _a.weekendDays, segmentHeight = _a.segmentHeight, viewStart = _a.viewStart, viewEnd = _a.viewEnd, minimumEventHeight = _a.minimumEventHeight;
    var dayViewHourGrid = getDayViewHourGrid(dateAdapter, {
        viewDate: viewDate,
        hourSegments: hourSegments,
        hourDuration: hourDuration,
        dayStart: dayStart,
        dayEnd: dayEnd,
    });
    var weekDays = getWeekViewHeader(dateAdapter, {
        viewDate: viewDate,
        weekStartsOn: weekStartsOn,
        excluded: excluded,
        weekendDays: weekendDays,
        viewStart: viewStart,
        viewEnd: viewEnd,
    });
    var setHours = dateAdapter.setHours, setMinutes = dateAdapter.setMinutes, getHours = dateAdapter.getHours, getMinutes = dateAdapter.getMinutes;
    return weekDays.map(function (day) {
        var dayView = getDayView(dateAdapter, {
            events: events,
            viewDate: day.date,
            hourSegments: hourSegments,
            dayStart: dayStart,
            dayEnd: dayEnd,
            segmentHeight: segmentHeight,
            eventWidth: 1,
            hourDuration: hourDuration,
            minimumEventHeight: minimumEventHeight,
        });
        var hours = dayViewHourGrid.map(function (hour) {
            var segments = hour.segments.map(function (segment) {
                var date = setMinutes(setHours(day.date, getHours(segment.date)), getMinutes(segment.date));
                return __assign(__assign({}, segment), { date: date });
            });
            return __assign(__assign({}, hour), { segments: segments });
        });
        function getColumnCount(allEvents, prevOverlappingEvents) {
            var columnCount = Math.max.apply(Math, __spread(prevOverlappingEvents.map(function (iEvent) { return iEvent.left + 1; })));
            var nextOverlappingEvents = allEvents
                .filter(function (iEvent) { return iEvent.left >= columnCount; })
                .filter(function (iEvent) {
                return (getOverLappingWeekViewEvents(prevOverlappingEvents, iEvent.top, iEvent.top + iEvent.height).length > 0);
            });
            if (nextOverlappingEvents.length > 0) {
                return getColumnCount(allEvents, nextOverlappingEvents);
            }
            else {
                return columnCount;
            }
        }
        var mappedEvents = dayView.events.map(function (event) {
            var columnCount = getColumnCount(dayView.events, getOverLappingWeekViewEvents(dayView.events, event.top, event.top + event.height));
            var width = 100 / columnCount;
            return __assign(__assign({}, event), { left: event.left * width, width: width });
        });
        return {
            hours: hours,
            date: day.date,
            events: mappedEvents.map(function (event) {
                var overLappingEvents = getOverLappingWeekViewEvents(mappedEvents.filter(function (otherEvent) { return otherEvent.left > event.left; }), event.top, event.top + event.height);
                if (overLappingEvents.length > 0) {
                    return __assign(__assign({}, event), { width: Math.min.apply(Math, __spread(overLappingEvents.map(function (otherEvent) { return otherEvent.left; }))) - event.left });
                }
                return event;
            }),
        };
    });
}
export function getWeekView(dateAdapter, _a) {
    var _b = _a.events, events = _b === void 0 ? [] : _b, viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn, _c = _a.excluded, excluded = _c === void 0 ? [] : _c, _d = _a.precision, precision = _d === void 0 ? 'days' : _d, _e = _a.absolutePositionedEvents, absolutePositionedEvents = _e === void 0 ? false : _e, hourSegments = _a.hourSegments, hourDuration = _a.hourDuration, dayStart = _a.dayStart, dayEnd = _a.dayEnd, weekendDays = _a.weekendDays, segmentHeight = _a.segmentHeight, minimumEventHeight = _a.minimumEventHeight, _f = _a.viewStart, viewStart = _f === void 0 ? dateAdapter.startOfWeek(viewDate, { weekStartsOn: weekStartsOn }) : _f, _g = _a.viewEnd, viewEnd = _g === void 0 ? dateAdapter.endOfWeek(viewDate, { weekStartsOn: weekStartsOn }) : _g;
    if (!events) {
        events = [];
    }
    var startOfDay = dateAdapter.startOfDay, endOfDay = dateAdapter.endOfDay;
    viewStart = startOfDay(viewStart);
    viewEnd = endOfDay(viewEnd);
    var eventsInPeriod = getEventsInPeriod(dateAdapter, {
        events: events,
        periodStart: viewStart,
        periodEnd: viewEnd,
    });
    var header = getWeekViewHeader(dateAdapter, {
        viewDate: viewDate,
        weekStartsOn: weekStartsOn,
        excluded: excluded,
        weekendDays: weekendDays,
        viewStart: viewStart,
        viewEnd: viewEnd,
    });
    return {
        allDayEventRows: getAllDayWeekEvents(dateAdapter, {
            events: eventsInPeriod,
            excluded: excluded,
            precision: precision,
            absolutePositionedEvents: absolutePositionedEvents,
            viewStart: viewStart,
            viewEnd: viewEnd,
        }),
        period: {
            events: eventsInPeriod,
            start: header[0].date,
            end: endOfDay(header[header.length - 1].date),
        },
        hourColumns: getWeekViewHourGrid(dateAdapter, {
            events: events,
            viewDate: viewDate,
            hourSegments: hourSegments,
            hourDuration: hourDuration,
            dayStart: dayStart,
            dayEnd: dayEnd,
            weekStartsOn: weekStartsOn,
            excluded: excluded,
            weekendDays: weekendDays,
            segmentHeight: segmentHeight,
            viewStart: viewStart,
            viewEnd: viewEnd,
            minimumEventHeight: minimumEventHeight,
        }),
    };
}
export function getMonthView(dateAdapter, _a) {
    var _b = _a.events, events = _b === void 0 ? [] : _b, viewDate = _a.viewDate, weekStartsOn = _a.weekStartsOn, _c = _a.excluded, excluded = _c === void 0 ? [] : _c, _d = _a.viewStart, viewStart = _d === void 0 ? dateAdapter.startOfMonth(viewDate) : _d, _e = _a.viewEnd, viewEnd = _e === void 0 ? dateAdapter.endOfMonth(viewDate) : _e, weekendDays = _a.weekendDays;
    if (!events) {
        events = [];
    }
    var startOfWeek = dateAdapter.startOfWeek, endOfWeek = dateAdapter.endOfWeek, differenceInDays = dateAdapter.differenceInDays, startOfDay = dateAdapter.startOfDay, addHours = dateAdapter.addHours, endOfDay = dateAdapter.endOfDay, isSameMonth = dateAdapter.isSameMonth, getDay = dateAdapter.getDay, getMonth = dateAdapter.getMonth;
    var start = startOfWeek(viewStart, { weekStartsOn: weekStartsOn });
    var end = endOfWeek(viewEnd, { weekStartsOn: weekStartsOn });
    var eventsInMonth = getEventsInPeriod(dateAdapter, {
        events: events,
        periodStart: start,
        periodEnd: end,
    });
    var initialViewDays = [];
    var previousDate;
    var _loop_2 = function (i) {
        // hacky fix for https://github.com/mattlewis92/angular-calendar/issues/173
        var date;
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
        if (!excluded.some(function (e) { return getDay(date) === e; })) {
            var day = getWeekDay(dateAdapter, {
                date: date,
                weekendDays: weekendDays,
            });
            var eventsInPeriod = getEventsInPeriod(dateAdapter, {
                events: eventsInMonth,
                periodStart: startOfDay(date),
                periodEnd: endOfDay(date),
            });
            day.inMonth = isSameMonth(date, viewDate);
            day.events = eventsInPeriod;
            day.badgeTotal = eventsInPeriod.length;
            initialViewDays.push(day);
        }
    };
    for (var i = 0; i < differenceInDays(end, start) + 1; i++) {
        _loop_2(i);
    }
    var days = [];
    var totalDaysVisibleInWeek = DAYS_IN_WEEK - excluded.length;
    if (totalDaysVisibleInWeek < DAYS_IN_WEEK) {
        for (var i = 0; i < initialViewDays.length; i += totalDaysVisibleInWeek) {
            var row = initialViewDays.slice(i, i + totalDaysVisibleInWeek);
            var isRowInMonth = row.some(function (day) { return viewStart <= day.date && day.date < viewEnd; });
            if (isRowInMonth) {
                days = __spread(days, row);
            }
        }
    }
    else {
        days = initialViewDays;
    }
    var rows = Math.floor(days.length / totalDaysVisibleInWeek);
    var rowOffsets = [];
    for (var i = 0; i < rows; i++) {
        rowOffsets.push(i * totalDaysVisibleInWeek);
    }
    return {
        rowOffsets: rowOffsets,
        totalDaysVisibleInWeek: totalDaysVisibleInWeek,
        days: days,
        period: {
            start: days[0].date,
            end: endOfDay(days[days.length - 1].date),
            events: eventsInMonth,
        },
    };
}
function getOverLappingWeekViewEvents(events, top, bottom) {
    return events.filter(function (previousEvent) {
        var previousEventTop = previousEvent.top;
        var previousEventBottom = previousEvent.top + previousEvent.height;
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
function getDayView(dateAdapter, _a) {
    var events = _a.events, viewDate = _a.viewDate, hourSegments = _a.hourSegments, dayStart = _a.dayStart, dayEnd = _a.dayEnd, eventWidth = _a.eventWidth, segmentHeight = _a.segmentHeight, hourDuration = _a.hourDuration, minimumEventHeight = _a.minimumEventHeight;
    var setMinutes = dateAdapter.setMinutes, setHours = dateAdapter.setHours, startOfDay = dateAdapter.startOfDay, startOfMinute = dateAdapter.startOfMinute, endOfDay = dateAdapter.endOfDay, differenceInMinutes = dateAdapter.differenceInMinutes;
    var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
    var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
    endOfView.setSeconds(59, 999);
    var previousDayEvents = [];
    var eventsInPeriod = getEventsInPeriod(dateAdapter, {
        events: events.filter(function (event) { return !event.allDay; }),
        periodStart: startOfView,
        periodEnd: endOfView,
    });
    var dayViewEvents = eventsInPeriod
        .sort(function (eventA, eventB) {
        return eventA.start.valueOf() - eventB.start.valueOf();
    })
        .map(function (event) {
        var eventStart = event.start;
        var eventEnd = event.end || eventStart;
        var startsBeforeDay = eventStart < startOfView;
        var endsAfterDay = eventEnd > endOfView;
        var hourHeightModifier = (hourSegments * segmentHeight) / (hourDuration || MINUTES_IN_HOUR);
        var top = 0;
        if (eventStart > startOfView) {
            // adjust the difference in minutes if the user's offset is different between the start of the day and the event (e.g. when going to or from DST)
            var eventOffset = eventStart.getTimezoneOffset();
            var startOffset = startOfView.getTimezoneOffset();
            var diff = startOffset - eventOffset;
            top += differenceInMinutes(eventStart, startOfView) + diff;
        }
        top *= hourHeightModifier;
        var startDate = startsBeforeDay ? startOfView : eventStart;
        var endDate = endsAfterDay ? endOfView : eventEnd;
        var height = differenceInMinutes(endDate, startDate);
        if (!event.end) {
            height = segmentHeight;
        }
        else {
            height *= hourHeightModifier;
        }
        if (minimumEventHeight && height < minimumEventHeight) {
            height = minimumEventHeight;
        }
        var bottom = top + height;
        var overlappingPreviousEvents = getOverLappingWeekViewEvents(previousDayEvents, top, bottom);
        var left = 0;
        while (overlappingPreviousEvents.some(function (previousEvent) { return previousEvent.left === left; })) {
            left += eventWidth;
        }
        var dayEvent = {
            event: event,
            height: height,
            width: eventWidth,
            top: top,
            left: left,
            startsBeforeDay: startsBeforeDay,
            endsAfterDay: endsAfterDay,
        };
        previousDayEvents.push(dayEvent);
        return dayEvent;
    });
    var width = Math.max.apply(Math, __spread(dayViewEvents.map(function (event) { return event.left + event.width; })));
    var allDayEvents = getEventsInPeriod(dateAdapter, {
        events: events.filter(function (event) { return event.allDay; }),
        periodStart: startOfDay(startOfView),
        periodEnd: endOfDay(endOfView),
    });
    return {
        events: dayViewEvents,
        width: width,
        allDayEvents: allDayEvents,
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
function getDayViewHourGrid(dateAdapter, _a) {
    var viewDate = _a.viewDate, hourSegments = _a.hourSegments, hourDuration = _a.hourDuration, dayStart = _a.dayStart, dayEnd = _a.dayEnd;
    var setMinutes = dateAdapter.setMinutes, setHours = dateAdapter.setHours, startOfDay = dateAdapter.startOfDay, startOfMinute = dateAdapter.startOfMinute, endOfDay = dateAdapter.endOfDay, addMinutes = dateAdapter.addMinutes, addHours = dateAdapter.addHours, addDays = dateAdapter.addDays;
    var hours = [];
    var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
    var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
    var segmentDuration = (hourDuration || MINUTES_IN_HOUR) / hourSegments;
    var startOfViewDay = startOfDay(viewDate);
    var endOfViewDay = endOfDay(viewDate);
    var dateAdjustment = function (d) { return d; };
    // this means that we change from or to DST on this day and that's going to cause problems so we bump the date
    if (startOfViewDay.getTimezoneOffset() !== endOfViewDay.getTimezoneOffset()) {
        startOfViewDay = addDays(startOfViewDay, 1);
        startOfView = addDays(startOfView, 1);
        endOfView = addDays(endOfView, 1);
        dateAdjustment = function (d) { return addDays(d, -1); };
    }
    var dayDuration = hourDuration
        ? (HOURS_IN_DAY * 60) / hourDuration
        : MINUTES_IN_HOUR;
    for (var i = 0; i < dayDuration; i++) {
        var segments = [];
        for (var j = 0; j < hourSegments; j++) {
            var date = addMinutes(addMinutes(startOfView, i * (hourDuration || MINUTES_IN_HOUR)), j * segmentDuration);
            if (date >= startOfView && date < endOfView) {
                segments.push({
                    date: dateAdjustment(date),
                    displayDate: date,
                    isStart: j === 0,
                });
            }
        }
        if (segments.length > 0) {
            hours.push({ segments: segments });
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
    var isValid = true;
    function isError(msg, event) {
        log(msg, event);
        isValid = false;
    }
    if (!Array.isArray(events)) {
        log(EventValidationErrorMessage.NotArray, events);
        return false;
    }
    events.forEach(function (event) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWMtY2FsZW5kYXItdXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsidXRpbGl0aWVzL21jLWNhbGVuZGFyLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxNQUFNLENBQU4sSUFBWSxZQVFYO0FBUkQsV0FBWSxZQUFZO0lBQ3BCLG1EQUFVLENBQUE7SUFDVixtREFBVSxDQUFBO0lBQ1YscURBQVcsQ0FBQTtJQUNYLHlEQUFhLENBQUE7SUFDYix1REFBWSxDQUFBO0lBQ1osbURBQVUsQ0FBQTtJQUNWLHVEQUFZLENBQUE7QUFDaEIsQ0FBQyxFQVJXLFlBQVksS0FBWixZQUFZLFFBUXZCO0FBRUQsSUFBTSxvQkFBb0IsR0FBYTtJQUNuQyxZQUFZLENBQUMsTUFBTTtJQUNuQixZQUFZLENBQUMsUUFBUTtDQUN4QixDQUFDO0FBQ0YsSUFBTSxZQUFZLEdBQVcsQ0FBQyxDQUFDO0FBQy9CLElBQU0sWUFBWSxHQUFXLEVBQUUsQ0FBQztBQUNoQyxJQUFNLGVBQWUsR0FBVyxFQUFFLENBQUM7QUFDbkMsTUFBTSxDQUFDLElBQU0sY0FBYyxHQUFXLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBK0tuRCxTQUFTLGtCQUFrQixDQUN2QixXQUF3QixFQUN4QixFQVVDO1FBVEcsd0JBQVMsRUFDVCxvQkFBTyxFQUNQLHNCQUFRLEVBQ1Isd0JBQVM7SUFRYixJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDO0tBQ1o7SUFDTyxJQUFBLG1DQUFVLEVBQUUsMkJBQU0sRUFBRSw2QkFBTyxDQUFpQjtJQUNwRCxJQUFNLE9BQU8sR0FBUyxVQUFVLENBQUMsU0FBUyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6RCxJQUFNLFFBQVEsR0FBVyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBTSxNQUFNLEdBQVcsTUFB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LDJCQUEyQixDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3BFO2FBQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsRUFBRTtZQUN2QyxPQUFPLENBQUMsMkJBQTJCLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDcEU7UUFFRCxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDWCxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxZQUFZLElBQUksQ0FBQyxFQUFFO2dCQUM5QixPQUFPLENBQUMsMkJBQTJCLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDbEU7WUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDekIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUMvRDtTQUNKO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tIFwiLi4vZGF0ZS1hZGFwdGVycy9kYXRlLWFkYXB0ZXJcIjtcblxuZXhwb3J0IGVudW0gREFZU19PRl9XRUVLIHtcbiAgICBTVU5EQVkgPSAwLFxuICAgIE1PTkRBWSA9IDEsXG4gICAgVFVFU0RBWSA9IDIsXG4gICAgV0VETkVTREFZID0gMyxcbiAgICBUSFVSU0RBWSA9IDQsXG4gICAgRlJJREFZID0gNSxcbiAgICBTQVRVUkRBWSA9IDYsXG59XG5cbmNvbnN0IERFRkFVTFRfV0VFS0VORF9EQVlTOiBudW1iZXJbXSA9IFtcbiAgICBEQVlTX09GX1dFRUsuU1VOREFZLFxuICAgIERBWVNfT0ZfV0VFSy5TQVRVUkRBWSxcbl07XG5jb25zdCBEQVlTX0lOX1dFRUs6IG51bWJlciA9IDc7XG5jb25zdCBIT1VSU19JTl9EQVk6IG51bWJlciA9IDI0O1xuY29uc3QgTUlOVVRFU19JTl9IT1VSOiBudW1iZXIgPSA2MDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX0lOX0RBWTogbnVtYmVyID0gNjAgKiA2MCAqIDI0O1xuXG5leHBvcnQgaW50ZXJmYWNlIE1DV2Vla0RheSB7XG4gICAgZGF0ZTogRGF0ZTtcbiAgICBkYXk6IG51bWJlcjtcbiAgICBpc1Bhc3Q6IGJvb2xlYW47XG4gICAgaXNUb2RheTogYm9vbGVhbjtcbiAgICBpc0Z1dHVyZTogYm9vbGVhbjtcbiAgICBpc1dlZWtlbmQ6IGJvb2xlYW47XG4gICAgY3NzQ2xhc3M/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRDb2xvciB7XG4gICAgcHJpbWFyeTogc3RyaW5nO1xuICAgIHNlY29uZGFyeTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DRXZlbnRBY3Rpb24ge1xuICAgIGlkPzogc3RyaW5nIHwgbnVtYmVyO1xuICAgIGxhYmVsOiBzdHJpbmc7XG4gICAgY3NzQ2xhc3M/OiBzdHJpbmc7XG4gICAgYTExeUxhYmVsPzogc3RyaW5nO1xuICAgIG9uQ2xpY2soe1xuICAgICAgICBldmVudCxcbiAgICAgICAgc291cmNlRXZlbnQsXG4gICAgfToge1xuICAgICAgICBldmVudDogTUNFdmVudDtcbiAgICAgICAgc291cmNlRXZlbnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50O1xuICAgIH0pOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNFdmVudDxNZXRhVHlwZSA9IGFueT4ge1xuICAgIGlkPzogc3RyaW5nIHwgbnVtYmVyO1xuICAgIHN0YXJ0OiBEYXRlO1xuICAgIGVuZD86IERhdGU7XG4gICAgdGl0bGU/OiBzdHJpbmc7XG4gICAgY29sb3I/OiBFdmVudENvbG9yO1xuICAgIGFjdGlvbnM/OiBNQ0V2ZW50QWN0aW9uW107XG4gICAgYWxsRGF5PzogYm9vbGVhbjtcbiAgICBjc3NDbGFzcz86IHN0cmluZztcbiAgICByZXNpemFibGU/OiB7XG4gICAgICAgIGJlZm9yZVN0YXJ0PzogYm9vbGVhbjtcbiAgICAgICAgYWZ0ZXJFbmQ/OiBib29sZWFuO1xuICAgIH07XG4gICAgZHJhZ2dhYmxlPzogYm9vbGVhbjtcbiAgICBtZXRhPzogTWV0YVR5cGU7XG4gICAgb25saW5lOiBib29sZWFuO1xuICAgIG9uU2l0ZTogYm9vbGVhbjtcbiAgICByb29tPzogTUNSb29tO1xuICAgIHZpZGVvVVJMPzogc3RyaW5nO1xuICAgIHByZXNlbmNlUmVjb3JkZWQ/OiBib29sZWFuO1xuICAgIGxlc3NvbjogTUNMZXNzb247XG4gICAgdG9waWM/OiBzdHJpbmc7XG4gICAgbmV3c2lkPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DTGVzc29uIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBzaG9ydE5hbWU6IHN0cmluZztcbiAgICBtb2R1bGU6IE1DTW9kdWxlO1xuICAgIHN1YmplY3Q6IE1DU3ViamVjdDtcbiAgICBwZXJmb3JtYW5jZVJlY29yZDogTUNQZXJmb3JtYW5jZVJlY29yZDtcbiAgICBsZXNzb25UeXBlOiBNQ0xlc3NvblR5cGU7XG4gICAgaWxpYXNVUkw6IHN0cmluZztcbiAgICBoYXNMZWFybmluZ01hdGVyaWFsOiBib29sZWFuO1xuICAgIHN3YXBMZXNzb25BbGxvd2VkPzogYm9vbGVhbjtcbiAgICBjaGFuZ2VMZXNzb25BbGxvd2VkPzogYm9vbGVhbjtcbiAgICBzd2FwRXZlbnRBbGxvd2VkOiBib29sZWFuO1xuICAgIGNoYW5nZUV2ZW50QWxsb3dlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ01vZHVsZSB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNSb29tIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBzaG9ydE5hbWU6IHN0cmluZztcbiAgICByb29tTGluazogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DU3ViamVjdCB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNQZXJmb3JtYW5jZVJlY29yZCB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNMZXNzb25UeXBlIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBtYW5kYXRvcnk6IGJvb2xlYW47XG4gICAgY29sb3I6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ1dlZWtWaWV3QWxsRGF5RXZlbnQge1xuICAgIGV2ZW50OiBNQ0V2ZW50O1xuICAgIG9mZnNldDogbnVtYmVyO1xuICAgIHNwYW46IG51bWJlcjtcbiAgICBzdGFydHNCZWZvcmVXZWVrOiBib29sZWFuO1xuICAgIGVuZHNBZnRlcldlZWs6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNXZWVrVmlld0FsbERheUV2ZW50Um93IHtcbiAgICBpZD86IHN0cmluZztcbiAgICByb3c6IE1DV2Vla1ZpZXdBbGxEYXlFdmVudFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DV2Vla1ZpZXcge1xuICAgIHBlcmlvZDogTUNWaWV3UGVyaW9kO1xuICAgIGFsbERheUV2ZW50Um93czogTUNXZWVrVmlld0FsbERheUV2ZW50Um93W107XG4gICAgaG91ckNvbHVtbnM6IE1DV2Vla1ZpZXdIb3VyQ29sdW1uW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNNb250aFZpZXdEYXk8TWV0YVR5cGUgPSBhbnk+IGV4dGVuZHMgTUNXZWVrRGF5IHtcbiAgICBpbk1vbnRoOiBib29sZWFuO1xuICAgIGV2ZW50czogTUNFdmVudFtdO1xuICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgICBiYWRnZVRvdGFsOiBudW1iZXI7XG4gICAgbWV0YT86IE1ldGFUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DTW9udGhWaWV3IHtcbiAgICByb3dPZmZzZXRzOiBudW1iZXJbXTtcbiAgICBkYXlzOiBNQ01vbnRoVmlld0RheVtdO1xuICAgIHRvdGFsRGF5c1Zpc2libGVJbldlZWs6IG51bWJlcjtcbiAgICBwZXJpb2Q6IE1DVmlld1BlcmlvZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ1dlZWtWaWV3VGltZUV2ZW50IHtcbiAgICBldmVudDogTUNFdmVudDtcbiAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIHRvcDogbnVtYmVyO1xuICAgIGxlZnQ6IG51bWJlcjtcbiAgICBzdGFydHNCZWZvcmVEYXk6IGJvb2xlYW47XG4gICAgZW5kc0FmdGVyRGF5OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgTUNEYXlWaWV3IHtcbiAgICBldmVudHM6IE1DV2Vla1ZpZXdUaW1lRXZlbnRbXTtcbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIGFsbERheUV2ZW50czogTUNFdmVudFtdO1xuICAgIHBlcmlvZDogTUNWaWV3UGVyaW9kO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DV2Vla1ZpZXdIb3VyU2VnbWVudCB7XG4gICAgaXNTdGFydDogYm9vbGVhbjtcbiAgICBkYXRlOiBEYXRlO1xuICAgIGRpc3BsYXlEYXRlOiBEYXRlO1xuICAgIGNzc0NsYXNzPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DV2Vla1ZpZXdIb3VyIHtcbiAgICBzZWdtZW50czogTUNXZWVrVmlld0hvdXJTZWdtZW50W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNXZWVrVmlld0hvdXJDb2x1bW4ge1xuICAgIGRhdGU6IERhdGU7XG4gICAgaG91cnM6IE1DV2Vla1ZpZXdIb3VyW107XG4gICAgZXZlbnRzOiBNQ1dlZWtWaWV3VGltZUV2ZW50W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNWaWV3UGVyaW9kIHtcbiAgICBzdGFydDogRGF0ZTtcbiAgICBlbmQ6IERhdGU7XG4gICAgZXZlbnRzOiBNQ0V2ZW50W107XG59XG5cbmZ1bmN0aW9uIGdldEV4Y2x1ZGVkU2Vjb25kcyhcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBzdGFydERhdGUsXG4gICAgICAgIHNlY29uZHMsXG4gICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICBwcmVjaXNpb24sXG4gICAgfToge1xuICAgICAgICBzdGFydERhdGU6IERhdGU7XG4gICAgICAgIHNlY29uZHM6IG51bWJlcjtcbiAgICAgICAgZXhjbHVkZWQ6IG51bWJlcltdO1xuICAgICAgICBwcmVjaXNpb246ICdtaW51dGVzJyB8ICdkYXlzJztcbiAgICB9XG4pOiBudW1iZXIge1xuICAgIGlmIChleGNsdWRlZC5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBjb25zdCB7IGFkZFNlY29uZHMsIGdldERheSwgYWRkRGF5cyB9ID0gZGF0ZUFkYXB0ZXI7XG4gICAgY29uc3QgZW5kRGF0ZTogRGF0ZSA9IGFkZFNlY29uZHMoc3RhcnREYXRlLCBzZWNvbmRzIC0gMSk7XG4gICAgY29uc3QgZGF5U3RhcnQ6IG51bWJlciA9IGdldERheShzdGFydERhdGUpO1xuICAgIGNvbnN0IGRheUVuZDogbnVtYmVyID0gZ2V0RGF5KGVuZERhdGUpO1xuICAgIGxldCByZXN1bHQ6IG51bWJlciA9IDA7IC8vIENhbGN1bGF0ZWQgaW4gc2Vjb25kc1xuICAgIGxldCBjdXJyZW50OiBEYXRlID0gc3RhcnREYXRlO1xuXG4gICAgd2hpbGUgKGN1cnJlbnQgPCBlbmREYXRlKSB7XG4gICAgICAgIGNvbnN0IGRheTogbnVtYmVyID0gZ2V0RGF5KGN1cnJlbnQpO1xuXG4gICAgICAgIGlmIChleGNsdWRlZC5zb21lKChleGNsdWRlZERheSkgPT4gZXhjbHVkZWREYXkgPT09IGRheSkpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBjYWxjdWxhdGVFeGNsdWRlZFNlY29uZHMoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgICAgICAgICBkYXlFbmQsXG4gICAgICAgICAgICAgICAgZGF5LFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbixcbiAgICAgICAgICAgICAgICBzdGFydERhdGUsXG4gICAgICAgICAgICAgICAgZW5kRGF0ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudCA9IGFkZERheXMoY3VycmVudCwgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlRXhjbHVkZWRTZWNvbmRzKFxuICAgIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgICB7XG4gICAgICAgIHByZWNpc2lvbixcbiAgICAgICAgZGF5LFxuICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgZGF5RW5kLFxuICAgICAgICBzdGFydERhdGUsXG4gICAgICAgIGVuZERhdGUsXG4gICAgfToge1xuICAgICAgICBkYXk6IG51bWJlcjtcbiAgICAgICAgc3RhcnREYXRlOiBEYXRlO1xuICAgICAgICBlbmREYXRlOiBEYXRlO1xuICAgICAgICBkYXlTdGFydDogbnVtYmVyO1xuICAgICAgICBkYXlFbmQ6IG51bWJlcjtcbiAgICAgICAgcHJlY2lzaW9uPzogJ21pbnV0ZXMnIHwgJ2RheXMnO1xuICAgIH1cbik6IG51bWJlciB7XG4gICAgY29uc3QgeyBkaWZmZXJlbmNlSW5TZWNvbmRzLCBlbmRPZkRheSwgc3RhcnRPZkRheSB9ID0gZGF0ZUFkYXB0ZXI7XG4gICAgaWYgKHByZWNpc2lvbiA9PT0gJ21pbnV0ZXMnKSB7XG4gICAgICAgIGlmIChkYXkgPT09IGRheVN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gZGlmZmVyZW5jZUluU2Vjb25kcyhlbmRPZkRheShzdGFydERhdGUpLCBzdGFydERhdGUpICsgMTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXkgPT09IGRheUVuZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRpZmZlcmVuY2VJblNlY29uZHMoZW5kRGF0ZSwgc3RhcnRPZkRheShlbmREYXRlKSkgKyAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFNFQ09ORFNfSU5fREFZO1xufVxuXG5mdW5jdGlvbiBnZXRXZWVrVmlld0V2ZW50U3BhbihcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBldmVudCxcbiAgICAgICAgb2Zmc2V0LFxuICAgICAgICBzdGFydE9mV2Vla0RhdGUsXG4gICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICBwcmVjaXNpb24sXG4gICAgICAgIHRvdGFsRGF5c0luVmlldyxcbiAgICB9OiB7XG4gICAgICAgIGV2ZW50OiBNQ0V2ZW50O1xuICAgICAgICBvZmZzZXQ6IG51bWJlcjtcbiAgICAgICAgc3RhcnRPZldlZWtEYXRlOiBEYXRlO1xuICAgICAgICBleGNsdWRlZDogbnVtYmVyW107XG4gICAgICAgIHByZWNpc2lvbjogJ21pbnV0ZXMnIHwgJ2RheXMnO1xuICAgICAgICB0b3RhbERheXNJblZpZXc6IG51bWJlcjtcbiAgICB9XG4pOiBudW1iZXIge1xuICAgIGNvbnN0IHtcbiAgICAgICAgbWF4LFxuICAgICAgICBkaWZmZXJlbmNlSW5TZWNvbmRzLFxuICAgICAgICBhZGREYXlzLFxuICAgICAgICBlbmRPZkRheSxcbiAgICAgICAgZGlmZmVyZW5jZUluRGF5cyxcbiAgICB9ID0gZGF0ZUFkYXB0ZXI7XG4gICAgbGV0IHNwYW46IG51bWJlciA9IFNFQ09ORFNfSU5fREFZO1xuICAgIGNvbnN0IGJlZ2luOiBEYXRlID0gbWF4KFtldmVudC5zdGFydCwgc3RhcnRPZldlZWtEYXRlXSk7XG5cbiAgICBpZiAoZXZlbnQuZW5kKSB7XG4gICAgICAgIHN3aXRjaCAocHJlY2lzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICdtaW51dGVzJzpcbiAgICAgICAgICAgICAgICBzcGFuID0gZGlmZmVyZW5jZUluU2Vjb25kcyhldmVudC5lbmQsIGJlZ2luKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgc3BhbiA9XG4gICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2VJbkRheXMoYWRkRGF5cyhlbmRPZkRheShldmVudC5lbmQpLCAxKSwgYmVnaW4pICpcbiAgICAgICAgICAgICAgICAgICAgU0VDT05EU19JTl9EQVk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvZmZzZXRTZWNvbmRzOiBudW1iZXIgPSBvZmZzZXQgKiBTRUNPTkRTX0lOX0RBWTtcbiAgICBjb25zdCB0b3RhbExlbmd0aDogbnVtYmVyID0gb2Zmc2V0U2Vjb25kcyArIHNwYW47XG5cbiAgICAvLyB0aGUgYmVzdCB3YXkgdG8gZGV0ZWN0IGlmIGFuIGV2ZW50IGlzIG91dHNpZGUgdGhlIHdlZWstdmlld1xuICAgIC8vIGlzIHRvIGNoZWNrIGlmIHRoZSB0b3RhbCBzcGFuIGJlZ2lubmluZyAoZnJvbSBzdGFydE9mV2Vla0RheSBvciBldmVudCBzdGFydCkgZXhjZWVkcyB0aGUgdG90YWwgZGF5cyBpbiB0aGUgdmlld1xuICAgIGNvbnN0IHNlY29uZHNJblZpZXcgPSB0b3RhbERheXNJblZpZXcgKiBTRUNPTkRTX0lOX0RBWTtcbiAgICBpZiAodG90YWxMZW5ndGggPiBzZWNvbmRzSW5WaWV3KSB7XG4gICAgICAgIHNwYW4gPSBzZWNvbmRzSW5WaWV3IC0gb2Zmc2V0U2Vjb25kcztcbiAgICB9XG5cbiAgICBzcGFuIC09IGdldEV4Y2x1ZGVkU2Vjb25kcyhkYXRlQWRhcHRlciwge1xuICAgICAgICBzdGFydERhdGU6IGJlZ2luLFxuICAgICAgICBzZWNvbmRzOiBzcGFuLFxuICAgICAgICBleGNsdWRlZCxcbiAgICAgICAgcHJlY2lzaW9uLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNwYW4gLyBTRUNPTkRTX0lOX0RBWTtcbn1cblxuZnVuY3Rpb24gZ2V0V2Vla1ZpZXdFdmVudE9mZnNldChcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBldmVudCxcbiAgICAgICAgc3RhcnRPZldlZWs6IHN0YXJ0T2ZXZWVrRGF0ZSxcbiAgICAgICAgZXhjbHVkZWQsXG4gICAgICAgIHByZWNpc2lvbixcbiAgICB9OiB7XG4gICAgICAgIGV2ZW50OiBNQ0V2ZW50O1xuICAgICAgICBzdGFydE9mV2VlazogRGF0ZTtcbiAgICAgICAgZXhjbHVkZWQ6IG51bWJlcltdO1xuICAgICAgICBwcmVjaXNpb246ICdtaW51dGVzJyB8ICdkYXlzJztcbiAgICB9XG4pOiBudW1iZXIge1xuICAgIGNvbnN0IHsgZGlmZmVyZW5jZUluRGF5cywgc3RhcnRPZkRheSwgZGlmZmVyZW5jZUluU2Vjb25kcyB9ID0gZGF0ZUFkYXB0ZXI7XG4gICAgaWYgKGV2ZW50LnN0YXJ0IDwgc3RhcnRPZldlZWtEYXRlKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGxldCBvZmZzZXQ6IG51bWJlciA9IDA7XG5cbiAgICBzd2l0Y2ggKHByZWNpc2lvbikge1xuICAgICAgICBjYXNlICdkYXlzJzpcbiAgICAgICAgICAgIG9mZnNldCA9XG4gICAgICAgICAgICAgICAgZGlmZmVyZW5jZUluRGF5cyhzdGFydE9mRGF5KGV2ZW50LnN0YXJ0KSwgc3RhcnRPZldlZWtEYXRlKSAqXG4gICAgICAgICAgICAgICAgU0VDT05EU19JTl9EQVk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbWludXRlcyc6XG4gICAgICAgICAgICBvZmZzZXQgPSBkaWZmZXJlbmNlSW5TZWNvbmRzKGV2ZW50LnN0YXJ0LCBzdGFydE9mV2Vla0RhdGUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgb2Zmc2V0IC09IGdldEV4Y2x1ZGVkU2Vjb25kcyhkYXRlQWRhcHRlciwge1xuICAgICAgICBzdGFydERhdGU6IHN0YXJ0T2ZXZWVrRGF0ZSxcbiAgICAgICAgc2Vjb25kczogb2Zmc2V0LFxuICAgICAgICBleGNsdWRlZCxcbiAgICAgICAgcHJlY2lzaW9uLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE1hdGguYWJzKG9mZnNldCAvIFNFQ09ORFNfSU5fREFZKTtcbn1cblxuaW50ZXJmYWNlIElzRXZlbnRJblBlcmlvZEFyZ3Mge1xuICAgIGV2ZW50OiBNQ0V2ZW50O1xuICAgIHBlcmlvZFN0YXJ0OiBEYXRlO1xuICAgIHBlcmlvZEVuZDogRGF0ZTtcbn1cblxuZnVuY3Rpb24gaXNFdmVudElzUGVyaW9kKFxuICAgIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgICB7IGV2ZW50LCBwZXJpb2RTdGFydCwgcGVyaW9kRW5kIH06IElzRXZlbnRJblBlcmlvZEFyZ3Ncbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHsgaXNTYW1lU2Vjb25kIH0gPSBkYXRlQWRhcHRlcjtcbiAgICBjb25zdCBldmVudFN0YXJ0OiBEYXRlID0gZXZlbnQuc3RhcnQ7XG4gICAgY29uc3QgZXZlbnRFbmQ6IERhdGUgPSBldmVudC5lbmQgfHwgZXZlbnQuc3RhcnQ7XG5cbiAgICBpZiAoZXZlbnRTdGFydCA+IHBlcmlvZFN0YXJ0ICYmIGV2ZW50U3RhcnQgPCBwZXJpb2RFbmQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50RW5kID4gcGVyaW9kU3RhcnQgJiYgZXZlbnRFbmQgPCBwZXJpb2RFbmQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50U3RhcnQgPCBwZXJpb2RTdGFydCAmJiBldmVudEVuZCA+IHBlcmlvZEVuZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIGlzU2FtZVNlY29uZChldmVudFN0YXJ0LCBwZXJpb2RTdGFydCkgfHxcbiAgICAgICAgaXNTYW1lU2Vjb25kKGV2ZW50U3RhcnQsIHBlcmlvZEVuZClcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgICBpc1NhbWVTZWNvbmQoZXZlbnRFbmQsIHBlcmlvZFN0YXJ0KSB8fFxuICAgICAgICBpc1NhbWVTZWNvbmQoZXZlbnRFbmQsIHBlcmlvZEVuZClcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DR2V0RXZlbnRzSW5QZXJpb2RBcmdzIHtcbiAgICBldmVudHM6IE1DRXZlbnRbXTtcbiAgICBwZXJpb2RTdGFydDogRGF0ZTtcbiAgICBwZXJpb2RFbmQ6IERhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFdmVudHNJblBlcmlvZChcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAgeyBldmVudHMsIHBlcmlvZFN0YXJ0LCBwZXJpb2RFbmQgfTogTUNHZXRFdmVudHNJblBlcmlvZEFyZ3Ncbik6IE1DRXZlbnRbXSB7XG4gICAgcmV0dXJuIGV2ZW50cy5maWx0ZXIoKGV2ZW50OiBNQ0V2ZW50KSA9PlxuICAgICAgICBpc0V2ZW50SXNQZXJpb2QoZGF0ZUFkYXB0ZXIsIHsgZXZlbnQsIHBlcmlvZFN0YXJ0LCBwZXJpb2RFbmQgfSlcbiAgICApO1xufVxuXG5mdW5jdGlvbiBnZXRXZWVrRGF5KFxuICAgIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgICB7XG4gICAgICAgIGRhdGUsXG4gICAgICAgIHdlZWtlbmREYXlzID0gREVGQVVMVF9XRUVLRU5EX0RBWVMsXG4gICAgfToge1xuICAgICAgICBkYXRlOiBEYXRlO1xuICAgICAgICB3ZWVrZW5kRGF5czogbnVtYmVyW107XG4gICAgICAgIHByZWNpc2lvbj86ICdkYXlzJyB8ICdtaW51dGVzJztcbiAgICB9XG4pOiBNQ1dlZWtEYXkge1xuICAgIGNvbnN0IHsgc3RhcnRPZkRheSwgaXNTYW1lRGF5LCBnZXREYXkgfSA9IGRhdGVBZGFwdGVyO1xuICAgIGNvbnN0IHRvZGF5ID0gc3RhcnRPZkRheShuZXcgRGF0ZSgpKTtcbiAgICBjb25zdCBkYXkgPSBnZXREYXkoZGF0ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGF0ZSxcbiAgICAgICAgZGF5LFxuICAgICAgICBpc1Bhc3Q6IGRhdGUgPCB0b2RheSxcbiAgICAgICAgaXNUb2RheTogaXNTYW1lRGF5KGRhdGUsIHRvZGF5KSxcbiAgICAgICAgaXNGdXR1cmU6IGRhdGUgPiB0b2RheSxcbiAgICAgICAgaXNXZWVrZW5kOiB3ZWVrZW5kRGF5cy5pbmRleE9mKGRheSkgPiAtMSxcbiAgICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DR2V0V2Vla1ZpZXdIZWFkZXJBcmdzIHtcbiAgICB2aWV3RGF0ZTogRGF0ZTtcbiAgICB3ZWVrU3RhcnRzT246IG51bWJlcjtcbiAgICBleGNsdWRlZD86IG51bWJlcltdO1xuICAgIHdlZWtlbmREYXlzPzogbnVtYmVyW107XG4gICAgdmlld1N0YXJ0PzogRGF0ZTtcbiAgICB2aWV3RW5kPzogRGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdlZWtWaWV3SGVhZGVyKFxuICAgIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgICB7XG4gICAgICAgIHZpZXdEYXRlLFxuICAgICAgICB3ZWVrU3RhcnRzT24sXG4gICAgICAgIGV4Y2x1ZGVkID0gW10sXG4gICAgICAgIHdlZWtlbmREYXlzLFxuICAgICAgICB2aWV3U3RhcnQgPSBkYXRlQWRhcHRlci5zdGFydE9mV2Vlayh2aWV3RGF0ZSwgeyB3ZWVrU3RhcnRzT24gfSksXG4gICAgICAgIHZpZXdFbmQgPSBkYXRlQWRhcHRlci5hZGREYXlzKHZpZXdTdGFydCwgREFZU19JTl9XRUVLKSxcbiAgICB9OiBNQ0dldFdlZWtWaWV3SGVhZGVyQXJnc1xuKTogTUNXZWVrRGF5W10ge1xuICAgIGNvbnN0IHsgYWRkRGF5cywgZ2V0RGF5IH0gPSBkYXRlQWRhcHRlcjtcbiAgICBjb25zdCBkYXlzOiBNQ1dlZWtEYXlbXSA9IFtdO1xuICAgIGxldCBkYXRlID0gdmlld1N0YXJ0O1xuICAgIHdoaWxlIChkYXRlIDwgdmlld0VuZCkge1xuICAgICAgICBpZiAoIWV4Y2x1ZGVkLnNvbWUoKGUpID0+IGdldERheShkYXRlKSA9PT0gZSkpIHtcbiAgICAgICAgICAgIGRheXMucHVzaChnZXRXZWVrRGF5KGRhdGVBZGFwdGVyLCB7IGRhdGUsIHdlZWtlbmREYXlzIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBkYXRlID0gYWRkRGF5cyhkYXRlLCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGRheXM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTUNHZXRXZWVrVmlld0FyZ3Mge1xuICAgIGV2ZW50cz86IE1DRXZlbnRbXTtcbiAgICB2aWV3RGF0ZTogRGF0ZTtcbiAgICB3ZWVrU3RhcnRzT246IG51bWJlcjtcbiAgICBleGNsdWRlZD86IG51bWJlcltdO1xuICAgIHByZWNpc2lvbj86ICdtaW51dGVzJyB8ICdkYXlzJztcbiAgICBhYnNvbHV0ZVBvc2l0aW9uZWRFdmVudHM/OiBib29sZWFuO1xuICAgIGhvdXJTZWdtZW50cz86IG51bWJlcjtcbiAgICBob3VyRHVyYXRpb24/OiBudW1iZXI7XG4gICAgZGF5U3RhcnQ6IFRpbWU7XG4gICAgZGF5RW5kOiBUaW1lO1xuICAgIHdlZWtlbmREYXlzPzogbnVtYmVyW107XG4gICAgc2VnbWVudEhlaWdodDogbnVtYmVyO1xuICAgIHZpZXdTdGFydD86IERhdGU7XG4gICAgdmlld0VuZD86IERhdGU7XG4gICAgbWluaW11bUV2ZW50SGVpZ2h0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlmZmVyZW5jZUluRGF5c1dpdGhFeGNsdXNpb25zKFxuICAgIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgICB7IGRhdGUxLCBkYXRlMiwgZXhjbHVkZWQgfTogeyBkYXRlMTogRGF0ZTsgZGF0ZTI6IERhdGU7IGV4Y2x1ZGVkOiBudW1iZXJbXSB9XG4pOiBudW1iZXIge1xuICAgIGxldCBkYXRlID0gZGF0ZTE7XG4gICAgbGV0IGRpZmYgPSAwO1xuICAgIHdoaWxlIChkYXRlIDwgZGF0ZTIpIHtcbiAgICAgICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2YoZGF0ZUFkYXB0ZXIuZ2V0RGF5KGRhdGUpKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGRpZmYrKztcbiAgICAgICAgfVxuICAgICAgICBkYXRlID0gZGF0ZUFkYXB0ZXIuYWRkRGF5cyhkYXRlLCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpZmY7XG59XG5cbmludGVyZmFjZSBNQ0dldEFsbERheUV2ZW50QXJncyB7XG4gICAgcHJlY2lzaW9uPzogJ2RheXMnIHwgJ21pbnV0ZXMnO1xuICAgIGV2ZW50cz86IE1DRXZlbnRbXTtcbiAgICBhYnNvbHV0ZVBvc2l0aW9uZWRFdmVudHM/OiBib29sZWFuO1xuICAgIHZpZXdTdGFydDogRGF0ZTtcbiAgICB2aWV3RW5kOiBEYXRlO1xuICAgIGV4Y2x1ZGVkPzogbnVtYmVyW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxEYXlXZWVrRXZlbnRzKFxuICAgIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgICB7XG4gICAgICAgIGV2ZW50cyA9IFtdLFxuICAgICAgICBleGNsdWRlZCA9IFtdLFxuICAgICAgICBwcmVjaXNpb24gPSAnZGF5cycgYXMgY29uc3QsXG4gICAgICAgIGFic29sdXRlUG9zaXRpb25lZEV2ZW50cyA9IGZhbHNlLFxuICAgICAgICB2aWV3U3RhcnQsXG4gICAgICAgIHZpZXdFbmQsXG4gICAgfTogTUNHZXRBbGxEYXlFdmVudEFyZ3Ncbik6IE1DV2Vla1ZpZXdBbGxEYXlFdmVudFJvd1tdIHtcbiAgICB2aWV3U3RhcnQgPSBkYXRlQWRhcHRlci5zdGFydE9mRGF5KHZpZXdTdGFydCk7XG4gICAgdmlld0VuZCA9IGRhdGVBZGFwdGVyLmVuZE9mRGF5KHZpZXdFbmQpO1xuICAgIGNvbnN0IHsgZGlmZmVyZW5jZUluU2Vjb25kcywgZGlmZmVyZW5jZUluRGF5cyB9ID0gZGF0ZUFkYXB0ZXI7XG4gICAgY29uc3QgbWF4UmFuZ2U6IG51bWJlciA9IGdldERpZmZlcmVuY2VJbkRheXNXaXRoRXhjbHVzaW9ucyhkYXRlQWRhcHRlciwge1xuICAgICAgICBkYXRlMTogdmlld1N0YXJ0LFxuICAgICAgICBkYXRlMjogdmlld0VuZCxcbiAgICAgICAgZXhjbHVkZWQsXG4gICAgfSk7XG4gICAgY29uc3QgdG90YWxEYXlzSW5WaWV3ID0gZGlmZmVyZW5jZUluRGF5cyh2aWV3RW5kLCB2aWV3U3RhcnQpICsgMTtcbiAgICBjb25zdCBldmVudHNNYXBwZWQ6IE1DV2Vla1ZpZXdBbGxEYXlFdmVudFtdID0gZXZlbnRzXG4gICAgICAgIC5maWx0ZXIoKGV2ZW50KSA9PiBldmVudC5hbGxEYXkpXG4gICAgICAgIC5tYXAoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXQ6IG51bWJlciA9IGdldFdlZWtWaWV3RXZlbnRPZmZzZXQoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICBzdGFydE9mV2Vlazogdmlld1N0YXJ0LFxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3Qgc3BhbjogbnVtYmVyID0gZ2V0V2Vla1ZpZXdFdmVudFNwYW4oZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICBvZmZzZXQsXG4gICAgICAgICAgICAgICAgc3RhcnRPZldlZWtEYXRlOiB2aWV3U3RhcnQsXG4gICAgICAgICAgICAgICAgZXhjbHVkZWQsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uLFxuICAgICAgICAgICAgICAgIHRvdGFsRGF5c0luVmlldyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHsgZXZlbnQsIG9mZnNldCwgc3BhbiB9O1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKChlKSA9PiBlLm9mZnNldCA8IG1heFJhbmdlKVxuICAgICAgICAuZmlsdGVyKChlKSA9PiBlLnNwYW4gPiAwKVxuICAgICAgICAubWFwKChlbnRyeSkgPT4gKHtcbiAgICAgICAgICAgIGV2ZW50OiBlbnRyeS5ldmVudCxcbiAgICAgICAgICAgIG9mZnNldDogZW50cnkub2Zmc2V0LFxuICAgICAgICAgICAgc3BhbjogZW50cnkuc3BhbixcbiAgICAgICAgICAgIHN0YXJ0c0JlZm9yZVdlZWs6IGVudHJ5LmV2ZW50LnN0YXJ0IDwgdmlld1N0YXJ0LFxuICAgICAgICAgICAgZW5kc0FmdGVyV2VlazogKGVudHJ5LmV2ZW50LmVuZCB8fCBlbnRyeS5ldmVudC5zdGFydCkgPiB2aWV3RW5kLFxuICAgICAgICB9KSlcbiAgICAgICAgLnNvcnQoKGl0ZW1BLCBpdGVtQik6IG51bWJlciA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdGFydFNlY29uZHNEaWZmOiBudW1iZXIgPSBkaWZmZXJlbmNlSW5TZWNvbmRzKFxuICAgICAgICAgICAgICAgIGl0ZW1BLmV2ZW50LnN0YXJ0LFxuICAgICAgICAgICAgICAgIGl0ZW1CLmV2ZW50LnN0YXJ0XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHN0YXJ0U2Vjb25kc0RpZmYgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlmZmVyZW5jZUluU2Vjb25kcyhcbiAgICAgICAgICAgICAgICAgICAgaXRlbUIuZXZlbnQuZW5kIHx8IGl0ZW1CLmV2ZW50LnN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBpdGVtQS5ldmVudC5lbmQgfHwgaXRlbUEuZXZlbnQuc3RhcnRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXJ0U2Vjb25kc0RpZmY7XG4gICAgICAgIH0pO1xuXG4gICAgY29uc3QgYWxsRGF5RXZlbnRSb3dzOiBNQ1dlZWtWaWV3QWxsRGF5RXZlbnRSb3dbXSA9IFtdO1xuICAgIGNvbnN0IGFsbG9jYXRlZEV2ZW50czogTUNXZWVrVmlld0FsbERheUV2ZW50W10gPSBbXTtcblxuICAgIGV2ZW50c01hcHBlZC5mb3JFYWNoKChldmVudDogTUNXZWVrVmlld0FsbERheUV2ZW50LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGlmIChhbGxvY2F0ZWRFdmVudHMuaW5kZXhPZihldmVudCkgPT09IC0xKSB7XG4gICAgICAgICAgICBhbGxvY2F0ZWRFdmVudHMucHVzaChldmVudCk7XG4gICAgICAgICAgICBsZXQgcm93U3BhbjogbnVtYmVyID0gZXZlbnQuc3BhbiArIGV2ZW50Lm9mZnNldDtcbiAgICAgICAgICAgIGNvbnN0IG90aGVyUm93RXZlbnRzOiBNQ1dlZWtWaWV3QWxsRGF5RXZlbnRbXSA9IGV2ZW50c01hcHBlZFxuICAgICAgICAgICAgICAgIC5zbGljZShpbmRleCArIDEpXG4gICAgICAgICAgICAgICAgLmZpbHRlcigobmV4dEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRFdmVudC5vZmZzZXQgPj0gcm93U3BhbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgcm93U3BhbiArIG5leHRFdmVudC5zcGFuIDw9IHRvdGFsRGF5c0luVmlldyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVkRXZlbnRzLmluZGV4T2YobmV4dEV2ZW50KSA9PT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0RXZlbnRPZmZzZXQ6IG51bWJlciA9IG5leHRFdmVudC5vZmZzZXQgLSByb3dTcGFuO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhYnNvbHV0ZVBvc2l0aW9uZWRFdmVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0RXZlbnQub2Zmc2V0ID0gbmV4dEV2ZW50T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93U3BhbiArPSBuZXh0RXZlbnQuc3BhbiArIG5leHRFdmVudE9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlZEV2ZW50cy5wdXNoKG5leHRFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3Qgd2Vla0V2ZW50cyA9IFtldmVudCwgLi4ub3RoZXJSb3dFdmVudHNdO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB3ZWVrRXZlbnRzXG4gICAgICAgICAgICAgICAgLmZpbHRlcigod2Vla0V2ZW50KSA9PiB3ZWVrRXZlbnQuZXZlbnQuaWQpXG4gICAgICAgICAgICAgICAgLm1hcCgod2Vla0V2ZW50KSA9PiB3ZWVrRXZlbnQuZXZlbnQuaWQpXG4gICAgICAgICAgICAgICAgLmpvaW4oJy0nKTtcbiAgICAgICAgICAgIGFsbERheUV2ZW50Um93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICByb3c6IHdlZWtFdmVudHMsXG4gICAgICAgICAgICAgICAgLi4uKGlkID8geyBpZCB9IDoge30pLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYWxsRGF5RXZlbnRSb3dzO1xufVxuXG5pbnRlcmZhY2UgTUNHZXRXZWVrVmlld0hvdXJHcmlkQXJncyBleHRlbmRzIE1DR2V0RGF5Vmlld0hvdXJHcmlkQXJncyB7XG4gICAgd2Vla1N0YXJ0c09uOiBudW1iZXI7XG4gICAgZXhjbHVkZWQ/OiBudW1iZXJbXTtcbiAgICB3ZWVrZW5kRGF5cz86IG51bWJlcltdO1xuICAgIGV2ZW50cz86IE1DRXZlbnRbXTtcbiAgICBzZWdtZW50SGVpZ2h0OiBudW1iZXI7XG4gICAgdmlld1N0YXJ0OiBEYXRlO1xuICAgIHZpZXdFbmQ6IERhdGU7XG4gICAgbWluaW11bUV2ZW50SGVpZ2h0OiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIGdldFdlZWtWaWV3SG91ckdyaWQoXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHtcbiAgICAgICAgZXZlbnRzLFxuICAgICAgICB2aWV3RGF0ZSxcbiAgICAgICAgaG91clNlZ21lbnRzLFxuICAgICAgICBob3VyRHVyYXRpb24sXG4gICAgICAgIGRheVN0YXJ0LFxuICAgICAgICBkYXlFbmQsXG4gICAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgICAgZXhjbHVkZWQsXG4gICAgICAgIHdlZWtlbmREYXlzLFxuICAgICAgICBzZWdtZW50SGVpZ2h0LFxuICAgICAgICB2aWV3U3RhcnQsXG4gICAgICAgIHZpZXdFbmQsXG4gICAgICAgIG1pbmltdW1FdmVudEhlaWdodCxcbiAgICB9OiBNQ0dldFdlZWtWaWV3SG91ckdyaWRBcmdzXG4pOiBNQ1dlZWtWaWV3SG91ckNvbHVtbltdIHtcbiAgICBjb25zdCBkYXlWaWV3SG91ckdyaWQgPSBnZXREYXlWaWV3SG91ckdyaWQoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgdmlld0RhdGUsXG4gICAgICAgIGhvdXJTZWdtZW50cyxcbiAgICAgICAgaG91ckR1cmF0aW9uLFxuICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgZGF5RW5kLFxuICAgIH0pO1xuICAgIGNvbnN0IHdlZWtEYXlzID0gZ2V0V2Vla1ZpZXdIZWFkZXIoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgdmlld0RhdGUsXG4gICAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgICAgZXhjbHVkZWQsXG4gICAgICAgIHdlZWtlbmREYXlzLFxuICAgICAgICB2aWV3U3RhcnQsXG4gICAgICAgIHZpZXdFbmQsXG4gICAgfSk7XG4gICAgY29uc3QgeyBzZXRIb3Vycywgc2V0TWludXRlcywgZ2V0SG91cnMsIGdldE1pbnV0ZXMgfSA9IGRhdGVBZGFwdGVyO1xuXG4gICAgcmV0dXJuIHdlZWtEYXlzLm1hcCgoZGF5KSA9PiB7XG4gICAgICAgIGNvbnN0IGRheVZpZXcgPSBnZXREYXlWaWV3KGRhdGVBZGFwdGVyLCB7XG4gICAgICAgICAgICBldmVudHMsXG4gICAgICAgICAgICB2aWV3RGF0ZTogZGF5LmRhdGUsXG4gICAgICAgICAgICBob3VyU2VnbWVudHMsXG4gICAgICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgICAgIGRheUVuZCxcbiAgICAgICAgICAgIHNlZ21lbnRIZWlnaHQsXG4gICAgICAgICAgICBldmVudFdpZHRoOiAxLFxuICAgICAgICAgICAgaG91ckR1cmF0aW9uLFxuICAgICAgICAgICAgbWluaW11bUV2ZW50SGVpZ2h0LFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBob3VycyA9IGRheVZpZXdIb3VyR3JpZC5tYXAoKGhvdXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gaG91ci5zZWdtZW50cy5tYXAoKHNlZ21lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gc2V0TWludXRlcyhcbiAgICAgICAgICAgICAgICAgICAgc2V0SG91cnMoZGF5LmRhdGUsIGdldEhvdXJzKHNlZ21lbnQuZGF0ZSkpLFxuICAgICAgICAgICAgICAgICAgICBnZXRNaW51dGVzKHNlZ21lbnQuZGF0ZSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLnNlZ21lbnQsIGRhdGUgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4uaG91ciwgc2VnbWVudHMgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29sdW1uQ291bnQoXG4gICAgICAgICAgICBhbGxFdmVudHM6IE1DV2Vla1ZpZXdUaW1lRXZlbnRbXSxcbiAgICAgICAgICAgIHByZXZPdmVybGFwcGluZ0V2ZW50czogTUNXZWVrVmlld1RpbWVFdmVudFtdXG4gICAgICAgICk6IG51bWJlciB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5Db3VudCA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICAgIC4uLnByZXZPdmVybGFwcGluZ0V2ZW50cy5tYXAoKGlFdmVudCkgPT4gaUV2ZW50LmxlZnQgKyAxKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29uc3QgbmV4dE92ZXJsYXBwaW5nRXZlbnRzID0gYWxsRXZlbnRzXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoaUV2ZW50KSA9PiBpRXZlbnQubGVmdCA+PSBjb2x1bW5Db3VudClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChpRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE92ZXJMYXBwaW5nV2Vla1ZpZXdFdmVudHMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldk92ZXJsYXBwaW5nRXZlbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlFdmVudC50b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaUV2ZW50LnRvcCArIGlFdmVudC5oZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICkubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAobmV4dE92ZXJsYXBwaW5nRXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q29sdW1uQ291bnQoYWxsRXZlbnRzLCBuZXh0T3ZlcmxhcHBpbmdFdmVudHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sdW1uQ291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXBwZWRFdmVudHMgPSBkYXlWaWV3LmV2ZW50cy5tYXAoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5Db3VudCA9IGdldENvbHVtbkNvdW50KFxuICAgICAgICAgICAgICAgIGRheVZpZXcuZXZlbnRzLFxuICAgICAgICAgICAgICAgIGdldE92ZXJMYXBwaW5nV2Vla1ZpZXdFdmVudHMoXG4gICAgICAgICAgICAgICAgICAgIGRheVZpZXcuZXZlbnRzLFxuICAgICAgICAgICAgICAgICAgICBldmVudC50b3AsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnRvcCArIGV2ZW50LmhlaWdodFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gMTAwIC8gY29sdW1uQ291bnQ7XG4gICAgICAgICAgICByZXR1cm4geyAuLi5ldmVudCwgbGVmdDogZXZlbnQubGVmdCAqIHdpZHRoLCB3aWR0aCB9O1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaG91cnMsXG4gICAgICAgICAgICBkYXRlOiBkYXkuZGF0ZSxcbiAgICAgICAgICAgIGV2ZW50czogbWFwcGVkRXZlbnRzLm1hcCgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvdmVyTGFwcGluZ0V2ZW50cyA9IGdldE92ZXJMYXBwaW5nV2Vla1ZpZXdFdmVudHMoXG4gICAgICAgICAgICAgICAgICAgIG1hcHBlZEV2ZW50cy5maWx0ZXIoKG90aGVyRXZlbnQpID0+IG90aGVyRXZlbnQubGVmdCA+IGV2ZW50LmxlZnQpLFxuICAgICAgICAgICAgICAgICAgICBldmVudC50b3AsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnRvcCArIGV2ZW50LmhlaWdodFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKG92ZXJMYXBwaW5nRXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLm92ZXJMYXBwaW5nRXZlbnRzLm1hcCgob3RoZXJFdmVudCkgPT4gb3RoZXJFdmVudC5sZWZ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgLSBldmVudC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnQ7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdlZWtWaWV3KFxuICAgIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcixcbiAgICB7XG4gICAgICAgIGV2ZW50cyA9IFtdLFxuICAgICAgICB2aWV3RGF0ZSxcbiAgICAgICAgd2Vla1N0YXJ0c09uLFxuICAgICAgICBleGNsdWRlZCA9IFtdLFxuICAgICAgICBwcmVjaXNpb24gPSAnZGF5cycsXG4gICAgICAgIGFic29sdXRlUG9zaXRpb25lZEV2ZW50cyA9IGZhbHNlLFxuICAgICAgICBob3VyU2VnbWVudHMsXG4gICAgICAgIGhvdXJEdXJhdGlvbixcbiAgICAgICAgZGF5U3RhcnQsXG4gICAgICAgIGRheUVuZCxcbiAgICAgICAgd2Vla2VuZERheXMsXG4gICAgICAgIHNlZ21lbnRIZWlnaHQsXG4gICAgICAgIG1pbmltdW1FdmVudEhlaWdodCxcbiAgICAgICAgdmlld1N0YXJ0ID0gZGF0ZUFkYXB0ZXIuc3RhcnRPZldlZWsodmlld0RhdGUsIHsgd2Vla1N0YXJ0c09uIH0pLFxuICAgICAgICB2aWV3RW5kID0gZGF0ZUFkYXB0ZXIuZW5kT2ZXZWVrKHZpZXdEYXRlLCB7IHdlZWtTdGFydHNPbiB9KSxcbiAgICB9OiBNQ0dldFdlZWtWaWV3QXJnc1xuKTogTUNXZWVrVmlldyB7XG4gICAgaWYgKCFldmVudHMpIHtcbiAgICAgICAgZXZlbnRzID0gW107XG4gICAgfVxuICAgIGNvbnN0IHsgc3RhcnRPZkRheSwgZW5kT2ZEYXkgfSA9IGRhdGVBZGFwdGVyO1xuICAgIHZpZXdTdGFydCA9IHN0YXJ0T2ZEYXkodmlld1N0YXJ0KTtcbiAgICB2aWV3RW5kID0gZW5kT2ZEYXkodmlld0VuZCk7XG4gICAgY29uc3QgZXZlbnRzSW5QZXJpb2QgPSBnZXRFdmVudHNJblBlcmlvZChkYXRlQWRhcHRlciwge1xuICAgICAgICBldmVudHMsXG4gICAgICAgIHBlcmlvZFN0YXJ0OiB2aWV3U3RhcnQsXG4gICAgICAgIHBlcmlvZEVuZDogdmlld0VuZCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhlYWRlciA9IGdldFdlZWtWaWV3SGVhZGVyKGRhdGVBZGFwdGVyLCB7XG4gICAgICAgIHZpZXdEYXRlLFxuICAgICAgICB3ZWVrU3RhcnRzT24sXG4gICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICB3ZWVrZW5kRGF5cyxcbiAgICAgICAgdmlld1N0YXJ0LFxuICAgICAgICB2aWV3RW5kLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWxsRGF5RXZlbnRSb3dzOiBnZXRBbGxEYXlXZWVrRXZlbnRzKGRhdGVBZGFwdGVyLCB7XG4gICAgICAgICAgICBldmVudHM6IGV2ZW50c0luUGVyaW9kLFxuICAgICAgICAgICAgZXhjbHVkZWQsXG4gICAgICAgICAgICBwcmVjaXNpb24sXG4gICAgICAgICAgICBhYnNvbHV0ZVBvc2l0aW9uZWRFdmVudHMsXG4gICAgICAgICAgICB2aWV3U3RhcnQsXG4gICAgICAgICAgICB2aWV3RW5kLFxuICAgICAgICB9KSxcbiAgICAgICAgcGVyaW9kOiB7XG4gICAgICAgICAgICBldmVudHM6IGV2ZW50c0luUGVyaW9kLFxuICAgICAgICAgICAgc3RhcnQ6IGhlYWRlclswXS5kYXRlLFxuICAgICAgICAgICAgZW5kOiBlbmRPZkRheShoZWFkZXJbaGVhZGVyLmxlbmd0aCAtIDFdLmRhdGUpLFxuICAgICAgICB9LFxuICAgICAgICBob3VyQ29sdW1uczogZ2V0V2Vla1ZpZXdIb3VyR3JpZChkYXRlQWRhcHRlciwge1xuICAgICAgICAgICAgZXZlbnRzLFxuICAgICAgICAgICAgdmlld0RhdGUsXG4gICAgICAgICAgICBob3VyU2VnbWVudHMsXG4gICAgICAgICAgICBob3VyRHVyYXRpb24sXG4gICAgICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgICAgIGRheUVuZCxcbiAgICAgICAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgICAgICAgIGV4Y2x1ZGVkLFxuICAgICAgICAgICAgd2Vla2VuZERheXMsXG4gICAgICAgICAgICBzZWdtZW50SGVpZ2h0LFxuICAgICAgICAgICAgdmlld1N0YXJ0LFxuICAgICAgICAgICAgdmlld0VuZCxcbiAgICAgICAgICAgIG1pbmltdW1FdmVudEhlaWdodCxcbiAgICAgICAgfSksXG4gICAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNQ0dldE1vbnRoVmlld0FyZ3Mge1xuICAgIGV2ZW50cz86IE1DRXZlbnRbXTtcbiAgICB2aWV3RGF0ZTogRGF0ZTtcbiAgICB3ZWVrU3RhcnRzT246IG51bWJlcjtcbiAgICBleGNsdWRlZD86IG51bWJlcltdO1xuICAgIHZpZXdTdGFydD86IERhdGU7XG4gICAgdmlld0VuZD86IERhdGU7XG4gICAgd2Vla2VuZERheXM/OiBudW1iZXJbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1vbnRoVmlldyhcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBldmVudHMgPSBbXSxcbiAgICAgICAgdmlld0RhdGUsXG4gICAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgICAgZXhjbHVkZWQgPSBbXSxcbiAgICAgICAgdmlld1N0YXJ0ID0gZGF0ZUFkYXB0ZXIuc3RhcnRPZk1vbnRoKHZpZXdEYXRlKSxcbiAgICAgICAgdmlld0VuZCA9IGRhdGVBZGFwdGVyLmVuZE9mTW9udGgodmlld0RhdGUpLFxuICAgICAgICB3ZWVrZW5kRGF5cyxcbiAgICB9OiBNQ0dldE1vbnRoVmlld0FyZ3Ncbik6IE1DTW9udGhWaWV3IHtcbiAgICBpZiAoIWV2ZW50cykge1xuICAgICAgICBldmVudHMgPSBbXTtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICAgIHN0YXJ0T2ZXZWVrLFxuICAgICAgICBlbmRPZldlZWssXG4gICAgICAgIGRpZmZlcmVuY2VJbkRheXMsXG4gICAgICAgIHN0YXJ0T2ZEYXksXG4gICAgICAgIGFkZEhvdXJzLFxuICAgICAgICBlbmRPZkRheSxcbiAgICAgICAgaXNTYW1lTW9udGgsXG4gICAgICAgIGdldERheSxcbiAgICAgICAgZ2V0TW9udGgsXG4gICAgfSA9IGRhdGVBZGFwdGVyO1xuICAgIGNvbnN0IHN0YXJ0OiBEYXRlID0gc3RhcnRPZldlZWsodmlld1N0YXJ0LCB7IHdlZWtTdGFydHNPbiB9KTtcbiAgICBjb25zdCBlbmQ6IERhdGUgPSBlbmRPZldlZWsodmlld0VuZCwgeyB3ZWVrU3RhcnRzT24gfSk7XG4gICAgY29uc3QgZXZlbnRzSW5Nb250aDogTUNFdmVudFtdID0gZ2V0RXZlbnRzSW5QZXJpb2QoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgZXZlbnRzLFxuICAgICAgICBwZXJpb2RTdGFydDogc3RhcnQsXG4gICAgICAgIHBlcmlvZEVuZDogZW5kLFxuICAgIH0pO1xuICAgIGNvbnN0IGluaXRpYWxWaWV3RGF5czogTUNNb250aFZpZXdEYXlbXSA9IFtdO1xuICAgIGxldCBwcmV2aW91c0RhdGU6IERhdGU7XG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGRpZmZlcmVuY2VJbkRheXMoZW5kLCBzdGFydCkgKyAxOyBpKyspIHtcbiAgICAgICAgLy8gaGFja3kgZml4IGZvciBodHRwczovL2dpdGh1Yi5jb20vbWF0dGxld2lzOTIvYW5ndWxhci1jYWxlbmRhci9pc3N1ZXMvMTczXG4gICAgICAgIGxldCBkYXRlOiBEYXRlO1xuICAgICAgICBpZiAocHJldmlvdXNEYXRlKSB7XG4gICAgICAgICAgICBkYXRlID0gc3RhcnRPZkRheShhZGRIb3VycyhwcmV2aW91c0RhdGUsIEhPVVJTX0lOX0RBWSkpO1xuICAgICAgICAgICAgaWYgKHByZXZpb3VzRGF0ZS5nZXRUaW1lKCkgPT09IGRhdGUuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICAgICAgLy8gRFNUIGNoYW5nZSwgc28gbmVlZCB0byBhZGQgMjUgaG91cnNcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgICAgICAgIGRhdGUgPSBzdGFydE9mRGF5KGFkZEhvdXJzKHByZXZpb3VzRGF0ZSwgSE9VUlNfSU5fREFZICsgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldmlvdXNEYXRlID0gZGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGUgPSBwcmV2aW91c0RhdGUgPSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXhjbHVkZWQuc29tZSgoZSkgPT4gZ2V0RGF5KGRhdGUpID09PSBlKSkge1xuICAgICAgICAgICAgY29uc3QgZGF5OiBNQ01vbnRoVmlld0RheSA9IGdldFdlZWtEYXkoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgICAgICAgICBkYXRlLFxuICAgICAgICAgICAgICAgIHdlZWtlbmREYXlzLFxuICAgICAgICAgICAgfSkgYXMgTUNNb250aFZpZXdEYXk7XG4gICAgICAgICAgICBjb25zdCBldmVudHNJblBlcmlvZDogTUNFdmVudFtdID0gZ2V0RXZlbnRzSW5QZXJpb2QoZGF0ZUFkYXB0ZXIsIHtcbiAgICAgICAgICAgICAgICBldmVudHM6IGV2ZW50c0luTW9udGgsXG4gICAgICAgICAgICAgICAgcGVyaW9kU3RhcnQ6IHN0YXJ0T2ZEYXkoZGF0ZSksXG4gICAgICAgICAgICAgICAgcGVyaW9kRW5kOiBlbmRPZkRheShkYXRlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF5LmluTW9udGggPSBpc1NhbWVNb250aChkYXRlLCB2aWV3RGF0ZSk7XG4gICAgICAgICAgICBkYXkuZXZlbnRzID0gZXZlbnRzSW5QZXJpb2Q7XG4gICAgICAgICAgICBkYXkuYmFkZ2VUb3RhbCA9IGV2ZW50c0luUGVyaW9kLmxlbmd0aDtcbiAgICAgICAgICAgIGluaXRpYWxWaWV3RGF5cy5wdXNoKGRheSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZGF5czogTUNNb250aFZpZXdEYXlbXSA9IFtdO1xuICAgIGNvbnN0IHRvdGFsRGF5c1Zpc2libGVJbldlZWs6IG51bWJlciA9IERBWVNfSU5fV0VFSyAtIGV4Y2x1ZGVkLmxlbmd0aDtcbiAgICBpZiAodG90YWxEYXlzVmlzaWJsZUluV2VlayA8IERBWVNfSU5fV0VFSykge1xuICAgICAgICBmb3IgKFxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XG4gICAgICAgICAgICBpIDwgaW5pdGlhbFZpZXdEYXlzLmxlbmd0aDtcbiAgICAgICAgICAgIGkgKz0gdG90YWxEYXlzVmlzaWJsZUluV2Vla1xuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdzogTUNNb250aFZpZXdEYXlbXSA9IGluaXRpYWxWaWV3RGF5cy5zbGljZShcbiAgICAgICAgICAgICAgICBpLFxuICAgICAgICAgICAgICAgIGkgKyB0b3RhbERheXNWaXNpYmxlSW5XZWVrXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgaXNSb3dJbk1vbnRoOiBib29sZWFuID0gcm93LnNvbWUoXG4gICAgICAgICAgICAgICAgKGRheSkgPT4gdmlld1N0YXJ0IDw9IGRheS5kYXRlICYmIGRheS5kYXRlIDwgdmlld0VuZFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1Jvd0luTW9udGgpIHtcbiAgICAgICAgICAgICAgICBkYXlzID0gWy4uLmRheXMsIC4uLnJvd107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBkYXlzID0gaW5pdGlhbFZpZXdEYXlzO1xuICAgIH1cblxuICAgIGNvbnN0IHJvd3M6IG51bWJlciA9IE1hdGguZmxvb3IoZGF5cy5sZW5ndGggLyB0b3RhbERheXNWaXNpYmxlSW5XZWVrKTtcbiAgICBjb25zdCByb3dPZmZzZXRzOiBudW1iZXJbXSA9IFtdO1xuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICAgICAgcm93T2Zmc2V0cy5wdXNoKGkgKiB0b3RhbERheXNWaXNpYmxlSW5XZWVrKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByb3dPZmZzZXRzLFxuICAgICAgICB0b3RhbERheXNWaXNpYmxlSW5XZWVrLFxuICAgICAgICBkYXlzLFxuICAgICAgICBwZXJpb2Q6IHtcbiAgICAgICAgICAgIHN0YXJ0OiBkYXlzWzBdLmRhdGUsXG4gICAgICAgICAgICBlbmQ6IGVuZE9mRGF5KGRheXNbZGF5cy5sZW5ndGggLSAxXS5kYXRlKSxcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnRzSW5Nb250aCxcbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1DR2V0RGF5Vmlld0FyZ3Mge1xuICAgIGV2ZW50cz86IE1DRXZlbnRbXTtcbiAgICB2aWV3RGF0ZTogRGF0ZTtcbiAgICBob3VyU2VnbWVudHM6IG51bWJlcjtcbiAgICBkYXlTdGFydDoge1xuICAgICAgICBob3VyOiBudW1iZXI7XG4gICAgICAgIG1pbnV0ZTogbnVtYmVyO1xuICAgIH07XG4gICAgZGF5RW5kOiB7XG4gICAgICAgIGhvdXI6IG51bWJlcjtcbiAgICAgICAgbWludXRlOiBudW1iZXI7XG4gICAgfTtcbiAgICBldmVudFdpZHRoOiBudW1iZXI7XG4gICAgc2VnbWVudEhlaWdodDogbnVtYmVyO1xuICAgIGhvdXJEdXJhdGlvbjogbnVtYmVyO1xuICAgIG1pbmltdW1FdmVudEhlaWdodDogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBnZXRPdmVyTGFwcGluZ1dlZWtWaWV3RXZlbnRzKFxuICAgIGV2ZW50czogTUNXZWVrVmlld1RpbWVFdmVudFtdLFxuICAgIHRvcDogbnVtYmVyLFxuICAgIGJvdHRvbTogbnVtYmVyXG4pOiBNQ1dlZWtWaWV3VGltZUV2ZW50W10ge1xuICAgIHJldHVybiBldmVudHMuZmlsdGVyKChwcmV2aW91c0V2ZW50OiBNQ1dlZWtWaWV3VGltZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzRXZlbnRUb3A6IG51bWJlciA9IHByZXZpb3VzRXZlbnQudG9wO1xuICAgICAgICBjb25zdCBwcmV2aW91c0V2ZW50Qm90dG9tOiBudW1iZXIgPVxuICAgICAgICAgICAgcHJldmlvdXNFdmVudC50b3AgKyBwcmV2aW91c0V2ZW50LmhlaWdodDtcblxuICAgICAgICBpZiAodG9wIDwgcHJldmlvdXNFdmVudEJvdHRvbSAmJiBwcmV2aW91c0V2ZW50Qm90dG9tIDwgYm90dG9tKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0b3AgPCBwcmV2aW91c0V2ZW50VG9wICYmIHByZXZpb3VzRXZlbnRUb3AgPCBib3R0b20pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHByZXZpb3VzRXZlbnRUb3AgPD0gdG9wICYmIGJvdHRvbSA8PSBwcmV2aW91c0V2ZW50Qm90dG9tKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0RGF5VmlldyhcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICBldmVudHMsXG4gICAgICAgIHZpZXdEYXRlLFxuICAgICAgICBob3VyU2VnbWVudHMsXG4gICAgICAgIGRheVN0YXJ0LFxuICAgICAgICBkYXlFbmQsXG4gICAgICAgIGV2ZW50V2lkdGgsXG4gICAgICAgIHNlZ21lbnRIZWlnaHQsXG4gICAgICAgIGhvdXJEdXJhdGlvbixcbiAgICAgICAgbWluaW11bUV2ZW50SGVpZ2h0LFxuICAgIH06IE1DR2V0RGF5Vmlld0FyZ3Ncbik6IE1DRGF5VmlldyB7XG4gICAgY29uc3Qge1xuICAgICAgICBzZXRNaW51dGVzLFxuICAgICAgICBzZXRIb3VycyxcbiAgICAgICAgc3RhcnRPZkRheSxcbiAgICAgICAgc3RhcnRPZk1pbnV0ZSxcbiAgICAgICAgZW5kT2ZEYXksXG4gICAgICAgIGRpZmZlcmVuY2VJbk1pbnV0ZXMsXG4gICAgfSA9IGRhdGVBZGFwdGVyO1xuXG4gICAgY29uc3Qgc3RhcnRPZlZpZXc6IERhdGUgPSBzZXRNaW51dGVzKFxuICAgICAgICBzZXRIb3VycyhzdGFydE9mRGF5KHZpZXdEYXRlKSwgc2FuaXRpc2VIb3VycyhkYXlTdGFydC5ob3VyKSksXG4gICAgICAgIHNhbml0aXNlTWludXRlcyhkYXlTdGFydC5taW51dGUpXG4gICAgKTtcbiAgICBjb25zdCBlbmRPZlZpZXc6IERhdGUgPSBzZXRNaW51dGVzKFxuICAgICAgICBzZXRIb3VycyhzdGFydE9mTWludXRlKGVuZE9mRGF5KHZpZXdEYXRlKSksIHNhbml0aXNlSG91cnMoZGF5RW5kLmhvdXIpKSxcbiAgICAgICAgc2FuaXRpc2VNaW51dGVzKGRheUVuZC5taW51dGUpXG4gICAgKTtcbiAgICBlbmRPZlZpZXcuc2V0U2Vjb25kcyg1OSwgOTk5KTtcbiAgICBjb25zdCBwcmV2aW91c0RheUV2ZW50czogTUNXZWVrVmlld1RpbWVFdmVudFtdID0gW107XG4gICAgY29uc3QgZXZlbnRzSW5QZXJpb2QgPSBnZXRFdmVudHNJblBlcmlvZChkYXRlQWRhcHRlciwge1xuICAgICAgICBldmVudHM6IGV2ZW50cy5maWx0ZXIoKGV2ZW50OiBNQ0V2ZW50KSA9PiAhZXZlbnQuYWxsRGF5KSxcbiAgICAgICAgcGVyaW9kU3RhcnQ6IHN0YXJ0T2ZWaWV3LFxuICAgICAgICBwZXJpb2RFbmQ6IGVuZE9mVmlldyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRheVZpZXdFdmVudHM6IE1DV2Vla1ZpZXdUaW1lRXZlbnRbXSA9IGV2ZW50c0luUGVyaW9kXG4gICAgICAgIC5zb3J0KChldmVudEE6IE1DRXZlbnQsIGV2ZW50QjogTUNFdmVudCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50QS5zdGFydC52YWx1ZU9mKCkgLSBldmVudEIuc3RhcnQudmFsdWVPZigpO1xuICAgICAgICB9KVxuICAgICAgICAubWFwKChldmVudDogTUNFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXZlbnRTdGFydDogRGF0ZSA9IGV2ZW50LnN0YXJ0O1xuICAgICAgICAgICAgY29uc3QgZXZlbnRFbmQ6IERhdGUgPSBldmVudC5lbmQgfHwgZXZlbnRTdGFydDtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0c0JlZm9yZURheTogYm9vbGVhbiA9IGV2ZW50U3RhcnQgPCBzdGFydE9mVmlldztcbiAgICAgICAgICAgIGNvbnN0IGVuZHNBZnRlckRheTogYm9vbGVhbiA9IGV2ZW50RW5kID4gZW5kT2ZWaWV3O1xuICAgICAgICAgICAgY29uc3QgaG91ckhlaWdodE1vZGlmaWVyOiBudW1iZXIgPVxuICAgICAgICAgICAgICAgIChob3VyU2VnbWVudHMgKiBzZWdtZW50SGVpZ2h0KSAvIChob3VyRHVyYXRpb24gfHwgTUlOVVRFU19JTl9IT1VSKTtcblxuICAgICAgICAgICAgbGV0IHRvcDogbnVtYmVyID0gMDtcbiAgICAgICAgICAgIGlmIChldmVudFN0YXJ0ID4gc3RhcnRPZlZpZXcpIHtcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgdGhlIGRpZmZlcmVuY2UgaW4gbWludXRlcyBpZiB0aGUgdXNlcidzIG9mZnNldCBpcyBkaWZmZXJlbnQgYmV0d2VlbiB0aGUgc3RhcnQgb2YgdGhlIGRheSBhbmQgdGhlIGV2ZW50IChlLmcuIHdoZW4gZ29pbmcgdG8gb3IgZnJvbSBEU1QpXG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnRPZmZzZXQgPSBldmVudFN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRPZmZzZXQgPSBzdGFydE9mVmlldy5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBzdGFydE9mZnNldCAtIGV2ZW50T2Zmc2V0O1xuICAgICAgICAgICAgICAgIHRvcCArPSBkaWZmZXJlbmNlSW5NaW51dGVzKGV2ZW50U3RhcnQsIHN0YXJ0T2ZWaWV3KSArIGRpZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b3AgKj0gaG91ckhlaWdodE1vZGlmaWVyO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFydERhdGU6IERhdGUgPSBzdGFydHNCZWZvcmVEYXkgPyBzdGFydE9mVmlldyA6IGV2ZW50U3RhcnQ7XG4gICAgICAgICAgICBjb25zdCBlbmREYXRlOiBEYXRlID0gZW5kc0FmdGVyRGF5ID8gZW5kT2ZWaWV3IDogZXZlbnRFbmQ7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0OiBudW1iZXIgPSBkaWZmZXJlbmNlSW5NaW51dGVzKGVuZERhdGUsIHN0YXJ0RGF0ZSk7XG4gICAgICAgICAgICBpZiAoIWV2ZW50LmVuZCkge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IHNlZ21lbnRIZWlnaHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhlaWdodCAqPSBob3VySGVpZ2h0TW9kaWZpZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtaW5pbXVtRXZlbnRIZWlnaHQgJiYgaGVpZ2h0IDwgbWluaW11bUV2ZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gbWluaW11bUV2ZW50SGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBib3R0b206IG51bWJlciA9IHRvcCArIGhlaWdodDtcblxuICAgICAgICAgICAgY29uc3Qgb3ZlcmxhcHBpbmdQcmV2aW91c0V2ZW50cyA9IGdldE92ZXJMYXBwaW5nV2Vla1ZpZXdFdmVudHMoXG4gICAgICAgICAgICAgICAgcHJldmlvdXNEYXlFdmVudHMsXG4gICAgICAgICAgICAgICAgdG9wLFxuICAgICAgICAgICAgICAgIGJvdHRvbVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbGV0IGxlZnQ6IG51bWJlciA9IDA7XG5cbiAgICAgICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgICAgICBvdmVybGFwcGluZ1ByZXZpb3VzRXZlbnRzLnNvbWUoXG4gICAgICAgICAgICAgICAgICAgIChwcmV2aW91c0V2ZW50KSA9PiBwcmV2aW91c0V2ZW50LmxlZnQgPT09IGxlZnRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZWZ0ICs9IGV2ZW50V2lkdGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRheUV2ZW50OiBNQ1dlZWtWaWV3VGltZUV2ZW50ID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICAgICAgICB3aWR0aDogZXZlbnRXaWR0aCxcbiAgICAgICAgICAgICAgICB0b3AsXG4gICAgICAgICAgICAgICAgbGVmdCxcbiAgICAgICAgICAgICAgICBzdGFydHNCZWZvcmVEYXksXG4gICAgICAgICAgICAgICAgZW5kc0FmdGVyRGF5LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcHJldmlvdXNEYXlFdmVudHMucHVzaChkYXlFdmVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXlFdmVudDtcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCB3aWR0aDogbnVtYmVyID0gTWF0aC5tYXgoXG4gICAgICAgIC4uLmRheVZpZXdFdmVudHMubWFwKChldmVudDogTUNXZWVrVmlld1RpbWVFdmVudCkgPT4gZXZlbnQubGVmdCArIGV2ZW50LndpZHRoKVxuICAgICk7XG4gICAgY29uc3QgYWxsRGF5RXZlbnRzOiBNQ0V2ZW50W10gPSBnZXRFdmVudHNJblBlcmlvZChkYXRlQWRhcHRlciwge1xuICAgICAgICBldmVudHM6IGV2ZW50cy5maWx0ZXIoKGV2ZW50OiBNQ0V2ZW50KSA9PiBldmVudC5hbGxEYXkpLFxuICAgICAgICBwZXJpb2RTdGFydDogc3RhcnRPZkRheShzdGFydE9mVmlldyksXG4gICAgICAgIHBlcmlvZEVuZDogZW5kT2ZEYXkoZW5kT2ZWaWV3KSxcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGV2ZW50czogZGF5Vmlld0V2ZW50cyxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGFsbERheUV2ZW50cyxcbiAgICAgICAgcGVyaW9kOiB7XG4gICAgICAgICAgICBldmVudHM6IGV2ZW50c0luUGVyaW9kLFxuICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0T2ZWaWV3LFxuICAgICAgICAgICAgZW5kOiBlbmRPZlZpZXcsXG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuaW50ZXJmYWNlIFRpbWUge1xuICAgIGhvdXI6IG51bWJlcjtcbiAgICBtaW51dGU6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIE1DR2V0RGF5Vmlld0hvdXJHcmlkQXJncyB7XG4gICAgdmlld0RhdGU6IERhdGU7XG4gICAgaG91clNlZ21lbnRzOiBudW1iZXI7XG4gICAgaG91ckR1cmF0aW9uOiBudW1iZXI7XG4gICAgZGF5U3RhcnQ6IFRpbWU7XG4gICAgZGF5RW5kOiBUaW1lO1xufVxuXG5mdW5jdGlvbiBzYW5pdGlzZUhvdXJzKGhvdXJzOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbigyMywgaG91cnMpLCAwKTtcbn1cblxuZnVuY3Rpb24gc2FuaXRpc2VNaW51dGVzKG1pbnV0ZXM6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKDU5LCBtaW51dGVzKSwgMCk7XG59XG5cbmZ1bmN0aW9uIGdldERheVZpZXdIb3VyR3JpZChcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIsXG4gICAge1xuICAgICAgICB2aWV3RGF0ZSxcbiAgICAgICAgaG91clNlZ21lbnRzLFxuICAgICAgICBob3VyRHVyYXRpb24sXG4gICAgICAgIGRheVN0YXJ0LFxuICAgICAgICBkYXlFbmQsXG4gICAgfTogTUNHZXREYXlWaWV3SG91ckdyaWRBcmdzXG4pOiBNQ1dlZWtWaWV3SG91cltdIHtcbiAgICBjb25zdCB7XG4gICAgICAgIHNldE1pbnV0ZXMsXG4gICAgICAgIHNldEhvdXJzLFxuICAgICAgICBzdGFydE9mRGF5LFxuICAgICAgICBzdGFydE9mTWludXRlLFxuICAgICAgICBlbmRPZkRheSxcbiAgICAgICAgYWRkTWludXRlcyxcbiAgICAgICAgYWRkSG91cnMsXG4gICAgICAgIGFkZERheXMsXG4gICAgfSA9IGRhdGVBZGFwdGVyO1xuICAgIGNvbnN0IGhvdXJzOiBNQ1dlZWtWaWV3SG91cltdID0gW107XG5cbiAgICBsZXQgc3RhcnRPZlZpZXc6IERhdGUgPSBzZXRNaW51dGVzKFxuICAgICAgICBzZXRIb3VycyhzdGFydE9mRGF5KHZpZXdEYXRlKSwgc2FuaXRpc2VIb3VycyhkYXlTdGFydC5ob3VyKSksXG4gICAgICAgIHNhbml0aXNlTWludXRlcyhkYXlTdGFydC5taW51dGUpXG4gICAgKTtcbiAgICBsZXQgZW5kT2ZWaWV3OiBEYXRlID0gc2V0TWludXRlcyhcbiAgICAgICAgc2V0SG91cnMoc3RhcnRPZk1pbnV0ZShlbmRPZkRheSh2aWV3RGF0ZSkpLCBzYW5pdGlzZUhvdXJzKGRheUVuZC5ob3VyKSksXG4gICAgICAgIHNhbml0aXNlTWludXRlcyhkYXlFbmQubWludXRlKVxuICAgICk7XG4gICAgY29uc3Qgc2VnbWVudER1cmF0aW9uOiBudW1iZXIgPVxuICAgICAgICAoaG91ckR1cmF0aW9uIHx8IE1JTlVURVNfSU5fSE9VUikgLyBob3VyU2VnbWVudHM7XG4gICAgbGV0IHN0YXJ0T2ZWaWV3RGF5OiBEYXRlID0gc3RhcnRPZkRheSh2aWV3RGF0ZSk7XG4gICAgY29uc3QgZW5kT2ZWaWV3RGF5OiBEYXRlID0gZW5kT2ZEYXkodmlld0RhdGUpO1xuICAgIGxldCBkYXRlQWRqdXN0bWVudDogKGQ6IERhdGUpID0+IERhdGUgPSAoZDogRGF0ZSkgPT4gZDtcblxuICAgIC8vIHRoaXMgbWVhbnMgdGhhdCB3ZSBjaGFuZ2UgZnJvbSBvciB0byBEU1Qgb24gdGhpcyBkYXkgYW5kIHRoYXQncyBnb2luZyB0byBjYXVzZSBwcm9ibGVtcyBzbyB3ZSBidW1wIHRoZSBkYXRlXG4gICAgaWYgKHN0YXJ0T2ZWaWV3RGF5LmdldFRpbWV6b25lT2Zmc2V0KCkgIT09IGVuZE9mVmlld0RheS5nZXRUaW1lem9uZU9mZnNldCgpKSB7XG4gICAgICAgIHN0YXJ0T2ZWaWV3RGF5ID0gYWRkRGF5cyhzdGFydE9mVmlld0RheSwgMSk7XG4gICAgICAgIHN0YXJ0T2ZWaWV3ID0gYWRkRGF5cyhzdGFydE9mVmlldywgMSk7XG4gICAgICAgIGVuZE9mVmlldyA9IGFkZERheXMoZW5kT2ZWaWV3LCAxKTtcbiAgICAgICAgZGF0ZUFkanVzdG1lbnQgPSAoZDogRGF0ZSkgPT4gYWRkRGF5cyhkLCAtMSk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF5RHVyYXRpb246IG51bWJlciA9IGhvdXJEdXJhdGlvblxuICAgICAgICA/IChIT1VSU19JTl9EQVkgKiA2MCkgLyBob3VyRHVyYXRpb25cbiAgICAgICAgOiBNSU5VVEVTX0lOX0hPVVI7XG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgZGF5RHVyYXRpb247IGkrKykge1xuICAgICAgICBjb25zdCBzZWdtZW50czogTUNXZWVrVmlld0hvdXJTZWdtZW50W10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IGhvdXJTZWdtZW50czsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlOiBEYXRlID0gYWRkTWludXRlcyhcbiAgICAgICAgICAgICAgICBhZGRNaW51dGVzKHN0YXJ0T2ZWaWV3LCBpICogKGhvdXJEdXJhdGlvbiB8fCBNSU5VVEVTX0lOX0hPVVIpKSxcbiAgICAgICAgICAgICAgICBqICogc2VnbWVudER1cmF0aW9uXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGRhdGUgPj0gc3RhcnRPZlZpZXcgJiYgZGF0ZSA8IGVuZE9mVmlldykge1xuICAgICAgICAgICAgICAgIHNlZ21lbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBkYXRlQWRqdXN0bWVudChkYXRlKSxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheURhdGU6IGRhdGUsXG4gICAgICAgICAgICAgICAgICAgIGlzU3RhcnQ6IGogPT09IDAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGhvdXJzLnB1c2goeyBzZWdtZW50cyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBob3Vycztcbn1cblxuZXhwb3J0IGVudW0gRXZlbnRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlIHtcbiAgICBOb3RBcnJheSA9ICdFdmVudHMgbXVzdCBiZSBhbiBhcnJheScsXG4gICAgU3RhcnRQcm9wZXJ0eU1pc3NpbmcgPSAnRXZlbnQgaXMgbWlzc2luZyB0aGUgYHN0YXJ0YCBwcm9wZXJ0eScsXG4gICAgU3RhcnRQcm9wZXJ0eU5vdERhdGUgPSAnRXZlbnQgYHN0YXJ0YCBwcm9wZXJ0eSBzaG91bGQgYmUgYSBqYXZhc2NyaXB0IGRhdGUgb2JqZWN0LiBEbyBgbmV3IERhdGUoZXZlbnQuc3RhcnQpYCB0byBmaXggaXQuJyxcbiAgICBFbmRQcm9wZXJ0eU5vdERhdGUgPSAnRXZlbnQgYGVuZGAgcHJvcGVydHkgc2hvdWxkIGJlIGEgamF2YXNjcmlwdCBkYXRlIG9iamVjdC4gRG8gYG5ldyBEYXRlKGV2ZW50LmVuZClgIHRvIGZpeCBpdC4nLFxuICAgIEVuZHNCZWZvcmVTdGFydCA9ICdFdmVudCBgc3RhcnRgIHByb3BlcnR5IG9jY3VycyBhZnRlciB0aGUgYGVuZGAnLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFdmVudHMoXG4gICAgZXZlbnRzOiBNQ0V2ZW50W10sXG4gICAgbG9nOiAoLi4uYXJnczogYW55W10pID0+IHZvaWRcbik6IGJvb2xlYW4ge1xuICAgIGxldCBpc1ZhbGlkOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIGlzRXJyb3IobXNnOiBzdHJpbmcsIGV2ZW50OiBNQ0V2ZW50KTogdm9pZCB7XG4gICAgICAgIGxvZyhtc2csIGV2ZW50KTtcbiAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudHMpKSB7XG4gICAgICAgIGxvZyhFdmVudFZhbGlkYXRpb25FcnJvck1lc3NhZ2UuTm90QXJyYXksIGV2ZW50cyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKCFldmVudC5zdGFydCkge1xuICAgICAgICAgICAgaXNFcnJvcihFdmVudFZhbGlkYXRpb25FcnJvck1lc3NhZ2UuU3RhcnRQcm9wZXJ0eU1pc3NpbmcsIGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIGlmICghKGV2ZW50LnN0YXJ0IGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgIGlzRXJyb3IoRXZlbnRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlLlN0YXJ0UHJvcGVydHlOb3REYXRlLCBldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQuZW5kKSB7XG4gICAgICAgICAgICBpZiAoIShldmVudC5lbmQgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIGlzRXJyb3IoRXZlbnRWYWxpZGF0aW9uRXJyb3JNZXNzYWdlLkVuZFByb3BlcnR5Tm90RGF0ZSwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2ZW50LnN0YXJ0ID4gZXZlbnQuZW5kKSB7XG4gICAgICAgICAgICAgICAgaXNFcnJvcihFdmVudFZhbGlkYXRpb25FcnJvck1lc3NhZ2UuRW5kc0JlZm9yZVN0YXJ0LCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpc1ZhbGlkO1xufSJdfQ==