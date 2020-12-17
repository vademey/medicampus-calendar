import { MCEvent, MCViewPeriod, MCWeekDay, MCWeekViewAllDayEvent, MCWeekViewHour, MCWeekViewHourSegment, MCWeekViewTimeEvent } from '../../utilities/mc-calendar-utils';
import { DateAdapter } from '../../date-adapters/date-adapter';
export declare const validateEvents: (events: MCEvent<any>[]) => boolean;
export declare function isInside(outer: ClientRect, inner: ClientRect): boolean;
export declare function roundToNearest(amount: number, precision: number): number;
export declare const trackByEventId: (index: number, event: MCEvent<any>) => string | number | MCEvent<any>;
export declare const trackByWeekDayHeaderDate: (index: number, day: MCWeekDay) => string;
export declare const trackByHourSegment: (index: number, segment: MCWeekViewHourSegment) => string;
export declare const trackByHour: (index: number, hour: MCWeekViewHour) => string;
export declare const trackByWeekAllDayEvent: (index: number, weekEvent: MCWeekViewAllDayEvent) => string | number | MCEvent<any>;
export declare const trackByWeekTimeEvent: (index: number, weekEvent: MCWeekViewTimeEvent) => string | number | MCEvent<any>;
export declare function getMinutesMoved(movedY: number, hourSegments: number, hourSegmentHeight: number, eventSnapSize: number): number;
export declare function getMinimumEventHeightInMinutes(hourSegments: number, hourSegmentHeight: number): number;
export declare function getDefaultEventEnd(dateAdapter: DateAdapter, event: MCEvent, minimumMinutes: number): Date;
export declare function addDaysWithExclusions(dateAdapter: DateAdapter, date: Date, days: number, excluded: number[]): Date;
export declare function isDraggedWithinPeriod(newStart: Date, newEnd: Date, period: MCViewPeriod): boolean;
export declare function shouldFireDroppedEvent(dropEvent: {
    dropData?: {
        event?: MCEvent;
        calendarId?: symbol;
    };
}, date: Date, allDay: boolean, calendarId: symbol): boolean;
export declare function getWeekViewPeriod(dateAdapter: DateAdapter, viewDate: Date, weekStartsOn: number, excluded?: number[], daysInWeek?: number): {
    viewStart: Date;
    viewEnd: Date;
};
export declare function isWithinThreshold({ x, y }: {
    x: number;
    y: number;
}): boolean;
