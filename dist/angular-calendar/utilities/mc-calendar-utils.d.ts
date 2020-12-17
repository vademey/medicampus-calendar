import { DateAdapter } from "../date-adapters/date-adapter";
export declare enum DAYS_OF_WEEK {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
export declare const SECONDS_IN_DAY: number;
export interface MCWeekDay {
    date: Date;
    day: number;
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
        event: MCEvent;
        sourceEvent: MouseEvent | KeyboardEvent;
    }): any;
}
export interface MCEvent<MetaType = any> {
    id?: string | number;
    start: Date;
    end?: Date;
    title?: string;
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
    online: boolean;
    onSite: boolean;
    room?: MCRoom;
    videoURL?: string;
    presenceRecorded?: boolean;
    lesson: MCLesson;
    topic?: string;
    newsid?: number;
}
export interface MCLesson {
    id: number;
    name: string;
    shortName: string;
    module: MCModule;
    subject: MCSubject;
    performanceRecord: MCPerformanceRecord;
    lessonType: MCLessonType;
    iliasURL: string;
    hasLearningMaterial: boolean;
    swapLessonAllowed?: boolean;
    changeLessonAllowed?: boolean;
    swapEventAllowed: boolean;
    changeEventAllowed: boolean;
}
export interface MCModule {
    id: number;
    name: string;
}
export interface MCRoom {
    id: number;
    name: string;
    shortName: string;
    roomLink: string;
}
export interface MCSubject {
    id: number;
    name: string;
}
export interface MCPerformanceRecord {
    id: number;
    name: string;
}
export interface MCLessonType {
    id: number;
    name: string;
    mandatory: boolean;
    color: string;
}
export interface MCWeekViewAllDayEvent {
    event: MCEvent;
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
    events: MCEvent[];
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
    event: MCEvent;
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
    events: MCEvent[];
}
export interface MCGetEventsInPeriodArgs {
    events: MCEvent[];
    periodStart: Date;
    periodEnd: Date;
}
export declare function getEventsInPeriod(dateAdapter: DateAdapter, { events, periodStart, periodEnd }: MCGetEventsInPeriodArgs): MCEvent[];
export interface MCGetWeekViewHeaderArgs {
    viewDate: Date;
    weekStartsOn: number;
    excluded?: number[];
    weekendDays?: number[];
    viewStart?: Date;
    viewEnd?: Date;
}
export declare function getWeekViewHeader(dateAdapter: DateAdapter, { viewDate, weekStartsOn, excluded, weekendDays, viewStart, viewEnd, }: MCGetWeekViewHeaderArgs): MCWeekDay[];
export interface MCGetWeekViewArgs {
    events?: MCEvent[];
    viewDate: Date;
    weekStartsOn: number;
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
export declare function getDifferenceInDaysWithExclusions(dateAdapter: DateAdapter, { date1, date2, excluded }: {
    date1: Date;
    date2: Date;
    excluded: number[];
}): number;
interface MCGetAllDayEventArgs {
    precision?: 'days' | 'minutes';
    events?: MCEvent[];
    absolutePositionedEvents?: boolean;
    viewStart: Date;
    viewEnd: Date;
    excluded?: number[];
}
export declare function getAllDayWeekEvents(dateAdapter: DateAdapter, { events, excluded, precision, absolutePositionedEvents, viewStart, viewEnd, }: MCGetAllDayEventArgs): MCWeekViewAllDayEventRow[];
export declare function getWeekView(dateAdapter: DateAdapter, { events, viewDate, weekStartsOn, excluded, precision, absolutePositionedEvents, hourSegments, hourDuration, dayStart, dayEnd, weekendDays, segmentHeight, minimumEventHeight, viewStart, viewEnd, }: MCGetWeekViewArgs): MCWeekView;
export interface MCGetMonthViewArgs {
    events?: MCEvent[];
    viewDate: Date;
    weekStartsOn: number;
    excluded?: number[];
    viewStart?: Date;
    viewEnd?: Date;
    weekendDays?: number[];
}
export declare function getMonthView(dateAdapter: DateAdapter, { events, viewDate, weekStartsOn, excluded, viewStart, viewEnd, weekendDays, }: MCGetMonthViewArgs): MCMonthView;
export interface MCGetDayViewArgs {
    events?: MCEvent[];
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
    hourDuration: number;
    minimumEventHeight: number;
}
interface Time {
    hour: number;
    minute: number;
}
export declare enum EventValidationErrorMessage {
    NotArray = "Events must be an array",
    StartPropertyMissing = "Event is missing the `start` property",
    StartPropertyNotDate = "Event `start` property should be a javascript date object. Do `new Date(event.start)` to fix it.",
    EndPropertyNotDate = "Event `end` property should be a javascript date object. Do `new Date(event.end)` to fix it.",
    EndsBeforeStart = "Event `start` property occurs after the `end`"
}
export declare function validateEvents(events: MCEvent[], log: (...args: any[]) => void): boolean;
export {};
